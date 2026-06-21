import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Divider } from "primereact/divider";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";

import ContextoUsuário from "../../contextos/contexto-usuário";
import {
  serviçoCadastrarDiretorEscola,
  serviçoBuscarDiretorEscola,
  serviçoAtualizarDiretorEscola,
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
  estilizarCard,
  estilizarInputText,
  estilizarDivCampo,
  estilizarDivider,
  estilizarFlex,
  estilizarInlineFlex,
  estilizarDropdown,
  estilizarLabel,
} from "../../utilitários/estilos";

export default function CadastrarDiretorEscola() {
  const referênciaToast = useRef(null);

  const { usuárioLogado, setUsuárioLogado } = useContext(ContextoUsuário);

  const [dados, setDados] = useState({
    nome_escola: "",
    turno: "",
  });

  const [erros, setErros] = useState({});
  const [cpfExistente, setCpfExistente] = useState(false);

  const navegar = useNavigate();

  const opçõesTurno = [
    { label: "Matutino", value: "matutino" },
    { label: "Vespertino", value: "vespertino" },
    { label: "Noturno", value: "noturno" },
  ];

  function alterarEstado(event) {
    const chave = event.target?.name || event.value;
    const valor = event.target?.value || event.value;

    setDados({
      ...dados,
      [chave]: valor,
    });
  }

  function validarCampos() {
    const errosCampos = validarCamposObrigatórios(dados);
    setErros(errosCampos);

    return checarListaVazia(errosCampos);
  }

  function títuloFormulário() {
    if (usuárioLogado?.cadastrado) return "Consultar DiretorEscola";
    else return "Cadastrar DiretorEscola";
  }

  async function cadastrarDiretorEscola() {
    if (validarCampos()) {
      try {
        const response = await serviçoCadastrarDiretorEscola({
          ...dados,
          usuário_info: usuárioLogado,
          nome_escola: dados.nome_escola,
          turno: dados.turno,
        });

        if (response.data) {
          setUsuárioLogado((usuário) => ({
            ...usuário,
            status: response.data.status,
            token: response.data.token,
          }));
        }

        mostrarToast(
          referênciaToast,
          "DiretorEscola cadastrado com sucesso!",
          "sucesso",
        );
      } catch (error) {
        setCpfExistente(true);
        mostrarToast(referênciaToast, error.response?.data?.erro, "erro");
      }
    }
  }

  async function atualizarDiretorEscola() {
    if (validarCampos()) {
      try {
        const response = await serviçoAtualizarDiretorEscola({
          ...dados,
          cpf: usuárioLogado.cpf,
        });

        if (response)
          mostrarToast(
            referênciaToast,
            "Diretor da Escola atualizado com sucesso!",
            "sucesso",
          );
      } catch (error) {
        mostrarToast(referênciaToast, error.response?.data?.erro, "erro");
      }
    }
  }

  function labelBotãoSalvar() {
    if (usuárioLogado?.cadastrado) return "Alterar";
    else return "Cadastrar";
  }

  function açãoBotãoSalvar() {
    if (usuárioLogado?.cadastrado) {
      atualizarDiretorEscola();
    } else {
      cadastrarDiretorEscola();
    }
  }

  function redirecionar() {
    if (cpfExistente) {
      setUsuárioLogado(null);
      navegar("/criar-usuario");
    } else {
      setUsuárioLogado((usuárioLogado) => ({
        ...usuárioLogado,
        cadastrado: true,
      }));
      navegar("/pagina-inicial");
    }
  }

  useEffect(() => {
    let desmontado = false;

    async function buscarDadosDiretorEscola() {
      if (!usuárioLogado?.cpf) return;

      try {
        const response = await serviçoBuscarDiretorEscola(usuárioLogado.cpf);

        if (!desmontado && response.data) {
          setDados((dados) => ({
            ...dados,
            nome_escola: response.data.nome_escola,
            turno: response.data.turno,
          }));
        }
      } catch (error) {
        const erro = error.response?.data?.erro;

        if (erro) {
          mostrarToast(referênciaToast, erro, "erro");
        }
      }
    }

    if (usuárioLogado?.cadastrado) {
      buscarDadosDiretorEscola();
    }

    return () => (desmontado = true);
  }, [usuárioLogado?.cadastrado, usuárioLogado?.cpf]);

  return (
    <div className={estilizarFlex()}>
      <Toast
        ref={referênciaToast}
        onHide={redirecionar}
        position="bottom-center"
      />

      <Card
        title={títuloFormulário()}
        className={estilizarCard(usuárioLogado?.cor_tema)}
      >
        <div className={estilizarDivCampo()}>
          <label className={estilizarLabel(usuárioLogado?.cor_tema)}>
            Nome da Escola*:
          </label>

          <InputText
            name="nome_escola"
            className={estilizarInputText(
              erros.nome_escola,
              usuárioLogado?.cor_tema,
            )}
            value={dados.nome_escola}
            placeholder="Nome da Escola"
            onChange={alterarEstado}
          />
          <MostrarMensagemErro mensagem={erros.nome_escola} />
        </div>

        <div className={estilizarDivCampo()}>
          <label className={estilizarLabel(usuárioLogado?.cor_tema)}>
            Turno*:
          </label>

          <Dropdown
            name="turno"
            value={dados.turno}
            options={opçõesTurno}
            onChange={alterarEstado}
            placeholder="-- Selecione --"
            className={estilizarDropdown(erros.turno, usuárioLogado?.cor_tema)}
          />

          <MostrarMensagemErro mensagem={erros.turno} />
        </div>

        <Divider className={estilizarDivider()} />

        <div className={estilizarInlineFlex()}>
          <Button
            className={estilizarBotãoRetornar()}
            label="Retornar"
            onClick={redirecionar}
          />

          <Button
            className={estilizarBotão()}
            label={labelBotãoSalvar()}
            onClick={açãoBotãoSalvar}
          />
        </div>
      </Card>
    </div>
  );
}
