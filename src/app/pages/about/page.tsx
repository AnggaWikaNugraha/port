"use client";

import { getMockUser } from "./_services";
import AvatarSection from "./_components/avatarSection";
import InfoSection from "./_components/infoSection";
import SkillsSection from "./_components/skillSection";
import ExperienceSection from "./_components/experienceSection";
import EducationSection from "./_components/educationSection";
import CertificatesSection from "./_components/certificateSection";
import { useEffect, useState } from "react";

const AboutPage = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/public/about")
      .then((res) => res.json())
      .then((data) => {
        setUser(data);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="px-4 py-10 space-y-12 text-white bg-gradient-to-b from-gray-900 to-gray-800 h-[100vh]">
        <div className="px-4 py-10 text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="px-4 py-10 space-y-12 text-white bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="max-w-5xl mx-auto">
        <AvatarSection user={user} />
        <InfoSection user={user} />
        <ExperienceSection experiences={user.experience} />
        <EducationSection educations={user.education} />
        <SkillsSection skills={user.skills} interests={user.interests} />
        <CertificatesSection certificates={user.certificates} />
      </div>
    </div>
  );
};

export default AboutPage;
