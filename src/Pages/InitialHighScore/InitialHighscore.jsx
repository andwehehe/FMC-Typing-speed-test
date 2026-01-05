import styles from './InitialHighscore.module.css'
import BestScorePanel from '../../Components/BestScorePanel/BestScorePanel';
import completedIcon from '../../assets/icons/icon-completed.svg';
import star2 from '../../assets/icons/pattern-star-2.svg';
import star1 from '../../assets/icons/pattern-star-1.svg';
import PlayAgain from '../../Components/PlayAgainBTN/PlayAgain';
import { StatsContext } from '../../Features/TextField/StatsContext';
import { useContext } from 'react';


function InitialHighscore() {

    const { bestScore, getAccuracy, totalCorrectChars, totalIncorrectChars } = useContext(StatsContext);

    return(
        <section className={styles.initialHighscore}>
            <BestScorePanel />

            <article className={styles.heading}>
                <div className={styles.iconsContainer}>
                    <img 
                        src={star2} 
                        alt="star" 
                        className={styles.star2}
                    />
                    <img 
                        src={completedIcon} 
                        alt="completed" 
                        className={styles.completed}
                    />
                </div>
                <h1 className={styles.title}>Baseline Established!</h1>
                <p className={styles.description}>
                    You've set the bar. Now the real 
                    challenge begins—time to beat it
                </p>
            </article>

            <article className={styles.final__stats}>

                <div className={styles.final__WPM}>
                    <p className={styles.category}>WPM:</p>
                    <p className={styles.score}>{Math.ceil(bestScore)}</p>
                </div>

                <div className={styles.final__accuracy}>
                    <p className={styles.category}>Accuracy:</p>
                    <p className={styles.score}>{getAccuracy()}%</p>
                </div>

                <div className={styles.final__character}>
                    <p className={styles.category}>Characters</p>
                    <p className={styles.score}>
                        {totalCorrectChars}/{totalIncorrectChars}
                    </p>
                </div>

            </article>

            <PlayAgain prompt="Beat This Score" />
            <img className={styles.star1} src={star1} alt="star 1" />
        </section>
    );
}

export default InitialHighscore