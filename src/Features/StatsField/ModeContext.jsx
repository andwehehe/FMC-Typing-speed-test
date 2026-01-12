import { useState, createContext } from "react";

// eslint-disable-next-line react-refresh/only-export-components
export const ModeContext = createContext();

function ModeContextProvider({ children }) {

    const [ selectedMode, setSelectedMode ] = useState(localStorage.getItem("mode") || "Timed (60s)");

    function getMode() {
        switch(selectedMode) {
            case "Easy": 
                return 'timed';
            case "Medium":
                return "passage";
        }
    }

    return(
        <ModeContext.Provider
            value={{
                getMode,
                setSelectedMode,
                selectedMode
            }}
        >
            {children}
        </ModeContext.Provider>
    );
}

export default ModeContextProvider