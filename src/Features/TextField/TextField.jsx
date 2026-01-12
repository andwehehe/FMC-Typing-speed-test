import styles from './TextField.module.css'
import WORD_POOL from './data.json'
import { useState, useContext, useEffect, useRef } from 'react';
import { StatsContext } from './StatsContext';
import { DifficultyContext } from '../StatsField/DifficultyContext';
import { ModeContext } from '../StatsField/ModeContext';
import { useNavigate } from 'react-router-dom';

function TextField() {
  
    // JSON data
    const { easy, medium, hard } = WORD_POOL;

    // Difficulty Context
    const { getDifficulty } = useContext(DifficultyContext);
    // Mode Context
    const { selectedMode } = useContext(ModeContext)

    // Level Randomizer
    const [ randomLevel, setRandomLevel ] = useState(() => Math.floor(Math.random() * getDifficulty(easy, medium, hard).length));
    
    // Generated Random Level
    const test = getDifficulty(easy, medium, hard)[randomLevel].text;

    // Stats Context
    const {
        // timer
        startTimer,
        isTimerRunning,
        timeLeft,
        setTimeLeft,
        setTestLength,

        // typing stats
        setTotalTypedChars,
        totalCorrectChars,
        setTotalCorrectChars,
        setTotalIncorrectChars,

        // score
        bestScore,
        setNewBestScore,

        // game state / resets
        resetTest,
        resetChars,
        resetFlag,
        setResetFlag,
    } = useContext(StatsContext);

    const inputRef = useRef();
    const [ hasIncorrect, setHasIncorrect ] = useState(false);
    const [ inputValue, setInputValue ] = useState("");
    const words = test.split(" ");
    let globalIndex = 0;

    let correctCharsCounter = 0;
    let incorrectCharsCounter = 0

    const NAVIGATE_TO_POSTTEST = useNavigate();

    // Handle input changes (correct input, incorrect input, etc.)
    function handleChange(e) {
        if(e.target.value.length > test.length) return;
        
        const newValue = e.target.value;
        setInputValue(newValue);
        setTotalTypedChars(prev => prev + 1);
        
        [...newValue].forEach((char, index) => {
            if(char === test[index]) {
                correctCharsCounter++;
            } else {
                incorrectCharsCounter++;
            }
        })

        setTotalCorrectChars(correctCharsCounter);
        setTotalIncorrectChars(incorrectCharsCounter);

        const foundIncorrect = [...newValue].some((char, index) => {
            return char !== test[index]
        })
        setHasIncorrect(foundIncorrect);
    }

    // Handle input keydown (Backspace rule)
    function handleKeyDown(e) {
        if(e.key === "Backspace" && !hasIncorrect) {
            e.preventDefault();
        } else if(e.key === "Backspace") {
            setTotalTypedChars(prev => prev - 1);
        }
        
        if(!isTimerRunning && inputValue.length === 0) {
            if (
                e.key === "Shift" || 
                e.key === "Control" || 
                e.key === "Alt" || 
                e.key === "Meta" ||
                e.key === "CapsLock" ||
                e.key === "Tab" ||
                e.key === "Escape"
            ) {
                return;
            }
            startTimer();
        }
    }

    // Autofocus to input when a key is pressed
    useEffect(() => {
        const handleGlobalKeydown = (e) => {
            if(!isTimerRunning && inputValue.length === 0) {
                if (
                    e.key === "Shift" || 
                    e.key === "Control" || 
                    e.key === "Alt" || 
                    e.key === "Meta" ||
                    e.key === "CapsLock" ||
                    e.key === "Tab" ||
                    e.key === "Escape"
                ) {
                    return;
                }
                startTimer();
            }
            inputRef.current.focus();
        };

        window.addEventListener("keydown", handleGlobalKeydown);

        return() => {
            window.removeEventListener("keydown", handleGlobalKeydown);
        }
    }, [isTimerRunning, inputValue, startTimer])

    // Reset input when timer drops to 0
    useEffect(() => {
        if(timeLeft <= 1) {
            setTimeout(() => {
                setInputValue("");
                setHasIncorrect(false);
            }, 1000)
        }
    }, [timeLeft])

    // Reset input when the restart button is clicked
    useEffect(() => {
        if(!resetFlag) return;
        setInputValue("");
        setHasIncorrect(false);
        setResetFlag(false);
    }, [resetFlag, setResetFlag, easy, medium, hard, getDifficulty])

    // Reset input when difficulty or mode is changed / on every mount
    useEffect(() => {
        setInputValue("");
        setHasIncorrect(false);
        resetTest();
        resetChars();

        if(selectedMode === "Passage") {
            setTimeLeft(0);
        }

        if(selectedMode === "Timed (60s)") {
            setTimeLeft(60);
        }
    }, [getDifficulty, resetTest, resetChars, selectedMode, setTimeLeft])

    // Autofocus to input after mount
    useEffect(() => {
        inputRef.current.focus();
    }, [])

    // Update best score after timer drops to zero or if the test is done   
    useEffect(() => {
        if((timeLeft <= 0 || totalCorrectChars === test.length) && selectedMode === "Timed (60s)") {
            setTestLength(test.length)
            localStorage.setItem("testLength", test.length.toString());
            setTimeLeft(60);
            setNewBestScore();
            setRandomLevel(() => Math.floor(Math.random() * getDifficulty(easy, medium, hard).length));
            NAVIGATE_TO_POSTTEST("Initial-High-Score");
        }
    }, [
        timeLeft, 
        setTimeLeft, 
        setNewBestScore, 
        bestScore, 
        totalCorrectChars, 
        test, 
        easy, 
        medium, 
        hard, 
        getDifficulty, 
        NAVIGATE_TO_POSTTEST, 
        setTestLength,
        selectedMode
    ])

    return(
        <section className={styles.text__field}>
            <input 
                type="text" 
                className={styles.input} 
                onChange={handleChange} 
                onKeyDown={handleKeyDown}
                onPaste={e => e.preventDefault()} 
                value={inputValue}
                disabled={timeLeft <= 0}
                ref={inputRef}
                spellCheck="false"
                autoCorrect="off"
                autoCapitalize="off"
                autoComplete="off"
            />
            <div className={styles.text}>
                {
                    words.map((word, wordIndex) => (
                        <div className={styles.word} key={wordIndex}>

                            {/* SPLITTING WORDS INTO CHARS */}
                            {
                                word.split("").map((char, charIndex) => {
                                    const currentCharIndex = globalIndex;

                                    let className = "";
                                    let fakeCursor = ""

                                    if (currentCharIndex < inputValue.length) {
                                        className =
                                            char === inputValue[currentCharIndex]
                                            ? "correct"
                                            : "incorrect";
                                    }

                                    if (currentCharIndex === inputValue.length && currentCharIndex !== 0) {
                                        fakeCursor = "fakeCursor";
                                    }

                                    globalIndex++;

                                    return(
                                        <span
                                            key={`${wordIndex}-${charIndex}`}
                                            className={`${styles[className]} ${styles[fakeCursor]}`}
                                        >
                                            {char}
                                        </span>
                                    );
                                })
                            }

                            {/* EXCESS ERROR */}
                            {
                                (() => {
                                    const errors = []

                                    while(inputValue.length > globalIndex && inputValue[globalIndex] !== " ") {
                                        let errorClass = "error";
                                        let errorIndex = globalIndex;
                                        globalIndex++
                                        errors.push(
                                            <span
                                                key={`error-${errorIndex}`}
                                                className={styles[errorClass]}
                                            >
                                                {inputValue[errorIndex]}
                                            </span>
                                        );
                                    }

                                    return(errors)
                                }) ()
                            }

                            {/* SPACE */}
                            {
                                (() => {
                                    const spaceIndex = globalIndex;
                                    let spaceClass = "";
                                    let fakeCursor = ""

                                    if (spaceIndex < inputValue.length) {
                                    spaceClass =
                                        inputValue[spaceIndex] === " "
                                        ? "correct"
                                        : "incorrect";
                                    }

                                    if (spaceIndex === inputValue.length) {
                                        fakeCursor = "fakeCursor";
                                    }

                                    globalIndex++;

                                    return(
                                        <span
                                            key={`space-${wordIndex}`}
                                            className={[styles[fakeCursor], styles[spaceClass]].filter(Boolean).join(" ")}
                                        >
                                            &nbsp;
                                        </span>
                                    );
                                }) ()
                            }

                        </div>
                    ))
                }
            </div>
        </section>
    )
}

export default TextField