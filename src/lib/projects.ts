import 'server-only';

import { ProjectFlowType, ProjectSkillGroupType, ProjectType } from '@/app/pages/projects/types';
import { db } from '@/lib/db';

type ProjectRow = Omit<ProjectType, 'flows' | 'techStack' | 'skillGroups'>;

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

/**
 * Skill tiap project diambil dari master user_skills lewat tabel project_skills,
 * lalu dikelompokkan mengikuti urutan kategori di halaman About.
 */
async function getProjectSkills(projectIds: string[]) {
    const map = new Map<string, { groups: ProjectSkillGroupType[]; flat: string[] }>();
    for (const id of projectIds) map.set(id, { groups: [], flat: [] });

    if (projectIds.length === 0) return map;

    const [rows]: any = await db.query(
        `
          SELECT
            ps.project_id AS projectId,
            s.skill,
            s.category_id AS categoryId,
            c.name AS categoryName
          FROM project_skills ps
          JOIN user_skills s ON s.id = ps.skill_id
          LEFT JOIN skill_categories c ON c.id = s.category_id
          WHERE ps.project_id IN (?)
          ORDER BY c.sort_order IS NULL, c.sort_order ASC, c.id ASC, ps.sort_order ASC, ps.id ASC
        `,
        [projectIds]
    );

    for (const row of rows) {
        const entry = map.get(row.projectId);
        if (!entry) continue;

        entry.flat.push(row.skill);

        const id = row.categoryId ?? null;
        let group = entry.groups.find(g => g.id === id);
        if (!group) {
            group = { id, name: row.categoryName || 'Other', skills: [] };
            entry.groups.push(group);
        }
        group.skills.push(row.skill);
    }

    return map;
}

const PROJECT_COLUMNS = `
  id, title, description, role, company,
  year, status, featured, is_private AS isPrivate,
  demo_url AS demoUrl, repo_url AS repoUrl, cover_image AS coverImage,
  created_at AS createdAt, updated_at AS updatedAt
`;

export async function getPublicProjects(): Promise<ProjectType[]> {
    const [rows]: any = await db.query(
        `
          SELECT ${PROJECT_COLUMNS}
          FROM projects
          WHERE user_id = 1 AND is_private = 0
          ORDER BY sort_order ASC, created_at DESC
        `
    );

    const skillMap = await getProjectSkills(rows.map((row: ProjectRow) => row.id));

    return Promise.all(
        rows.map(async (row: ProjectRow) => {
            const skills = skillMap.get(row.id);
            return {
                ...row,
                techStack: skills?.flat ?? [],
                skillGroups: skills?.groups ?? [],
                flows: await getProjectFlows(row.id),
            } as ProjectType;
        })
    );
}

export async function getPublicProjectById(id: string): Promise<ProjectType | null> {
    const [rows]: any = await db.query(
        `
          SELECT ${PROJECT_COLUMNS}
          FROM projects
          WHERE user_id = 1 AND is_private = 0 AND id = ?
          LIMIT 1
        `,
        [id]
    );

    if (!Array.isArray(rows) || rows.length === 0) {
        return null;
    }

    const row: ProjectRow = rows[0];
    const skills = (await getProjectSkills([row.id])).get(row.id);

    return {
        ...row,
        techStack: skills?.flat ?? [],
        skillGroups: skills?.groups ?? [],
        flows: await getProjectFlows(row.id),
    } as ProjectType;
}
