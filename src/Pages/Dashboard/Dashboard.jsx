import styles from './Dashboard.module.css'
import StatsField from '../../Features/StatsField/StatsField';
import TextField from '../../Features/TextField/TextField';
import DifficultyContextProvider from '../../Components/DifficultyContext';

function Dashboard() {

  return(
    <div className={styles.dashboard}>
      <DifficultyContextProvider>
          <StatsField />
          <TextField />
      </DifficultyContextProvider>
    </div>
  );
}

export default Dashboard