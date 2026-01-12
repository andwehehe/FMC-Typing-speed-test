import styles from './DropdownBTN.module.css'
import downArrow from '../../assets/icons/icon-down-arrow.svg'
import { DifficultyContext } from '../../Features/StatsField/DifficultyContext';
import { ModeContext } from '../../Features/StatsField/ModeContext';
import { useState, useContext } from 'react';

function DropdownBTN({ content }) {

    const { setSelectedDifficulty, selectedDifficulty } = useContext(DifficultyContext);
    const { selectedMode, setSelectedMode } = useContext(ModeContext)
    const [ isDropdownOpen, setIsDropdownOpen ] = useState(false);

    const selectRadio = (e) => {
        
        if(content[0].name === "difficulty") {
            setSelectedDifficulty(e.target.value);
            localStorage.setItem("difficulty", e.target.value.toString());
        }

        if(content[0].name === "mode") {
            setSelectedMode(e.target.value);
            localStorage.setItem("mode", e.target.value.toString());
        }

        setIsDropdownOpen(prev => !prev);
    }

    return(
        <div className={styles.dropdownBTN__container}>

            <button 
                className={styles.dropdownBTN} 
                onClick={() => setIsDropdownOpen(prev => !prev)}
            >
                {content[0].name === "difficulty" && selectedDifficulty}
                {content[0].name === "mode" && selectedMode}
                <img src={downArrow} alt="arrow down" />
            </button>

            <ul 
                className={styles.dropdown__options}
                style={{ display: isDropdownOpen ? "block" : "none" }}
            >
                {
                    content.map(({ name, value }) => {
                        return(
                            <li className={styles.option} key={value}>
                                <label>
                                    <input 
                                        type="radio" 
                                        name={name}
                                        value={value}
                                        onChange={selectRadio}
                                        checked={(content[0].name === "difficulty" ? selectedDifficulty : selectedMode) === value}
                                    />
                                    <div className={styles.custom__radio}></div>
                                    {value}
                                </label>
                            </li>
                        );
                    })
                }
            </ul>

        </div>
    );
}

export default DropdownBTN