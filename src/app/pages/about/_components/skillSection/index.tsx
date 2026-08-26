interface Props {
    skills?: string[];
    interests?: string[];
  }
  
  export default function SkillsSection({ skills, interests }: Props) {
    return (
      <section className="mt-14 border-t border-white/[0.08] pt-10">
        <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-gray-600">Toolkit</p>
        <h2 className="mt-2 text-xl font-semibold tracking-tight text-white">Skills & interests</h2>

        {skills && skills.length > 0 && (
          <div className="mt-7">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500">Skills</h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {skills.map(skill => (
                <span key={skill} className="rounded-full border border-white/[0.10] bg-white/[0.03] px-3 py-1.5 text-xs font-medium text-gray-300">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}
        {interests && interests.length > 0 && (
          <div className="mt-7">
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
