import styles from './BestScorePanel.module.css';
import logoMobile from '../../assets/icons/logo-small.svg'
import logoDesktop from '../../assets/icons/logo-large.svg'
import trophy from '../../assets/icons/icon-personal-best.svg'
import { StatsContext } from '../../Features/TextField/StatsContext';
import { useContext, useState, useEffect } from 'react';

function BestScorePanel() {

    const [ isWideScreen, setIsWideScreen ] = useState(window.innerWidth >= 768)

    const handleResize = () => {
        setIsWideScreen(window.innerWidth >= 768);
    }

    useEffect(() => {
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    })

    const { bestScore } = useContext(StatsContext);

    return(
        <div className={styles.best__scorePanel}>
            <img 
                src={isWideScreen ? logoDesktop : logoMobile} 
                alt="logo" 
            />
            <div className={styles.best__score}>
                <img src={trophy} alt="trophy" />
                <span>{isWideScreen ? "Personal Best:" : "Best:"}</span>
                {Math.ceil(bestScore)} WPM
            </div>
        </div>
    );
}

export default BestScorePanel