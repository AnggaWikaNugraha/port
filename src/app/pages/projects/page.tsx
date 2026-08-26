import Projects from './components';

export default function ProjectsPage() {
    return (
        <section className="min-h-screen flex-1 bg-gray-950 px-4 py-12 font-sans sm:px-6 sm:py-14">
            <div className="mx-auto max-w-4xl space-y-10">
                <div className="space-y-2">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-gray-600">Work</p>
                    <h1 className="text-xl font-bold leading-tight tracking-tight text-white sm:text-2xl">
                        Things I&apos;ve built.
                    </h1>
                </div>
                <Projects />
            </div>
        </section>
    );
}
