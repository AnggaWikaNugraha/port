import { ProjectType } from '../types';

export async function fetchProjects(): Promise<ProjectType[]> {
    const res = await fetch('/api/public/projects');
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : [];
}
