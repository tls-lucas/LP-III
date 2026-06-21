import { createContext, useState } from "react";
const ContextoDiretorAquario = createContext();
export default ContextoDiretorAquario;
export function ProvedorDiretorAquario({ children }) {
  const [periodo_visitaConsultada, setPeriodoVisitaConsultada] = useState({});
  const [reservaConsultado, setReservaConsultado] = useState(null);
  const [diretor_escolaInteressado, setDiretorEscolaInteressado] =
    useState(null);
  return (
    <ContextoDiretorAquario.Provider
      value={{
        periodo_visitaConsultada,
        setPeriodoVisitaConsultada,
        reservaConsultado,
        setReservaConsultado,
        diretor_escolaInteressado,
        setDiretorEscolaInteressado,
      }}
    >
      {children}
    </ContextoDiretorAquario.Provider>
  );
}
