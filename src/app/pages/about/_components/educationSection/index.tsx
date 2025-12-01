import { EducationType } from '../../_types';

interface Props {
  educations?: EducationType[];
}

export default function EducationSection({ educations }: Props) {
  if (!educations?.length) return null;

  return (
    <div className='mt-4'>
      <h2 className="font-semibold text-lg">Education</h2>
      <ul className="space-y-4">
        {educations.map(edu => (
          <li key={edu.id}>
            <p className="font-medium text-gray-200">{edu.school} ({edu.degree})</p>
            <p className="text-sm text-gray-400">{edu.fieldOfStudy}</p>
            <p className="text-sm text-gray-500">{edu.startYear} - {edu.endYear || 'Present'}</p>
            {edu.description && <p className="text-gray-300 text-sm mt-1">{edu.description}</p>}
          </li>
        ))}
      </ul>
    </div>
  );
}