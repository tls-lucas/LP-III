import { Request, Response, NextFunction } from "express";
import { Perfil } from "../entidades/usuário";

export default function verificarPerfilDiretorAquario(
  request: Request & { perfil?: Perfil },
  response: Response,
  next: NextFunction,
) {
  if (request.perfil === Perfil.DIRETOR_AQUARIO) return next();
  return response.status(401).json({ erro: "Acesso não autorizado." });
}
