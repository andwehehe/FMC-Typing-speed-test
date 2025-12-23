import styles from './TextField.module.css'
import WORD_POOL from './data.json'
import { useState, useEffect } from 'react';

function TextField() {
  
    const { easy, medium, hard } = WORD_POOL;
    const sample = hard[9].text;
    const words = sample.split(" ");
    
    const [ inputValue, setInputValue ] = useState("");

    function handleChange(e) {
        if(e.target.value.length > sample.length) return;
        setInputValue(e.target.value)
    }

    let globalIndex = 0;

    useEffect(() => {
        
    }, [])

    return(
        <section className={styles.text__field}>
            <input 
                type="text" 
                className={styles.input} 
                onChange={handleChange} 
                onPaste={e => e.preventDefault} 
                autoFocus
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

                                    if (currentCharIndex === inputValue.length) {
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
                                                key={`error-${errorClass}`}
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