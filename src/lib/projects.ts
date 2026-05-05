import 'server-only';

import { ProjectFlowType, ProjectType } from '@/app/pages/projects/types';
import { db } from '@/lib/db';

type ProjectRow = Omit<ProjectType, 'flows' | 'techStack'> & {
    techStack: string | null;
};

async function getProjectFlows(projectId: string): Promise<ProjectFlowType[]> {
    const [flows]: any = await db.query(
        `
          SELECT id, project_id AS projectId, title, description, image_url AS imageUrl, sort_order AS sortOrder
          FROM project_flows
          WHERE project_id = ?
          ORDER BY sort_order ASC
        `,
        [projectId]
    );

    return flows;
}

function normalizeProject(row: ProjectRow): ProjectType {
    return {
        ...row,
        techStack: row.techStack ? JSON.parse(row.techStack) : [],
    };
}

export async function getPublicProjects(): Promise<ProjectType[]> {
    const [rows]: any = await db.query(
        `
          SELECT id, title, description, role, company, tech_stack AS techStack,
                 year, status, featured, is_private AS isPrivate,
                 demo_url AS demoUrl, repo_url AS repoUrl, cover_image AS coverImage,
                 created_at AS createdAt, updated_at AS updatedAt
          FROM projects
          WHERE user_id = 1 AND is_private = 0
          ORDER BY sort_order ASC, created_at DESC
        `
    );

    return Promise.all(
        rows.map(async (row: ProjectRow) => {
            const project = normalizeProject(row);
            project.flows = await getProjectFlows(project.id);
            return project;
        })
    );
}

export async function getPublicProjectById(id: string): Promise<ProjectType | null> {
    const [rows]: any = await db.query(
        `
          SELECT id, title, description, role, company, tech_stack AS techStack,
                 year, status, featured, is_private AS isPrivate,
                 demo_url AS demoUrl, repo_url AS repoUrl, cover_image AS coverImage,
                 created_at AS createdAt, updated_at AS updatedAt
          FROM projects
          WHERE user_id = 1 AND is_private = 0 AND id = ?
          LIMIT 1
        `,
        [id]
    );

    if (!Array.isArray(rows) || rows.length === 0) {
        return null;
    }

    const project = normalizeProject(rows[0]);
    project.flows = await getProjectFlows(project.id);

    return project;
}
