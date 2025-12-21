import styles from './TextField.module.css'
import WORD_POOL from './data.json'
import { useState, useEffect } from 'react';

function TextField() {
  
    const { easy, medium, hard } = WORD_POOL;
    const sample = hard[9].text
    const words = sample.split(" ");
    
    let i = 0;
    
    const [ currentChar, setCurrentChar ] = useState(sample[i]);
    const [ value, setValue ] = useState("");

    function handleChange(e) {
        setValue(e.target.value)
        e.target.value = ""
    }

    useEffect(() => {
      if(currentChar === value) {
        console.log("same")
      } else {
        console.log("not same")
      }
      setCurrentChar(sample[i++])
      console.log(i)
    }, [value, currentChar, i, sample])



    return(
        <section className={styles.text__field}>
            <input type="text" className={styles.input} onChange={handleChange} />
            <div className={styles.text}>
                {

                    words.map((word, wordIndex) => {

                        return(
                            <div className={styles.word} key={wordIndex}>
                                {
                                  word.split("").map((char, charIndex) => {
                                      return <span key={`${wordIndex}-${charIndex}`} className={styles.char}>{char}</span>
                                  })
                                }
                                <span key={`space-${wordIndex}`} className={styles.space}>&nbsp;</span>
                            </div>
                        )

                    })

                }
            </div>
        </section>
    )
}

export default TextField