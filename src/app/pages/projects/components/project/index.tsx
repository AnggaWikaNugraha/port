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
            <button className="absolute top-4 right-4 text-white/60 hover:text-white text-2xl leading-none">✕</button>
            <div className="relative max-w-5xl w-full max-h-[90vh]" onClick={e => e.stopPropagation()}>
                <img src={src} alt={alt} className="w-full h-full object-contain rounded-2xl max-h-[90vh]" />
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
                className="relative bg-gray-900 border border-white/10 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl"
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 pt-5 pb-3">
                    <div>
                        <p className="text-xs text-gray-500 uppercase tracking-widest font-medium">{project.title}</p>
                        <h3 className="text-white font-semibold text-lg mt-0.5">
                            {flow.title ?? `Step ${active + 1}`}
                        </h3>
                    </div>
                    <button onClick={onClose} className="text-gray-500 hover:text-white text-xl leading-none">✕</button>
                </div>

                {/* Image */}
                {flow.imageUrl && (
                    <div
                        className="relative w-full bg-gray-800 cursor-zoom-in"
                        style={{ aspectRatio: '16/9' }}
                        onClick={() => setZoomedImg(flow.imageUrl!)}
                    >
                        <Image src={flow.imageUrl} alt={flow.title ?? ''} fill className="object-cover" />
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity bg-black/20">
                            <span className="bg-black/50 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-full">Click to expand</span>
                        </div>
                    </div>
                )}

                {/* Description */}
                {flow.description && (
                    <p className="px-6 py-4 text-sm text-gray-400 leading-relaxed">{flow.description}</p>
                )}

                {zoomedImg && (
                    <Lightbox src={zoomedImg} alt={flow.title ?? ''} onClose={() => setZoomedImg(null)} />
                )}

                {/* Navigation */}
                {flows.length > 1 && (
                    <div className="flex items-center justify-between px-6 pb-5 pt-1">
                        <button
                            onClick={() => setActive(v => Math.max(v - 1, 0))}
                            disabled={active === 0}
                            className="text-sm text-gray-400 hover:text-white disabled:opacity-30 transition-colors"
                        >
                            ← Prev
                        </button>
                        <div className="flex gap-1.5">
                            {flows.map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setActive(i)}
                                    className={`w-2 h-2 rounded-full transition-colors ${i === active ? 'bg-white' : 'bg-gray-600 hover:bg-gray-400'}`}
                                />
                            ))}
                        </div>
                        <button
                            onClick={() => setActive(v => Math.min(v + 1, flows.length - 1))}
                            disabled={active === flows.length - 1}
                            className="text-sm text-gray-400 hover:text-white disabled:opacity-30 transition-colors"
                        >
                            Next →
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

/* ── Project Card ─────────────────────────────────────── */
function Project({ project }: { project: ProjectType }) {
    const [lightbox, setLightbox] = useState(false);
    const [flowsOpen, setFlowsOpen] = useState(false);
    const [expandDesc, setExpandDesc] = useState(false);
    const hasFlows = Array.isArray(project.flows) && project.flows.length > 0;
    const isLongDesc = (project.description?.length ?? 0) > 100;

    return (
        <>
            <div className="group flex flex-col rounded-3xl overflow-hidden bg-gray-900 border border-white/5 hover:border-white/10 transition-all duration-300">
                {/* Image */}
                <div
                    className="relative overflow-hidden cursor-zoom-in"
                    style={{ aspectRatio: '4/3' }}
                    onClick={() => project.coverImage && setLightbox(true)}
                >
                    {project.coverImage ? (
                        <>
                            <Image
                                src={project.coverImage}
                                alt={project.title}
                                fill
                                className="object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent" />
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <span className="bg-black/50 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-full">
                                    Click to expand
                                </span>
                            </div>
                        </>
                    ) : (
                        <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                            <span className="text-gray-600 text-4xl">✦</span>
                        </div>
                    )}

                    <div className="absolute top-4 left-4 flex gap-2">
                        {project.featured && (
                            <span className="text-xs bg-white text-gray-900 font-semibold px-2.5 py-1 rounded-full">
                                Featured
                            </span>
                        )}
                        {project.status === 'in-progress' && (
                            <span className="text-xs bg-yellow-400/90 text-gray-900 font-semibold px-2.5 py-1 rounded-full">
                                In Progress
                            </span>
                        )}
                    </div>

                    {project.year && (
                        <span className="absolute top-4 right-4 text-xs text-white/60 bg-black/40 backdrop-blur-sm px-2.5 py-1 rounded-full">
                            {project.year}
                        </span>
                    )}
                </div>

                {/* Content */}
                <div className="flex flex-col flex-1 p-5 gap-3">
                    <div>
                        <h2 className="text-white font-semibold text-lg leading-snug">{project.title}</h2>
                        {(project.role || project.company) && (
                            <p className="text-gray-500 text-sm mt-0.5">
                                {[project.role, project.company].filter(Boolean).join(' · ')}
                            </p>
                        )}
                    </div>

                    {project.description && (
                        <div>
                            <p className={`text-gray-400 text-sm leading-relaxed ${!expandDesc && isLongDesc ? 'line-clamp-2' : ''}`}>
                                {project.description}
                            </p>
                            {isLongDesc && (
                                <button
                                    onClick={() => setExpandDesc(v => !v)}
                                    className="text-xs text-gray-500 hover:text-gray-300 mt-1 transition-colors"
                                >
                                    {expandDesc ? 'Show less ▲' : 'Show more ▼'}
                                </button>
                            )}
                        </div>
                    )}

                    {Array.isArray(project.techStack) && project.techStack.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                            {project.techStack.map(tech => (
                                <span key={tech} className="text-xs text-gray-400 bg-white/5 border border-white/10 px-2 py-0.5 rounded-full">
                                    {tech}
                                </span>
                            ))}
                        </div>
                    )}

                    <div className="flex items-center gap-3 mt-auto pt-1 flex-wrap">
                        {project.demoUrl && (
                            <Link href={project.demoUrl} target="_blank"
                                className="text-sm font-medium text-white bg-white/10 hover:bg-white/20 px-4 py-1.5 rounded-full transition-colors">
                                Live Demo
                            </Link>
                        )}
                        {project.repoUrl && (
                            <Link href={project.repoUrl} target="_blank"
                                className="text-sm text-gray-400 hover:text-white transition-colors">
                                Source →
                            </Link>
                        )}
                        {hasFlows && (
                            <button
                                onClick={() => setFlowsOpen(true)}
                                className="ml-auto text-xs text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 px-3 py-1.5 rounded-full transition-colors"
                            >
                                View {project.flows!.length} step{project.flows!.length > 1 ? 's' : ''} ▶
                            </button>
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
