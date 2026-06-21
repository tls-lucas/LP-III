import { Route, BrowserRouter, Routes } from "react-router-dom";
import RotasUsuárioLogado from "./rotas-usuário-logado";
import LogarUsuário from "../páginas/usuário/logar-usuário";
import CadastrarUsuário from "../páginas/usuário/cadastrar-usuário";
import PáginaInicial from "../páginas/usuário/página-inicial";
import RecuperarAcesso from "../páginas/usuário/recuperar-acesso";
import CadastrarDiretorEscola from "../páginas/diretor-escola/cadastrar-diretor-escola";
import { ProvedorDiretorAquario } from "../contextos/contexto-diretor-aquario";
import { ProvedorDiretorEscola } from "../contextos/contexto-diretor-escola";

import RotasDiretorAquario from "./rotas-diretor-aquario";
import RotasDiretorEscola from "./rotas-diretor-escola";

import AdministrarPeriodoVisita from "../páginas/diretor-aquario/administrar-periodos-visitas";
import CadastrarPeriodoVisita from "../páginas/diretor-aquario/cadastrar-periodo-visita";

import AdministrarReservas from "../páginas/diretor-escola/administrar-reservas";
import CadastrarReserva from "../páginas/diretor-escola/cadastrar-reserva";

import PesquisarPeriodoVisita from "../páginas/diretor-escola/pesquisar-periodos-visitas";
import ConsultarPeriodoVisita from "../páginas/diretor-escola/consultar-periodo-visita";
import CadastrarDiretorAquario from "../páginas/diretor-aquario/cadastrar-diretor-aquario";

import PesquisarReservas from "../páginas/diretor-aquario/pesquisar-reservas";
import ConsultarReserva from "../páginas/diretor-aquario/consultar-reserva";
import ConsultarDiretorEscola from "../páginas/diretor-aquario/consultar-diretor-escola";
import ConsultarDiretorAquario from "../páginas/diretor-escola/consultar-diretor-aquario";
export default function RotasAplicação() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<LogarUsuário />} path="/" />
        <Route element={<RecuperarAcesso />} path="recuperar-acesso" />
        <Route element={<CadastrarUsuário />} path="criar-usuario" />
        <Route element={<RotasUsuárioLogado />}>
          <Route element={<PáginaInicial />} path="pagina-inicial" />
          <Route element={<CadastrarUsuário />} path="atualizar-usuario" />
          <Route
            element={
              <ProvedorDiretorAquario>
                <RotasDiretorAquario />
              </ProvedorDiretorAquario>
            }
          >
            <Route element={<PesquisarReservas />} path="pesquisar-reservas" />
            <Route element={<ConsultarReserva />} path="consultar-reserva" />
            <Route
              element={<ConsultarDiretorEscola />}
              path="consultar-diretor-escola-interessado"
            />
            <Route
              element={<CadastrarDiretorAquario />}
              path="cadastrar-diretor-aquario"
            />
            <Route
              element={<AdministrarPeriodoVisita />}
              path="administrar-periodos-visitas"
            />
            <Route
              element={<CadastrarPeriodoVisita />}
              path="cadastrar-periodo-visita"
            />
          </Route>

          <Route
            element={
              <ProvedorDiretorEscola>
                <RotasDiretorEscola />
              </ProvedorDiretorEscola>
            }
          >
            <Route
              element={<ConsultarDiretorAquario />}
              path="consultar-diretor-aquario-proponente"
            />
            <Route
              element={<CadastrarDiretorEscola />}
              path="cadastrar-diretor-escola"
            />
            <Route
              element={<AdministrarReservas />}
              path="administrar-reserva"
            />
            <Route element={<CadastrarReserva />} path="cadastrar-reserva" />
            <Route
              element={<PesquisarPeriodoVisita />}
              path="pesquisar-periodos-visitas"
            />
            <Route
              element={<ConsultarPeriodoVisita />}
              path="consultar-periodo-visita"
            />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
