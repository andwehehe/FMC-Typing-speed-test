import { useState, createContext, useRef, useEffect } from "react";

// eslint-disable-next-line react-refresh/only-export-components
export const TimerContext = createContext()

function TimerContextProvider({ children }) {

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

    return(
        <TimerContext.Provider 
            value={{
                timeLeft, 
                setTimeLeft,
                isTimerRunning, 
                setIsTimerRunning, 
                startTimer
            }}
        >
            {children}
        </TimerContext.Provider>
    );
}

export default TimerContextProvider