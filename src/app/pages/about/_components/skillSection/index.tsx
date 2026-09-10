import { SkillGroupType } from "../../_types";

interface Props {
  skills?: string[];
  skillGroups?: SkillGroupType[];
  interests?: string[];
}

export default function SkillsSection({ skills, skillGroups, interests }: Props) {
  // Sebelum kategori diisi, semua skill jatuh ke satu grup tanpa judul
  const groups: SkillGroupType[] =
    skillGroups && skillGroups.length > 0
      ? skillGroups.filter(g => g.skills?.length)
      : skills && skills.length > 0
        ? [{ id: null, name: "", skills }]
        : [];

  return (
    <section className="mt-14 border-t border-white/[0.08] pt-10">
      <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-gray-600">Toolkit</p>
      <h2 className="mt-2 text-xl font-semibold tracking-tight text-white">Skills & interests</h2>

      {groups.length > 0 && (
        <div className="mt-7 space-y-6">
          {groups.map(group => (
            <div key={group.id ?? group.name ?? "uncategorized"}>
              {group.name && (
                <div className="flex items-center gap-3">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500">{group.name}</h3>
                  <span className="h-px flex-1 bg-white/[0.06]" />
                  <span className="text-[10px] tabular-nums text-gray-600">{group.skills.length}</span>
                </div>
              )}
              <div className="mt-3 flex flex-wrap gap-2">
                {group.skills.map(skill => (
                  <span
                    key={skill}
                    className="rounded-full border border-white/[0.10] bg-white/[0.03] px-3 py-1.5 text-xs font-medium text-gray-300"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {interests && interests.length > 0 && (
        <div className="mt-8 border-t border-white/[0.06] pt-7">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500">Interests</h3>
          <div className="mt-3 flex flex-wrap gap-2">
            {interests.map(interest => (
              <span key={interest} className="rounded-full border border-white/[0.08] px-3 py-1.5 text-xs text-gray-500">
                {interest}
              </span>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
