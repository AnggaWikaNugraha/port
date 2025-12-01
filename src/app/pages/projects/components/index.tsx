'use client';

import { mockProjects } from '../services';
import Image from 'next/image';
import Link from 'next/link';
import { Fragment, useEffect, useMemo, useState } from 'react';
import Project from './project';

const ProjectsPage = () => {

    const [loading, setLoading] = useState(true);
    const [mockProjects, setMockProjects] = useState([]); // Use state for mockProjects


    // Simulate data fetching
    useEffect(() => {
        setTimeout(() => {
            setMockProjects(mockProjects); // Simulate fetched data
            setLoading(false);
        }, 2000); // Simulate 2 seconds loading
    }, []);

    const content = useMemo(() => {
        if (loading) {
            return <p className='text-center text-white'>Loading...</p>;
        }

        if (mockProjects.length === 0) {
            return <p className='text-center text-white'>No projects available.</p>;
        }

        return mockProjects.map((project, id) => (
            <Fragment key={id}>
                <Project project={project} />
            </Fragment>
        ))
    }, [loading, mockProjects]);

    return (
        <div className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
                {content}
            </div>
        </div>
    );
};

export default ProjectsPage;