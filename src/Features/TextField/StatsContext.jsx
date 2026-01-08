import { useState, createContext, useRef, useEffect, useCallback } from "react";

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
                    return 0;
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
    const [ testLength, setTestLength ] = useState(Number(localStorage.getItem("testLength")) || 0);
    const [ resetFlag, setResetFlag ] = useState(false);
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
        
        const accuracyIntegrated = wpm * (getAccuracy() / 100)
        return Math.max(0, Math.round(accuracyIntegrated));
    };

    const resetTest = useCallback(() => {
        clearInterval(timerRef.current);
        setIsTimerRunning(false);
        setTimeLeft(60);
        setResetFlag(true);
    }, [])

    const resetChars = useCallback(() => {
        setTotalCorrectChars(0);
        setTotalTypedChars(0);
        setTotalIncorrectChars(0);
    }, [])
    // Accuracy & WPM



    // Best Score
    const [ isFirstGame, setIsFirstGame ] = useState(localStorage.getItem("isFirstGame") || "true");
    const [ bestScore, setBestScore ] = useState(Number(localStorage.getItem("highScore")) || 0);
    const [ accuracy, setAccuracy ] = useState(Number(localStorage.getItem("accuracy")) || 0)
    const [ currentWPM, setCurrentWPM ] = useState(Number(localStorage.getItem("currentWPM") || 0));
    const [ currentCorrectChars, setCurrentCorrectChars ] = useState(Number(localStorage.getItem("currentCorrect") || 0));
    // localStorage.setItem("highScore", "0");
    function setNewBestScore() {
        setBestScore(Math.max(getWPM(), bestScore));
        setAccuracy(getAccuracy());
        setCurrentWPM(getWPM());
        setCurrentCorrectChars(totalCorrectChars);
        localStorage.setItem("highScore", bestScore.toString());
        localStorage.setItem("accuracy", accuracy.toString());
        localStorage.setItem("currentWPM", getWPM().toString());
        localStorage.setItem("currentCorrect", totalCorrectChars.toString());
    }
    // Best Score
    

    return(
        <StatsContext.Provider 
            value={{
                timeLeft, 
                setTimeLeft,
                isTimerRunning, 
                setIsTimerRunning, 
                startTimer,
                resetTest,
                testLength, 
                setTestLength,
                setTotalTypedChars,
                totalCorrectChars,
                totalIncorrectChars,
                currentCorrectChars,
                setTotalCorrectChars,
                setTotalIncorrectChars,
                getAccuracy,
                accuracy,
                getWPM,
                currentWPM,
                setNewBestScore,
                bestScore,
                setResetFlag,
                resetFlag,
                resetChars,
                isFirstGame,
                setIsFirstGame
            }}
        >
            {children}
        </StatsContext.Provider>
    );
}

export default StatsContextProvider