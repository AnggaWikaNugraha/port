"use client";

import { useState, useEffect } from "react";

export default function AdminProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [skills, setSkills] = useState<any[]>([]);
  const [newSkill, setNewSkill] = useState("");
  const [loading, setLoading] = useState(true);

  // FETCH USER + SKILLS
  useEffect(() => {
    Promise.all([
      fetch("/api/profile").then((res) => res.json()),
      fetch("/api/admin/skills").then((res) => res.json()),
    ]).then(([userData, skillData]) => {
      setUser(userData);
      setSkills(skillData);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-500">
        Loading...
      </div>
    );
  }

  // SAVE PROFILE
  const saveProfile = async () => {
    const res = await fetch("/api/profile/update", {
      method: "POST",
      body: JSON.stringify(user),
    });

    if (res.ok) {
      alert("Profile updated!");
    } else {
      alert("Failed updating profile!");
    }
  };

  // ADD SKILL
  const addSkill = async () => {
      if (!newSkill.trim()) return;
    
      await fetch("/api/admin/skills/create", {
        method: "POST",
        body: JSON.stringify({ skill: newSkill }),
      });
    
      setNewSkill("");
    
      // REFRESH from DB
      const updated = await fetch("/api/admin/skills").then(r => r.json());
      setSkills(updated);
    };
    

  // DELETE SKILL
  const deleteSkill = async (id: string) => {
    const res = await fetch("/api/admin/skills/delete", {
      method: "POST",
      body: JSON.stringify({ id }),
    });

    if (res.ok) {
      setSkills(skills.filter((s) => s.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-sm p-6 md:p-10 border border-gray-200">
        <h1 className="text-3xl font-bold mb-8 text-gray-900">Edit Profile</h1>

        {/* PROFILE FIELDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input label="Name" value={user.name} onChange={(e: any) => setUser({ ...user, name: e.target.value })} />
          <Input label="Username" value={user.username} onChange={(e: any) => setUser({ ...user, username: e.target.value })} />

          <Input label="Email" value={user.email} onChange={(e: any) => setUser({ ...user, email: e.target.value })} />
          <Input label="Phone" value={user.phone} onChange={(e: any) => setUser({ ...user, phone: e.target.value })} />

          <Input label="Location" value={user.location} onChange={(e: any) => setUser({ ...user, location: e.target.value })} />
          <Input label="Website" value={user.website} onChange={(e: any) => setUser({ ...user, website: e.target.value })} />

          <Input label="Job Title" value={user.job_title} onChange={(e: any) => setUser({ ...user, job_title: e.target.value })} />
          <Input label="Company" value={user.company} onChange={(e: any) => setUser({ ...user, company: e.target.value })} />
        </div>

        {/* Avatar URL */}
        <div className="mt-6">
          <Input label="Avatar URL" value={user.avatar_url} onChange={(e: any) => setUser({ ...user, avatar_url: e.target.value })} />
        </div>

        {/* Bio */}
        <div className="mt-6">
          <Input
            label="Bio"
            type="textarea"
            value={user.bio}
            onChange={(e: any) => setUser({ ...user, bio: e.target.value })}
          />
        </div>

        {/* SKILLS SECTION */}
        <div className="mt-10">
          <h2 className="text-2xl font-semibold mb-4 text-gray-900">Skills</h2>

          {/* Add Skill Input */}
          <div className="flex gap-3">
            <input
              className="flex-1 border p-3 rounded-lg focus:ring-2 focus:ring-blue-200"
              placeholder="Add new skill..."
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
            />
            <button
              onClick={addSkill}
              className="px-5 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Add
            </button>
          </div>

          {/* List Skills */}
          <div className="flex flex-wrap gap-2 mt-4">
            {skills.map((s) => (
              <div
                key={s.id}
                className="flex items-center gap-2 bg-gray-200 px-3 py-1 rounded-full"
              >
                <span>{s.skill}</span>
                <button
                  onClick={() => deleteSkill(s.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* SAVE BUTTON */}
        <div className="flex justify-end mt-8">
          <button
            onClick={saveProfile}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

function Input({ label, value, onChange, type = "text" }: any) {
  const base =
    "w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition text-gray-800";

  return (
    <div className="flex flex-col space-y-1">
      <label className="font-semibold text-gray-700">{label}</label>

      {type === "textarea" ? (
        <textarea
          className={`border p-3 h-32 ${base}`}
          value={value || ""}
          onChange={onChange}
        />
      ) : (
        <input
          className={`border p-3 ${base}`}
          value={value || ""}
          onChange={onChange}
        />
      )}
    </div>
  );
}
