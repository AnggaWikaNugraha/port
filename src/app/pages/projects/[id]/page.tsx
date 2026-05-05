import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getPublicProjectById } from '@/lib/projects';

type ProjectDetailPageProps = {
    params: Promise<{ id: string }>;
};

export default async function ProjectDetailPage({ params }: ProjectDetailPageProps) {
    const { id } = await params;
    const project = await getPublicProjectById(id);

    if (!project) {
        notFound();
    }

    const flows = project.flows ?? [];

    return (
        <section className="min-h-screen bg-gray-950 px-4 py-10 sm:px-6 sm:py-14">
            <article className="mx-auto max-w-4xl space-y-10">
                <div className="space-y-6 border-b border-white/[0.07] pb-8">
                    <Link
                        href="/pages/projects"
                        className="inline-flex items-center text-xs uppercase tracking-[0.24em] text-gray-500 transition-colors hover:text-gray-300"
                    >
                        ← Back to projects
                    </Link>

                    <div className="space-y-3">
                        <p className="text-xs font-semibold uppercase tracking-[0.26em] text-gray-500">Case Study</p>
                        <h1 className="text-3xl font-bold leading-tight text-white sm:text-5xl">
                            {project.title}
                        </h1>
                        {project.description && (
                            <p className="max-w-3xl text-sm leading-7 text-gray-400 sm:text-lg">
                                {project.description}
                            </p>
                        )}
                    </div>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-500">
                        {(project.role || project.company) && (
                            <span>{[project.role, project.company].filter(Boolean).join(' · ')}</span>
                        )}
                        {project.year && <span>{project.year}</span>}
                        {project.status === 'in-progress' && <span className="text-yellow-500">In Progress</span>}
                        {project.featured && <span className="text-gray-300">Featured</span>}
                    </div>

                    <div className="flex flex-wrap gap-3 text-sm">
                        {project.demoUrl && (
                            <Link
                                href={project.demoUrl}
                                target="_blank"
                                className="rounded-full border border-white/10 px-4 py-2 text-gray-200 transition-colors hover:border-white/20 hover:bg-white/[0.04]"
                            >
                                Demo ↗
                            </Link>
                        )}
                        {project.repoUrl && (
                            <Link
                                href={project.repoUrl}
                                target="_blank"
                                className="rounded-full border border-white/10 px-4 py-2 text-gray-400 transition-colors hover:border-white/20 hover:bg-white/[0.04] hover:text-gray-200"
                            >
                                Source →
                            </Link>
                        )}
                    </div>
                </div>

                {project.coverImage && (
                    <div className="overflow-hidden rounded-3xl border border-white/[0.08] bg-white/[0.03]">
                        <div className="relative aspect-[16/10] w-full sm:aspect-[16/9]">
                            <Image
                                src={project.coverImage}
                                alt={project.title}
                                fill
                                className="object-cover object-top"
                                priority
                            />
                        </div>
                    </div>
                )}

                {project.techStack && project.techStack.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                        {project.techStack.map(tech => (
                            <span
                                key={tech}
                                className="rounded-full border border-white/[0.08] bg-white/[0.04] px-3 py-1 text-xs text-gray-400"
                            >
                                {tech}
                            </span>
                        ))}
                    </div>
                )}

                <div className="space-y-12">
                    {flows.length > 0 ? (
                        flows.map((flow, index) => (
                            <section key={flow.id} className="space-y-5">
                                <div className="space-y-2">
                                    <p className="text-xs font-semibold uppercase tracking-[0.26em] text-gray-600">
                                        Flow {String(index + 1).padStart(2, '0')}
                                    </p>
                                    {flow.title && (
                                        <h2 className="text-xl font-semibold text-white sm:text-2xl">
                                            {flow.title}
                                        </h2>
                                    )}
                                </div>

                                {flow.imageUrl && (
                                    <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.03]">
                                        <div className="relative aspect-[16/10] w-full sm:aspect-[16/9]">
                                            <Image
                                                src={flow.imageUrl}
                                                alt={flow.title ?? `${project.title} flow ${index + 1}`}
                                                fill
                                                className="object-cover object-top"
                                            />
                                        </div>
                                    </div>
                                )}

                                {flow.description && (
                                    <p className="max-w-3xl text-sm leading-7 text-gray-400 sm:text-base">
                                        {flow.description}
                                    </p>
                                )}
                            </section>
                        ))
                    ) : (
                        <section className="space-y-3">
                            <p className="text-xs font-semibold uppercase tracking-[0.26em] text-gray-600">Overview</p>
                            <p className="max-w-3xl text-sm leading-7 text-gray-400 sm:text-base">
                                Belum ada flow detail untuk project ini.
                            </p>
                        </section>
                    )}
                </div>
            </article>
        </section>
    );
}
