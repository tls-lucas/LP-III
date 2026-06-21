import md5 from "md5";
import { getManager } from "typeorm";
import Usuário, { Status } from "../entidades/usuário";
import DiretorEscola from "../entidades/diretor-escola";

import PeriodoVisita from "../entidades/periodo-visita";
import Reserva from "../entidades/reserva";
import ServiçosUsuário from "./serviços-usuário";
export default class ServiçosDiretorEscola {
  constructor() {}
  static async cadastrarDiretorEscola(request, response) {
    try {
      const { usuário_info, nome_escola, turno } = request.body;
      const { usuário, token } =
        await ServiçosUsuário.cadastrarUsuário(usuário_info);
      const entityManager = getManager();
      await entityManager.transaction(async (transactionManager) => {
        await transactionManager.save(usuário);
        const diretor_escola = DiretorEscola.create({
          usuário,
          nome_escola,
          turno,
        });
        await transactionManager.save(diretor_escola);
        await transactionManager.update(Usuário, usuário.cpf, {
          status: Status.ATIVO,
        });
        return response.json({ status: Status.ATIVO, token });
      });
    } catch (error) {
      console.error(error);
      return response.status(500).json({ erro: error });
    }
  }

  static async cadastrarReserva(request, response) {
    try {
      const {
        id_periodo_visita,
        necessidade_pcd,
        guia,
        n_alunos,
        horario,
        cpf,
      } = request.body;
      const cpf_encriptado = md5(cpf);
      const diretor_escola = await DiretorEscola.findOne({
        where: { usuário: cpf_encriptado },
      });
      const periodo_visita = await PeriodoVisita.findOne(id_periodo_visita);
      const reservas = await Reserva.find({
        where: { diretor_escola, periodo_visita },
      });
      if (reservas.length > 0)
        return response.status(404).json({
          erro: "O diretor_escola já cadastrou reserva para a periodo_visita.",
        });
      await Reserva.create({
        necessidade_pcd,
        guia,
        n_alunos,
        horario,
        diretor_escola,
        periodo_visita,
      }).save();
      return response.json();
    } catch (error) {
      console.log(error);
      return response.status(500).json({ erro: "Erro BD : cadastrarReserva" });
    }
  }
  static async removerReserva(request, response) {
    try {
      const id = request.params.id;
      await Reserva.delete(id);
      return response.json();
    } catch (error) {
      return response.status(500).json({ erro: "Erro BD : removerReserva" });
    }
  }
  static async buscarReservasDiretorEscola(request, response) {
    try {
      const cpf_encriptado = md5(request.params.cpf);
      const reservas = await Reserva.find({
        where: { diretor_escola: { usuário: cpf_encriptado } },
        relations: [
          "diretor_escola",
          "diretor_escola.usuário",
          "periodo_visita",
          "periodo_visita.diretor_aquario",
          "periodo_visita.diretor_aquario.usuário",
        ],
      });
      return response.json(reservas);
    } catch (error) {
      return response
        .status(500)
        .json({ erro: "Erro BD : buscarReservasDiretorEscola" });
    }
  }
  static async buscarPeriodosVisitas(request, response) {
    try {
      const periodos_visitas = await PeriodoVisita.find({
        relations: ["diretor_aquario", "diretor_aquario.usuário"],
      });
      return response.json(periodos_visitas);
    } catch (error) {
      return response
        .status(500)
        .json({ erro: "Erro BD : buscarPeriodosVisitas" });
    }
  }

  static async atualizarDiretorEscola(request, response) {
    try {
      const { cpf, nome_escola, turno } = request.body;
      const cpf_encriptado = md5(cpf);
      await DiretorEscola.update(
        { usuário: { cpf: cpf_encriptado } },
        { nome_escola, turno },
      );
      return response.json();
    } catch (error) {
      return response
        .status(500)
        .json({ erro: "Erro BD : atualizarDiretor da Escola" });
    }
  }

  static async buscarDiretorEscola(request, response) {
    try {
      const cpf_encriptado = md5(request.params.cpf);
      const diretor_escola = await DiretorEscola.findOne({
        where: { usuário: cpf_encriptado },
        relations: ["usuário"],
      });
      if (!diretor_escola)
        return response
          .status(404)
          .json({ erro: "DiretorEscola não encontrado." });
      return response.json({
        nome: diretor_escola.usuário.nome,
        email: diretor_escola.usuário.email,
        nome_escola: diretor_escola.nome_escola,
        turno: diretor_escola.turno,
      });
    } catch (error) {
      return response
        .status(500)
        .json({ erro: "Erro BD : buscarDiretorEscola" });
    }
  }
}
