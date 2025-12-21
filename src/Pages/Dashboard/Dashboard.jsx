import styles from './Dashboard.module.css'
import StatsField from '../../Features/StatsField/StatsField';
import TextField from '../../Features/TextField/TextField';

function Dashboard() {

  return(
    <div className={styles.dashboard}>
      <StatsField />
      <TextField />
    </div>
  );
}

export default Dashboard