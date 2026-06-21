import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Divider } from "primereact/divider";
import { Dropdown } from "primereact/dropdown";
import { Toast } from "primereact/toast";
import { TriStateCheckbox } from "primereact/tristatecheckbox";
import ContextoUsuário from "../../contextos/contexto-usuário";
import ContextoDiretorEscola from "../../contextos/contexto-diretor-escola";
import { serviçoBuscarPeriodosVisitas } from "../../serviços/serviços-diretor-escola";
import mostrarToast from "../../utilitários/mostrar-toast";
import {
  TAMANHOS,
  estilizarBotãoRetornar,
  estilizarBotãoTabela,
  estilizarCard,
  estilizarColumnHeader,
  estilizarColunaConsultar,
  estilizarDataTable,
  estilizarDataTablePaginator,
  estilizarDivider,
  estilizarFilterMenu,
  estilizarFlex,
  estilizarTriStateCheckbox,
} from "../../utilitários/estilos";
export default function PesquisarPeriodosVisitas() {
  const referênciaToast = useRef(null);
  const { usuárioLogado } = useContext(ContextoUsuário);
  const {
    periodo_visitaConsultada,
    setPeriodoVisitaConsultada,
    setPeriodoVisitaSelecionada,
  } = useContext(ContextoDiretorEscola);
  const [listaPeriodosVisitas, setListaPeriodosVisitas] = useState([]);
  const navegar = useNavigate();
  const opçõesCategoria = [
    { label: "Agua Salgada", value: "agua_salgada" },
    { label: "Agua Doce", value: "agua_doce" },
  ];

  function retornarCadastrarInteresse() {
    setPeriodoVisitaSelecionada(periodo_visitaConsultada);
    setPeriodoVisitaConsultada(null);
    navegar("../cadastrar-reserva");
  }

  function ConsultarTemplate(periodo_visita) {
    return (
      <Button
        icon="pi pi-search"
        className={estilizarBotãoTabela(
          usuárioLogado.cor_tema,
          periodo_visitaConsultada?.id === periodo_visita.id,
        )}
        tooltip="Consultar PeriodoVisita"
        tooltipOptions={{ position: "top" }}
        onClick={() => {
          setPeriodoVisitaConsultada(periodo_visita);
          navegar("../consultar-periodo-visita");
        }}
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
        <label>Inclui transporte:</label>
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
    async function buscarPeriodosVisitas() {
      try {
        const response = await serviçoBuscarPeriodosVisitas();
        if (!desmontado && response.data)
          setListaPeriodosVisitas(response.data);
      } catch (error) {
        mostrarToast(referênciaToast, error.response.data.erro, "error");
      }
    }
    buscarPeriodosVisitas();
    return () => (desmontado = true);
  }, [usuárioLogado.cpf]);
  return (
    <div className={estilizarFlex()}>
      <Toast ref={referênciaToast} position="bottom-center" />
      <Card
        title="Administrar Interesses"
        className={estilizarCard(usuárioLogado.cor_tema)}
      >
        <DataTable
          dataKey="id"
          size="small"
          paginator
          rows={TAMANHOS.MAX_LINHAS_TABELA}
          emptyMessage="Nenhuma proposta encontrada."
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
            z
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
            filter
            showFilterOperator={false}
            headerClassName={estilizarColumnHeader(usuárioLogado.cor_tema)}
            sortable
            filterMatchMode="equals"
            showClearButton={false}
            showAddButton={false}
            filterMenuClassName={estilizarFilterMenu()}
            dataType="boolean"
          />
        </DataTable>
        <Divider className={estilizarDivider()} />
        <Button
          className={estilizarBotãoRetornar()}
          label="Retornar"
          onClick={retornarCadastrarInteresse}
        />
      </Card>
    </div>
  );
}
