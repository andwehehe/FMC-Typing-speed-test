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
        <>
        {/* Dropdown Button */}
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



            {/* Single Button */}
            <div className={styles.singleBTN__container}>

                <span className={styles.settings_label}>
                    {`${content[0].name.charAt(0).toUpperCase()}${content[0].name.slice(1)}:`}
                </span>

                <ul 
                    className={styles.dropdown__options_single}
                >
                    {
                        content.map(({ name, value }) => {
                            return(
                                <li className={styles.option_single} key={value}>
                                    <label>
                                        <input 
                                            type="radio" 
                                            name={name + "_single"}
                                            value={value}
                                            onChange={selectRadio}
                                            checked={(content[0].name === "difficulty" ? selectedDifficulty : selectedMode) === value}
                                        />
                                        {
                                            value === "Timed (60s)" ? "60s"
                                            : value === "Timed (30s)" ? "30s"
                                            : value === "Timed (15s)" ? "15s"
                                            : value
                                        }
                                    </label>
                                </li>
                            );
                        })
                    }
                </ul>
            </div>
        </>
    );
}

export default DropdownBTN