import styles from './RestartBTN.module.css'
import restartIcon from '/src/assets/icons/icon-restart.svg'
import { useContext } from 'react'
import { StatsContext } from '../../Features/TextField/StatsContext'

function RestartBTN() {

    const { resetTest } = useContext(StatsContext)

    return(
        <div className={styles.restartBTN}>
            <button onClick={resetTest}>
                Restart Test
                <img src={restartIcon} alt="restart" />
            </button>
        </div>
    )
}

export default RestartBTN