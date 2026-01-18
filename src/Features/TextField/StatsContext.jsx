import { useState, createContext, useRef, useEffect, useCallback, useContext } from "react";
import { ModeContext } from "../StatsField/ModeContext";

// eslint-disable-next-line react-refresh/only-export-components
export const StatsContext = createContext()

function StatsContextProvider({ children }) {

    // Timer for Timed mode
    const [ timeLeft, setTimeLeft ] = useState(0);
    const [ isTimerRunning, setIsTimerRunning ] = useState(false);
    const throughCountdown = useRef(false);
    const timerRef = useRef(null);
    const { selectedMode } = useContext(ModeContext);

    function startTimer() {
        if(isTimerRunning || selectedMode === "Passage") return;

        setIsTimerRunning(true);
        throughCountdown.current = true;

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

    useEffect(() => {return () => clearInterval(timerRef.current)}, [])
    // Timer for Timed Mode



    // Timer for Passage Mode
    const passageTimerRef = useRef(null);
    const isPassageTestDone = useRef(false);
    const [ timeConsumed, setTimeConsumed ] = useState(localStorage.getItem("timeConsumed") || 0);

    function startPassageTimer() {
        if(isTimerRunning || !(selectedMode === "Passage")) return;

        setIsTimerRunning(true);

        passageTimerRef.current = setInterval(() => {
            setTimeLeft(prev => {
                if(isPassageTestDone.current) {
                    clearInterval(passageTimerRef.current);
                    setIsTimerRunning(false);
                }
                return prev + 1;
            })
        }, 1000)
    }

    useEffect(() => {return () => clearInterval(passageTimerRef.current) }, [])
    // Timer for Passage Mode



    // Time formatting
    function formattedTime(time) {
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        return `${minutes}:${seconds.toString().padStart(2, "0")}`;
    }
    // Time formatting



    // Accuracy & WPM
    const [ testLength, setTestLength ] = useState(Number(localStorage.getItem("testLength")) || 0);
    const [ resetFlag, setResetFlag ] = useState(false);
    const [ totalTypedChars, setTotalTypedChars ] = useState(0);
    const [ totalCorrectChars, setTotalCorrectChars ] = useState(0);
    const [ totalIncorrectChars, setTotalIncorrectChars ] = useState(0);
    const TIME_LIMIT = useRef(0);
    useEffect(() => {
        if(selectedMode === "Timed (60s)") {
            TIME_LIMIT.current = 60;
        } else if(selectedMode === "Timed (30s)") {
            TIME_LIMIT.current = 30;
        } else if(selectedMode === "Timed (15s)") {
            TIME_LIMIT.current = 15;
        }
    }, [selectedMode])

    function getAccuracy() {
        return (totalCorrectChars / totalTypedChars) * 100;
    }

    function getWPM() {
        let timeElapsed;
        let netChars;
        let wpm;

        const WPM_CALC_DELAY = 1;

        if (selectedMode === "Passage") {
            timeElapsed = timeLeft;
            if (timeElapsed < WPM_CALC_DELAY) return 0;

            netChars = totalCorrectChars;
        } else {
            timeElapsed = TIME_LIMIT.current - timeLeft;
            if (timeElapsed < WPM_CALC_DELAY) return 0;

            netChars = totalCorrectChars - totalIncorrectChars;
        }

        wpm = (netChars / 5) / (timeElapsed / 60);

        return Math.max(0, Math.round(wpm));
    }


    const modeBasedTime = useCallback(() => {
        if(selectedMode === "Passage") {
            setTimeLeft(0);
        } else if(selectedMode === "Timed (60s)") {
            setTimeLeft(60);
        } else if(selectedMode === "Timed (30s)") {
            setTimeLeft(30);
        } else if(selectedMode === "Timed (15s)") {
            setTimeLeft(15);
        }
    }, [selectedMode])

    const resetTest = useCallback(() => {
        clearInterval(timerRef.current);
        clearInterval(passageTimerRef.current)
        setIsTimerRunning(false);
        setResetFlag(true);
        modeBasedTime();
    }, [setResetFlag, modeBasedTime])

    const resetChars = useCallback(() => {
        setTotalCorrectChars(0);
        setTotalTypedChars(0);
        setTotalIncorrectChars(0);
    }, [setTotalCorrectChars, setTotalTypedChars])
    // Accuracy & WPM



    // Best Score
    const [ isFirstGame, setIsFirstGame ] = useState(localStorage.getItem("isFirstGame") || "true");
    const [ bestScore, setBestScore ] = useState(Number(localStorage.getItem("highScore")) || 0);
    const [ accuracy, setAccuracy ] = useState(Number(localStorage.getItem("accuracy")) || 0)
    const [ currentWPM, setCurrentWPM ] = useState(Number(localStorage.getItem("currentWPM") || 0));
    const [ currentCorrectChars, setCurrentCorrectChars ] = useState(Number(localStorage.getItem("currentCorrect") || 0));
    // localStorage.setItem("highScore", "0");
    // localStorage.setItem("isFirstGame", "true");
    // console.log(localStorage.getItem("isFirstGame"))
    function setNewScore() {
        setBestScore(Math.max(getWPM(), bestScore));
        setAccuracy(getAccuracy());
        setCurrentWPM(getWPM());
        setCurrentCorrectChars(totalCorrectChars);
        localStorage.setItem("highScore", bestScore.toString());
        localStorage.setItem("accuracy", getAccuracy().toString());
        localStorage.setItem("currentWPM", getWPM().toString());
        localStorage.setItem("currentCorrect", totalCorrectChars.toString());
    }
    // Best Score
    

    return (
        <StatsContext.Provider
            value={{
                // ----- TIMER -----
                timeLeft,
                setTimeLeft,
                isTimerRunning,
                setIsTimerRunning,
                throughCountdown,
                startTimer,
                startPassageTimer,
                timeConsumed,
                setTimeConsumed,
                formattedTime,
                isPassageTestDone,
                modeBasedTime,
                testLength,
                setTestLength,

                // ----- TYPING STATS -----
                totalTypedChars,
                setTotalTypedChars,
                totalCorrectChars,
                setTotalCorrectChars,
                totalIncorrectChars,
                setTotalIncorrectChars,
                currentCorrectChars,
                getAccuracy,
                accuracy,

                // ----- WPM -----
                getWPM,
                currentWPM,

                // ----- SCORE -----
                bestScore,
                setNewScore,

                // ----- GAME STATE -----
                isFirstGame,
                setIsFirstGame,
                resetFlag,
                setResetFlag,

                // ----- ACTIONS / RESETS -----
                resetTest,
                resetChars,
            }}
        >
            {children}
        </StatsContext.Provider>
    );
}

export default StatsContextProvider