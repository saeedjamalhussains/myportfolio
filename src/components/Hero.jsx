import { motion } from 'framer-motion';
import Desk from './Desk';
import BrightnessSlider from './BrightnessSlider';
import { useLighting } from '../hooks/useLighting';
import styles from './Hero.module.css';

// Stroke glyphs on a 24px grid, drawn to a single weight so the three tiles
// read as one set. Unicode symbols can't do this — they shift with the
// platform's emoji font.
const marks = [
    {
        label: 'Build',
        glyph: (
            <>
                <path d="M9.5 8.5 6 12l3.5 3.5" />
                <path d="M14.5 8.5 18 12l-3.5 3.5" />
            </>
        ),
    },
    {
        label: 'Secure',
        glyph: <path d="M12 3.6 18.4 6.3v5.2c0 4.1-2.7 6.9-6.4 8.1-3.7-1.2-6.4-4-6.4-8.1V6.3Z" />,
    },
    {
        label: 'Design',
        glyph: (
            <>
                <path d="M12 3.6 17 14l-5 6-5-6Z" />
                <circle cx="12" cy="12.1" r="1.6" />
                <path d="M12 13.7V20" />
            </>
        ),
    },
];

const rise = {
    hidden: { opacity: 0, y: 18 },
    visible: (i = 0) => ({
        opacity: 1,
        y: 0,
        transition: { duration: 0.8, delay: 0.35 + i * 0.12, ease: [0.16, 1, 0.3, 1] },
    }),
};

const Hero = () => {
    // Owned here so the desk switch and the slider drive the same value
    const { brightness, setBrightness, isDark, toggleLights } = useLighting();

    return (
        <header className={styles.hero}>
            <Desk lightsOn={!isDark} onToggleLights={toggleLights} />
            <BrightnessSlider value={brightness} isDark={isDark} onChange={setBrightness} />

            <div className={styles.center}>
                <motion.h1
                    className={styles.name}
                    initial={{ opacity: 0, y: 22 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                >
                    Saeed Jamal<br />Hussain Shaik
                </motion.h1>

                <motion.p className={styles.roleAlt} variants={rise} initial="hidden" animate="visible" custom={0}>
                    Security &amp; Design
                </motion.p>

                <motion.p className={styles.tagline} variants={rise} initial="hidden" animate="visible" custom={1}>
                    a careful process of building digital work that is useful, secure, and clear.
                </motion.p>

                <motion.div className={styles.marks} variants={rise} initial="hidden" animate="visible" custom={2}>
                    {marks.map((mark) => (
                        <span key={mark.label} className={styles.mark} title={mark.label}>
                            <svg
                                className={styles.markGlyph}
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.6"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                aria-hidden="true"
                            >
                                {mark.glyph}
                            </svg>
                            <span className={styles.srOnly}>{mark.label}</span>
                        </span>
                    ))}
                </motion.div>
            </div>

            <motion.span
                className={styles.hint}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.4, duration: 0.8 }}
            >
                <span className={styles.hintDrag}>drag anything · </span>scroll down
            </motion.span>
        </header>
    );
};

export default Hero;
