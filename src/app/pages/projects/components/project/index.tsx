'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ProjectFlowType, ProjectType } from '../../types';

/* ── Lightbox ─────────────────────────────────────────── */
function Lightbox({ src, alt, onClose }: { src: string; alt: string; onClose: () => void }) {
    useEffect(() => {
        const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [onClose]);

    return (
        <div
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={onClose}
        >
            <button className="absolute top-4 right-4 text-white/40 hover:text-white text-xl leading-none">✕</button>
            <div className="relative max-w-5xl w-full max-h-[90vh]" onClick={e => e.stopPropagation()}>
                <img src={src} alt={alt} className="w-full h-full object-contain rounded-xl max-h-[90vh]" />
            </div>
        </div>
    );
}

/* ── Flows Modal ──────────────────────────────────────── */
function FlowsModal({ project, onClose }: { project: ProjectType; onClose: () => void }) {
    const [active, setActive] = useState(0);
    const [zoomedImg, setZoomedImg] = useState<string | null>(null);
    const flows = project.flows ?? [];

    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
            if (e.key === 'ArrowRight') setActive(v => Math.min(v + 1, flows.length - 1));
            if (e.key === 'ArrowLeft') setActive(v => Math.max(v - 1, 0));
        };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [onClose, flows.length]);

    const flow: ProjectFlowType = flows[active];

    return (
        <div
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={onClose}
        >
            <div
                className="relative bg-gray-900 border border-white/10 rounded-2xl w-full max-w-2xl overflow-y-auto max-h-[90vh] shadow-2xl"
                onClick={e => e.stopPropagation()}
            >
                <div className="flex items-center justify-between px-5 pt-5 pb-3">
                    <div>
                        <p className="text-[10px] text-gray-600 uppercase tracking-widest font-medium">{project.title}</p>
                        <h3 className="text-white font-semibold text-base mt-0.5">
                            {flow.title ?? `Step ${active + 1}`}
                        </h3>
                    </div>
                    <button onClick={onClose} className="text-gray-600 hover:text-white text-lg leading-none">✕</button>
                </div>

                {flow.imageUrl && (
                    <div
                        className="relative w-full bg-gray-800 cursor-zoom-in"
                        style={{ aspectRatio: '16/9' }}
                        onClick={() => setZoomedImg(flow.imageUrl!)}
                    >
                        <Image src={flow.imageUrl} alt={flow.title ?? ''} fill className="object-cover" />
                    </div>
                )}

                {flow.description && (
                    <p className="px-5 py-4 text-sm text-gray-500 leading-relaxed">{flow.description}</p>
                )}

                {zoomedImg && (
                    <Lightbox src={zoomedImg} alt={flow.title ?? ''} onClose={() => setZoomedImg(null)} />
                )}

                {flows.length > 1 && (
                    <div className="flex items-center justify-between px-5 pb-5 pt-1">
                        <button
                            onClick={() => setActive(v => Math.max(v - 1, 0))}
                            disabled={active === 0}
                            className="text-xs text-gray-500 hover:text-white disabled:opacity-30 transition-colors"
                        >
                            ← Prev
                        </button>
                        <div className="flex gap-1.5">
                            {flows.map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setActive(i)}
                                    className={`w-1.5 h-1.5 rounded-full transition-colors ${i === active ? 'bg-white' : 'bg-gray-700 hover:bg-gray-500'}`}
                                />
                            ))}
                        </div>
                        <button
                            onClick={() => setActive(v => Math.min(v + 1, flows.length - 1))}
                            disabled={active === flows.length - 1}
                            className="text-xs text-gray-500 hover:text-white disabled:opacity-30 transition-colors"
                        >
                            Next →
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

/* ── Project Row (Medium-style) ───────────────────────── */
function Project({ project }: { project: ProjectType }) {
    const [lightbox, setLightbox] = useState(false);
    const [flowsOpen, setFlowsOpen] = useState(false);
    const [showAllTech, setShowAllTech] = useState(false);
    const [showFullDesc, setShowFullDesc] = useState(false);
    const isLongDesc = (project.description?.length ?? 0) > 120;
    const hasFlows = Array.isArray(project.flows) && project.flows.length > 0;
    const techStack = project.techStack ?? [];
    const visibleTech = showAllTech ? techStack : techStack.slice(0, 3);
    const hiddenCount = techStack.length - 3;

    return (
        <>
            <div className="flex gap-4 sm:gap-8 py-6">

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
                    <h2 className="text-white font-bold text-base sm:text-lg leading-snug line-clamp-2">
                        {project.title}
                    </h2>

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
                                    onClick={() => setShowFullDesc(v => !v)}
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
                                className="text-[11px] text-gray-400 hover:text-white transition-colors"
                            >
                                Demo ↗
                            </Link>
                        )}
                        {project.repoUrl && (
                            <Link
                                href={project.repoUrl}
                                target="_blank"
                                className="text-[11px] text-gray-600 hover:text-gray-300 transition-colors"
                            >
                                Source →
                            </Link>
                        )}
                        {hasFlows && (
                            <button
                                onClick={() => setFlowsOpen(true)}
                                className="text-[11px] text-gray-600 hover:text-gray-300 transition-colors"
                            >
                                {project.flows!.length} steps ▶
                            </button>
                        )}
                    </div>
                </div>

                {/* Right: thumbnail + meta */}
                <div className="flex-shrink-0 w-48 flex flex-col gap-2 self-start mt-5">
                    {project.coverImage && (
                        <div
                            className="w-48 h-32 overflow-hidden cursor-pointer bg-gray-800/40"
                            style={{ borderRadius: '2px' }}
                            onClick={() => setLightbox(true)}
                        >
                            <Image
                                src={project.coverImage}
                                alt={project.title}
                                width={192}
                                height={128}
                                className="w-full h-full object-cover object-top"
                            />
                        </div>
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
                                        onClick={() => setShowAllTech(true)}
                                        className="text-[10px] text-gray-600 hover:text-gray-400 transition-colors"
                                    >
                                        Show +{hiddenCount} more
                                    </button>
                                )}
                                {showAllTech && hiddenCount > 0 && (
                                    <button
                                        onClick={() => setShowAllTech(false)}
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

            {lightbox && project.coverImage && (
                <Lightbox src={project.coverImage} alt={project.title} onClose={() => setLightbox(false)} />
            )}
            {flowsOpen && hasFlows && (
                <FlowsModal project={project} onClose={() => setFlowsOpen(false)} />
            )}
        </>
    );
}

export default Project;
