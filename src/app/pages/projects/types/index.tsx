export interface ProjectFlowType {
    id: string;
    projectId?: string;
    title?: string;
    description?: string;
    imageUrl?: string;
    sortOrder?: number;
}

export interface ProjectType {
    id: string;
    title: string;
    description?: string;
    role?: string;
    company?: string;
    techStack?: string[];
    year?: string;
    status?: 'completed' | 'in-progress' | 'archived';
    featured?: boolean;
    isPrivate?: boolean;
    demoUrl?: string;
    repoUrl?: string;
    coverImage?: string;
    flows?: ProjectFlowType[];
    createdAt: string;
    updatedAt?: string;
}
