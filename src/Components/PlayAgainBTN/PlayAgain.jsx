import styles from './PlayAgain.module.css'
import returnIcon from '../../assets/icons/icon-restart-black.svg'
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { StatsContext } from '../../Features/TextField/StatsContext';

function PlayAgain({ prompt }) {

    const NAVIGATE__PLAY_AGAIN = useNavigate();
    const { setTotalCorrectChars, setTotalTypedChars, setTotalIncorrectChars } = useContext(StatsContext);

    function handleClick() {
        setTotalCorrectChars(0);
        setTotalTypedChars(0);
        setTotalIncorrectChars(0);
        NAVIGATE__PLAY_AGAIN("/FMC-Typing-speed-test/");
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