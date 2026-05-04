'use client';

import { useEffect, useState } from 'react';
import { fetchProjects } from '../services';
import { ProjectType } from '../types';
import Project from './project';

function SkeletonCard() {
    return (
        <div className="rounded-3xl overflow-hidden bg-gray-900 border border-white/5 animate-pulse">
            <div className="bg-gray-800" style={{ aspectRatio: '4/3' }} />
            <div className="p-5 space-y-3">
                <div className="h-5 bg-gray-800 rounded-full w-2/3" />
                <div className="h-3 bg-gray-800 rounded-full w-full" />
                <div className="h-3 bg-gray-800 rounded-full w-4/5" />
                <div className="flex gap-2 pt-1">
                    <div className="h-6 w-20 bg-gray-800 rounded-full" />
                    <div className="h-6 w-16 bg-gray-800 rounded-full" />
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
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {[...Array(3)].map((_, i) => <SkeletonCard key={i} />)}
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
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map(p => <Project key={p.id} project={p} />)}
        </div>
    );
};

export default ProjectsPage;
