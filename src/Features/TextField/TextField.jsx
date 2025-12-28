import styles from './TextField.module.css'
import WORD_POOL from './data.json'
import { useState, useContext, useEffect, useRef } from 'react';
import { StatsContext } from './StatsContext';
import { DifficultyContext } from '../StatsField/DifficultyContext';

function TextField() {
  
    const { easy, medium, hard } = WORD_POOL;
    const { getDifficulty } = useContext(DifficultyContext);
    const [ RANDOM_LEVEL ] = useState(() => Math.floor(Math.random() * getDifficulty(easy, medium, hard).length));
    const sample = getDifficulty(easy, medium, hard)[RANDOM_LEVEL].text;

    const { 
        startTimer, 
        isTimerRunning, 
        timeLeft, 
        setTotalTypedChars, 
        setTotalCorrectChars, 
        setTotalIncorrectChars,
        resetFlag, 
        setResetFlag
    } = useContext(StatsContext);

    const inputRef = useRef();
    const [ hasIncorrect, setHasIncorrect ] = useState(false);
    const [ inputValue, setInputValue ] = useState("");
    const words = sample.split(" ");
    let globalIndex = 0;

    let correctCharsCounter = 0;
    let incorrectCharsCounter = 0

    // Handle input changes (correct input, incorrect input, etc.)
    function handleChange(e) {
        if(e.target.value.length > sample.length) return;
        
        const newValue = e.target.value;
        setInputValue(newValue);
        setTotalTypedChars(prev => prev + 1);
        
        [...newValue].forEach((char, index) => {
            if(char === sample[index]) {
                correctCharsCounter++;
            } else {
                incorrectCharsCounter++;
            }
        })

        setTotalCorrectChars(correctCharsCounter);
        setTotalIncorrectChars(incorrectCharsCounter);

        const foundIncorrect = [...newValue].some((char, index) => {
            return char !== sample[index]
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
        if(resetFlag === false) return;
        setInputValue("");
        setHasIncorrect(false);
        setResetFlag(false);
    }, [resetFlag, setResetFlag])

    // Reset input when difficulty is changed
    useEffect(() => {
        setInputValue("");
        setHasIncorrect(false);
    }, [getDifficulty])

    // Autofocus to input
    useEffect(() => {
        inputRef.current.focus();
    }, [])

    return(
        <section className={styles.text__field}>
            <input 
                type="text" 
                className={styles.input} 
                onChange={handleChange} 
                onKeyDown={handleKeyDown}
                onPaste={e => e.preventDefault()} 
                value={inputValue}
                disabled={timeLeft <= 1}
                ref={inputRef}
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

                            {/* EXCESS ERRROR */}
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