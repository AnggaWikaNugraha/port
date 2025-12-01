export interface ProjectType {
    id: string;
    title: string;
    description: string;
    ownerId: string;
  
    role?: string;
    company?: string;
    techStack?: string[];
    year?: string;
    isPrivate?: boolean;
    demoUrl?: string;
    repoUrl?: string;
    coverImage?: string;
    createdAt: string;
    updatedAt?: string;
  }