'use client';

import { useEffect, useRef, useState } from 'react';
import { fetchProjects } from '../services';
import { ProjectType } from '../types';
import Project from './project';

function SkeletonCard() {
    return (
        <div className="flex-shrink-0 w-[260px] rounded-2xl overflow-hidden bg-gray-900/40 border border-white/[0.07] animate-pulse snap-start">
            <div className="bg-gray-800/60" style={{ aspectRatio: '3/4' }} />
            <div className="px-4 py-3 space-y-2">
                <div className="h-4 bg-gray-800/60 rounded-full w-3/4" />
                <div className="h-3 bg-gray-800/40 rounded-full w-1/2" />
                <div className="flex gap-1.5 pt-1">
                    <div className="h-3 w-12 bg-gray-800/40 rounded-full" />
                    <div className="h-3 w-10 bg-gray-800/40 rounded-full" />
                </div>
            </div>
        </div>
    );
}

const ProjectsPage = () => {
    const [projects, setProjects] = useState<ProjectType[]>([]);
    const [loading, setLoading] = useState(true);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        fetchProjects().then(data => {
            setProjects(data);
            setLoading(false);
        });
    }, []);

    const scroll = (dir: 'left' | 'right') => {
        if (!scrollRef.current) return;
        scrollRef.current.scrollBy({ left: dir === 'right' ? 280 : -280, behavior: 'smooth' });
    };

    if (!loading && projects.length === 0) {
        return (
            <div className="text-center py-24 text-gray-600">
                <p className="text-5xl mb-4">✦</p>
                <p className="text-lg">No projects yet.</p>
            </div>
        );
    }

    return (
        <div className="relative">
            {/* Nav buttons */}
            <div className="absolute -top-11 right-0 flex gap-2 z-10">
                <button
                    onClick={() => scroll('left')}
                    className="w-8 h-8 rounded-full bg-white/5 border border-white/[0.08] hover:bg-white/10 flex items-center justify-center text-gray-500 hover:text-white transition-colors text-xs"
                >
                    ←
                </button>
                <button
                    onClick={() => scroll('right')}
                    className="w-8 h-8 rounded-full bg-white/5 border border-white/[0.08] hover:bg-white/10 flex items-center justify-center text-gray-500 hover:text-white transition-colors text-xs"
                >
                    →
                </button>
            </div>

            {/* Scrollable strip */}
            <div
                ref={scrollRef}
                className="flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                style={{ justifyContent: 'safe center' }}
            >
                {loading
                    ? [...Array(4)].map((_, i) => <SkeletonCard key={i} />)
                    : projects.map(p => <Project key={p.id} project={p} />)
                }
                <div className="flex-shrink-0 w-4" />
            </div>
        </div>
    );
};

export default ProjectsPage;
