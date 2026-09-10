import Link from 'next/link';
import Projects from './components';
import styles from './projects.module.css';

export default function ProjectsPage() {
    return (
        <main className={`${styles.page} font-sans`}>
            <div className={styles.container}>
                <header className={styles.header}>
                    <div>
                        <p className={styles.eyebrow}><span /> Portfolio / Projects</p>
                        <h1>Selected work<span>.</span></h1>
                    </div>
                    <p className={styles.intro}>
                        Ideas turned into working products.<br />
                        A selection of things I&apos;ve designed and built.
                    </p>
                </header>
                <Projects />
                <footer className={styles.footer}>
                    <span>Thoughtfully built. Always learning.</span>
                    <Link href="/pages/about">Meet the developer ↗</Link>
                </footer>
            </div>
        </main>
    );
}
