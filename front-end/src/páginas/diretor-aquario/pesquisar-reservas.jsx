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
import ContextoDiretorAquario from "../../contextos/contexto-diretor-aquario";
import mostrarToast from "../../utilitários/mostrar-toast";
import { serviçoBuscarReservasPeridoVisita } from "../../serviços/serviços-diretor-aquario";
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
export default function PesquisarReservas() {
  const referênciaToast = useRef(null);
  const { usuárioLogado } = useContext(ContextoUsuário);
  const { reservaConsultado, setReservaConsultado, periodo_visitaConsultada } =
    useContext(ContextoDiretorAquario);
  const [listaReservas, setListaReservas] = useState([]);
  const navegar = useNavigate();
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
  function retornarCadastrarPeridoVisita() {
    setReservaConsultado(null);
    navegar("../cadastrar-periodo-visita");
  }
  function ConsultarTemplate(reserva) {
    return (
      <Button
        icon="pi pi-search"
        className={estilizarBotãoTabela(
          usuárioLogado.cor_tema,
          reservaConsultado?.id === reserva.id,
        )}
        tooltip="Consultar reserva"
        tooltipOptions={{ position: "top" }}
        onClick={() => {
          setReservaConsultado(reserva);
          navegar("../consultar-reserva");
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
        options={opçõesHorario}
        placeholder="Selecione"
        onChange={alterarFiltroDropdown}
        showClear
      />
    );
  }
  function BooleanBodyTemplate(reserva) {
    if (reserva.necessidade_pcd) return "Sim";
    else return "Não";
  }
  function BooleanFilterTemplate(opções) {
    function alterarFiltroTriState(event) {
      return opções.filterCallback(event.value);
    }
    return (
      <div>
        <label>Necessidade especial PCD:</label>
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
    async function buscarReservasPeridoVisita() {
      try {
        const response = await serviçoBuscarReservasPeridoVisita(
          periodo_visitaConsultada?.id,
        );
        if (!desmontado && response.data) setListaReservas(response.data);
      } catch (error) {
        mostrarToast(referênciaToast, error.response.data.erro, "error");
      }
    }
    buscarReservasPeridoVisita();
    return () => (desmontado = true);
  }, [periodo_visitaConsultada?.id]);
  return (
    <div className={estilizarFlex()}>
      <Toast ref={referênciaToast} position="bottom-center" />
      <Card
        title="Reservas Cadastrados"
        className={estilizarCard(usuárioLogado.cor_tema)}
      >
        <DataTable
          dataKey="id"
          size="small"
          paginator
          rows={TAMANHOS.MAX_LINHAS_TABELA}
          emptyMessage="Nenhuma reserva encontrado."
          value={listaReservas}
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
            field="diretor_escola.usuário.nome"
            header="Diretor Escola"
            filter
            showFilterOperator={false}
            headerClassName={estilizarColumnHeader(usuárioLogado.cor_tema)}
            sortable
          />
          <Column
            field="periodo_visita.título"
            header="PeridoVisita"
            filter
            showFilterOperator={false}
            headerClassName={estilizarColumnHeader(usuárioLogado.cor_tema)}
            sortable
          />
          <Column
            headerClassName={estilizarColumnHeader(usuárioLogado.cor_tema)}
            field="periodo_visita.categoria"
            header="Categoria"
            filter
            filterMatchMode="equals"
            filterElement={DropdownÁreaTemplate}
            showClearButton={false}
            showFilterOperator={false}
            showFilterMatchModes={false}
            filterMenuClassName={estilizarFilterMenu()}
            showFilterMenuOptions={false}
            sortable
          />
          <Column
            field="necessidade_pcd"
            header="Necessidade de PCD"
            dataType="boolean"
            filter
            showFilterOperator={false}
            body={BooleanBodyTemplate}
            filterElement={BooleanFilterTemplate}
            filterMatchMode="equals"
            showClearButton={false}
            showAddButton={false}
            filterMenuClassName={estilizarFilterMenu()}
            headerClassName={estilizarColumnHeader(usuárioLogado.cor_tema)}
            sortable
          />
        </DataTable>
        <Divider className={estilizarDivider()} />
        <Button
          className={estilizarBotãoRetornar()}
          label="Retornar"
          onClick={retornarCadastrarPeridoVisita}
        />
      </Card>
    </div>
  );
}
