'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { ProjectType } from '../../types';

/* ── Project Row (Medium-style) ───────────────────────── */
function Project({ project }: { project: ProjectType }) {
    const router = useRouter();
    const [showAllTech, setShowAllTech] = useState(false);
    const [showFullDesc, setShowFullDesc] = useState(false);
    const isLongDesc = (project.description?.length ?? 0) > 120;
    const techStack = project.techStack ?? [];
    const visibleTech = showAllTech ? techStack : techStack.slice(0, 3);
    const hiddenCount = techStack.length - 3;
    const detailHref = `/pages/projects/${project.id}`;
    const flowCount = project.flows?.length ?? 0;

    return (
        <div
            className="flex cursor-pointer gap-4 py-6 sm:gap-8"
            onClick={() => router.push(detailHref)}
            onKeyDown={e => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    router.push(detailHref);
                }
            }}
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
                        <p className={`text-gray-500 text-sm leading-relaxed sm:block hidden ${!showFullDesc && isLongDesc ? 'line-clamp-2' : ''}`}>
                            {project.description}
                        </p>
                        <p className={`text-gray-500 text-xs leading-relaxed sm:hidden ${!showFullDesc && isLongDesc ? 'line-clamp-2' : ''}`}>
                            {project.description}
                        </p>
                        {isLongDesc && (
                            <button
                                type="button"
                                onClick={e => {
                                    e.stopPropagation();
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
                        className="text-[11px] text-gray-600 hover:text-gray-300 transition-colors"
                    >
                        {flowCount > 0 ? `${flowCount} flows →` : 'View details →'}
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
                                    onClick={e => {
                                        e.stopPropagation();
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
                                    onClick={e => {
                                        e.stopPropagation();
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
