import { Router } from "express";
import verificarToken from "../middlewares/verificar-token";
import verificarErroConteúdoToken from "../middlewares/verificar-erro-conteúdo-token";
import verificarPerfilDiretorEscola from "../middlewares/verificar-perfil-diretor-escola";
import ServiçosDiretorEscola from "../serviços/serviços-diretor-escola";
const RotasDiretorEscola = Router();
RotasDiretorEscola.post(
  "/reserva/",
  verificarToken,
  verificarPerfilDiretorEscola,
  ServiçosDiretorEscola.cadastrarReserva,
);
RotasDiretorEscola.delete(
  "/reserva/:id",
  verificarToken,
  verificarPerfilDiretorEscola,
  ServiçosDiretorEscola.removerReserva,
);
RotasDiretorEscola.get(
  "/reserva/diretor-escola/:cpf",
  verificarToken,
  verificarPerfilDiretorEscola,
  verificarErroConteúdoToken,
  ServiçosDiretorEscola.buscarReservasDiretorEscola,
);
RotasDiretorEscola.get(
  "/reserva/periodo-visita/",
  verificarToken,
  verificarPerfilDiretorEscola,
  ServiçosDiretorEscola.buscarPeriodosVisitas,
);

export default RotasDiretorEscola;
RotasDiretorEscola.post("/", ServiçosDiretorEscola.cadastrarDiretorEscola);
RotasDiretorEscola.patch(
  "/",
  verificarToken,
  verificarPerfilDiretorEscola,
  ServiçosDiretorEscola.atualizarDiretorEscola,
);
RotasDiretorEscola.get(
  "/:cpf",
  verificarToken,
  verificarPerfilDiretorEscola,
  ServiçosDiretorEscola.buscarDiretorEscola,
);
