import { useState, createContext, useRef, useEffect } from "react";

// eslint-disable-next-line react-refresh/only-export-components
export const StatsContext = createContext()

function StatsContextProvider({ children }) {

    // Timer
    const [ timeLeft, setTimeLeft ] = useState(60);
    const [ isTimerRunning, setIsTimerRunning ] = useState(false);
    const timerRef = useRef(null);

    function startTimer() {
        if(isTimerRunning) return;

        setIsTimerRunning(true);
        timerRef.current = setInterval(() => {
            setTimeLeft(prev => {
                if(prev <= 1) {
                    clearInterval(timerRef.current);
                    setIsTimerRunning(false);
                    return 60;
                }
                return prev - 1;
            })
        }, 1000)
    }

    useEffect(() => {
        return () => clearInterval(timerRef.current)
    }, [])
    // Timer



    // Accuracy & WPM
    const [ totalTypedChars, setTotalTypedChars ] = useState(0);
    const [ totalCorrectChars, setTotalCorrectChars ] = useState(0);
    const [ totalIncorrectChars, setTotalIncorrectChars ] = useState(0);
    const TIME_LIMIT = 60;

    function getAccuracy() {
        return (totalCorrectChars / totalTypedChars) * 100;
    }

    function getWPM() {
        const timeElapsed = TIME_LIMIT - timeLeft;
        if (timeElapsed === 0) return 0;
        
        const netChars = totalCorrectChars - totalIncorrectChars;
        const wpm = (netChars / 5) / (timeElapsed / 60);
        
        return Math.max(0, Math.round(wpm));
    };
    // Accuracy & WPM



    return(
        <StatsContext.Provider 
            value={{
                timeLeft, 
                setTimeLeft,
                isTimerRunning, 
                setIsTimerRunning, 
                startTimer,
                setTotalTypedChars,
                setTotalCorrectChars,
                setTotalIncorrectChars,
                getAccuracy,
                getWPM
            }}
        >
            {children}
        </StatsContext.Provider>
    );
}

export default StatsContextProvider