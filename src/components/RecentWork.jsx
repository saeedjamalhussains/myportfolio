import { motion } from 'framer-motion';
import { recentWork } from '../data/work';
import styles from './RecentWork.module.css';

const initials = (title) =>
    title
        .split(' ')
        .slice(0, 2)
        .map((word) => word[0])
        .join('');

const RecentWork = () => {
    if (!recentWork.length) {
        return null;
    }

    return (
        <section className={`wrap ${styles.section}`} id="work" aria-label="Recently made">
            <span className="eyebrow">Recently Made ▶</span>

            <div className={styles.grid}>
                {recentWork.map((project, index) => {
                    const external = project.href?.startsWith('http');
                    // Only render a link when there is somewhere to go
                    const Card = project.href ? motion.a : motion.div;

                    return (
                        <Card
                            key={project.title}
                            className={styles.card}
                            href={project.href ?? undefined}
                            target={external ? '_blank' : undefined}
                            rel={external ? 'noreferrer' : undefined}
                            initial={{ opacity: 0, y: 26 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.2 }}
                            transition={{ duration: 0.7, delay: index * 0.07, ease: [0.16, 1, 0.3, 1] }}
                        >
                            <div className={styles.art} style={{ background: project.tint }}>
                                {project.art ? (
                                    <img src={project.art} alt="" className={styles.artImage} />
                                ) : (
                                    <span className={styles.monogram}>{initials(project.title)}</span>
                                )}
                            </div>

                            <div className={styles.meta}>
                                <h3 className={styles.title}>{project.title}</h3>
                                <span className={styles.year}>{project.year}</span>
                            </div>
                            <p className={styles.blurb}>{project.blurb}</p>
                        </Card>
                    );
                })}
            </div>
        </section>
    );
};

export default RecentWork;
