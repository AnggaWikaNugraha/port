export interface UserType {
    id: string;
    name: string;
    username: string;
    bio?: string;
    email?: string;
    phone?: string;
    location?: string;
    avatarUrl?: string;

    jobTitle?: string;
    company?: string;
    website?: string;

    social?: {
        github?: string;
        linkedin?: string;
        twitter?: string;
        instagram?: string;
        website?: string;
    };

    skills?: string[];
    interests?: string[];

    experience?: ExperienceType[];
    education?: EducationType[];
    certificates?: CertificateType[];

    createdAt: string;
    updatedAt?: string;
}

export interface ExperienceType {
    id: string;
    company: string;
    companyLogoUrl?: string;
    location?: string;
    roles: RoleType[]; // <= satu posisi pun tetap dimasukkan ke sini
}

export interface RoleType {
    id: string;
    title: string;
    employmentType: 'Fulltime' | 'Contract' | 'Internship' | 'Freelance';
    startDate: string;
    endDate?: string;
    duration?: string;
    description?: string;
    skills?: string[];
    productLink?: string;
    productTitle?: string;
}

export interface EducationType {
    id: string;
    school: string;
    degree: string; // e.g., S1, D3, etc
    fieldOfStudy: string;
    startYear: number;
    endYear?: number;
    description?: string;
}

export interface CertificateType {
    id: string;
    title: string;
    issuer: string;
    issueDate: string; // ISO
    expirationDate?: string;
    credentialUrl?: string;
}