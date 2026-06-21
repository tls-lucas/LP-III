import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Divider } from "primereact/divider";
import { Dropdown } from "primereact/dropdown";
import { InputNumber } from "primereact/inputnumber";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";

import ContextoUsuário from "../../contextos/contexto-usuário";
import {
  serviçoCadastrarDiretorAquario,
  serviçoBuscarDiretorAquario,
  serviçoAtualizarDiretorAquario,
} from "../../serviços/serviços-diretor-aquario";

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
  estilizarDropdown,
  estilizarInputText,
  estilizarDivCampo,
  estilizarDivider,
  estilizarFlex,
  estilizarInlineFlex,
  estilizarInputNumber,
  estilizarLabel,
} from "../../utilitários/estilos";

export default function CadastrarDiretorAquario() {
  const referênciaToast = useRef(null);

  const { usuárioLogado, setUsuárioLogado } = useContext(ContextoUsuário);

  const opçõesCertificacaoAmbiental = [
    { label: "Não Possui", value: "Não Possui" },
    { label: "Certificação Estadual", value: "Certificação Estadual" },
    { label: "Certificação Nacional", value: "Certificação Nacional" },
    { label: "Certificação Internacional", value: "Certificação Internacional" },
  ];

  const [dados, setDados] = useState({
    nome_aquario: "",
    anos_direção: "",
    certificacao_ambiental: "",
  });

  const [erros, setErros] = useState({});
  const [cpfExistente, setCpfExistente] = useState(false);

  const navegar = useNavigate();

  function alterarEstado(event) {
    const chave = event.target.name || event.value;
    const valor = event.target.value;

    setDados({
      ...dados,
      [chave]: valor,
    });
  }

  function validarCampos() {
    let errosCamposObrigatórios;

    errosCamposObrigatórios = validarCamposObrigatórios(dados);
    setErros(errosCamposObrigatórios);

    return checarListaVazia(errosCamposObrigatórios);
  }

  function títuloFormulário() {
    if (usuárioLogado?.cadastrado) return "Consultar DiretorAquario";
    else return "Cadastrar DiretorAquario";
  }

  async function cadastrarDiretorAquario() {
    if (validarCampos()) {
      try {
        const response = await serviçoCadastrarDiretorAquario({
          ...dados,
          usuário_info: usuárioLogado,
          nome_aquario: dados.nome_aquario,
          anos_direção: dados.anos_direção,
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
          "DiretorAquario cadastrado com sucesso!",
          "sucesso",
        );
      } catch (error) {
        setCpfExistente(true);

        mostrarToast(referênciaToast, error.response.data.erro, "erro");
      }
    }
  }
  async function atualizarDiretorAquario() {
    if (validarCampos()) {
      try {
        const response = await serviçoAtualizarDiretorAquario({
          ...dados,
          cpf: usuárioLogado.cpf,
        });
        if (response)
          mostrarToast(
            referênciaToast,
            "Diretor do Aquario atualizado com sucesso!",
            "sucesso",
          );
      } catch (error) {
        mostrarToast(referênciaToast, error.response.data.erro, "erro");
      }
    }
  }
  function labelBotãoSalvar() {
    if (usuárioLogado?.cadastrado) return "Alterar";
    else return "Cadastrar";
  }

  function açãoBotãoSalvar() {
    if (usuárioLogado?.cadastrado) atualizarDiretorAquario();
    else cadastrarDiretorAquario();
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

    async function buscarDadosDiretorAquario() {
      try {
        const response = await serviçoBuscarDiretorAquario(usuárioLogado.cpf);

        if (!desmontado && response.data) {
          setDados((dados) => ({
            ...dados,
            nome_aquario: response.data.nome_aquario,
            anos_direção: response.data.anos_direção,
            certificacao_ambiental: response.data.certificacao_ambiental,
          }));
        }
      } catch (error) {
        const erro = error.response.data.erro;

        if (erro) {
          mostrarToast(referênciaToast, erro, "erro");
        }
      }
    }

    if (usuárioLogado?.cadastrado) {
      buscarDadosDiretorAquario();
    }

    return () => (desmontado = true);
  }, [usuárioLogado?.cadastrado, usuárioLogado.cpf]);

  return (
    <div className={estilizarFlex()}>
      <Toast
        ref={referênciaToast}
        onHide={redirecionar}
        position="bottom-center"
      />

      <Card
        title={títuloFormulário()}
        className={estilizarCard(usuárioLogado.cor_tema)}
      >
        <div className={estilizarDivCampo()}>
          <label className={estilizarLabel(usuárioLogado.cor_tema)}>
            Nome do Aquário*:
          </label>

          <InputText
            name="nome_aquario"
            className={estilizarInputText(
              erros.nome_aquario,
              400,
              dados.cor_tema,
            )}
            value={dados.nome_aquario}
            placeholder="Nome do Aquario"
            onChange={alterarEstado}
          />
          <MostrarMensagemErro mensagem={erros.nome_aquario} />
        </div>

        <div className={estilizarDivCampo()}>
          <label className={estilizarLabel(usuárioLogado.cor_tema)}>
            Anos de Direção*:
          </label>

          <InputNumber
            name="anos_direção"
            size={5}
            value={dados.anos_direção}
            onValueChange={alterarEstado}
            mode="decimal"
            inputClassName={estilizarInputNumber(
              erros.anos_direção,
              usuárioLogado.cor_tema,
            )}
          />

          <MostrarMensagemErro mensagem={erros.anos_direção} />
        </div>

        <div className={estilizarDivCampo()}>
          <label className={estilizarLabel(usuárioLogado.cor_tema)}>
            Certificação Ambiental*:
          </label>

          <Dropdown
            name="certificacao_ambiental"
            className={estilizarDropdown(
              erros.certificacao_ambiental,
              usuárioLogado.cor_tema,
            )}
            value={dados.certificacao_ambiental}
            options={opçõesCertificacaoAmbiental}
            onChange={alterarEstado}
            placeholder="-- Selecione --"
          />

          <MostrarMensagemErro mensagem={erros.certificacao_ambiental} />
        </div>

        <Divider className={estilizarDivider(dados.cor_tema)} />

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
