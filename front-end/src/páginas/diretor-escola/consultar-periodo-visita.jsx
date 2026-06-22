import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Checkbox } from "primereact/checkbox";
import { Divider } from "primereact/divider";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import ContextoUsuário from "../../contextos/contexto-usuário";
import ContextoDiretorEscola from "../../contextos/contexto-diretor-escola";
import {
  estilizarBotãoRetornar,
  estilizarCard,
  estilizarBotão,
  estilizarCheckbox,
  estilizarDivCampo,
  estilizarDivider,
  estilizarInputNumber,
  estilizarFlex,
  estilizarInlineFlex,
  estilizarInputText,
  estilizarLabel,
} from "../../utilitários/estilos";
export default function ConsultarPeriodoVisita() {
  const { usuárioLogado } = useContext(ContextoUsuário);
  const {
    periodo_visitaConsultada,
    periodo_visitaReserva,
    setDiretorAquarioProponente,
    reservaConsultado,
  } = useContext(ContextoDiretorEscola);
  const dados = {
    nome_diretor_aquario:
      periodo_visitaConsultada?.diretor_aquario?.usuário?.nome ||
      periodo_visitaReserva?.diretor_aquario?.usuário?.nome,
    título: periodo_visitaConsultada?.título || periodo_visitaReserva?.título,
    categoria:
      periodo_visitaConsultada?.categoria || periodo_visitaReserva?.categoria,
    date: periodo_visitaConsultada?.date || periodo_visitaReserva?.date,
    numero_tanques:
      periodo_visitaConsultada?.numero_tanques ||
      periodo_visitaReserva?.numero_tanques,
    inclui_transporte:
      periodo_visitaConsultada?.inclui_transporte ||
      periodo_visitaReserva?.inclui_transporte,
  };
  const navegar = useNavigate();
  function consultarDiretorAquarioProponente() {
    if (reservaConsultado)
      setDiretorAquarioProponente(periodo_visitaReserva?.diretor_aquario);
    else setDiretorAquarioProponente(periodo_visitaConsultada?.diretor_aquario);
    navegar("../consultar-diretor-aquario-proponente");
  }
  function retornar() {
    if (periodo_visitaConsultada) navegar("../pesquisar-periodos-visitas");
    else if (periodo_visitaReserva) navegar("../cadastrar-reserva");
  }
  return (
    <div className={estilizarFlex()}>
      <Card
        title="Consultar Periodo Visita"
        className={estilizarCard(usuárioLogado.cor_tema)}
      >
        <div className={estilizarDivCampo()}>
          <label className={estilizarLabel(usuárioLogado.cor_tema)}>
            DiretorAquario*:
          </label>
          <InputText
            name="nome_diretor-aquario"
            className={estilizarInputText(null, 400, usuárioLogado.cor_tema)}
            value={dados.nome_diretor_aquario}
            disabled
          />
        </div>
        <div className={estilizarDivCampo()}>
          <label className={estilizarLabel(usuárioLogado.cor_tema)}>
            Título*:
          </label>
          <InputText
            name="título"
            className={estilizarInputText(null, 400, usuárioLogado.cor_tema)}
            value={dados.título}
            disabled
          />
        </div>
        <div className={estilizarDivCampo()}>
          <label className={estilizarLabel(usuárioLogado.cor_tema)}>
            Categoria*:
          </label>
          <InputText
            name="categoria"
            className={estilizarInputText(null, 200, usuárioLogado.cor_tema)}
            value={dados.categoria}
            disabled
          />
        </div>
        <div className={estilizarDivCampo()}>
          <label className={estilizarLabel(usuárioLogado.cor_tema)}>
            Data de Início*:
          </label>
          <InputText
            name="date"
            type="date"
            value={dados.date}
            className={estilizarInputText(null, usuárioLogado.cor_tema)}
            disabled
          />
        </div>
        <div className={estilizarDivCampo()}>
          <label className={estilizarLabel(usuárioLogado.cor_tema)}>
            Inclui Transporte*:
          </label>
          <Checkbox
            name="inclui_transporte"
            checked={dados.inclui_transporte}
            className={estilizarCheckbox(null)}
            autoResize
            dataType="boolean"
            disabled
          />
        </div>
        <div className={estilizarDivCampo()}>
          <label className={estilizarLabel(usuárioLogado.cor_tema)}>
            Número de Tanques*:
          </label>
          <InputNumber
            name="numero_tanques"
            className={estilizarInputNumber(null, 100, usuárioLogado.cor_tema)}
            value={dados.numero_tanques}
            autoResize
            disabled
          />
        </div>
        <Divider className={estilizarDivider()} />
        <div className={estilizarInlineFlex()}>
          <Button
            className={estilizarBotãoRetornar()}
            label="Retornar"
            onClick={retornar}
          />
          <Button
            className={estilizarBotão()}
            label="Diretor_Aquario"
            onClick={consultarDiretorAquarioProponente}
          />
        </div>
      </Card>
    </div>
  );
}
