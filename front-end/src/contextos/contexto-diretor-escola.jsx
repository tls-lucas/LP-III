import { createContext, useState } from "react";
const ContextoDiretorEscola = createContext();
export default ContextoDiretorEscola;
export function ProvedorDiretorEscola({ children }) {
  const [reservaConsultado, setReservaConsultado] = useState({});
  const [periodo_visitaConsultada, setPeriodoVisitaConsultada] = useState({});
  const [periodo_visitaSelecionada, setPeriodoVisitaSelecionada] = useState({});
  const [periodo_visitaReserva, setPeriodoVisitaReserva] = useState({});
  const [diretorAquarioProponente, setDiretorAquarioProponente] = useState({});
  return (
    <ContextoDiretorEscola.Provider
      value={{
        reservaConsultado,
        setReservaConsultado,
        periodo_visitaConsultada,
        setPeriodoVisitaConsultada,
        periodo_visitaSelecionada,
        setPeriodoVisitaSelecionada,
        periodo_visitaReserva,
        setPeriodoVisitaReserva,
        diretorAquarioProponente,
        setDiretorAquarioProponente,
      }}
    >
      {children}
    </ContextoDiretorEscola.Provider>
  );
}
