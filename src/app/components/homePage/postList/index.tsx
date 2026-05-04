'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface Project {
    id: string;
    title: string;
    description?: string;
    role?: string;
    company?: string;
    year?: string;
    coverImage?: string;
    techStack?: string[];
    featured?: boolean;
    demoUrl?: string;
    repoUrl?: string;
}

const PostList = () => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/public/projects')
            .then(r => r.json())
            .then(data => {
                setProjects(Array.isArray(data) ? data.slice(0, 3) : []);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    return (
        <div className="mt-12 space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">Projects</h3>
                <Link href="/pages/projects" className="text-xs text-gray-400 hover:text-white transition-colors">
                    View all →
                </Link>
            </div>

            {loading ? (
                <div className="space-y-3">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="flex gap-3 items-center border border-gray-800 rounded-2xl p-3 animate-pulse">
                            <div className="w-16 h-16 rounded-xl bg-gray-800 shrink-0" />
                            <div className="flex-1 space-y-2">
                                <div className="h-4 bg-gray-800 rounded w-2/3" />
                                <div className="h-3 bg-gray-800 rounded w-1/2" />
                            </div>
                        </div>
                    ))}
                </div>
            ) : projects.length === 0 ? (
                <p className="text-gray-500 text-sm text-center py-6">No projects yet.</p>
            ) : (
                <div className="space-y-3">
                    {projects.map(p => (
                        <div key={p.id} className="flex gap-3 items-center border border-gray-700/50 rounded-2xl p-3 hover:bg-gray-800/40 transition-colors">
                            {p.coverImage ? (
                                <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0 bg-gray-800">
                                    <Image src={p.coverImage} alt={p.title} fill className="object-cover" />
                                </div>
                            ) : (
                                <div className="w-16 h-16 rounded-xl bg-gray-800 shrink-0 flex items-center justify-center text-gray-600 text-xl">✦</div>
                            )}
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-white truncate">{p.title}</p>
                                <p className="text-xs text-gray-500 mt-0.5">
                                    {[p.role, p.company, p.year].filter(Boolean).join(' · ')}
                                </p>
                                {Array.isArray(p.techStack) && p.techStack.length > 0 && (
                                    <div className="flex gap-1 mt-1.5 flex-wrap">
                                        {p.techStack.slice(0, 3).map(t => (
                                            <span key={t} className="text-xs text-gray-500 bg-gray-800 px-1.5 py-0.5 rounded-md">{t}</span>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <div className="flex flex-col gap-1.5 shrink-0">
                                {p.demoUrl && (
                                    <a href={p.demoUrl} target="_blank" rel="noreferrer" className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors">
                                        Demo →
                                    </a>
                                )}
                                {p.repoUrl && (
                                    <a href={p.repoUrl} target="_blank" rel="noreferrer" className="text-xs text-gray-500 hover:text-gray-300 transition-colors">
                                        Code
                                    </a>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default PostList;
