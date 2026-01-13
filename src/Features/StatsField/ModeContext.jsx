import { useState, createContext } from "react";

// eslint-disable-next-line react-refresh/only-export-components
export const ModeContext = createContext();

function ModeContextProvider({ children }) {

    const [ selectedMode, setSelectedMode ] = useState(localStorage.getItem("mode") || "Timed (60s)");

    return(
        <ModeContext.Provider
            value={{
                setSelectedMode,
                selectedMode
            }}
        >
            {children}
        </ModeContext.Provider>
    );
}

export default ModeContextProvider