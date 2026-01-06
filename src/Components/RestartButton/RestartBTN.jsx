import styles from './RestartBTN.module.css'
import restartIcon from '/src/assets/icons/icon-restart-white.svg'
import { useContext } from 'react'
import { StatsContext } from '../../Features/TextField/StatsContext'

function RestartBTN() {

    const { resetTest, resetChars } = useContext(StatsContext)

    function reset() {
        resetTest();
        resetChars();
    }

    return(
        <div className={styles.restartBTN}>
            <button onClick={reset}>
                Restart Test
                <img src={restartIcon} alt="restart" />
            </button>
        </div>
    )
}

export default RestartBTN