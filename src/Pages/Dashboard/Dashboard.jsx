import styles from './Dashboard.module.css'
import StatsField from '../../Features/StatsField/StatsField';
import TextField from '../../Features/TextField/TextField';
import DifficultyContextProvider from '../../Features/StatsField/DifficultyContext';
import RestarBTN from '../../Components/RestartButton/RestartBTN';

function Dashboard() {

  return(
    <div className={styles.dashboard}>
      <DifficultyContextProvider>
            <StatsField />
            <TextField />
            <RestarBTN />
      </DifficultyContextProvider>
    </div>
  );
}

export default Dashboard