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
        setUser({
          ...data,
          avatarUrl: data.avatar_url,
          jobTitle: data.job_title,
        });
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="px-4 py-10 text-white">
        <div className="max-w-5xl mx-auto space-y-8 animate-pulse">

          {/* Avatar skeleton */}
          <div className="flex items-center gap-6 p-4 bg-gray-800 rounded-xl">
            <div className="w-20 h-20 rounded-full bg-gray-700 shrink-0" />
            <div className="space-y-2 flex-1">
              <div className="h-5 bg-gray-700 rounded-lg w-48" />
              <div className="h-4 bg-gray-700 rounded-lg w-32" />
              <div className="h-4 bg-gray-700 rounded-lg w-56" />
            </div>
          </div>

          {/* Bio skeleton */}
          <div className="space-y-2">
            <div className="h-4 bg-gray-700 rounded-lg w-full" />
            <div className="h-4 bg-gray-700 rounded-lg w-5/6" />
            <div className="h-4 bg-gray-700 rounded-lg w-4/6" />
          </div>

          {/* Info skeleton */}
          <div className="space-y-3">
            {[1,2,3,4].map(i => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-5 h-5 bg-gray-700 rounded" />
                <div className="h-4 bg-gray-700 rounded-lg w-40" />
              </div>
            ))}
          </div>

          {/* Experience skeleton */}
          <div className="space-y-4">
            <div className="h-5 bg-gray-700 rounded-lg w-32" />
            {[1,2].map(i => (
              <div key={i} className="flex gap-4">
                <div className="w-12 h-12 rounded-lg bg-gray-700 shrink-0" />
                <div className="space-y-2 flex-1">
                  <div className="h-4 bg-gray-700 rounded-lg w-56" />
                  <div className="h-3 bg-gray-700 rounded-lg w-32" />
                  <div className="h-3 bg-gray-700 rounded-lg w-44" />
                </div>
              </div>
            ))}
          </div>

          {/* Skills skeleton */}
          <div className="space-y-3">
            <div className="h-5 bg-gray-700 rounded-lg w-24" />
            <div className="flex flex-wrap gap-2">
              {[1,2,3,4,5,6,7].map(i => (
                <div key={i} className="h-7 bg-gray-700 rounded-full" style={{ width: `${60 + i * 15}px` }} />
              ))}
            </div>
          </div>

        </div>
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
