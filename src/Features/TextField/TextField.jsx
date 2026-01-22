import styles from './TextField.module.css'
import WORD_POOL from './data.json';
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
    const { selectedMode } = useContext(ModeContext);

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
        throughCountdown,
        modeBasedTime,
        startPassageTimer,
        isPassageTestDone,
        setTimeConsumed,

        // typing stats
        setTotalTypedChars,
        totalCorrectChars,
        setTotalCorrectChars,
        setTotalIncorrectChars,

        // score
        bestScore,
        setNewScore,

        // game state / resets
        resetTest,
        resetChars,
        resetFlag,
        setResetFlag,
    } = useContext(StatsContext);

    const inputRef = useRef();
    const textRef = useRef(null);
    const [ isAllowedToStart, setIsAllowedToStart ] = useState(false);
    const [ hasIncorrect, setHasIncorrect ] = useState(false);
    const [ inputValue, setInputValue ] = useState("");
    const words = test.split(" ");
    let globalIndex = 0;
    const NAVIGATE_TO_POSTTEST = useNavigate();
    const hasNavigatedRef = useRef(false);

    // Handle input changes (correct input, incorrect input, etc.)
    function handleChange(e) {
        if(!isAllowedToStart) {
            setIsAllowedToStart(true);
            return;
        }

        if(e.target.value.length === 1 && e.target.value[0] !== test[0]) {
            e.target.value === "";
            return;
        }

        if(e.target.value.length > test.length) return;
        
        const newValue = e.target.value;
        const previousLength = inputValue.length;
        setInputValue(newValue);
        
        if(newValue.length > previousLength) {
            // Character added
            setTotalTypedChars(prev => prev + 1);

            const newCharIndex = newValue.length - 1;
            if(newValue[newCharIndex] === test[newCharIndex]) {
                setTotalCorrectChars(prev => prev + 1);
            } else {
                setTotalIncorrectChars(prev => prev + 1);
            }
        } else if(newValue.length < previousLength) {
            // Character removed
            const removedCharIndex = previousLength - 1;
            if(inputValue[removedCharIndex] === test[removedCharIndex]) {
                // Deleted a CORRECT character - subtract from both
                setTotalCorrectChars(prev => prev - 1);
                setTotalTypedChars(prev => prev - 1);
            }
        }
        
        // Check for incorrect characters
        const foundIncorrect = [...newValue].some((char, index) => {
            return char !== test[index]
        })
        setHasIncorrect(foundIncorrect);
    }

    // Handle input keydown (Backspace rule)
    function handleKeyDown(e) {
        if (e.key === "Backspace") {
            if (!hasIncorrect) {
                e.preventDefault();
                return;
            }
        }

        // Prevents cursor from going left or right
        if(e.key === "ArrowRight" || e.key === "ArrowLeft") {
            e.preventDefault();
        };
    }

    // Autofocus to input when a key is pressed
    useEffect(() => {
        const handleGlobalKeydown = (e) => {
            if(!isTimerRunning && inputValue.length === 0) {
                if (e.key !== test[0]) {
                    return;
                }
                startPassageTimer();    
                startTimer();
            }
            if(inputRef.current === null) return;
            inputRef.current.focus();
        };

        window.addEventListener("keydown", handleGlobalKeydown);

        return() => {
            window.removeEventListener("keydown", handleGlobalKeydown);
        }
    }, [isTimerRunning, inputValue, startTimer, startPassageTimer, test])

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
        modeBasedTime();
        throughCountdown.current = false;
        isPassageTestDone.current = false;
    }, [
        getDifficulty, 
        resetTest, 
        resetChars, 
        selectedMode, 
        setTimeLeft, 
        throughCountdown, 
        modeBasedTime, 
        isPassageTestDone,
    ])

    // Autofocus to input after mount
    useEffect(() => {inputRef.current.focus()}, [])

    // Update best score after timer drops to zero or if the test is done   
    useEffect(() => {
        // this avoid navigating to the score page twice
        if(hasNavigatedRef.current) return;

        if(totalCorrectChars === test.length) {
            isPassageTestDone.current = true;
        }

        if(selectedMode === "Passage") {
            if(!isPassageTestDone.current) return;
        } else {
           if(!throughCountdown.current) return;
        }
        
        if(timeLeft <= 0 || totalCorrectChars === test.length) {
            hasNavigatedRef.current = true;

            // save test lenght for stats
            setTestLength(test.length)
            localStorage.setItem("testLength", test.length.toString());

            // calculate new scores for post test stats
            setNewScore();

            // set time consumed for passage mode stats
            setTimeConsumed(timeLeft);
            localStorage.setItem("timeConsumed", timeLeft);

            // reset time based on mode
            modeBasedTime();

            // generate random level for the next test
            setTimeout(() => {
                setRandomLevel(() => {
                    Math.floor(Math.random() * getDifficulty(easy, medium, hard).length)
                })
            }, 1000);

            // navigate to the score page
            NAVIGATE_TO_POSTTEST("Score");

            // Show again the dialog
            setIsAllowedToStart(false);
        }        
    }, [
        timeLeft, 
        setTimeLeft, 
        setNewScore, 
        bestScore, 
        totalCorrectChars, 
        test, 
        NAVIGATE_TO_POSTTEST, 
        setTestLength,
        selectedMode,
        throughCountdown,
        isPassageTestDone,
        modeBasedTime,
        easy,
        medium,
        hard,
        getDifficulty,
        setTimeConsumed
    ])

    // Scroll up and down behavior
    const container = textRef.current;
    const scrollTopRef = useRef(0);

    useEffect(() => {
        if (!textRef.current) return;
        
        const cursorElement = textRef.current.querySelector('[data-cursor="true"]');
        if (cursorElement) {
            const cursorTop = cursorElement.offsetTop;
            const containerHeight = container.clientHeight;
            
            // Detect mobile (adjust breakpoint as needed)
            const isMobile = window.innerWidth <= 768;
            const scrollAmount = isMobile ? 50 : 80;
            const triggerDistanceDown = isMobile ? 50 : 80;
            const triggerDistanceUp = isMobile ? 200 : 150;
            
            // Scroll down when cursor moves to next line
            if (cursorTop > scrollTopRef.current + containerHeight - triggerDistanceDown) {
                container.scrollTop = scrollTopRef.current + scrollAmount;
                scrollTopRef.current = scrollTopRef.current + scrollAmount;
            } else if (cursorTop < scrollTopRef.current + triggerDistanceUp) {
                container.scrollTop = scrollTopRef.current - scrollAmount;
                scrollTopRef.current = scrollTopRef.current - scrollAmount;
            }
        }
    }, [inputValue, container]);

    // Reset scroll when test restarts
    useEffect(() => {
        if (!resetFlag) return;
        if (textRef.current) {
            textRef.current.scrollTop = 0;
            scrollTopRef.current = 0;
        }
    }, [resetFlag]);

        return(
            <section className={styles.text__field}>

                {/* Start Test Overlay */}
                <div 
                    className={styles.dialogBox}
                    style={{display: isAllowedToStart ? "none" : "flex"}}
                >
                    <button onClick={() => setIsAllowedToStart(true)}>
                        Start Typing Test
                    </button>
                    <p>Or click the text and start typing</p>
                </div>

                {/* Input */}
                <input 
                    type="text" 
                    className={styles.input} 
                    onChange={handleChange} 
                    onKeyDown={handleKeyDown}
                    onPaste={e => e.preventDefault()} 
                    value={inputValue}
                    ref={inputRef}
                    spellCheck="false"
                    autoCorrect="off"
                    autoCapitalize="off"
                    autoComplete="off"
                />

                {/* Text Container */}
                <div className={styles.text} ref={textRef}>
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
                                                data-cursor={fakeCursor ? "true" : undefined}
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