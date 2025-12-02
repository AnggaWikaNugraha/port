import { formatLongDate } from '@/lib/tgl';
import { ExperienceType } from '../../_types';
import Image from 'next/image';

interface Props {
  experiences?: ExperienceType[];
}

export default function ExperienceSection({ experiences }: Props) {
  if (!experiences?.length) return null;

  return (
    <div className='mt-4'>
      <h2 className="font-semibold text-lg">Experience</h2>
      <div className="space-y-6">
        {experiences.map(exp => (
          <div key={exp.id} className="space-y-2">
            <div className="flex items-center gap-3">
              {exp.companyLogoUrl && (
                <Image src={exp.companyLogoUrl} alt={''} width={32} height={32} className="rounded" />
              )}
              <div>
                <p className="font-medium">{exp.company}</p>
                {exp.location && <p className="text-sm text-gray-400">{exp.location}</p>}
              </div>
            </div>
            <div className="ml-10 space-y-2">
              {exp.roles.map(role => (
                <div key={role.id} className="text-sm">
                  <p className="font-semibold text-gray-200">{role.title} ({role.employmentType})</p>
                  <p className="text-gray-400">{role.startDate ? formatLongDate(role?.startDate) : '-'} - {role.endDate ? formatLongDate(role.endDate) : 'Present' || 'Present'} ({role.duration})</p>
                  {role.description && <p className="text-gray-300 mt-1">{role.description}</p>}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}