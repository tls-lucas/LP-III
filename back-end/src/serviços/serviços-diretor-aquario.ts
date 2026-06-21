import md5 from "md5";
import PeriodoVisita from "../entidades/periodo-visita";
import Reserva from "src/entidades/reserva";
import { getManager } from "typeorm";
import Usuário, { Status } from "../entidades/usuário";
import DiretorAquario, { CertificacaoAmbiental } from "../entidades/diretor-aquario";
import ServiçosUsuário from "./serviços-usuário";
export default class ServiçosDiretorAquario {
  constructor() {}
  static async cadastrarPeriodoVisita(request, response) {
    try {
      const {
        título,
        categoria,
        nome_responsavel,
        inclui_transporte,
        numero_tanques,
        date,
        cpf,
      } = request.body;
      const cpf_encriptado = md5(cpf);
      const diretor_aquario = await DiretorAquario.findOne({
        where: { usuário: cpf_encriptado },
        relations: ["usuário"],
      });
      await PeriodoVisita.create({
        título,
        categoria,
        nome_responsavel,
        inclui_transporte,
        numero_tanques,
        date,
        diretor_aquario,
      }).save();
      return response.json();
    } catch (error) {
      return response
        .status(500)
        .json({ erro: "Erro BD : cadastrarPeriodoVisita" });
    }
  }
  static async alterarPeriodoVisita(request, response) {
    try {
      const {
        id,
        título,
        categoria,
        nome_responsavel,
        numero_tanques,
        inclui_transporte,
        date,
      } = request.body;
      await PeriodoVisita.update(id, {
        título,
        categoria,
        nome_responsavel,
        numero_tanques,
        inclui_transporte,
        date,
      });
      return response.json();
    } catch (error) {
      return response
        .status(500)
        .json({ erro: "Erro BD : alterarPeriodoVisita" });
    }
  }
  static async removerPeriodoVisita(request, response) {
    try {
      const id_periodo_visita = request.params.id;
      const periodo_visita = await PeriodoVisita.findOne(id_periodo_visita);
      await PeriodoVisita.remove(periodo_visita);
      return response.json();
    } catch (error) {
      return response
        .status(500)
        .json({ erro: "Erro BD : removerPeriodoVisita" });
    }
  }
  static async buscarPeriodoVisitasDiretorAquario(request, response) {
    try {
      const cpf_encriptado = md5(request.params.cpf);
      const periodos_visitas = await PeriodoVisita.find({
        where: { diretor_aquario: { usuário: cpf_encriptado } },
        relations: ["diretor_aquario", "diretor_aquario.usuário"],
      });
      return response.json(periodos_visitas);
    } catch (error) {
      return response
        .status(500)
        .json({ erro: "Erro BD : buscarPeriodoVisitasDiretorAquario" });
    }
  }
  static filtrarNomeResponsavelEliminandoRepetição(
    periodos_visitas: PeriodoVisita[],
  ) {
    let nome_responsavel: { label: string; value: string }[];
    nome_responsavel = periodos_visitas
      .filter(
        (periodo_visita, índice, periodos_visitas_antes_filtrar) =>
          periodos_visitas_antes_filtrar.findIndex(
            (periodo_visita_anterior) =>
              periodo_visita_anterior.nome_responsavel ===
              periodo_visita.nome_responsavel,
          ) === índice,
      )
      .map((periodo_visita) => ({
        label: periodo_visita.nome_responsavel,
        value: periodo_visita.nome_responsavel,
      }));
    return nome_responsavel;
  }
  static async buscarReservasPeriodoVisita(request, response) {
    try {
      const id_periodo_visita = request.params.id_periodo_visita;
      const reservas = await Reserva.find({
        where: { periodo_visita: { id: id_periodo_visita } },
        relations: [
          "diretor_escola",
          "diretor_escola.usuário",
          "periodo_visita",
        ],
      });
      return response.json(reservas);
    } catch (error) {
      return response
        .status(500)
        .json({ erro: "Erro BD : buscarReservasPeriodoVisita" });
    }
  }
  static async buscarNomeResponsavelPeriodoVisitas(request, response) {
    try {
      const periodos_visitas = await PeriodoVisita.find();
      const nome_responsavel =
        ServiçosDiretorAquario.filtrarNomeResponsavelEliminandoRepetição(
          periodos_visitas,
        );
      return response.json(nome_responsavel.sort());
    } catch (error) {
      return response
        .status(500)
        .json({ erro: "Erro BD : buscarCategoriasPeriodoVisitas" });
    }
  }

  static async cadastrarDiretorAquario(request, response) {
    try {
      const { usuário_info, nome_aquario, anos_direção, certificacao_ambiental } = request.body;
      const { usuário, token } =
        await ServiçosUsuário.cadastrarUsuário(usuário_info);
      const entityManager = getManager();
      await entityManager.transaction(async (transactionManager) => {
        await transactionManager.save(usuário);
        const diretor_aquario = DiretorAquario.create({
          usuário,
          nome_aquario,
          anos_direção,
          certificacao_ambiental,
        });
        await transactionManager.save(diretor_aquario);
        await transactionManager.update(Usuário, usuário.cpf, {
          status: Status.ATIVO,
        });
        return response.json({ status: Status.ATIVO, token });
      });
    } catch (error) {
      return response.status(500).json({ erro: error });
    }
  }

  static async atualizarDiretorAquario(request, response) {
    try {
      const { cpf, nome_aquario, anos_direção, certificacao_ambiental } = request.body;
      const cpf_encriptado = md5(cpf);
      await DiretorAquario.update(
        { usuário: { cpf: cpf_encriptado } },
        { nome_aquario, anos_direção, certificacao_ambiental },
      );
      return response.json();
    } catch (error) {
      return response
        .status(500)
        .json({ erro: "Erro BD : atualizarDiretor da Aquario" });
    }
  }

  static async buscarDiretorAquario(request, response) {
    try {
      const cpf_encriptado = md5(request.params.cpf);
      const diretor_aquario = await DiretorAquario.findOne({
        where: { usuário: cpf_encriptado },
        relations: ["usuário"],
      });
      if (!diretor_aquario)
        return response
          .status(404)
          .json({ erro: "DiretorAquario não encontrado." });
      return response.json({
        nome: diretor_aquario.usuário.nome,
        email: diretor_aquario.usuário.email,
        nome_aquario: diretor_aquario.nome_aquario,
        anos_direção: diretor_aquario.anos_direção,
        certificacao_ambiental: diretor_aquario.certificacao_ambiental,
      });
    } catch (error) {
      return response
        .status(500)
        .json({ erro: "Erro BD : buscarDiretorAquario" });
    }
  }
}
