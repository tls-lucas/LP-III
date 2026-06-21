import servidor from "./servidor";
export function serviçoCadastrarPeriodoVisita(periodo_visita) {
  return servidor.post("/diretor-aquario/periodo-visita", periodo_visita);
}
export function serviçoAlterarPeriodoVisita(periodo_visita) {
  return servidor.patch("/diretor-aquario/periodo-visita", periodo_visita);
}
export function serviçoRemoverPeriodoVisita(id) {
  return servidor.delete(`/diretor-aquario/periodo-visita/${id}`);
}
export function serviçoBuscarPeriodosVisitasDiretorAquario(cpf) {
  return servidor.get(`/diretor-aquario/periodo-visita/diretor-aquario/${cpf}`);
}
export function serviçoBuscarNomeResponsavelPeridoVisita() {
  return servidor.get("/diretor-aquario/periodo-visita/nome-responsavel");
}
export function serviçoBuscarReservasPeridoVisita(id_reserva) {
  return servidor.get(`/diretor-aquario/reserva/${id_reserva}`);
}

export function serviçoCadastrarDiretorAquario(diretor_aquario) {
  return servidor.post("/diretor-aquario", diretor_aquario);
}

export function serviçoAtualizarDiretorAquario(diretor_aquario) {
  return servidor.patch("/diretor-aquario", diretor_aquario);
}

export function serviçoBuscarDiretorAquario(cpf) {
  return servidor.get(`/diretor-aquario/${cpf}`);
}
