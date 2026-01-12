import styles from './PlayAgain.module.css'
import returnIcon from '../../assets/icons/icon-restart-black.svg'
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { StatsContext } from '../../Features/TextField/StatsContext';

function PlayAgain({ prompt }) {

    const NAVIGATE_TO_MAIN = useNavigate();
    const { resetChars, setIsFirstGame } = useContext(StatsContext);

    function handleClick() {
        NAVIGATE_TO_MAIN("/FMC-Typing-speed-test/");
        resetChars();
        setIsFirstGame("false");
        localStorage.setItem("isFirstGame", "false");
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