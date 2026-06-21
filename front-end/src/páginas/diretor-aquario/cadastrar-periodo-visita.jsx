import { useContext, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Checkbox } from "primereact/checkbox";
import { Divider } from "primereact/divider";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import ContextoUsuário from "../../contextos/contexto-usuário";
import ContextoDiretorAquario from "../../contextos/contexto-diretor-aquario";
import {
  serviçoAlterarPeriodoVisita,
  serviçoCadastrarPeriodoVisita,
  serviçoRemoverPeriodoVisita,
} from "../../serviços/serviços-diretor-aquario";
import mostrarToast from "../../utilitários/mostrar-toast";
import {
  MostrarMensagemErro,
  checarListaVazia,
  validarCamposObrigatórios,
} from "../../utilitários/validações";
import {
  estilizarBotão,
  estilizarBotãoRemover,
  estilizarBotãoRetornar,
  estilizarCard,
  estilizarCheckbox,
  estilizarDivCampo,
  estilizarDivider,
  estilizarDropdown,
  estilizarFlex,
  estilizarInlineFlex,
  estilizarInputNumber,
  estilizarInputText,
  estilizarLabel,
} from "../../utilitários/estilos";
import { InputNumber } from "primereact/inputnumber";
export default function CadastrarPeriodoVisita() {
  const referênciaToast = useRef(null);
  const { usuárioLogado } = useContext(ContextoUsuário);
  const { periodo_visitaConsultada } = useContext(ContextoDiretorAquario);
  const [dados, setDados] = useState({
    título: periodo_visitaConsultada?.título || "",
    categoria: periodo_visitaConsultada?.categoria || "",
    nome_responsavel: periodo_visitaConsultada?.nome_responsavel || "",
    date: periodo_visitaConsultada?.date || "",
    numero_tanques: periodo_visitaConsultada?.numero_tanques || "",
    inclui_transporte: periodo_visitaConsultada?.inclui_transporte || "",
  });
  const [erros, setErros] = useState({});
  const navegar = useNavigate();
  const opçõesCategoria = [
    { label: "Agua Salgada", value: "agua_salgada" },
    { label: "Agua Doce", value: "agua_doce" },
  ];

  function alterarEstado(event) {
    const chave = event.target?.name;
    const valor = event.target?.value ?? event.value ?? event.checked;

    setDados({
      ...dados,
      [chave]: valor,
    });
  }
  function validarCampos() {
    const { título, categoria, nome_responsavel, date, numero_tanques } = dados;
    let errosCamposObrigatórios = validarCamposObrigatórios({
      título,
      categoria,
      nome_responsavel,
      date,
      numero_tanques,
    });
    setErros(errosCamposObrigatórios);
    return checarListaVazia(errosCamposObrigatórios);
  }
  function retornarAdministrarPeridoVisita() {
    navegar("../administrar-periodos-visitas");
  }
  async function cadastrarPeriodoVisita() {
    if (validarCampos()) {
      try {
        await serviçoCadastrarPeriodoVisita({
          ...dados,
          cpf: usuárioLogado.cpf,
        });
        mostrarToast(
          referênciaToast,
          "PeriodoVisita cadastrada com sucesso!",
          "sucesso",
        );
      } catch (error) {
        mostrarToast(referênciaToast, error.response.data.erro, "error");
      }
    }
  }
  function mostrarReservas() {
    navegar("../pesquisar-reservas");
  }
  async function alterarPeriodoVisita() {
    if (validarCampos()) {
      try {
        await serviçoAlterarPeriodoVisita({
          ...dados,
          id: periodo_visitaConsultada.id,
        });
        mostrarToast(
          referênciaToast,
          "PeriodoVisita alterada com sucesso!",
          "sucesso",
        );
      } catch (error) {
        mostrarToast(referênciaToast, error.response.data.erro, "error");
      }
    }
  }
  async function removerPeriodoVisita() {
    try {
      await serviçoRemoverPeriodoVisita(periodo_visitaConsultada.id);
      mostrarToast(
        referênciaToast,
        "PeriodoVisita excluída com sucesso!",
        "sucesso",
      );
    } catch (error) {
      mostrarToast(referênciaToast, error.response.data.erro, "error");
    }
  }
  function BotõesAções() {
    if (periodo_visitaConsultada) {
      return (
        <div className={estilizarInlineFlex()}>
          <Button
            className={estilizarBotãoRetornar()}
            label="Retornar"
            onClick={retornarAdministrarPeridoVisita}
          />
          <Button
            className={estilizarBotãoRemover()}
            label="Remover"
            onClick={removerPeriodoVisita}
          />
          <Button
            className={estilizarBotão()}
            label="Alterar"
            onClick={alterarPeriodoVisita}
          />
          <Button
            className={estilizarBotão()}
            label="Interesses"
            onClick={mostrarReservas}
          />
        </div>
      );
    } else {
      return (
        <div className={estilizarInlineFlex()}>
          <Button
            className={estilizarBotãoRetornar()}
            label="Retornar"
            onClick={retornarAdministrarPeridoVisita}
          />
          <Button
            className={estilizarBotão()}
            label="Cadastrar"
            onClick={cadastrarPeriodoVisita}
          />
        </div>
      );
    }
  }
  function títuloFormulário() {
    if (periodo_visitaConsultada) return "Alterar PeriodoVisita";
    else return "Cadastrar Periodo Visita";
  }
  return (
    <div className={estilizarFlex()}>
      <Toast
        ref={referênciaToast}
        onHide={retornarAdministrarPeridoVisita}
        position="bottom-center"
      />
      <Card
        title={títuloFormulário()}
        className={estilizarCard(usuárioLogado.cor_tema)}
      >
        <div className={estilizarDivCampo()}>
          <label className={estilizarLabel(usuárioLogado.cor_tema)}>
            Título*:
          </label>
          <InputText
            name="título"
            className={estilizarInputText(
              erros.título,
              400,
              usuárioLogado.cor_tema,
            )}
            value={dados.título}
            onChange={alterarEstado}
          />
          <MostrarMensagemErro mensagem={erros.título} />
        </div>
        <div className={estilizarDivCampo()}>
          <label className={estilizarLabel(usuárioLogado.cor_tema)}>
            Categoria*:
          </label>
          <Dropdown
            name="categoria"
            className={estilizarDropdown(
              erros.categoria,
              usuárioLogado.cor_tema,
            )}
            value={dados.categoria}
            options={opçõesCategoria}
            onChange={alterarEstado}
            placeholder="-- Selecione --"
          />
          <MostrarMensagemErro mensagem={erros.categoria} />
        </div>
        <div className={estilizarDivCampo()}>
          <label className={estilizarLabel(usuárioLogado.cor_tema)}>
            Número de Tanques*:
          </label>
          <InputNumber
            name="numero_tanques"
            className={estilizarInputNumber(
              erros.numero_tanques,
              200,
              usuárioLogado.cor_tema,
            )}
            value={dados.numero_tanques}
            onValueChange={alterarEstado}
          />
        </div>
        <div className={estilizarDivCampo()}>
          <label className={estilizarLabel(usuárioLogado.cor_tema)}>
            Nome Responsavel*:
          </label>
          <InputText
            name="nome_responsavel"
            className={estilizarInputText(
              erros.nome_responsavel,
              200,
              usuárioLogado.cor_tema,
            )}
            value={dados.nome_responsavel}
            onChange={alterarEstado}
          />
          <MostrarMensagemErro mensagem={erros.nome_responsavel} />
        </div>
        <div className={estilizarDivCampo()}>
          <label className={estilizarLabel(usuárioLogado.cor_tema)}>
            Data de Início:
          </label>
          <InputText
            name="date"
            type="date"
            value={dados.date}
            className={estilizarInputText(erros.date, usuárioLogado.cor_tema)}
            onChange={alterarEstado}
          />
          <MostrarMensagemErro mensagem={erros.date} />
        </div>

        <div className={estilizarDivCampo()}>
          <label className={estilizarLabel(usuárioLogado.cor_tema)}>
            Inclui Transporte*:
          </label>
          <Checkbox
            name="inclui_transporte"
            type="checkbox"
            checked={dados.inclui_transporte}
            className={estilizarCheckbox()}
            onChange={alterarEstado}
            autoResize
          />
        </div>
        <Divider className={estilizarDivider()} />
        <BotõesAções />
      </Card>
    </div>
  );
}
