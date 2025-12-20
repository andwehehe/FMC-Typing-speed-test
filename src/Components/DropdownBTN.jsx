import styles from './Components.module.css'
import downArrow from '../assets/icons/icon-down-arrow.svg'
import { useState } from 'react';

function DropdownBTN({ content }) {

    const [ selectedDifficulty, setSelectedDifficulty ] = useState(content[0].value);
    const [ isDropdownOpen, setIsDropdownOpen ] = useState(false);

    const selectDifficulty = (e) => {
        setSelectedDifficulty(e.target.value)
        setIsDropdownOpen(prev => !prev)
    }

    return(
        <div className={styles.dropdownBTN__container}>

            <button 
                className={styles.dropdownBTN} 
                onClick={() => setIsDropdownOpen(prev => !prev)}
            >
                {selectedDifficulty}
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
                                        onChange={selectDifficulty}
                                        checked={selectedDifficulty === value}
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