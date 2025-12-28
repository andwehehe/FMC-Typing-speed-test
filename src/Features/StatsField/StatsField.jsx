import styles from './StatsField.module.css'
import logoMobile from '../../assets/icons/logo-small.svg'
import trophy from '../../assets/icons/icon-personal-best.svg'
import DropdownBTN from '../../Components/DropdownButton/DropdownBTN'
import { useContext } from 'react'
import { StatsContext } from '../TextField/StatsContext'

function StatsField() {

  const { timeLeft } = useContext(StatsContext);
  const { getAccuracy, getWPM } = useContext(StatsContext)

  const DIFFICULTY_DROPDOWN = [
    {
      name: "difficulty",
      value: "Easy"
    },
    {
      name: "difficulty",
      value: "Medium"
    },
    {
      name: "difficulty",
      value: "Hard"
    }
  ];

  const GAME_MODE = [
    {
      name: "mode",
      value: "Timed (60s)"
    },
    {
      name: "mode",
      value: "Passage"
    }
  ]

  return(
    <section className={styles.statsField}>

        {/* Best Score Panel */}
        <div className={styles.best__scorePanel}>
            <img src={logoMobile} alt="logo" />
            <div className={styles.best__score}>
                <img src={trophy} alt="trophy" />
                <span>Best:</span>
                92 WPM
            </div>
        </div>

        {/* Real-time Stats */}
        <div className={styles.realTime__stats}>
            <div className={styles.stats__category}>
                WPM:
                <span className={styles.realTime__WPM}>{Math.floor(getWPM())}</span>
            </div>

            <hr />

            <div className={styles.stats__category}>
                Accuracy:
                <span className={styles.realTime__accuracy}>{getAccuracy() ? getAccuracy().toFixed(0) : 100}%</span>
            </div>

            <hr />

            <div className={styles.stats__category}>
                Time:
                <span className={styles.realTime__timer}>
                  {timeLeft === 60 ? 1 : 0}:{timeLeft < 10 && 0}{timeLeft < 60 ? timeLeft : "00"}
                </span>
            </div>
        </div>

        {/* Game Settings */}
        <div className={styles.game__settings}>
            <DropdownBTN content={DIFFICULTY_DROPDOWN}/>
            <DropdownBTN content={GAME_MODE}/>
        </div>

    </section>
  )
}

export default StatsField