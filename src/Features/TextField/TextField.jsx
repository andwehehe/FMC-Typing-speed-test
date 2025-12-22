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
                            {
                                word.split("").map((char, charIndex) => {
                                    const currentCharIndex = globalIndex;

                                    let className = "";

                                    if (currentCharIndex < inputValue.length) {
                                        className =
                                            char === inputValue[currentCharIndex]
                                            ? "correct"
                                            : "incorrect";
                                    }

                                    // if (currentCharIndex+1 === inputValue.length) {
                                    //     className += " active";
                                    // }

                                    globalIndex++;

                                    return (
                                        <span
                                            key={`${wordIndex}-${charIndex}`}
                                            className={styles[className]}
                                        >
                                            {className === "incorrect" ? inputValue[currentCharIndex] : char}
                                        </span>
                                    );
                                })
                            }

                            {/* SPACE */}
                            {
                                (() => {
                                    const spaceIndex = globalIndex;
                                    let spaceClass = "";

                                    if (spaceIndex < inputValue.length) {
                                    spaceClass =
                                        inputValue[spaceIndex] === " "
                                        ? "correct"
                                        : "incorrect";
                                    }

                                    if (spaceIndex === inputValue.length) {
                                    spaceClass += " active";
                                    }

                                    globalIndex++;

                                    return (

                                    spaceClass === "incorrect" 
                                        ? <span
                                            key={`space-${wordIndex}`}
                                            className={`${styles.space} ${styles[spaceClass]}`}
                                        >
                                            {inputValue[spaceIndex]}
                                        </span>
                                        : <span
                                            key={`space-${wordIndex}`}
                                            className={`${styles.space} ${styles[spaceClass]}`}
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