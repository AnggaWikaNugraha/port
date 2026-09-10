'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { ArrowUpRight, Github, Globe, Layers } from 'lucide-react';
import ProjectMarkdown from '../projectMarkdown';
import { ProjectType } from '../../types';
import styles from '../../projects.module.css';
import { displayProjectTitle } from '../projectPresentation';

export default function Project({ project, spotlight = false, index = 0 }: {
    project: ProjectType;
    spotlight?: boolean;
    index?: number;
}) {
    const [expandedTech, setExpandedTech] = useState(false);
    const [failedImage, setFailedImage] = useState<string | null>(null);
    const techStack = project.techStack ?? [];
    const title = displayProjectTitle(project.title);
    const detailHref = `/pages/projects/${project.id}`;
    const Heading = spotlight ? 'h2' : 'h3';

    return (
        <article className={`${styles.card} ${spotlight ? styles.spotlight : ''}`}>
            <Link
                href={detailHref}
                className={styles.preview}
                data-tone={index % 3}
                aria-label={`View ${title}`}
                tabIndex={-1}
            >
                <div className={styles.previewCaption} aria-hidden="true">
                    <span>{String(index + 1).padStart(2, '0')} / {spotlight ? 'In the spotlight' : 'Project preview'}</span>
                    <ArrowUpRight size={16} />
                </div>
                <div className={styles.imageFrame}>
                    {project.coverImage && failedImage !== project.coverImage ? (
                        <Image
                            src={project.coverImage}
                            alt={`${title} interface preview`}
                            fill
                            sizes="(max-width: 639px) 90vw, (max-width: 959px) 80vw, 560px"
                            className={styles.coverImage}
                            priority={spotlight}
                            onError={() => setFailedImage(project.coverImage ?? null)}
                        />
                    ) : (
                        <div className={styles.placeholder}>
                            <Layers size={32} strokeWidth={1} />
                            <span>{title}</span>
                        </div>
                    )}
                </div>
            </Link>

            <div className={styles.content}>
                <div className={styles.meta}>
                    <span>{spotlight ? (project.featured ? 'Featured project' : 'Project spotlight') : project.company || 'Project'}</span>
                    {project.year && <span>{project.year}</span>}
                </div>
                <Heading className={styles.title}>
                    <Link href={detailHref}>{title}</Link>
                </Heading>
                {spotlight && (project.role || project.company) && (
                    <p className={styles.role}>{[project.role, project.company].filter(Boolean).join(' · ')}</p>
                )}
                {project.description && (
                    <ProjectMarkdown content={project.description} className={styles.description} />
                )}
                {project.status === 'in-progress' && <span className={styles.status}>In progress</span>}
                {techStack.length > 0 && (
                    <div className={styles.technologies}>
                        {(expandedTech ? techStack : techStack.slice(0, 3)).map(tech => <span key={tech}>{tech}</span>)}
                        {techStack.length > 3 && (
                            <button
                                type="button"
                                aria-expanded={expandedTech}
                                aria-label={`${expandedTech ? 'Show fewer' : 'Show all'} technologies for ${title}`}
                                onClick={() => setExpandedTech(value => !value)}
                            >{expandedTech ? 'Show less' : `+${techStack.length - 3}`}</button>
                        )}
                    </div>
                )}
                <div className={styles.actions}>
                    <Link href={detailHref} className={styles.primaryLink} aria-label={`View project: ${title}`}>
                        View project <ArrowUpRight size={16} />
                    </Link>
                    <div className={styles.externalLinks}>
                        {project.demoUrl && (
                            <a href={project.demoUrl} target="_blank" rel="noreferrer" aria-label={`Open ${title} live website (new tab)`}>
                                <Globe size={14} /> Live
                            </a>
                        )}
                        {project.repoUrl && (
                            <a href={project.repoUrl} target="_blank" rel="noreferrer" aria-label={`Open ${title} on GitHub (new tab)`}>
                                <Github size={14} /> GitHub
                            </a>
                        )}
                    </div>
                </div>
            </div>
        </article>
    );
}
