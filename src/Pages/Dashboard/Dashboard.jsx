import styles from './Dashboard.module.css'
import StatsField from '../../Features/StatsField/StatsField';

function Dashboard() {

  return(
    <div className={styles.dashboard}>
      <StatsField />
    </div>
  );
}

export default Dashboard