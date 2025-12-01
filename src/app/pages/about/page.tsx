'use client';

import { getMockUser } from './_services';
import AvatarSection from './_components/avatarSection';
import InfoSection from './_components/infoSection';
import SkillsSection from './_components/skillSection';
import ExperienceSection from './_components/experienceSection';
import EducationSection from './_components/educationSection';
import CertificatesSection from './_components/certificateSection';

const AboutPage = () => {
    const user = getMockUser();

    return (
        <div className="px-4 py-10 space-y-12 text-white bg-gradient-to-b from-gray-900 to-gray-800">
            <div className='max-w-5xl mx-auto'>
                <AvatarSection user={user} />
                <InfoSection user={user} />
                <SkillsSection skills={user.skills} interests={user.interests} />
                <ExperienceSection experiences={user.experience} />
                <EducationSection educations={user.education} />
                <CertificatesSection certificates={user.certificates} />
            </div>
        </div>
    );
};

export default AboutPage;
