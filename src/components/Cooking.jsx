import { motion } from 'framer-motion';
import styles from './Cooking.module.css';

const Cooking = () => (
    <motion.section
        className={styles.cooking}
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        aria-label="Currently working on"
    >
        <span className="eyebrow">Currently cooking ☺︎</span>

        <p className={styles.body}>
            Putting desktop interfaces on the OSINT tools I use most —{' '}
            <em className={styles.highlight}>Maigret</em>,{' '}
            <em className={styles.highlight}>Sherlock</em>, and{' '}
            <em className={styles.highlight}>GitFive</em>. Same investigations, without
            living in the terminal.
        </p>

        <p className={styles.footnote}>All three are on GitHub. More coming. ✈︎</p>
    </motion.section>
);

export default Cooking;
