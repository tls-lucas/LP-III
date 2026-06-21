import { Perfil } from "../entidades/usuário";
export default function verificarPerfilDiretorEscola(request, response, next) {
  if (request.perfil === Perfil.DIRETOR_ESCOLA) return next();
  else return response.status(401).json({ erro: "Acesso não autorizado." });
}
