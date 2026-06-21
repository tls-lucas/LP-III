import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Divider } from "primereact/divider";
import { Dropdown } from "primereact/dropdown";
import { InputNumber } from "primereact/inputnumber";
import { InputText } from "primereact/inputtext";
import ContextoUsuário from "../../contextos/contexto-usuário";
import ContextoDiretorEscola from "../../contextos/contexto-diretor-escola";
import {
  estilizarBotãoRetornar,
  estilizarCard,
  estilizarDropdown,
  estilizarDivCampo,
  estilizarDivider,
  estilizarFlex,
  estilizarInlineFlex,
  estilizarInputText,
  estilizarLabel,
} from "../../utilitários/estilos";

const opçõesCertificacaoAmbiental = [
  { label: "Não Possui", value: "Não Possui" },
  { label: "Certificação Estadual", value: "Certificação Estadual" },
  { label: "Certificação Nacional", value: "Certificação Nacional" },
  { label: "Certificação Internacional", value: "Certificação Internacional" },
];

export default function ConsultarDiretorAquario() {
  const { usuárioLogado } = useContext(ContextoUsuário);
  const { diretorAquarioProponente } = useContext(ContextoDiretorEscola);
  const dados = {
    nome_diretor_aquario: diretorAquarioProponente?.usuário?.nome,
    nome_aquario: diretorAquarioProponente?.nome_aquario,
    anos_direção: diretorAquarioProponente?.anos_direção,
    certificacao_ambiental: diretorAquarioProponente?.certificacao_ambiental,
  };
  const navegar = useNavigate();
  function retornarConsultarProposta() {
    navegar("/consultar-periodo-visita");
  }
  return (
    <div className={estilizarFlex()}>
      <Card
        title="Consultar Diretor Aquario"
        className={estilizarCard(usuárioLogado.cor_tema)}
      >
        <div className={estilizarDivCampo()}>
          <label className={estilizarLabel(usuárioLogado.cor_tema)}>
            DiretorAquario*:
          </label>
          <InputText
            name="nome_diretor_aquario"
            className={estilizarInputText(null, 400, usuárioLogado.cor_tema)}
            value={dados.nome_diretor_aquario}
            disabled
          />
        </div>
        <div className={estilizarDivCampo()}>
          <label className={estilizarLabel(usuárioLogado.cor_tema)}>
            Nome do Aquario*:
          </label>
          <InputText
            name="nome_aquario"
            className={estilizarInputText(null, 150, usuárioLogado.cor_tema)}
            value={dados.nome_aquario}
            autoResize
            disabled
          />
        </div>
        <div className={estilizarDivCampo()}>
          <label className={estilizarLabel(usuárioLogado.cor_tema)}>
            Anos de Diretor*:
          </label>
          <InputNumber
            name="anos_direção"
            value={dados.anos_direção}
            inputClassName={estilizarInputText(null, usuárioLogado.cor_tema)}
            disabled
          />
        </div>
        <div className={estilizarDivCampo()}>
          <label className={estilizarLabel(usuárioLogado.cor_tema)}>
            Certificação Ambiental:
          </label>
          <Dropdown
            name="certificacao_ambiental"
            className={estilizarDropdown(null, usuárioLogado.cor_tema)}
            value={dados.certificacao_ambiental}
            options={opçõesCertificacaoAmbiental}
            placeholder="-- Não informado --"
            disabled
          />
        </div>
        <Divider className={estilizarDivider(dados.cor_tema)} />
        <div className={estilizarInlineFlex()}>
          <Button
            className={estilizarBotãoRetornar()}
            label="Retornar"
            onClick={retornarConsultarProposta}
          />
        </div>
      </Card>
    </div>
  );
}
