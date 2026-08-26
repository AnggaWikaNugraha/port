"use client";

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
      <div className="min-h-screen bg-gray-950 px-4 py-10 font-sans text-white sm:px-6 sm:py-14">
        <div className="mx-auto max-w-4xl animate-pulse">
          <div className="h-44 rounded-3xl bg-gray-900 sm:h-56" />
          <div className="relative -mt-12 flex flex-col items-center">
            <div className="h-24 w-24 rounded-full border-4 border-gray-950 bg-gray-800 sm:h-28 sm:w-28" />
            <div className="mt-4 h-7 w-52 rounded-full bg-gray-800" />
            <div className="mt-3 h-4 w-40 rounded-full bg-gray-900" />
          </div>

          <div className="mt-14 space-y-10 border-t border-white/[0.08] pt-10">
            <div className="space-y-3">
              <div className="h-5 w-28 rounded-full bg-gray-800" />
              <div className="h-3.5 w-full rounded-full bg-gray-900" />
              <div className="h-3.5 w-11/12 rounded-full bg-gray-900" />
              <div className="h-3.5 w-4/5 rounded-full bg-gray-900" />
            </div>
            {[1, 2, 3].map(i => (
              <div key={i} className="flex gap-4">
                <div className="h-11 w-11 shrink-0 rounded-xl bg-gray-800" />
                <div className="flex-1 space-y-2 py-1">
                  <div className="h-4 w-1/2 rounded-full bg-gray-800" />
                  <div className="h-3 w-1/3 rounded-full bg-gray-900" />
                  <div className="h-3 w-4/5 rounded-full bg-gray-900" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-950 px-4 py-10 font-sans text-white sm:px-6 sm:py-14">
      <div className="mx-auto max-w-4xl">
        <AvatarSection user={user} />
        <InfoSection user={user} />
        <ExperienceSection experiences={user.experience} />
        <EducationSection educations={user.education} />
        <SkillsSection skills={user.skills} interests={user.interests} />
        <CertificatesSection certificates={user.certificates} />
      </div>
    </main>
  );
};

export default AboutPage;
