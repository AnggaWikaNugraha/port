export const runtime = "nodejs";
import { getPublicProjects } from "@/lib/projects";

export async function GET() {
  try {
    const projects = await getPublicProjects();
    return Response.json(projects);
  } catch (err: any) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
