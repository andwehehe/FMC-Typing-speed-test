import styles from './BestScorePanel.module.css';
import logoMobile from '../../assets/icons/logo-small.svg'
import trophy from '../../assets/icons/icon-personal-best.svg'
import { StatsContext } from '../../Features/TextField/StatsContext';
import { useContext } from 'react';

function BestScorePanel() {

    const { bestScore } = useContext(StatsContext);

    return(
        <div className={styles.best__scorePanel}>
            <img src={logoMobile} alt="logo" />
            <div className={styles.best__score}>
                <img src={trophy} alt="trophy" />
                <span>Best:</span>
                {Math.ceil(bestScore)} WPM
            </div>
        </div>
    );
}

export default BestScorePanel