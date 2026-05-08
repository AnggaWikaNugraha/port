'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { KeyboardEvent, MouseEvent, useState } from 'react';
import ProjectMarkdown, { normalizeProjectMarkdown } from '../projectMarkdown';
import { ProjectType } from '../../types';

/* ── Project Row (Medium-style) ───────────────────────── */
function Project({ project }: { project: ProjectType }) {
    const router = useRouter();
    const [showAllTech, setShowAllTech] = useState(false);
    const [showFullDesc, setShowFullDesc] = useState(false);
    const normalizedDescription = project.description ? normalizeProjectMarkdown(project.description) : '';
    const isLongDesc = normalizedDescription.length > 220 || normalizedDescription.split('\n').length > 5;
    const techStack = project.techStack ?? [];
    const visibleTech = showAllTech ? techStack : techStack.slice(0, 3);
    const hiddenCount = techStack.length - 3;
    const detailHref = `/pages/projects/${project.id}`;

    const handleCardClick = (event: MouseEvent<HTMLDivElement>) => {
        const target = event.target as HTMLElement;

        if (target.closest('a, button')) {
            return;
        }

        router.push(detailHref);
    };

    const handleCardKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
        const target = event.target as HTMLElement;

        if (target.closest('a, button')) {
            return;
        }

        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            router.push(detailHref);
        }
    };

    return (
        <div
            className="flex cursor-pointer gap-4 py-6 sm:gap-8"
            onClick={handleCardClick}
            onKeyDown={handleCardKeyDown}
            role="link"
            tabIndex={0}
        >

            {/* Left: content */}
            <div className="flex-1 min-w-0 flex flex-col gap-1.5">

                {/* Publication line + year + featured */}
                <div className="flex items-center gap-2 flex-wrap">
                    {(project.role || project.company) && (
                        <p className="text-xs text-gray-600">
                            {[project.role, project.company].filter(Boolean).join(' · ')}
                        </p>
                    )}
                    {project.year && (
                        <span className="text-[10px] text-gray-700 tabular-nums">· {project.year}</span>
                    )}
                    {project.featured && (
                        <span className="text-[10px] text-gray-500 bg-white/[0.06] px-2 py-px rounded-full">
                            Featured
                        </span>
                    )}
                    {project.status === 'in-progress' && (
                        <span className="text-[10px] text-yellow-600">In Progress</span>
                    )}
                </div>

                {/* Title */}
                <Link href={detailHref} className="block">
                    <h2 className="text-white font-bold text-base sm:text-lg leading-snug line-clamp-2">
                        {project.title}
                    </h2>
                </Link>

                {/* Description */}
                {project.description && (
                    <div className="flex flex-col items-start gap-1">
                        <div className={`relative w-full overflow-hidden ${showFullDesc ? '' : 'max-h-32 sm:max-h-36'}`}>
                            <ProjectMarkdown
                                content={project.description}
                                className="text-xs sm:text-sm [&_p]:text-gray-500 [&_ul]:text-gray-500 [&_ol]:text-gray-500 [&_li]:text-gray-500 [&_h1]:text-gray-300 [&_h2]:text-gray-300 [&_h3]:text-gray-300 [&_strong]:text-gray-300"
                            />
                            {!showFullDesc && isLongDesc && (
                                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-gray-950 to-transparent" />
                            )}
                        </div>
                        {isLongDesc && (
                            <button
                                type="button"
                                onClick={() => {
                                    setShowFullDesc(v => !v);
                                }}
                                className="block text-[11px] text-gray-600 hover:text-gray-400 transition-colors"
                            >
                                {showFullDesc ? 'Show less' : 'Show more'}
                            </button>
                        )}
                    </div>
                )}

                {/* Actions — bottom left */}
                <div className="flex items-center gap-3 mt-auto pt-2 flex-wrap">
                    {project.demoUrl && (
                        <Link
                            href={project.demoUrl}
                            target="_blank"
                            onClick={e => e.stopPropagation()}
                            className="text-[11px] text-gray-400 hover:text-white transition-colors"
                        >
                            Demo ↗
                        </Link>
                    )}
                    {project.repoUrl && (
                        <Link
                            href={project.repoUrl}
                            target="_blank"
                            onClick={e => e.stopPropagation()}
                            className="text-[11px] text-gray-600 hover:text-gray-300 transition-colors"
                        >
                            Source →
                        </Link>
                    )}
                    <Link
                        href={detailHref}
                        onClick={e => e.stopPropagation()}
                        className="rounded-full border border-white/[0.08] px-3 py-1 text-[11px] text-gray-500 transition-colors hover:border-white/[0.16] hover:text-gray-300"
                    >
                        Detail
                    </Link>
                </div>
            </div>

            {/* Right: thumbnail + meta */}
            <div className="flex-shrink-0 w-48 flex flex-col gap-2 self-start mt-5">
                {project.coverImage && (
                    <Link
                        href={detailHref}
                        className="block w-48 h-32 overflow-hidden bg-gray-800/40"
                        style={{ borderRadius: '2px' }}
                    >
                        <Image
                            src={project.coverImage}
                            alt={project.title}
                            width={192}
                            height={128}
                            className="w-full h-full object-cover object-top"
                        />
                    </Link>
                )}

                {/* Tech stack + meta below image */}
                <div className="flex flex-col gap-1.5">
                    {techStack.length > 0 && (
                        <div className="flex flex-col items-start gap-1.5">
                            <div className="flex flex-wrap gap-1 items-center">
                                {visibleTech.map(tech => (
                                    <span
                                        key={tech}
                                        className="text-[10px] text-gray-500 bg-white/[0.04] border border-white/[0.07] px-2 py-px rounded-full"
                                    >
                                        {tech}
                                    </span>
                                ))}
                            </div>
                            {!showAllTech && hiddenCount > 0 && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowAllTech(true);
                                    }}
                                    className="text-[10px] text-gray-600 hover:text-gray-400 transition-colors"
                                >
                                    Show +{hiddenCount} more
                                </button>
                            )}
                            {showAllTech && hiddenCount > 0 && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowAllTech(false);
                                    }}
                                    className="text-[10px] text-gray-600 hover:text-gray-400 transition-colors"
                                >
                                    Show less
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Project;
