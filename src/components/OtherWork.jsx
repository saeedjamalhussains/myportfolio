import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { otherWork } from '../data/work';
import styles from './OtherWork.module.css';

const OtherWork = () => {
    // Accordion: one row open at a time, null when everything is closed
    const [openIndex, setOpenIndex] = useState(null);

    if (!otherWork.length) {
        return null;
    }

    return (
        <section className={`wrap ${styles.section}`} aria-label="Other work">
            <span className="eyebrow">Other Work ⁕</span>

            <ul className={styles.list}>
                {otherWork.map((project, index) => {
                    const isOpen = openIndex === index;

                    return (
                        <motion.li
                            key={project.title}
                            className={styles.row}
                            initial={{ opacity: 0, y: 18 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.4 }}
                            transition={{ duration: 0.6, delay: index * 0.05, ease: [0.16, 1, 0.3, 1] }}
                        >
                            <button
                                type="button"
                                className={styles.trigger}
                                onClick={() => setOpenIndex(isOpen ? null : index)}
                                aria-expanded={isOpen}
                            >
                                <span className={styles.head}>
                                    <span className={styles.title}>{project.title}</span>
                                    <span className={styles.meta}>{project.meta}</span>
                                </span>
                                <span className={styles.blurb}>{project.blurb}</span>
                                <span className={`${styles.chevron} ${isOpen ? styles.chevronOpen : ''}`}>
                                    {/* Drawn rather than a "+" character, which
                                        shifts weight and baseline across fonts. */}
                                    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
                                        <path d="M8 2.5v11M2.5 8h11" />
                                    </svg>
                                </span>
                            </button>

                            <AnimatePresence initial={false}>
                                {isOpen ? (
                                    <motion.div
                                        className={styles.detailWrap}
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                                    >
                                        <p className={styles.detail}>{project.detail}</p>
                                        {project.href ? (
                                            <a
                                                className={styles.detailLink}
                                                href={project.href}
                                                target="_blank"
                                                rel="noreferrer"
                                            >
                                                View on GitHub →
                                            </a>
                                        ) : null}
                                    </motion.div>
                                ) : null}
                            </AnimatePresence>
                        </motion.li>
                    );
                })}
            </ul>
        </section>
    );
};

export default OtherWork;
