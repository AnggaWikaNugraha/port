'use client';

import { useEffect, useState } from 'react';
import { fetchProjects } from '../services';
import { ProjectType } from '../types';
import Project from './project';
import styles from '../projects.module.css';

export default function Projects() {
    const [projects, setProjects] = useState<ProjectType[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [attempt, setAttempt] = useState(0);

    useEffect(() => {
        let active = true;
        fetchProjects()
            .then(data => { if (active) setProjects(data); })
            .catch(() => { if (active) setError(true); })
            .finally(() => { if (active) setLoading(false); });
        return () => { active = false; };
    }, [attempt]);

    if (loading) {
        return (
            <div className={styles.loading} role="status" aria-label="Loading projects">
                <div className={`${styles.skeleton} ${styles.skeletonFeatured}`} />
                <div className={styles.grid}>
                    <div className={styles.skeleton} />
                    <div className={styles.skeleton} />
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className={styles.empty} role="alert">
                <h2>Projects couldn&apos;t load.</h2>
                <p>Please try again in a moment.</p>
                <button type="button" onClick={() => {
                    setLoading(true);
                    setError(false);
                    setAttempt(value => value + 1);
                }}>Try again ↗</button>
            </div>
        );
    }

    if (projects.length === 0) {
        return (
            <div className={styles.empty}>
                <h2>Good things are in the works.</h2>
                <p>New projects will appear here soon.</p>
            </div>
        );
    }

    const featured = projects.find(project => project.featured) ?? projects[0];
    const remaining = projects.filter(project => project.id !== featured.id);

    return (
        <div className={styles.collection}>
            <section aria-label="Project spotlight">
                <Project project={featured} spotlight />
            </section>
            {remaining.length > 0 && (
                <section aria-labelledby="more-projects-title">
                    <div className={styles.sectionHeading}>
                        <h2 id="more-projects-title">More projects <span>{String(remaining.length).padStart(2, '0')}</span></h2>
                        <span>A little more of what I do</span>
                    </div>
                    <div className={styles.grid}>
                        {remaining.map((project, index) => (
                            <Project key={project.id} project={project} index={index + 1} />
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
}
