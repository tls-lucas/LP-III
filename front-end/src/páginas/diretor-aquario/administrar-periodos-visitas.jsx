import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Divider } from "primereact/divider";
import { Dropdown } from "primereact/dropdown";
import { TriStateCheckbox } from "primereact/tristatecheckbox";
import { Toast } from "primereact/toast";
import ContextoDiretorAquario from "../../contextos/contexto-diretor-aquario";
import ContextoUsuário from "../../contextos/contexto-usuário";
import { serviçoBuscarPeriodosVisitasDiretorAquario } from "../../serviços/serviços-diretor-aquario";
import mostrarToast from "../../utilitários/mostrar-toast";
import {
  TAMANHOS,
  estilizarBotão,
  estilizarBotãoRetornar,
  estilizarBotãoTabela,
  estilizarCard,
  estilizarColunaConsultar,
  estilizarColumnHeader,
  estilizarDataTable,
  estilizarDataTablePaginator,
  estilizarDivider,
  estilizarFilterMenu,
  estilizarFlex,
  estilizarTriStateCheckbox,
} from "../../utilitários/estilos";
export default function AdministrarPeriodosVisitas() {
  const referênciaToast = useRef(null);
  const { usuárioLogado } = useContext(ContextoUsuário);
  const { PeriodoVisitaConsultada, setPeriodoVisitaConsultada } = useContext(
    ContextoDiretorAquario,
  );
  const [listaPeriodosVisitas, setListaPeriodosVisitas] = useState([]);
  const navegar = useNavigate();
  const opçõesCategoria = [
    { label: "Agua Salgada", value: "agua_salgada" },
    { label: "Agua Doce", value: "agua_doce" },
  ];
  function retornarPáginaInicial() {
    navegar("/pagina-inicial");
  }
  function adicionarPeriodoVisita() {
    setPeriodoVisitaConsultada(null);
    navegar("../cadastrar-periodo-visita");
  }
  function ConsultarTemplate(periodo_visita) {
    function consultar() {
      setPeriodoVisitaConsultada(periodo_visita);
      navegar("../cadastrar-periodo-visita");
    }
    return (
      <Button
        icon="pi pi-search"
        className={estilizarBotãoTabela(
          usuárioLogado.cor_tema,
          PeriodoVisitaConsultada?.id === periodo_visita.id,
        )}
        tooltip="Consultar Periodo Visita"
        tooltipOptions={{ position: "top" }}
        onClick={consultar}
      />
    );
  }
  function DropdownÁreaTemplate(opções) {
    function alterarFiltroDropdown(event) {
      return opções.filterCallback(event.value, opções.index);
    }
    return (
      <Dropdown
        value={opções.value}
        options={opçõesCategoria}
        placeholder="Selecione"
        onChange={alterarFiltroDropdown}
        showClear
      />
    );
  }
  function BooleanBodyTemplate(periodo_visita) {
    if (periodo_visita.inclui_transporte) return "Sim";
    else return "Não";
  }
  function BooleanFilterTemplate(opções) {
    function alterarFiltroTriState(event) {
      return opções.filterCallback(event.value);
    }
    return (
      <div>
        <label>Inclui Transporte:</label>
        <TriStateCheckbox
          className={estilizarTriStateCheckbox(usuárioLogado?.cor_tema)}
          value={opções.value}
          onChange={alterarFiltroTriState}
        />
      </div>
    );
  }
  useEffect(() => {
    let desmontado = false;
    async function buscarPeriodosVisitasDiretorAquario() {
      try {
        const response = await serviçoBuscarPeriodosVisitasDiretorAquario(
          usuárioLogado.cpf,
        );
        if (!desmontado && response.data) {
          setListaPeriodosVisitas(response.data);
        }
      } catch (error) {
        const erro = error.response.data.erro;
        if (erro) mostrarToast(referênciaToast, erro, "error");
      }
    }
    buscarPeriodosVisitasDiretorAquario();
    return () => (desmontado = true);
  }, [usuárioLogado.cpf]);
  return (
    <div className={estilizarFlex()}>
      <Toast ref={referênciaToast} position="bottom-center" />
      <Card
        title="Administrar Periodos de Visitas"
        className={estilizarCard(usuárioLogado.cor_tema)}
      >
        <DataTable
          dataKey="id"
          size="small"
          paginator
          rows={TAMANHOS.MAX_LINHAS_TABELA}
          emptyMessage="Nenhuma periodo_visita encontrada."
          value={listaPeriodosVisitas}
          responsiveLayout="scroll"
          breakpoint="490px"
          removableSort
          className={estilizarDataTable()}
          paginatorClassName={estilizarDataTablePaginator(
            usuárioLogado.cor_tema,
          )}
        >
          <Column
            bodyClassName={estilizarColunaConsultar()}
            body={ConsultarTemplate}
            headerClassName={estilizarColumnHeader(usuárioLogado.cor_tema)}
          />

          <Column
            field="título"
            header="Título"
            filter
            showFilterOperator={false}
            headerClassName={estilizarColumnHeader(usuárioLogado.cor_tema)}
            sortable
          />
          <Column
            field="nome_responsavel"
            header="Nome Responsavel"
            filter
            showFilterOperator={false}
            headerClassName={estilizarColumnHeader(usuárioLogado.cor_tema)}
            sortable
          />
          <Column
            field="numero_tanques"
            header="Número de Tanques"
            filter
            filterMatchMode="gt"
            showFilterOperator={false}
            headerClassName={estilizarColumnHeader(usuárioLogado.cor_tema)}
            sortable
          />
          <Column
            headerClassName={estilizarColumnHeader(usuárioLogado.cor_tema)}
            field="categoria"
            header="Categoria"
            filter
            filterMatchMode="equals"
            filterElement={DropdownÁreaTemplate}
            showClearButton={false}
            showFilterOperator={false}
            showFilterMatchModes={false}
            showFilterMenuOptions={false}
            sortable
          />

          <Column
            field="inclui_transporte"
            header="Inclui Transporte"
            filter
            showFilterOperator={false}
            headerClassName={estilizarColumnHeader(usuárioLogado.cor_tema)}
            sortable
            filterMatchMode="equals"
            filterElement={BooleanFilterTemplate}
            body={BooleanBodyTemplate}
            showClearButton={false}
            showAddButton={false}
            filterMenuClassName={estilizarFilterMenu()}
            dataType="boolean"
          />
          <Column
            field="date"
            header="Data"
            headerClassName={estilizarColumnHeader(usuárioLogado.cor_tema)}
            sortable
          />
        </DataTable>
        <Divider className={estilizarDivider()} />
        <Button
          className={estilizarBotãoRetornar()}
          label="Retornar"
          onClick={retornarPáginaInicial}
        />
        <Button
          className={estilizarBotão()}
          label="Adicionar"
          onClick={adicionarPeriodoVisita}
        />
      </Card>
    </div>
  );
}
