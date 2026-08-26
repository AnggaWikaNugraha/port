'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { KeyboardEvent, MouseEvent, ReactNode, useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { ArrowUpRight, Github, Globe, X } from 'lucide-react';
import ProjectMarkdown, { normalizeProjectMarkdown } from '../projectMarkdown';
import { ProjectType } from '../../types';

function ProjectModal({
    eyebrow,
    title,
    modalId,
    onClose,
    children,
}: {
    eyebrow: string;
    title: string;
    modalId: string;
    onClose: () => void;
    children: ReactNode;
}) {
    const [isClosing, setIsClosing] = useState(false);
    const isClosingRef = useRef(false);
    const closeTimerRef = useRef<number | null>(null);

    const requestClose = useCallback(() => {
        if (isClosingRef.current) return;

        isClosingRef.current = true;
        setIsClosing(true);
        closeTimerRef.current = window.setTimeout(onClose, 200);
    }, [onClose]);

    useEffect(() => {
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';

        const handleEscape = (event: globalThis.KeyboardEvent) => {
            if (event.key === 'Escape') requestClose();
        };

        window.addEventListener('keydown', handleEscape);

        return () => {
            document.body.style.overflow = previousOverflow;
            window.removeEventListener('keydown', handleEscape);
            if (closeTimerRef.current !== null) window.clearTimeout(closeTimerRef.current);
        };
    }, [requestClose]);

    return createPortal(
        <div
            className="project-modal-backdrop fixed inset-0 z-[100] flex items-center justify-center bg-black/75 p-4 font-sans backdrop-blur-sm sm:p-6"
            data-closing={isClosing}
            onClick={event => {
                event.stopPropagation();
                if (event.target === event.currentTarget) requestClose();
            }}
            role="presentation"
        >
            <div
                className="project-modal-panel flex max-h-[85vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-white/10 bg-gray-900 shadow-2xl shadow-black/50"
                data-closing={isClosing}
                role="dialog"
                aria-modal="true"
                aria-labelledby={modalId}
                onClick={event => event.stopPropagation()}
            >
                <div className="flex items-start justify-between gap-6 border-b border-white/10 px-5 py-4 sm:px-6 sm:py-5">
                    <div>
                        <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-500">
                            {eyebrow}
                        </p>
                        <h2 id={modalId} className="text-lg font-bold tracking-tight text-white sm:text-xl">
                            {title}
                        </h2>
                    </div>
                    <button
                        type="button"
                        onClick={requestClose}
                        className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-white/10 text-gray-400 transition hover:border-white/20 hover:bg-white/[0.06] hover:text-white"
                        aria-label="Close modal"
                        autoFocus
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>

                <div className="overflow-y-auto px-5 py-5 sm:px-6 sm:py-6">
                    {children}
                </div>
            </div>
        </div>,
        document.body,
    );
}

function DescriptionModal({
    title,
    description,
    onClose,
}: {
    title: string;
    description: string;
    onClose: () => void;
}) {
    return (
        <ProjectModal
            eyebrow="Project overview"
            title={title}
            modalId="project-description-title"
            onClose={onClose}
        >
            <ProjectMarkdown
                content={description}
                className="text-xs sm:text-sm [&_p]:text-gray-400 sm:[&_p]:leading-6 [&_ul]:text-gray-400 [&_ol]:text-gray-400 [&_li]:text-gray-400"
            />
        </ProjectModal>
    );
}

function TechStackModal({
    title,
    techStack,
    onClose,
}: {
    title: string;
    techStack: string[];
    onClose: () => void;
}) {
    return (
        <ProjectModal
            eyebrow="Technologies used"
            title={title}
            modalId="project-tech-stack-title"
            onClose={onClose}
        >
            <div className="flex flex-wrap gap-2.5">
                {techStack.map(tech => (
                    <span
                        key={tech}
                        className="rounded-full border border-white/[0.14] bg-white/[0.04] px-3 py-1.5 text-xs font-medium text-gray-200"
                    >
                        {tech}
                    </span>
                ))}
            </div>
        </ProjectModal>
    );
}

/* ── Project Row (Medium-style) ───────────────────────── */
function Project({ project }: { project: ProjectType }) {
    const router = useRouter();
    const [showDescriptionModal, setShowDescriptionModal] = useState(false);
    const [showTechStackModal, setShowTechStackModal] = useState(false);
    const normalizedDescription = project.description ? normalizeProjectMarkdown(project.description) : '';
    const isLongDesc = normalizedDescription.length > 220 || normalizedDescription.split('\n').length > 5;
    const techStack = project.techStack ?? [];
    const visibleTech = techStack.slice(0, 3);
    const hiddenCount = techStack.length - 3;
    const detailHref = `/pages/projects/${project.id}`;

    const handleCardClick = (event: MouseEvent<HTMLDivElement>) => {
        const target = event.target as HTMLElement;
        if (target.closest('a, button')) return;
        router.push(detailHref);
    };

    const handleCardKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
        const target = event.target as HTMLElement;
        if (target.closest('a, button')) return;
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            router.push(detailHref);
        }
    };

    return (
        <div
            className="group flex h-full cursor-pointer flex-col-reverse overflow-hidden rounded-[4px] border border-white/[0.07] bg-gray-900/50 transition-colors sm:min-h-[580px] sm:flex-col sm:rounded-[22px] sm:border-white/[0.10] sm:bg-gray-900/30 sm:hover:border-white/20 lg:min-h-[610px]"
            onClick={handleCardClick}
            onKeyDown={handleCardKeyDown}
            role="link"
            tabIndex={0}
        >

            {/* Left: content */}
            <div className="order-1 flex min-w-0 flex-1 flex-col gap-1.5 px-4 pb-4 pt-3 sm:order-2 sm:gap-0 sm:px-6 sm:pb-6 sm:pt-6">

                {/* Publication line + year + featured */}
                <div className="flex items-center gap-2 flex-wrap sm:order-2 sm:mt-2">
                    {(project.role || project.company) && (
                        <p className="text-xs text-gray-600 sm:text-[11px] sm:text-gray-500">
                            {[project.role, project.company].filter(Boolean).join(' · ')}
                        </p>
                    )}
                    {project.year && (
                        <span className="text-[10px] text-gray-700 tabular-nums sm:text-[11px] sm:text-gray-500 sm:[&:first-child]:before:hidden sm:before:mr-2 sm:before:content-['·']">{project.year}</span>
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
                <Link href={detailHref} className="block sm:order-1">
                    <div className="flex items-start justify-between gap-4">
                        <h2 className="line-clamp-2 text-base font-bold leading-snug tracking-tight text-white sm:text-lg">
                            {project.title}
                        </h2>
                        <ArrowUpRight className="mt-0.5 hidden h-6 w-6 shrink-0 text-gray-500 transition duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-white sm:block" />
                    </div>
                </Link>

                {/* Description */}
                {project.description && (
                    <div className="flex flex-col items-start gap-1 sm:order-3 sm:mt-7">
                        <div className="relative max-h-32 w-full overflow-hidden sm:max-h-[116px]">
                            <ProjectMarkdown
                                content={project.description}
                                className="text-xs sm:text-[13px] [&_p]:text-gray-500 sm:[&_p]:leading-[1.65] [&_ul]:text-gray-500 [&_ol]:text-gray-500 [&_li]:text-gray-500 [&_h1]:text-gray-300 [&_h2]:text-gray-300 [&_h3]:text-gray-300 [&_strong]:text-gray-300"
                            />
                            {isLongDesc && (
                                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-gray-950 to-transparent sm:from-[#10141d]" />
                            )}
                        </div>
                        {isLongDesc && (
                            <button
                                type="button"
                                onClick={() => setShowDescriptionModal(true)}
                                className="block text-[11px] text-gray-600 hover:text-gray-400 transition-colors sm:text-xs"
                            >
                                Show more
                            </button>
                        )}
                    </div>
                )}

                {/* Tech stack — mobile only */}
                {techStack.length > 0 && (
                    <div className="flex flex-wrap gap-1 items-center sm:order-4 sm:mt-auto sm:gap-2 sm:pt-8">
                        {visibleTech.map(tech => (
                            <span
                                key={tech}
                                className="rounded-full border border-white/[0.07] bg-white/[0.04] px-2 py-px text-[10px] text-gray-500 sm:border-white/[0.12] sm:bg-transparent sm:px-2.5 sm:py-1 sm:text-[11px] sm:font-medium sm:text-gray-300"
                            >
                                {tech}
                            </span>
                        ))}
                        {hiddenCount > 0 && (
                            <button
                                type="button"
                                onClick={() => setShowTechStackModal(true)}
                                className="text-[10px] text-gray-600 hover:text-gray-400 transition-colors sm:text-xs"
                            >
                                +{hiddenCount} more
                            </button>
                        )}
                    </div>
                )}

                {/* Actions — bottom left */}
                <div className="flex items-center gap-3 mt-auto pt-2 flex-wrap sm:hidden">
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
            <div className="order-2 w-full sm:order-1 sm:relative sm:h-[260px] sm:flex-shrink-0 sm:border-b sm:border-white/[0.08] sm:bg-gray-950/45 lg:h-[280px]">
                {project.coverImage && (
                    <Link
                        href={detailHref}
                        className="block h-44 w-full overflow-hidden bg-gray-800/40 sm:h-full"
                    >
                        <Image
                            src={project.coverImage}
                            alt={project.title}
                            width={720}
                            height={480}
                            className="h-full w-full object-cover object-top transition-transform duration-500 sm:group-hover:scale-[1.02]"
                        />
                    </Link>
                )}

                {/* Floating actions — desktop only */}
                <div className="absolute right-4 top-4 z-10 hidden flex-wrap justify-end gap-2 sm:flex">
                    {project.demoUrl && (
                        <Link
                            href={project.demoUrl}
                            target="_blank"
                            rel="noreferrer"
                            onClick={e => e.stopPropagation()}
                            className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-[11px] font-semibold text-gray-950 shadow-lg shadow-black/25 transition hover:bg-gray-200"
                        >
                            <Globe className="h-4 w-4" />
                            Website
                        </Link>
                    )}
                    {project.repoUrl && (
                        <Link
                            href={project.repoUrl}
                            target="_blank"
                            rel="noreferrer"
                            onClick={e => e.stopPropagation()}
                            className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-[11px] font-semibold text-gray-950 shadow-lg shadow-black/25 transition hover:bg-gray-200"
                        >
                            <Github className="h-4 w-4" />
                            Source
                        </Link>
                    )}
                </div>
            </div>

            {showDescriptionModal && project.description && (
                <DescriptionModal
                    title={project.title}
                    description={project.description}
                    onClose={() => setShowDescriptionModal(false)}
                />
            )}

            {showTechStackModal && (
                <TechStackModal
                    title={project.title}
                    techStack={techStack}
                    onClose={() => setShowTechStackModal(false)}
                />
            )}
        </div>
    );
}

export default Project;
