import { useState, createContext } from "react";

// eslint-disable-next-line react-refresh/only-export-components
export const DifficultyContext = createContext();

function DifficultyContextProvider({ children }) {

    const [ selectedDifficulty, setSelectedDifficulty ] = useState("Easy");

    function getDifficulty(easy, medium, hard) {
        switch(selectedDifficulty) {
            case "Easy": 
                return easy;
            case "Medium":
                return medium;
            case "Hard": 
                return hard;
        }
    }

    return(
        <DifficultyContext.Provider
            value={{
                setSelectedDifficulty,
                getDifficulty
            }}
        >
            {children}
        </DifficultyContext.Provider>
    );
}

export default DifficultyContextProvider