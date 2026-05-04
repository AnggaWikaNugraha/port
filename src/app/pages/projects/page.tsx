import Projects from './components';

export default function ProjectsPage() {
    return (
        <section className="flex-1 px-4 py-16 bg-gray-950 min-h-screen">
            <div className="mx-auto max-w-5xl space-y-10">
                <div className="space-y-2">
                    <p className="text-xs text-gray-500 font-semibold uppercase tracking-widest">Work</p>
                    <h1 className="text-4xl font-bold text-white leading-tight">
                        Things I&apos;ve built.
                    </h1>
                </div>
                <Projects />
            </div>
        </section>
    );
}
