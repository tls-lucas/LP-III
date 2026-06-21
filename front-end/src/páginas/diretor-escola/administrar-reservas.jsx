import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Column } from "primereact/column";
import { Dropdown } from "primereact/dropdown";
import { DataTable } from "primereact/datatable";
import { Divider } from "primereact/divider";
import { Toast } from "primereact/toast";
import { TriStateCheckbox } from "primereact/tristatecheckbox";
import ContextoUsuário from "../../contextos/contexto-usuário";
import ContextoDiretorEscola from "../../contextos/contexto-diretor-escola";
import mostrarToast from "../../utilitários/mostrar-toast";
import { serviçoBuscarReservasDiretorEscola } from "../../serviços/serviços-diretor-escola";
import {
  TAMANHOS,
  estilizarBotão,
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
export default function AdministrarReservas() {
  const referênciaToast = useRef(null);
  const { usuárioLogado } = useContext(ContextoUsuário);
  const {
    reservaConsultado,
    setReservaConsultado,
    setPeriodoVisitaSelecionada,
  } = useContext(ContextoDiretorEscola);
  const [listaReservas, setListaReservas] = useState([]);
  const navegar = useNavigate();

  function retornarPáginaInicial() {
    navegar("/pagina-inicial");
  }
  function adicionarReserva() {
    setReservaConsultado(null);
    setPeriodoVisitaSelecionada(null);
    navegar("../cadastrar-reserva");
  }
  function ConsultarTemplate(reserva) {
    function consultar() {
      setReservaConsultado(reserva);
      setPeriodoVisitaSelecionada(null);
      navegar("../cadastrar-reserva");
    }
    return (
      <Button
        icon="pi pi-search"
        className={estilizarBotãoTabela(
          usuárioLogado.cor_tema,
          reservaConsultado?.id === reserva.id,
        )}
        tooltip="Consultar reserva"
        tooltipOptions={{ position: "top" }}
        onClick={consultar}
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
        <label>Necessidade PCD:</label>
        <TriStateCheckbox
          className={estilizarTriStateCheckbox(usuárioLogado?.cor_tema)}
          value={opções.value}
          onChange={alterarFiltroTriState}
        />
      </div>
    );
  }
  const opçõesCategoria = [
    { label: "Agua Salgada", value: "agua_salgada" },
    { label: "Agua Doce", value: "agua_doce" },
  ];
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
  useEffect(() => {
    let desmontado = false;
    async function buscarReservasDiretorEscola() {
      try {
        const response = await serviçoBuscarReservasDiretorEscola(
          usuárioLogado.cpf,
        );
        if (!desmontado && response.data) setListaReservas(response.data);
      } catch (error) {
        mostrarToast(referênciaToast, error.response.data.erro, "error");
      }
    }
    buscarReservasDiretorEscola();
    return () => (desmontado = true);
  }, [usuárioLogado.cpf]);
  return (
    <div className={estilizarFlex()}>
      <Toast ref={referênciaToast} position="bottom-center" />
      <Card
        title="Administrar Reservas"
        className={estilizarCard(usuárioLogado.cor_tema)}
      >
        <DataTable
          dataKey="id"
          size="small"
          paginator
          rows={TAMANHOS.MAX_LINHAS_TABELA}
          emptyMessage="Nenhum reserva encontrado."
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
            field="periodo_visita.diretor_aquario.usuário.nome"
            header="Diretor Aquario"
            filter
            showFilterOperator={false}
            headerClassName={estilizarColumnHeader(usuárioLogado.cor_tema)}
            sortable
          />
          <Column
            field="periodo_visita.título"
            header="Titulo Periodo Visita"
            headerClassName={estilizarColumnHeader(usuárioLogado.cor_tema)}
            sortable
          />
          <Column
            field="periodo_visita.categoria"
            header="Categoria"
            filter
            filterMatchMode="equals"
            filterElement={DropdownÁreaTemplate}
            showClearButton={false}
            showFilterOperator={false}
            showFilterMatchModes={false}
            showFilterMenuOptions={false}
            sortable
            headerClassName={estilizarColumnHeader(usuárioLogado.cor_tema)}
          />
          <Column
            field="periodo_visita.necessidade_pcd"
            header="Necessidade PCD"
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
          <Column
            field="periodo_visita.numero_tanques"
            header="Numero de Tanques"
            dataType="number"
            filter
            showFilterOperator={false}
            filterMatchMode="lt"
            showClearButton={false}
            showAddButton={false}
            filterMenuClassName={estilizarFilterMenu()}
            headerClassName={estilizarColumnHeader(usuárioLogado.cor_tema)}
            sortable
          />
          <Column
            field="periodo_visita.date"
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
          onClick={adicionarReserva}
        />
      </Card>
    </div>
  );
}
