import styles from './Dashboard.module.css'
import StatsField from '../../Features/StatsField/StatsField';
import TextField from '../../Features/TextField/TextField';
import DifficultyContextProvider from '../../Features/StatsField/DifficultyContext';
import ModeContextProvider from '../../Features/StatsField/ModeContext';
import RestarBTN from '../../Components/RestartButton/RestartBTN';

function Dashboard() {

  return(
    <div className={styles.dashboard}>
      <DifficultyContextProvider>
          <ModeContextProvider>
            <StatsField />
            <TextField />
            <RestarBTN />
          </ModeContextProvider>
      </DifficultyContextProvider>
    </div>
  );
}

export default Dashboard