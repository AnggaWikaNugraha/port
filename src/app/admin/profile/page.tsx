"use client";

import { useState, useEffect } from "react";

export default function AdminProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/profile")
      .then((res) => res.json())
      .then((data) => {
        setUser(data);
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

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-sm p-6 md:p-10 border border-gray-200">
        <h1 className="text-3xl font-bold mb-8 text-gray-900">Edit Profile</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input label="Name" value={user.name} onChange={(e) => setUser({ ...user, name: e.target.value })} />
          <Input label="Username" value={user.username} onChange={(e) => setUser({ ...user, username: e.target.value })} />

          <Input label="Email" value={user.email} onChange={(e) => setUser({ ...user, email: e.target.value })} />
          <Input label="Phone" value={user.phone} onChange={(e) => setUser({ ...user, phone: e.target.value })} />

          <Input label="Location" value={user.location} onChange={(e) => setUser({ ...user, location: e.target.value })} />
          <Input label="Website" value={user.website} onChange={(e) => setUser({ ...user, website: e.target.value })} />

          <Input label="Job Title" value={user.job_title} onChange={(e) => setUser({ ...user, job_title: e.target.value })} />
          <Input label="Company" value={user.company} onChange={(e) => setUser({ ...user, company: e.target.value })} />
        </div>

        {/* Avatar URL full width */}
        <div className="mt-6">
          <Input label="Avatar URL" value={user.avatar_url} onChange={(e) => setUser({ ...user, avatar_url: e.target.value })} />
        </div>

        {/* Bio full width */}
        <div className="mt-6">
          <Input
            label="Bio"
            type="textarea"
            value={user.bio}
            onChange={(e) => setUser({ ...user, bio: e.target.value })}
          />
        </div>

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
