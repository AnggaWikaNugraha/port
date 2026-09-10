import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowUpRight, ChevronDown, Github } from 'lucide-react';
import { getPublicProjectById } from '@/lib/projects';
import ProjectMarkdown from '../components/projectMarkdown';
import { displayProjectTitle, presentProjectDescription } from '../components/projectPresentation';
import ZoomableImage from './ZoomableImage';
import DemoAccess from './DemoAccess';
import shared from '../projects.module.css';
import styles from './detail.module.css';

type ProjectDetailPageProps = { params: Promise<{ id: string }> };

export default async function ProjectDetailPage({ params }: ProjectDetailPageProps) {
    const { id } = await params;
    const project = await getPublicProjectById(id);
    if (!project) notFound();

    const title = displayProjectTitle(project.title);
    const { overview, intro, credentials } = presentProjectDescription(project.description);
    const flows = project.flows ?? [];
    const technologies = project.techStack ?? [];
    const skillGroups = project.skillGroups ?? [];
    const hasDemo = Boolean(project.demoUrl || credentials.length);
    const sections = [
        ...(overview ? [{ id: 'overview', label: 'Overview' }] : []),
        ...(technologies.length ? [{ id: 'technologies', label: 'Tech stack' }] : []),
        ...(flows.length ? [{ id: 'walkthrough', label: 'Product walkthrough' }] : []),
        ...(hasDemo ? [{ id: 'demo', label: 'Try the demo' }] : []),
    ];
    const metadata = [
        { label: 'My role', value: project.role },
        { label: 'Project type', value: project.company },
        { label: 'Year', value: project.year },
        { label: 'Status', value: project.status === 'in-progress' ? 'In progress' : project.status === 'completed' ? 'Completed' : project.status === 'archived' ? 'Archived' : undefined },
    ].filter(item => item.value);

    return (
        <main className={`${shared.page} ${styles.page} font-sans`}>
            <article className={shared.container}>
                <div className={styles.topbar}>
                    <Link href="/pages/projects" className={styles.back}><ArrowLeft size={15} /> All projects</Link>
                    <span>Behind the build <span className={styles.dot}>/</span> {project.year || 'Project details'}</span>
                </div>

                <header className={styles.header}>
                    <p className={shared.eyebrow}><span /> Project case study {project.featured ? ' / Featured' : ''}</p>
                    <h1>{title}<span className={styles.titleDot}>.</span></h1>
                    <div className={styles.headerBottom}>
                        {intro && <p className={styles.intro}>{intro}</p>}
                        <div className={styles.headerActions}>
                            {project.demoUrl && <a href={project.demoUrl} target="_blank" rel="noreferrer" className={styles.primaryButton}>Visit website <ArrowUpRight size={16} /></a>}
                            {project.repoUrl && <a href={project.repoUrl} target="_blank" rel="noreferrer" className={styles.secondaryButton}><Github size={16} /> Source code</a>}
                        </div>
                    </div>
                </header>

                {project.coverImage && (
                    <figure className={styles.hero}>
                        <figcaption><span>THE PRODUCT / {title}</span><span>Click to explore <ArrowUpRight size={14} /></span></figcaption>
                        <div className={styles.heroImage}>
                            <ZoomableImage src={project.coverImage} alt={`${title} product preview`} aspectClass={styles.heroAspect} className="object-contain" priority />
                        </div>
                    </figure>
                )}

                {metadata.length > 0 && (
                    <dl className={styles.metadata}>
                        {metadata.map(item => <div key={item.label}><dt>{item.label}</dt><dd>{item.label === 'Status' && <span className={styles.statusDot} data-status={project.status} />}{item.value}</dd></div>)}
                    </dl>
                )}

                {sections.length > 0 && (
                    <div className={styles.body}>
                        <aside className={styles.sidebar}>
                            <nav aria-label="Project sections">
                                <p>In this project</p>
                                {sections.map((section, index) => <a key={section.id} href={`#${section.id}`}><span>{String(index + 1).padStart(2, '0')}</span>{section.label}</a>)}
                            </nav>
                            <p className={styles.sidebarNote}>A closer look at the product,<br />from the interface to the implementation.</p>
                        </aside>

                        <div className={styles.sections}>
                            {overview && (
                                <section id="overview" className={styles.section}>
                                    <p className={styles.sectionLabel}>The idea</p>
                                    <h2>About the project</h2>
                                    <ProjectMarkdown content={overview} className={styles.prose} />
                                </section>
                            )}

                            {technologies.length > 0 && (
                                <section id="technologies" className={styles.section}>
                                    <p className={styles.sectionLabel}>Under the hood</p>
                                    <h2>Built with</h2>
                                    <div className={styles.techGroups}>
                                        {skillGroups.map(group => (
                                            <div key={group.id ?? group.name} className={styles.techGroup}>
                                                <h3>{group.name}<span>{group.skills.length}</span></h3>
                                                <div className={styles.techStack}>
                                                    {group.skills.map(skill => <span key={skill}>{skill}</span>)}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            )}

                            {flows.length > 0 && (
                                <section id="walkthrough" className={styles.section}>
                                    <div className={styles.walkthroughHeading}>
                                        <div><p className={styles.sectionLabel}>Inside the experience</p><h2>Product walkthrough</h2></div>
                                        <span>{String(flows.length).padStart(2, '0')} features</span>
                                    </div>
                                    <p className={styles.sectionIntro}>Explore each feature, its interface, and how it works.</p>
                                    <div className={styles.flows}>
                                        {flows.map((flow, index) => (
                                            <details key={flow.id} name="project-flow" open={index === 0} className={styles.flow}>
                                                <summary>
                                                    <span className={styles.flowNumber}>{String(index + 1).padStart(2, '0')}</span>
                                                    <h3>{flow.title || `Feature ${index + 1}`}</h3>
                                                    <ChevronDown size={17} className={styles.chevron} />
                                                </summary>
                                                <div className={styles.flowBody}>
                                                    {flow.imageUrl && <div className={styles.flowImage}><ZoomableImage src={flow.imageUrl} alt={flow.title || `${title} feature ${index + 1}`} aspectClass="aspect-[16/10]" className="object-contain" /></div>}
                                                    {flow.description && <ProjectMarkdown content={flow.description} className={styles.prose} />}
                                                </div>
                                            </details>
                                        ))}
                                    </div>
                                </section>
                            )}

                            {hasDemo && (
                                <section id="demo" className={`${styles.section} ${styles.demo}`}>
                                    <p className={styles.sectionLabel}>Take a look around</p>
                                    <h2>Try it for yourself.</h2>
                                    <p className={styles.sectionIntro}>{credentials.length ? 'Use the demo account below to explore the project.' : 'Open the live project and explore the experience.'}</p>
                                    {credentials.length > 0 && <DemoAccess credentials={credentials} />}
                                    {project.demoUrl && <a href={project.demoUrl} target="_blank" rel="noreferrer" className={styles.primaryButton}>Launch demo <ArrowUpRight size={16} /></a>}
                                </section>
                            )}
                        </div>
                    </div>
                )}

                <footer className={styles.footer}>
                    <div><p>There&apos;s more to explore</p><Link href="/pages/projects">Back to selected work <ArrowUpRight size={24} /></Link></div>
                    <span>Thoughtfully built. Always learning.</span>
                </footer>
            </article>
        </main>
    );
}
