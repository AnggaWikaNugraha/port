import { formatLongDate } from '@/lib/tgl';
import { ExperienceType } from '../../_types';
import Image from 'next/image';
import { ExternalLink } from 'lucide-react';

interface Props {
  experiences?: ExperienceType[];
}

export default function ExperienceSection({ experiences }: Props) {
  if (!experiences?.length) return null;

  return (
    <section className="mt-14 border-t border-white/[0.08] pt-10">
      <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-gray-600">Career</p>
      <h2 className="mt-2 text-xl font-semibold tracking-tight text-white">Experience</h2>

      <div className="mt-7 space-y-10">
        {experiences.map(exp => (
          <article key={exp.id} className="grid gap-5 sm:grid-cols-[180px_1fr] sm:gap-8">
            <div className="flex items-start gap-3">
              {exp.companyLogoUrl ? (
                <Image src={exp.companyLogoUrl} alt={`${exp.company} logo`} width={40} height={40} className="h-10 w-10 rounded-lg bg-white object-contain p-1" />
              ) : (
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-gray-800 text-sm font-semibold text-gray-400">{exp.company[0]}</div>
              )}
              <div className="min-w-0 pt-0.5">
                <h3 className="text-sm font-semibold leading-5 text-gray-200">{exp.company}</h3>
                {exp.location && <p className="mt-1 text-xs text-gray-600">{exp.location}</p>}
              </div>
            </div>

            <div className="relative space-y-7 border-l border-white/[0.08] pl-5">
              {exp.roles.map(role => (
                <div key={role.id} className="relative">
                  <span className="absolute -left-[23px] top-1.5 h-1.5 w-1.5 rounded-full bg-gray-500 ring-4 ring-gray-950" />
                  <div className="flex flex-wrap items-center gap-2">
                    <h4 className="text-sm font-semibold text-gray-200">{role.title}</h4>
                    <span className="rounded-full border border-white/[0.08] px-2 py-0.5 text-[10px] text-gray-500">{role.employmentType}</span>
                  </div>
                  <p className="mt-1.5 text-xs tabular-nums text-gray-600">
                    {role.startDate ? formatLongDate(role.startDate) : '-'} — {role.endDate ? formatLongDate(role.endDate) : 'Present'}
                  </p>
                  {role.description && <p className="mt-3 text-sm leading-6 text-gray-400">{role.description}</p>}
                  {role.skills && role.skills.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {role.skills.map(skill => <span key={skill} className="text-[11px] text-gray-600">#{skill.replace(/\s+/g, '')}</span>)}
                    </div>
                  )}
                  {role.productLink && (
                    <a href={role.productLink} target="_blank" rel="noreferrer" className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-gray-400 transition hover:text-white">
                      {role.productTitle || 'View product'} <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </div>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
