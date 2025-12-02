// /app/api/admin/roles/[id]/route.ts
import { NextResponse } from "next/server";

export async function GET(req: Request, context: { params: { id: string } }) {
  const { id } = context.params;

  // Type-safe dictionary
  const fakeRoles: Record<string, string[]> = {
    "1": ["Admin", "Editor"],
    "2": ["Viewer"],
    "3": ["Manager", "Supervisor", "Editor"],
  };

  const roles = fakeRoles[id] || [];

  return NextResponse.json({
    status: "success",
    id,
    roles,
  });
}
