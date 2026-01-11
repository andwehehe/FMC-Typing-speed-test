import styles from './DropdownBTN.module.css'
import downArrow from '../../assets/icons/icon-down-arrow.svg'
import { DifficultyContext } from '../../Features/StatsField/DifficultyContext';
import { useState, useContext } from 'react';

function DropdownBTN({ content }) {

    const { setSelectedDifficulty } = useContext(DifficultyContext);
    const [ selectedRadio, setSelectedRadio ] = useState(content[0].value);
    const [ isDropdownOpen, setIsDropdownOpen ] = useState(false);

    const selectRadio = (e) => {
        setSelectedRadio(e.target.value);
        
        if(content[0].name === "difficulty") {
            setSelectedDifficulty(e.target.value);
        }

        setIsDropdownOpen(prev => !prev);
    }

    return(
        <div className={styles.dropdownBTN__container}>

            <button 
                className={styles.dropdownBTN} 
                onClick={() => setIsDropdownOpen(prev => !prev)}
            >
                {selectedRadio}
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
                                        checked={selectedRadio === value}
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