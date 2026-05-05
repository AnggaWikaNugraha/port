'use client';

import { useEffect, useState } from 'react';
import { fetchProjects } from '../services';
import { ProjectType } from '../types';
import Project from './project';

function SkeletonRow() {
    return (
        <div className="flex gap-4 sm:gap-6 py-6 animate-pulse">
            <div className="flex-1 flex flex-col gap-2">
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
            <div className="flex-shrink-0 w-48 h-32 rounded-xl bg-gray-800/60" />
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
            <div className="divide-y divide-white/[0.05]">
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
        <div className="divide-y divide-white/[0.05]">
            {projects.map(p => <Project key={p.id} project={p} />)}
        </div>
    );
};

export default ProjectsPage;
