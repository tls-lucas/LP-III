import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";

import { Card } from "primereact/card";
import { Divider } from "primereact/divider";
import { InputText } from "primereact/inputtext";
import ContextoUsuário from "../../contextos/contexto-usuário";
import ContextoDiretorAquario from "../../contextos/contexto-diretor-aquario";
import {
  estilizarBotãoRetornar,
  estilizarCard,
  estilizarDivCampo,
  estilizarDivider,
  estilizarFlex,
  estilizarInlineFlex,
  estilizarInputMask,
  estilizarInputText,
  estilizarLabel,
} from "../../utilitários/estilos";
export default function ConsultarDiretorEscola() {
  const { usuárioLogado } = useContext(ContextoUsuário);
  const { diretor_escolaInteressado } = useContext(ContextoDiretorAquario);
  const dados = {
    nome: diretor_escolaInteressado?.usuário?.nome,
    nome_escola: diretor_escolaInteressado?.nome_escola,
    turno: diretor_escolaInteressado?.turno,
  };
  const navegar = useNavigate();
  function retornarConsultarInteresse() {
    navegar("../consultar-reserva");
  }
  return (
    <div className={estilizarFlex()}>
      <Card
        title="Consultar Diretor Escola"
        className={estilizarCard(usuárioLogado.cor_tema)}
      >
        <div className={estilizarDivCampo()}>
          <label className={estilizarLabel(usuárioLogado.cor_tema)}>
            Nome*:
          </label>
          <InputText
            name="nome"
            className={estilizarInputText(null, 400, usuárioLogado.cor_tema)}
            value={dados.nome}
            disabled
          />
        </div>
        <div className={estilizarDivCampo()}>
          <label className={estilizarLabel(usuárioLogado.cor_tema)}>
            Nome da Escola*:
          </label>
          <InputText
            name="nome_escola"
            className={estilizarInputText(null, 300, usuárioLogado.cor_tema)}
            value={dados.nome_escola}
            disabled
          />
        </div>
        <div className={estilizarDivCampo()}>
          <label className={estilizarLabel(usuárioLogado.cor_tema)}>
            Turno*:
          </label>
          <InputText
            name="turno"
            value={dados.turno}
            className={estilizarInputMask(null, usuárioLogado.cor_tema)}
            disabled
          />
        </div>
        <Divider className={estilizarDivider(dados.cor_tema)} />
        <div className={estilizarInlineFlex()}>
          <Button
            className={estilizarBotãoRetornar()}
            label="Retornar"
            onClick={retornarConsultarInteresse}
          />
        </div>
      </Card>
    </div>
  );
}
