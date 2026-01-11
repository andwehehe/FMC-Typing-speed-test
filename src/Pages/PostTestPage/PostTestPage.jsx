import styles from './PostTestPage.module.css'
import BestScorePanel from '../../Components/BestScorePanel/BestScorePanel';
import completedIcon from '../../assets/icons/icon-completed.svg';
import star2 from '../../assets/icons/pattern-star-2.svg';
import star1 from '../../assets/icons/pattern-star-1.svg';
import confetti from '../../assets/icons/pattern-confetti.svg';
import newBest from '../../assets/icons/icon-new-pb.svg';
import PlayAgain from '../../Components/PlayAgainBTN/PlayAgain';
import { StatsContext } from '../../Features/TextField/StatsContext';
import { useContext } from 'react';


function InitialHighscore() {

    const { 
        currentWPM,
        accuracy, 
        testLength,
        currentCorrectChars, 
        bestScore,
        isFirstGame
    } = useContext(StatsContext);

    const BASE__SCORE = {
        title: "Baseline Established!",
        description: "You've set the bar. Now the real challenge begins—time to beat it",
        button: "Beat This Score",
        headIcon: completedIcon,
        headImgClass: "completed-icon",
    }

    const TEST__COMPLETE = {
        title: "Test Complete!",
        description: "Solid run. Keep pushing to beat your high score.",
        button: "Go Again",
        headIcon: completedIcon,
        headImgClass: "completed-icon",
    }

    const NEW__BEST = {
        title: "High Score Smashed!",
        description: "You're getting faster. That was incredible typing.",
        button: "Go Again",
        headIcon: newBest,
        headImgClass: "newBest-icon",
        footerIcon: confetti,
    }

    return(
        <section className={styles.postTestPanel}>
            <BestScorePanel />

            <article className={styles.heading}>
                <div className={styles.iconsContainer}>
                    <img 
                        src={star2} 
                        style={{display: currentWPM < bestScore ? "block" : "none"}}
                        alt="star" 
                        className={styles.star2}
                    />
                    <img 
                        src={
                            isFirstGame === "true"
                            ? BASE__SCORE.headIcon
                            : currentWPM < bestScore
                                ? TEST__COMPLETE.headIcon
                                : NEW__BEST.headIcon
                        } 
                        alt="completed" 
                        className={styles[
                            isFirstGame === "true"
                            ? BASE__SCORE.headImgClass
                            : currentWPM < bestScore
                                ? TEST__COMPLETE.headImgClass
                                : NEW__BEST.headImgClass
                        ]}
                    />
                </div>
                <h1 className={styles.title}>
                    {
                        isFirstGame === "true"
                        ? BASE__SCORE.title
                        : currentWPM < bestScore
                            ? TEST__COMPLETE.title
                            : NEW__BEST.title
                    }
                </h1>
                <p className={styles.description}>
                    {
                        isFirstGame === "true"
                        ? BASE__SCORE.description
                        : currentWPM < bestScore
                            ? TEST__COMPLETE.description
                            : NEW__BEST.description
                    }
                </p>
            </article>

            <article className={styles.final__stats}>

                <div className={styles.final__WPM}>
                    <p className={styles.category}>WPM:</p>
                    <p className={styles.score}>{Math.ceil(currentWPM)}</p>
                </div>

                <div className={styles.final__accuracy}>
                    <p className={styles.category}>Accuracy:</p>
                    <p className={`${styles.score} ${styles[accuracy === 100 ? "perfect" : "not__perfect"]}`}>
                        {Math.ceil(accuracy)}%
                    </p>
                </div>

                <div className={styles.final__character}>
                    <p className={styles.category}>Characters</p>
                    <p className={styles.score}>
                        <span className={styles.totalCorrect}>{currentCorrectChars}</span>
                        / 
                        <span className={styles.totalIncorrect}>{testLength - currentCorrectChars}</span>
                    </p>
                </div>

            </article>

            <PlayAgain prompt={currentWPM <= bestScore ? TEST__COMPLETE.button : BASE__SCORE.button} />
            <img 
                className={styles.star1} 
                style={{display: currentWPM < bestScore ? "block" : "none"}}
                src={star1} 
                alt="star 1" 
            />
            <div 
                className={styles.confettiContainer} 
                style={{display: currentWPM < bestScore ? "none" : "block"}}
            > 
                <img 
                    className={styles.confetti} 
                    src={NEW__BEST.footerIcon} 
                    alt="confetti" 
                />
            </div>
        </section>
    );
}

export default InitialHighscore