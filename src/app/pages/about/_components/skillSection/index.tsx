interface Props {
    skills?: string[];
    interests?: string[];
  }
  
  export default function SkillsSection({ skills, interests }: Props) {
    return (
      <div className="mt-4">
        {skills && skills.length > 0 && (
          <div className="mb-4">
            <h2 className="font-semibold text-lg">Skills</h2>
            <div className="flex flex-wrap gap-2">
              {skills.map(skill => (
                <span key={skill} className="bg-gray-800 text-gray-200 text-sm px-3 py-1 rounded-full">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}
        {interests && interests.length > 0 && (
          <div>
            <h2 className="font-semibold text-lg">Interests</h2>
            <div className="flex flex-wrap gap-2">
              {interests.map(interest => (
                <span key={interest} className="bg-gray-800 text-gray-200 text-sm px-3 py-1 rounded-full">
                  {interest}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }