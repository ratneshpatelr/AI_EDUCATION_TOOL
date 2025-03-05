import { useNavigate } from 'react-router-dom';
import styles from './Home.module.css';

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Currently, We Have Features for You</h1>
      <div className={styles.cardContainer}>
        <div className={styles.card} onClick={() => navigate('/mcq')}>
        <h2>MCQ Generator <span className={styles.arrow}>→</span></h2>
        <p>Create multiple-choice questions easily.</p>
        </div>
        <div className={styles.card} onClick={() => navigate('/question-generator')}>
        <h2>Question Generator <span className={styles.arrow}>→</span></h2>
        <p>Generate questions on any topic instantly.</p>
        </div>
      </div>
    </div>
  );
}
