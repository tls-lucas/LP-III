export default function formatarPerfil(perfil) {
  switch (perfil) {
    case "diretoraaquario":
      return "Diretora do Aquário";
    case "diretor-escola":
      return "Diretor(a) de Escola";
    default:
      return;
  }
}
