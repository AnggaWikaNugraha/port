export interface ProjectSkillGroupType {
    id: number | null; // null = skill tanpa kategori
    name: string;
    skills: string[];
}

/** Card ringkas untuk section "Project types" di halaman About. */
export interface ProjectCardType {
    id: string;
    title: string;
    coverImage?: string | null;
    stack: string[]; // label arsitektur (MERN, MEVN, Laravue, ...)
}

export interface ProjectCategoryGroupType {
    id: number;
    name: string;
    projects: ProjectCardType[];
}

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
    categoryId?: number | null; // null = tidak muncul di section "Project types"
    categoryName?: string | null;
    techStack?: string[];       // nama skill, hasil flatten dari skillGroups
    skillGroups?: ProjectSkillGroupType[];
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
