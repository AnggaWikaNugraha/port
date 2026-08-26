import { EducationType } from '../../_types';

interface Props {
  educations?: EducationType[];
}

export default function EducationSection({ educations }: Props) {
  if (!educations?.length) return null;

  return (
    <section className="mt-14 border-t border-white/[0.08] pt-10">
      <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-gray-600">Background</p>
      <h2 className="mt-2 text-xl font-semibold tracking-tight text-white">Education</h2>
      <ul className="mt-7 grid gap-3 sm:grid-cols-2">
        {educations.map(edu => (
          <li key={edu.id} className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-5">
            <p className="text-sm font-semibold leading-6 text-gray-200">{edu.school}</p>
            <p className="mt-1 text-sm text-gray-400">{edu.degree} · {edu.fieldOfStudy}</p>
            <p className="mt-3 text-xs tabular-nums text-gray-600">{edu.startYear} — {edu.endYear || 'Present'}</p>
            {edu.description && <p className="mt-4 text-sm leading-6 text-gray-500">{edu.description}</p>}
          </li>
        ))}
      </ul>
    </section>
  );
}
