import styles from './TextField.module.css'
import WORD_POOL from './data.json'
import { useState, useRef, useEffect } from 'react';

function TextField() {
  
    const { easy, medium, hard } = WORD_POOL;
    const sample = hard[9].text;
    const words = sample.split(" ");
    let globalIndex = 0;
    const timerRef = useRef(null);

    const [ hasIncorrect, setHasIncorrect ] = useState(false);
    const [ inputValue, setInputValue ] = useState("");
    const [ isTimerRunning, setIsTimerRunning ] = useState(false);
    const [ timeLeft, setTimeLeft ] = useState(5);

    function handleChange(e) {
        if(e.target.value.length > sample.length) return;
        const newValue = e.target.value;
        setInputValue(newValue);

        const foundIncorrect = [...newValue].some((char, index) => {
            return char !== sample[index]
        })
        setHasIncorrect(foundIncorrect);
    }

    function handleKeyDown(e) {
        if(e.key === "Backspace" && !hasIncorrect) {
            e.preventDefault();
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

            setIsTimerRunning(true);
            timerRef.current = setInterval(() => {
                setTimeLeft(prev => {
                    console.log(prev);
                    if(prev <= 1) {
                        clearInterval(timerRef.current);
                        setIsTimerRunning(false);
                        setInputValue("");
                        return 60;
                    }
                    return prev - 1;
                })
            }, 1000)
        }
    }

    useEffect(() => {
        return () => clearInterval(timerRef.current)
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
                autoFocus
                disabled={timeLeft === 0}
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