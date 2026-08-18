import { motion } from 'framer-motion';
import { links } from '../data/work';
import styles from './About.module.css';

const About = () => (
    <motion.section
        className={`wrap ${styles.section}`}
        id="about"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        aria-label="About"
    >
        <span className="eyebrow">About ⌘</span>

        <div className={styles.body}>
            <p>
                I&apos;m a cybersecurity student at KL University in Vijayawada, graduating
                in 2027. I build full-stack web apps and do the design work that goes with
                them.
            </p>
            <p>
                Lately I&apos;ve been putting interfaces on security tools. A GUI for
                Volatility 3, so memory forensics doesn&apos;t mean memorising flags, and
                desktop front ends for OSINT tools like Maigret, Sherlock and GitFive. They
                are all good tools. They all live in the terminal. I wanted to see how much
                easier they got with a window around them.
            </p>
            <p>
                The rest is normal full-stack work: React on the front, Express and MongoDB
                behind it. I&apos;ve also done the Deloitte Australia cyber job simulation
                on Forage, and I&apos;m part of the Broadband Networks Club at uni.
            </p>
            <p>
                I learn by building something, breaking it, and figuring out why.
            </p>
            <p className={styles.sign}>If you&apos;re building something, say hi.</p>
        </div>

        <div className={styles.contact}>
            <a href={links.github} target="_blank" rel="noreferrer" className={styles.link}>GitHub</a>
            <span className={styles.sep}>|</span>
            <a href={links.linkedin} target="_blank" rel="noreferrer" className={styles.link}>LinkedIn</a>
            <span className={styles.sep}>|</span>
            <a href={links.instagram} target="_blank" rel="noreferrer" className={styles.link}>Instagram</a>
            <span className={styles.sep}>|</span>
            <span>E-mail: <a href={`mailto:${links.email}`} className={styles.link}>{links.email}</a></span>
        </div>
    </motion.section>
);

export default About;
