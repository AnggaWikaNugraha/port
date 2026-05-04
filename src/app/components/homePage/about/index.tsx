"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const AboutSection = () => {
  const [jobTitle, setJobTitle] = useState("");
  const [bio, setBio] = useState("");

  useEffect(() => {
    fetch("/api/public/about")
      .then((r) => r.json())
      .then((data) => {
        setJobTitle(data.job_title || "");
        setBio(data.bio || "");
      });
  }, []);

  return (
    <div className="text-center mt-6">
      {jobTitle && <h2 className="text-lg font-semibold">{jobTitle}</h2>}
      {bio && (
        <p className="text-sm text-gray-400 mt-2 max-w-2xl mx-auto">{bio}</p>
      )}
      <Link href="/pages/about">
        <button className="mt-4 px-4 py-2 text-sm border border-gray-600 rounded hover:bg-gray-800">
          More about me →
        </button>
      </Link>
    </div>
  );
};

export default AboutSection;
