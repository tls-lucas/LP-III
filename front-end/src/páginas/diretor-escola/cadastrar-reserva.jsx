import { useContext, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Checkbox } from "primereact/checkbox";
import ContextoDiretorEscola from "../../contextos/contexto-diretor-escola";
import { Divider } from "primereact/divider";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { InputNumber } from "primereact/inputnumber";
import { Dropdown } from "primereact/dropdown";
import { Toast } from "primereact/toast";
import ContextoUsuário from "../../contextos/contexto-usuário";
import {
  serviçoCadastrarReserva,
  serviçoRemoverReserva,
} from "../../serviços/serviços-diretor-escola";
import mostrarToast from "../../utilitários/mostrar-toast";
import {
  MostrarMensagemErro,
  checarListaVazia,
  validarCamposObrigatórios,
} from "../../utilitários/validações";
import {
  estilizarBotão,
  estilizarBotãoRetornar,
  estilizarBotãoRemover,
  estilizarCard,
  estilizarCheckbox,
  estilizarDivCampo,
  estilizarInputNumber,
  estilizarDivider,
  estilizarFlex,
  estilizarDropdown,
  estilizarInlineFlex,
  estilizarInputText,
  estilizarInputTextarea,
  estilizarLabel,
} from "../../utilitários/estilos";
export default function CadastrarReserva() {
  const referênciaToast = useRef(null);
  const { usuárioLogado } = useContext(ContextoUsuário);
  const {
    reservaConsultado,
    periodo_visitaSelecionada,
    setPeriodoVisitaConsultada,
    setPeriodoVisitaReserva,
  } = useContext(ContextoDiretorEscola);
  const [dados, setDados] = useState({
    id_periodo_visita: periodo_visitaSelecionada?.id || "",
    necessidade_pcd: reservaConsultado?.necessidade_pcd || "",
    guia: reservaConsultado?.guia || "",
    horario: reservaConsultado?.horario || "",
    n_alunos: reservaConsultado?.n_alunos || "",
  });
  const [erros, setErros] = useState({});
  const navegar = useNavigate();
  function alterarEstado(event) {
    const chave = event.target.name || event.value;
    let valor = event.target.value || event.checked;
    setDados({ ...dados, [chave]: valor });
  }
  function validarCampos() {
    const { guia, horario, n_alunos } = dados;
    let errosCamposObrigatórios = validarCamposObrigatórios({
      guia,
      horario,
      n_alunos,
    });
    setErros(errosCamposObrigatórios);
    return checarListaVazia(errosCamposObrigatórios);
  }
  function periodo_visitaLabel() {
    if (reservaConsultado?.título_periodo_visita || periodo_visitaSelecionada)
      return "Periodo Visita Selecionado*:";
    else return "Selecione um Periodo de Visita*:";
  }
  function pesquisarPeriodoVisitas() {
    navegar("../pesquisar-periodos-visitas");
  }
  function retornarAdministrarReservas() {
    navegar("../administrar-reserva");
  }
  async function cadastrarReserva() {
    if (validarCampos()) {
      try {
        await serviçoCadastrarReserva({ ...dados, cpf: usuárioLogado.cpf });
        mostrarToast(
          referênciaToast,
          "Reserva cadastrado com sucesso!",
          "sucesso",
        );
      } catch (error) {
        mostrarToast(referênciaToast, error.response.data.erro, "erro");
      }
    }
  }
  const opçõesHorario = [
    { label: "08:00 - 09:00", value: "08:00 - 09:00" },
    { label: "09:00 - 10:00", value: "09:00 - 10:00" },
    { label: "10:00 - 11:00", value: "10:00 - 11:00" },
    { label: "11:00 - 12:00", value: "11:00 - 12:00" },
    { label: "12:00 - 13:00", value: "12:00 - 13:00" },
    { label: "13:00 - 14:00", value: "13:00 - 14:00" },
    { label: "14:00 - 15:00", value: "14:00 - 15:00" },
    { label: "15:00 - 16:00", value: "15:00 - 16:00" },
    { label: "16:00 - 17:00", value: "16:00 - 17:00" },
    { label: "17:00 - 18:00", value: "17:00 - 18:00" },
  ];
  async function removerReserva() {
    try {
      await serviçoRemoverReserva(reservaConsultado.id);
      mostrarToast(referênciaToast, "Reserva removido com sucesso!", "sucesso");
    } catch (error) {
      mostrarToast(referênciaToast, error.response.data.erro, "erro");
    }
  }
  function BotõesAções() {
    if (reservaConsultado) {
      return (
        <div className={estilizarInlineFlex()}>
          <Button
            className={estilizarBotãoRetornar()}
            label="Retornar"
            onClick={retornarAdministrarReservas}
          />
          <Button
            className={estilizarBotãoRemover()}
            label="Remover"
            onClick={removerReserva}
          />
          <Button
            className={estilizarBotão()}
            label="Proposta"
            onClick={consultarPeriodoVisitaReserva()}
          />
        </div>
      );
    } else {
      return (
        <div className={estilizarInlineFlex()}>
          <Button
            className={estilizarBotãoRetornar()}
            label="Retornar"
            onClick={retornarAdministrarReservas}
          />
          <Button
            className={estilizarBotão()}
            label="Cadastrar"
            onClick={cadastrarReserva}
          />
        </div>
      );
    }
  }
  function títuloFormulário() {
    if (reservaConsultado) return "Remover Reserva";
    else return "Cadastrar Reserva";
  }
  function PeriodoVisitaInputText() {
    if (periodo_visitaSelecionada?.título) {
      return (
        <InputText
          name="título_periodo_visita"
          className={estilizarInputText(
            erros.título_periodo_visita,
            400,
            usuárioLogado.cor_tema,
          )}
          value={periodo_visitaSelecionada?.título}
          disabled
        />
      );
    } else if (reservaConsultado?.periodo_visita?.título) {
      return (
        <InputText
          name="título_periodo_visita"
          className={estilizarInputText(
            erros.título_periodo_visita,
            400,
            usuárioLogado.cor_tema,
          )}
          value={reservaConsultado?.periodo_visita?.título}
          disabled
        />
      );
    } else return null;
  }
  function consultarPeriodoVisitaReserva() {
    setPeriodoVisitaConsultada(null);
    setPeriodoVisitaReserva(reservaConsultado?.periodo_visita);
    navegar("../consultar-periodo-visita");
  }
  function BotãoSelecionar() {
    if (!periodo_visitaSelecionada && !reservaConsultado) {
      return (
        <Button
          className={estilizarBotão()}
          label="Selecionar"
          onClick={pesquisarPeriodoVisitas}
        />
      );
    } else if (periodo_visitaSelecionada) {
      return (
        <Button
          className={estilizarBotão()}
          label="Substituir"
          onClick={pesquisarPeriodoVisitas}
        />
      );
    } else return null;
  }
  return (
    <div className={estilizarFlex()}>
      <Toast
        ref={referênciaToast}
        onHide={retornarAdministrarReservas}
        position="bottom-center"
      />
      <Card
        title={títuloFormulário()}
        className={estilizarCard(usuárioLogado.cor_tema)}
      >
        <div className={estilizarDivCampo()}>
          <label className={estilizarLabel(usuárioLogado.cor_tema)}>
            {periodo_visitaLabel()}
          </label>
          <BotãoSelecionar />
          <PeriodoVisitaInputText />
          <MostrarMensagemErro mensagem={erros.id} />
        </div>
        <div className={estilizarDivCampo()}>
          <label className={estilizarLabel(usuárioLogado.cor_tema)}>
            Necessidade PCD*:
          </label>
          <Checkbox
            name="necessidade_pcd"
            checked={dados.necessidade_pcd}
            className={estilizarCheckbox()}
            onChange={alterarEstado}
            autoResize
          />
        </div>
        <div className={estilizarDivCampo()}>
          <label className={estilizarLabel(usuárioLogado.cor_tema)}>
            Nome do Guia*:
          </label>
          <InputTextarea
            name="guia"
            value={dados.guia}
            className={estilizarInputTextarea(
              erros.guia,
              usuárioLogado.cor_tema,
            )}
            onChange={alterarEstado}
            autoResize
            cols={40}
          />
        </div>
        <div className={estilizarDivCampo()}>
          <label className={estilizarLabel(usuárioLogado.cor_tema)}>
            Horário*:
          </label>
          <Dropdown
            name="horario"
            className={estilizarDropdown(erros.horario, usuárioLogado.cor_tema)}
            value={dados.horario}
            options={opçõesHorario}
            onChange={alterarEstado}
            placeholder="-- Selecione --"
          />
          <MostrarMensagemErro mensagem={erros.horario} />
        </div>
        <div className={estilizarDivCampo()}>
          <label className={estilizarLabel(usuárioLogado.cor_tema)}>
            Número de Alunos*:
          </label>
          <InputNumber
            name="n_alunos"
            className={estilizarInputNumber(
              erros.n_alunos,
              200,
              usuárioLogado.cor_tema,
            )}
            value={dados.n_alunos}
            onValueChange={alterarEstado}
          />
        </div>
        <MostrarMensagemErro mensagem={erros.n_alunos} />

        <Divider className={estilizarDivider()} />
        <BotõesAções />
      </Card>
    </div>
  );
}
