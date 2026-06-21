import servidor from "./servidor";
export function serviçoCadastrarReserva(reserva) {
  return servidor.post("/diretor-escola/reserva", reserva);
}
export function serviçoRemoverReserva(id) {
  return servidor.delete(`/diretor-escola/reserva/${id}`);
}
export function serviçoBuscarReservasDiretorEscola(cpf) {
  return servidor.get(`/diretor-escola/reserva/diretor-escola/${cpf}`);
}
export function serviçoBuscarPeriodosVisitas() {
  return servidor.get("/diretor-escola/reserva/periodo-visita");
}

export function serviçoCadastrarDiretorEscola(diretorEscola) {
  return servidor.post("/diretor-escola", diretorEscola);
}
export function serviçoAtualizarDiretorEscola(diretorEscola) {
  return servidor.patch("/diretor-escola", diretorEscola);
}
export function serviçoBuscarDiretorEscola(cpf) {
  return servidor.get(`/diretor-escola/${cpf}`);
}
