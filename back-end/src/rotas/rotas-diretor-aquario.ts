import { Router } from "express";
import verificarToken from "../middlewares/verificar-token";
import verificarErroConteúdoToken from "../middlewares/verificar-erro-conteúdo-token";
import verificarPerfilDiretorAquario from "../middlewares/verificar-perfil-diretor-aquario";
import ServiçosDiretorAquario from "../serviços/serviços-diretor-aquario";
const RotasDiretorAquario = Router();

RotasDiretorAquario.post(
  "/periodo-visita",
  verificarToken,
  verificarPerfilDiretorAquario,
  ServiçosDiretorAquario.cadastrarPeriodoVisita,
);
RotasDiretorAquario.get(
  "/reserva/:id_periodo_visita",
  verificarToken,
  verificarPerfilDiretorAquario,
  ServiçosDiretorAquario.buscarReservasPeriodoVisita,
);
RotasDiretorAquario.patch(
  "/periodo-visita",
  verificarToken,
  verificarPerfilDiretorAquario,
  ServiçosDiretorAquario.alterarPeriodoVisita,
);
RotasDiretorAquario.delete(
  "/periodo-visita/:id",
  verificarToken,
  verificarPerfilDiretorAquario,
  ServiçosDiretorAquario.removerPeriodoVisita,
);
RotasDiretorAquario.get(
  "/periodo-visita/diretor-aquario/:cpf",
  verificarToken,
  verificarPerfilDiretorAquario,
  verificarErroConteúdoToken,
  ServiçosDiretorAquario.buscarPeriodoVisitasDiretorAquario,
);
RotasDiretorAquario.get(
  "/periodo-visita/nome-responsavel",
  verificarToken,
  verificarPerfilDiretorAquario,
  ServiçosDiretorAquario.buscarNomeResponsavelPeriodoVisitas,
);

export default RotasDiretorAquario;
RotasDiretorAquario.post("/", ServiçosDiretorAquario.cadastrarDiretorAquario);
RotasDiretorAquario.patch(
  "/",
  verificarToken,
  verificarPerfilDiretorAquario,
  ServiçosDiretorAquario.atualizarDiretorAquario,
);
RotasDiretorAquario.get(
  "/:cpf",
  verificarToken,
  verificarPerfilDiretorAquario,
  ServiçosDiretorAquario.buscarDiretorAquario,
);
