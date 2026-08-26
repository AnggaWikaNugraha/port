'use client';

import { useEffect, useState } from 'react';
import { fetchProjects } from '../services';
import { ProjectType } from '../types';
import Project from './project';

function SkeletonRow() {
    return (
        <div className="animate-pulse overflow-hidden rounded-2xl border border-white/[0.06] bg-gray-900/50 sm:min-h-[580px] lg:min-h-[610px]">
            <div className="h-40 w-full bg-gray-800/60 sm:h-[260px] lg:h-[280px]" />
            <div className="flex flex-1 flex-col gap-2 p-4 sm:p-6">
                <div className="h-3 bg-gray-800/60 rounded-full w-1/3" />
                <div className="h-5 bg-gray-800/60 rounded-full w-4/5" />
                <div className="h-4 bg-gray-800/40 rounded-full w-full" />
                <div className="h-4 bg-gray-800/40 rounded-full w-3/4" />
                <div className="flex gap-1.5 mt-1">
                    <div className="h-4 w-14 bg-gray-800/40 rounded-full" />
                    <div className="h-4 w-12 bg-gray-800/40 rounded-full" />
                    <div className="h-4 w-16 bg-gray-800/40 rounded-full" />
                </div>
            </div>
        </div>
    );
}

const ProjectsPage = () => {
    const [projects, setProjects] = useState<ProjectType[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProjects().then(data => {
            setProjects(data);
            setLoading(false);
        });
    }, []);

    if (loading) {
        return (
            <div className="grid gap-3 sm:grid-cols-2 sm:gap-4">
                {[...Array(3)].map((_, i) => <SkeletonRow key={i} />)}
            </div>
        );
    }

    if (projects.length === 0) {
        return (
            <div className="text-center py-24 text-gray-600">
                <p className="text-5xl mb-4">✦</p>
                <p className="text-lg">No projects yet.</p>
            </div>
        );
    }

    return (
        <div className="grid gap-3 sm:grid-cols-2 sm:items-stretch sm:gap-4">
            {projects.map(p => <Project key={p.id} project={p} />)}
        </div>
    );
};

export default ProjectsPage;
