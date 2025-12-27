import { useState, createContext } from "react";

// eslint-disable-next-line react-refresh/only-export-components
export const DifficultyContext = createContext();

function DifficultyContextProvider({ children }) {

    const [ selectedDifficulty, setSelectedDifficulty ] = useState("Easy");

    return(
        <DifficultyContext.Provider
            value={{
                selectedDifficulty, 
                setSelectedDifficulty
            }}
        >
            {children}
        </DifficultyContext.Provider>
    );
}

export default DifficultyContextProvider