import styles from './PlayAgain.module.css'
import returnIcon from '../../assets/icons/icon-restart-black.svg'
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { StatsContext } from '../../Features/TextField/StatsContext';

function PlayAgain({ prompt }) {

    const NAVIGATE__PLAY_AGAIN = useNavigate();
    const { resetChars } = useContext(StatsContext);

    function handleClick() {
        NAVIGATE__PLAY_AGAIN("/FMC-Typing-speed-test/");
        resetChars();
    }

    return(
        <button 
            className={styles.play__again} 
            onClick={handleClick}
        >
            {prompt}
            <img src={returnIcon} alt="play again" />
        </button>
    );
}

export default PlayAgain