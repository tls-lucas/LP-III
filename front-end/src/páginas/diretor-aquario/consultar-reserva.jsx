import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Checkbox } from "primereact/checkbox";
import { Divider } from "primereact/divider";
import { InputText } from "primereact/inputtext";
import ContextoUsuário from "../../contextos/contexto-usuário";
import ContextoDiretorAquario from "../../contextos/contexto-diretor-aquario";
import {
  estilizarBotão,
  estilizarBotãoRetornar,
  estilizarCard,
  estilizarCheckbox,
  estilizarDivCampo,
  estilizarDivider,
  estilizarFlex,
  estilizarInlineFlex,
  estilizarInputText,
  estilizarLabel,
} from "../../utilitários/estilos";
export default function ConsultarReserva() {
  const { usuárioLogado } = useContext(ContextoUsuário);
  const { reservaConsultado, setDiretorEscolaInteressado } = useContext(
    ContextoDiretorAquario,
  );
  const dados = {
    nome_diretor_escola: reservaConsultado?.diretor_escola?.usuário?.nome,
    necessidade_pcd: reservaConsultado?.necessidade_pcd,
    horario: reservaConsultado?.horario,
    título_periodo_visita: reservaConsultado?.periodo_visita.título,
  };
  const navegar = useNavigate();
  function retornarPesquisarReservas() {
    navegar("../pesquisar-reservas");
  }
  function consultarDiretorEscolaInteressado() {
    setDiretorEscolaInteressado(reservaConsultado.diretor_escola);
    navegar("../consultar-diretor-escola-interessado");
  }
  return (
    <div className={estilizarFlex()}>
      <Card
        title="Consultar Reserva"
        className={estilizarCard(usuárioLogado.cor_tema)}
      >
        <div className={estilizarDivCampo()}>
          <label className={estilizarLabel(usuárioLogado.cor_tema)}>
            Diretor Escola*:
          </label>
          <InputText
            name="nome_diretor_escola"
            className={estilizarInputText(null, 400, usuárioLogado.cor_tema)}
            value={dados.nome_diretor_escola}
            disabled
          />
        </div>
        <div className={estilizarDivCampo()}>
          <label className={estilizarLabel(usuárioLogado.cor_tema)}>
            Necessidade de PCD*:
          </label>
          <Checkbox
            name="necessidade_pcd"
            checked={dados.necessidade_pcd}
            className={estilizarCheckbox()}
            autoResize
            disabled
          />
        </div>
        <div className={estilizarDivCampo()}>
          <label className={estilizarLabel(usuárioLogado.cor_tema)}>
            Horario*:
          </label>
          <InputText
            name="horario"
            className={estilizarInputText(null, 400, usuárioLogado.cor_tema)}
            value={dados.horario}
            disabled
          />
        </div>
        <div className={estilizarDivCampo()}>
          <label className={estilizarLabel(usuárioLogado.cor_tema)}>
            PeriodoVisita*
          </label>
          <InputText
            name="título_periodo_visita"
            className={estilizarInputText(null, 400, usuárioLogado.cor_tema)}
            value={dados.título_periodo_visita}
            disabled
          />
        </div>
        <Divider className={estilizarDivider()} />
        <div className={estilizarInlineFlex()}>
          <Button
            className={estilizarBotãoRetornar()}
            label="Retornar"
            onClick={retornarPesquisarReservas}
          />
          <Button
            className={estilizarBotão()}
            label="DiretorEscola"
            onClick={consultarDiretorEscolaInteressado}
          />
        </div>
      </Card>
    </div>
  );
}
