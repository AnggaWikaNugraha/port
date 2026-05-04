"use client";

import { useState, useEffect, useRef } from "react";

export default function AdminProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [skills, setSkills] = useState<any[]>([]);
  const [interests, setInterests] = useState<any[]>([]);
  const [experiences, setExperiences] = useState<any[]>([]);
  const [certificates, setCertificates] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [newSkill, setNewSkill] = useState("");
  const [newInterest, setNewInterest] = useState("");
  const [newExp, setNewExp] = useState({ company: "", companyLogoUrl: "", location: "" });
  const [newCert, setNewCert] = useState({ title: "", issuer: "", issue_date: "", expiration_date: "", credential_url: "" });
  const [activeTab, setActiveTab] = useState("profile");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/profile").then((r) => r.json()),
      fetch("/api/admin/skills").then((r) => r.json()),
      fetch("/api/admin/interests").then((r) => r.json()),
      fetch("/api/admin/experience").then((r) => r.json()),
      fetch("/api/admin/certificates").then((r) => r.json()),
      fetch("/api/admin/projects").then((r) => r.json()),
    ]).then(([u, s, i, e, c, p]) => {
      setUser(u);
      setSkills(Array.isArray(s) ? s : []);
      setInterests(Array.isArray(i) ? i : []);
      setExperiences(Array.isArray(e) ? e : []);
      setCertificates(Array.isArray(c) ? c : []);
      setProjects(Array.isArray(p) ? p : []);
      setLoading(false);
    });
  }, []);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-400 animate-pulse">Loading...</p>
      </div>
    );

  async function refresh(url: string) {
    return await fetch(url).then((r) => r.json());
  }

  function updateLocalExp(id: string, key: string, val: any) {
    setExperiences((prev) => prev.map((x) => (x.id === id ? { ...x, [key]: val } : x)));
  }

  function updateLocalCert(id: string, key: string, val: any) {
    setCertificates((prev) => prev.map((x) => (x.id === id ? { ...x, [key]: val } : x)));
  }

  const saveProfile = async () => {
    await fetch("/api/profile/update", { method: "POST", body: JSON.stringify(user) });
    alert("Profile updated!");
  };

  const addSkill = async () => {
    if (!newSkill.trim()) return;
    await fetch("/api/admin/skills/create", { method: "POST", body: JSON.stringify({ skill: newSkill }) });
    setSkills(await refresh("/api/admin/skills"));
    setNewSkill("");
  };

  const deleteSkill = async (id: string) => {
    await fetch("/api/admin/skills/delete", { method: "POST", body: JSON.stringify({ id }) });
    setSkills(await refresh("/api/admin/skills"));
  };

  const addInterest = async () => {
    if (!newInterest.trim()) return;
    await fetch("/api/admin/interests/create", { method: "POST", body: JSON.stringify({ interest: newInterest }) });
    setInterests(await refresh("/api/admin/interests"));
    setNewInterest("");
  };

  const deleteInterest = async (id: string) => {
    await fetch("/api/admin/interests/delete", { method: "POST", body: JSON.stringify({ id }) });
    setInterests(await refresh("/api/admin/interests"));
  };

  const addExperience = async () => {
    if (!newExp.company) return;
    await fetch("/api/admin/experience/create", { method: "POST", body: JSON.stringify(newExp) });
    setExperiences(await refresh("/api/admin/experience"));
    setNewExp({ company: "", companyLogoUrl: "", location: "" });
  };

  const updateExperience = async (exp: any) => {
    await fetch("/api/admin/experience/update", { method: "POST", body: JSON.stringify(exp) });
    alert("Experience updated!");
  };

  const deleteExperience = async (id: string) => {
    await fetch("/api/admin/experience/delete", { method: "POST", body: JSON.stringify({ id }) });
    setExperiences(await refresh("/api/admin/experience"));
  };

  const addCertificate = async () => {
    if (!newCert.title.trim()) return;
    await fetch("/api/admin/certificates/create", { method: "POST", body: JSON.stringify(newCert) });
    setCertificates(await refresh("/api/admin/certificates"));
    setNewCert({ title: "", issuer: "", issue_date: "", expiration_date: "", credential_url: "" });
  };

  const updateCertificate = async (cert: any) => {
    await fetch("/api/admin/certificates/update", { method: "POST", body: JSON.stringify(cert) });
    alert("Certificate updated!");
  };

  const deleteCertificate = async (id: string) => {
    await fetch("/api/admin/certificates/delete", { method: "POST", body: JSON.stringify({ id }) });
    setCertificates(await refresh("/api/admin/certificates"));
  };

  const TABS = [
    { id: "profile", label: "Profile", icon: "👤" },
    { id: "skills", label: "Skills", icon: "⚡" },
    { id: "interests", label: "Interests", icon: "❤️" },
    { id: "experience", label: "Experience", icon: "🏢" },
    { id: "certificates", label: "Certificates", icon: "🎓" },
    { id: "projects", label: "Projects", icon: "🚀" },
  ];

  return (
    <div className="min-h-screen px-4 sm:px-6 py-8">
      <div className="max-w-4xl mx-auto space-y-6">

        {/* Page Title */}
        <div>
          <h1 className="text-2xl font-bold text-white">Manage Profile</h1>
          <p className="text-gray-400 text-sm mt-1">Edit your portfolio content</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`whitespace-nowrap px-4 py-2 rounded-xl text-sm font-medium transition-all duration-150 ${
                activeTab === t.id
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-900/30"
                  : "bg-gray-800/60 text-gray-400 hover:bg-gray-700/60 hover:text-gray-200 border border-gray-700/50"
              }`}
            >
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div>
          {activeTab === "profile" && (
            <Card>
              <ProfileForm user={user} setUser={setUser} saveProfile={saveProfile} />
            </Card>
          )}
          {activeTab === "skills" && (
            <Card>
              <SkillForm skills={skills} setSkills={setSkills} newSkill={newSkill} setNewSkill={setNewSkill} addSkill={addSkill} deleteSkill={deleteSkill} />
            </Card>
          )}
          {activeTab === "interests" && (
            <Card>
              <InterestForm interests={interests} setInterests={setInterests} newInterest={newInterest} setNewInterest={setNewInterest} addInterest={addInterest} deleteInterest={deleteInterest} />
            </Card>
          )}
          {activeTab === "experience" && (
            <Card>
              <ExperienceForm
                experiences={experiences} newExp={newExp} setNewExp={setNewExp}
                addExperience={addExperience} updateLocalExp={updateLocalExp}
                updateExperience={updateExperience} deleteExperience={deleteExperience}
              />
            </Card>
          )}
          {activeTab === "certificates" && (
            <Card>
              <CertificateForm
                certificates={certificates} newCert={newCert} setNewCert={setNewCert}
                addCertificate={addCertificate} updateLocalCert={updateLocalCert}
                updateCertificate={updateCertificate} deleteCertificate={deleteCertificate}
              />
            </Card>
          )}
          {activeTab === "projects" && (
            <ProjectForm projects={projects} setProjects={setProjects} />
          )}
        </div>

      </div>
    </div>
  );
}

/* =========================================================
    SHARED COMPONENTS
========================================================= */

function Card({ children }: any) {
  return (
    <div className="bg-gray-800/40 border border-gray-700/60 rounded-2xl p-5 sm:p-7 space-y-5">
      {children}
    </div>
  );
}

function Input({ label, type = "text", placeholder, ...props }: any) {
  const base =
    "w-full rounded-xl px-4 py-2.5 text-sm bg-gray-900/60 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition";

  return (
    <div className="space-y-1.5">
      {label && <label className="text-xs font-medium text-gray-400 uppercase tracking-wide">{label}</label>}
      {type === "textarea" ? (
        <textarea {...props} placeholder={placeholder} rows={4} className={`${base} resize-none`} />
      ) : (
        <input {...props} type={type} placeholder={placeholder} className={base} />
      )}
    </div>
  );
}

function BtnPrimary({ children, onClick }: any) {
  return (
    <button onClick={onClick} className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition-colors">
      {children}
    </button>
  );
}

function BtnSuccess({ children, onClick }: any) {
  return (
    <button onClick={onClick} className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium transition-colors">
      {children}
    </button>
  );
}

function BtnDanger({ children, onClick }: any) {
  return (
    <button onClick={onClick} className="px-5 py-2 rounded-xl bg-red-600/80 hover:bg-red-600 text-white text-sm font-medium transition-colors">
      {children}
    </button>
  );
}

/* =========================================================
    IMAGE UPLOAD
========================================================= */
function ImageUpload({ value, onChange, label = "Image" }: { value: string; onChange: (url: string) => void; label?: string }) {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (data.url) onChange(data.url);
      else alert(data.error ?? "Upload failed");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-1.5">
      <p className="text-xs text-gray-400">{label}</p>
      <div className="flex items-center gap-3">
        {value && (
          <img src={value} alt="preview" className="w-14 h-14 rounded-xl object-cover bg-gray-800 shrink-0 border border-gray-700" />
        )}
        <div className="flex flex-col gap-1.5 flex-1 min-w-0">
          <input
            type="text"
            value={value}
            onChange={e => onChange(e.target.value)}
            placeholder="Paste URL or upload file"
            className="w-full rounded-xl px-3 py-2 text-sm bg-gray-900/60 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          />
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="self-start text-xs px-3 py-1.5 rounded-lg bg-gray-700/60 hover:bg-gray-700 text-gray-300 transition-colors disabled:opacity-50"
          >
            {uploading ? "Uploading..." : "Upload screenshot"}
          </button>
        </div>
      </div>
      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
    </div>
  );
}

/* =========================================================
    PROFILE FORM
========================================================= */
function ProfileForm({ user, setUser, saveProfile }: any) {
  const [editing, setEditing] = useState(false);

  const handleSave = async () => {
    await saveProfile();
    setEditing(false);
  };

  const fields = [
    { label: "Name", value: user.name },
    { label: "Username", value: user.username },
    { label: "Email", value: user.email },
    { label: "Phone", value: user.phone },
    { label: "Location", value: user.location },
    { label: "Job Title", value: user.job_title },
    { label: "Company", value: user.company },
    { label: "Website", value: user.website },
  ];

  return (
    <div className="space-y-6">
      {/* Avatar + Identity */}
      <div className="flex items-center gap-5">
        {user.avatar_url ? (
          <img
            src={user.avatar_url}
            alt={user.name}
            className="w-20 h-20 rounded-2xl object-cover ring-2 ring-gray-700 shrink-0"
          />
        ) : (
          <div className="w-20 h-20 rounded-2xl bg-gray-700 flex items-center justify-center shrink-0">
            <span className="text-3xl text-gray-400">👤</span>
          </div>
        )}
        <div>
          <p className="text-xl font-bold text-white">{user.name || "—"}</p>
          <p className="text-sm text-gray-400">{user.job_title || "—"}{user.company ? ` · ${user.company}` : ""}</p>
          <p className="text-xs text-gray-500 mt-1">{user.email}</p>
        </div>
        <button
          onClick={() => setEditing(!editing)}
          className={`ml-auto px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
            editing
              ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
              : "bg-gray-700/60 text-gray-300 hover:bg-gray-700 border border-gray-600/50"
          }`}
        >
          {editing ? "Cancel" : "✏️ Edit"}
        </button>
      </div>

      {/* Display Mode */}
      {!editing && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {fields.map(({ label, value }) => (
            <div key={label} className="rounded-xl bg-gray-900/40 border border-gray-700/40 px-4 py-3">
              <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">{label}</p>
              <p className="text-sm text-gray-200 truncate">{value || <span className="text-gray-600">—</span>}</p>
            </div>
          ))}
          {user.bio && (
            <div className="col-span-full rounded-xl bg-gray-900/40 border border-gray-700/40 px-4 py-3">
              <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Bio</p>
              <p className="text-sm text-gray-200 leading-relaxed">{user.bio}</p>
            </div>
          )}
        </div>
      )}

      {/* Edit Mode */}
      {editing && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Name" value={user.name || ""} onChange={(e: any) => setUser({ ...user, name: e.target.value })} />
            <Input label="Username" value={user.username || ""} onChange={(e: any) => setUser({ ...user, username: e.target.value })} />
            <Input label="Email" value={user.email || ""} onChange={(e: any) => setUser({ ...user, email: e.target.value })} />
            <Input label="Phone" value={user.phone || ""} onChange={(e: any) => setUser({ ...user, phone: e.target.value })} />
            <Input label="Location" value={user.location || ""} onChange={(e: any) => setUser({ ...user, location: e.target.value })} />
            <Input label="Website" value={user.website || ""} onChange={(e: any) => setUser({ ...user, website: e.target.value })} />
            <Input label="Job Title" value={user.job_title || ""} onChange={(e: any) => setUser({ ...user, job_title: e.target.value })} />
            <Input label="Company" value={user.company || ""} onChange={(e: any) => setUser({ ...user, company: e.target.value })} />
          </div>
          <Input label="Avatar URL" value={user.avatar_url || ""} onChange={(e: any) => setUser({ ...user, avatar_url: e.target.value })} />
          <Input label="Bio" type="textarea" value={user.bio || ""} onChange={(e: any) => setUser({ ...user, bio: e.target.value })} />
          <div className="flex gap-3">
            <BtnPrimary onClick={handleSave}>Save Profile</BtnPrimary>
            <button
              onClick={() => setEditing(false)}
              className="px-5 py-2 rounded-xl bg-gray-700 hover:bg-gray-600 text-gray-300 text-sm font-medium transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* =========================================================
    SKILLS FORM
========================================================= */
function SkillForm({ skills, setSkills, newSkill, setNewSkill, addSkill, deleteSkill }: any) {
  const dragItem = useRef<number | null>(null);
  const dragOver = useRef<number | null>(null);
  const [draggingIdx, setDraggingIdx] = useState<number | null>(null);
  const [overIdx, setOverIdx] = useState<number | null>(null);

  const handleDragStart = (index: number) => {
    dragItem.current = index;
    setDraggingIdx(index);
  };

  const handleDragEnter = (index: number) => {
    dragOver.current = index;
    setOverIdx(index);
  };

  const handleDragEnd = () => {
    if (dragItem.current !== null && dragOver.current !== null && dragItem.current !== dragOver.current) {
      const reordered = [...skills];
      const [moved] = reordered.splice(dragItem.current, 1);
      reordered.splice(dragOver.current, 0, moved);
      setSkills(reordered);
      fetch("/api/admin/skills/reorder", {
        method: "POST",
        body: JSON.stringify({ ids: reordered.map((s: any) => s.id) }),
      });
    }
    dragItem.current = null;
    dragOver.current = null;
    setDraggingIdx(null);
    setOverIdx(null);
  };

  return (
    <div className="space-y-5">
      <div className="flex gap-3 flex-col sm:flex-row">
        <input
          className="flex-1 rounded-xl px-4 py-2.5 text-sm bg-gray-900/60 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition"
          placeholder="Add a skill..."
          value={newSkill}
          onChange={(e: any) => setNewSkill(e.target.value)}
          onKeyDown={(e: any) => e.key === "Enter" && addSkill()}
        />
        <BtnPrimary onClick={addSkill}>Add</BtnPrimary>
      </div>

      <div className="flex flex-wrap gap-2">
        {skills.length === 0 && <p className="text-gray-500 text-sm">No skills added yet.</p>}
        {skills.map((s: any, index: number) => (
          <div
            key={s.id}
            draggable
            onDragStart={() => handleDragStart(index)}
            onDragEnter={() => handleDragEnter(index)}
            onDragEnd={handleDragEnd}
            onDragOver={(e: any) => e.preventDefault()}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm border select-none transition-all cursor-grab active:cursor-grabbing
              ${draggingIdx === index ? "opacity-40 scale-95" : ""}
              ${overIdx === index && draggingIdx !== index
                ? "border-blue-500 bg-blue-500/10 text-white"
                : "bg-gray-700/50 border-gray-600/50 text-gray-200"
              }`}
          >
            <span className="text-gray-500 text-xs">⠿</span>
            <span>{s.skill}</span>
            <button onClick={() => deleteSkill(s.id)} className="text-gray-500 hover:text-red-400 transition-colors leading-none">✕</button>
          </div>
        ))}
      </div>

      {skills.length > 1 && (
        <p className="text-xs text-gray-600">Drag pill untuk mengubah urutan</p>
      )}
    </div>
  );
}

/* =========================================================
    INTERESTS FORM
========================================================= */
function InterestForm({ interests, setInterests, newInterest, setNewInterest, addInterest, deleteInterest }: any) {
  const dragItem = useRef<number | null>(null);
  const dragOver = useRef<number | null>(null);
  const [draggingIdx, setDraggingIdx] = useState<number | null>(null);
  const [overIdx, setOverIdx] = useState<number | null>(null);

  const handleDragStart = (index: number) => {
    dragItem.current = index;
    setDraggingIdx(index);
  };

  const handleDragEnter = (index: number) => {
    dragOver.current = index;
    setOverIdx(index);
  };

  const handleDragEnd = () => {
    if (dragItem.current !== null && dragOver.current !== null && dragItem.current !== dragOver.current) {
      const reordered = [...interests];
      const [moved] = reordered.splice(dragItem.current, 1);
      reordered.splice(dragOver.current, 0, moved);
      setInterests(reordered);
      fetch("/api/admin/interests/reorder", {
        method: "POST",
        body: JSON.stringify({ ids: reordered.map((i: any) => i.id) }),
      });
    }
    dragItem.current = null;
    dragOver.current = null;
    setDraggingIdx(null);
    setOverIdx(null);
  };

  return (
    <div className="space-y-5">
      <div className="flex gap-3 flex-col sm:flex-row">
        <input
          className="flex-1 rounded-xl px-4 py-2.5 text-sm bg-gray-900/60 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition"
          placeholder="Add an interest..."
          value={newInterest}
          onChange={(e: any) => setNewInterest(e.target.value)}
          onKeyDown={(e: any) => e.key === "Enter" && addInterest()}
        />
        <BtnPrimary onClick={addInterest}>Add</BtnPrimary>
      </div>

      <div className="flex flex-wrap gap-2">
        {interests.length === 0 && <p className="text-gray-500 text-sm">No interests added yet.</p>}
        {interests.map((i: any, index: number) => (
          <div
            key={i.id}
            draggable
            onDragStart={() => handleDragStart(index)}
            onDragEnter={() => handleDragEnter(index)}
            onDragEnd={handleDragEnd}
            onDragOver={(e: any) => e.preventDefault()}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm border select-none transition-all cursor-grab active:cursor-grabbing
              ${draggingIdx === index ? "opacity-40 scale-95" : ""}
              ${overIdx === index && draggingIdx !== index
                ? "border-blue-500 bg-blue-500/10 text-white"
                : "bg-gray-700/50 border-gray-600/50 text-gray-200"
              }`}
          >
            <span className="text-gray-500 text-xs">⠿</span>
            <span>{i.interest}</span>
            <button onClick={() => deleteInterest(i.id)} className="text-gray-500 hover:text-red-400 transition-colors leading-none">✕</button>
          </div>
        ))}
      </div>

      {interests.length > 1 && (
        <p className="text-xs text-gray-600">Drag pill untuk mengubah urutan</p>
      )}
    </div>
  );
}

/* =========================================================
    EXPERIENCE FORM
========================================================= */
function ExperienceForm({ experiences, newExp, setNewExp, addExperience, updateLocalExp, updateExperience, deleteExperience }: any) {
  const [expandedExp, setExpandedExp] = useState<string | null>(null);
  const [editingExp, setEditingExp] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);

  function updateLocalRole(expId: string, roleId: string, key: string, value: any) {
    updateLocalExp(
      expId, "roles",
      experiences.find((x: any) => x.id === expId).roles.map((r: any) => (r.id === roleId ? { ...r, [key]: value } : r))
    );
  }

  return (
    <div className="space-y-4">

      {/* ADD EXPERIENCE TOGGLE */}
      <button
        onClick={() => setShowAdd(!showAdd)}
        className={`w-full rounded-xl border border-dashed px-4 py-3 text-sm font-medium transition-colors ${
          showAdd ? "border-gray-600 text-gray-400 bg-gray-800/30" : "border-gray-700 text-gray-500 hover:border-gray-600 hover:text-gray-400"
        }`}
      >
        {showAdd ? "✕ Cancel" : "+ Add New Experience"}
      </button>

      {showAdd && (
        <div className="rounded-xl border border-gray-700/60 bg-gray-900/40 p-4 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Input placeholder="Company name" value={newExp.company} onChange={(e: any) => setNewExp({ ...newExp, company: e.target.value })} />
            <Input placeholder="Logo URL" value={newExp.companyLogoUrl} onChange={(e: any) => setNewExp({ ...newExp, companyLogoUrl: e.target.value })} />
            <Input placeholder="Location" value={newExp.location} onChange={(e: any) => setNewExp({ ...newExp, location: e.target.value })} />
          </div>
          <BtnPrimary onClick={() => { addExperience(); setShowAdd(false); }}>Add Experience</BtnPrimary>
        </div>
      )}

      {/* EXPERIENCE LIST */}
      {experiences.length === 0 && <p className="text-gray-500 text-sm">No experiences added yet.</p>}
      {experiences.map((exp: any) => (
        <div key={exp.id} className="rounded-2xl border border-gray-700/60 bg-gray-900/30 overflow-hidden">

          {/* DISPLAY HEADER */}
          <div className="px-5 py-4 flex items-center gap-4">
            {exp.companyLogoUrl ? (
              <img src={exp.companyLogoUrl} alt={exp.company} className="w-11 h-11 rounded-xl object-contain bg-white p-1 shrink-0" />
            ) : (
              <div className="w-11 h-11 rounded-xl bg-gray-700 flex items-center justify-center shrink-0">
                <span className="text-gray-400 text-lg">🏢</span>
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-white truncate">{exp.company}</p>
              <p className="text-xs text-gray-400">{exp.location}</p>
              <p className="text-xs text-gray-600 mt-0.5">{exp.roles?.length || 0} role{exp.roles?.length !== 1 ? "s" : ""}</p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => { setEditingExp(editingExp === exp.id ? null : exp.id); setExpandedExp(exp.id); }}
                className="px-3 py-1.5 rounded-lg text-xs font-medium bg-gray-700/60 text-gray-300 hover:bg-gray-700 transition-colors"
              >
                {editingExp === exp.id ? "Done" : "✏️ Edit"}
              </button>
              <button
                onClick={() => setExpandedExp(expandedExp === exp.id ? null : exp.id)}
                className="px-3 py-1.5 rounded-lg text-xs text-gray-500 hover:text-gray-300 transition-colors"
              >
                {expandedExp === exp.id ? "▲" : "▼"}
              </button>
            </div>
          </div>

          {/* EDIT FIELDS */}
          {editingExp === exp.id && (
            <div className="px-5 pb-4 border-t border-gray-700/40 pt-4 space-y-3 bg-gray-800/20">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <Input label="Company" value={exp.company} onChange={(e: any) => updateLocalExp(exp.id, "company", e.target.value)} />
                <Input label="Logo URL" value={exp.companyLogoUrl} onChange={(e: any) => updateLocalExp(exp.id, "companyLogoUrl", e.target.value)} />
                <Input label="Location" value={exp.location} onChange={(e: any) => updateLocalExp(exp.id, "location", e.target.value)} />
              </div>
              <div className="flex gap-3">
                <BtnSuccess onClick={() => { updateExperience(exp); setEditingExp(null); }}>Save</BtnSuccess>
                <BtnDanger onClick={() => deleteExperience(exp.id)}>Delete</BtnDanger>
              </div>
            </div>
          )}

          {/* ROLES SECTION */}
          {expandedExp === exp.id && (
            <div className="border-t border-gray-700/40 bg-gray-900/20">
              <div className="px-5 pt-4 pb-2 flex items-center justify-between">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Roles</p>
              </div>

              {/* ROLE LIST */}
              <div className="px-5 pb-4 space-y-2">
                {exp.roles?.map((role: any) => (
                  <RoleItem
                    key={role.id}
                    role={role}
                    expId={exp.id}
                    updateLocalRole={updateLocalRole}
                  />
                ))}

                {/* ADD ROLE */}
                <AddRoleForm experienceId={exp.id} refreshLocal={updateLocalExp} />
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

/* =========================================================
    ROLE ITEM — display + edit
========================================================= */
function RoleItem({ role, expId, updateLocalRole }: any) {
  const [editing, setEditing] = useState(false);

  const fmt = (d: string) => {
    if (!d) return "Present";
    const date = new Date(d);
    return date.toLocaleDateString("id-ID", { month: "short", year: "numeric" });
  };

  return (
    <div className="rounded-xl border border-gray-700/40 bg-gray-800/30 overflow-hidden">
      {/* DISPLAY */}
      <div className="px-4 py-3 flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-sm font-semibold text-white">{role.title}</p>
            <span className="text-xs px-2 py-0.5 rounded-full bg-gray-700 text-gray-400">{role.employmentType}</span>
          </div>
          <p className="text-xs text-gray-500 mt-0.5">
            {fmt(role.startDate)} → {fmt(role.endDate)}
          </p>
          {role.description && (
            <p className="text-xs text-gray-400 mt-1 line-clamp-2">{role.description}</p>
          )}
        </div>
        <button
          onClick={() => setEditing(!editing)}
          className="shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium bg-gray-700/60 text-gray-300 hover:bg-gray-700 transition-colors"
        >
          {editing ? "Done" : "✏️"}
        </button>
      </div>

      {/* EDIT */}
      {editing && (
        <div className="px-4 pb-4 border-t border-gray-700/40 pt-3 space-y-3 bg-gray-900/30">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input label="Title" value={role.title} onChange={(e: any) => updateLocalRole(expId, role.id, "title", e.target.value)} />
            <Input label="Employment Type" value={role.employmentType} onChange={(e: any) => updateLocalRole(expId, role.id, "employmentType", e.target.value)} />
            <Input type="date" label="Start Date" value={role.startDate} onChange={(e: any) => updateLocalRole(expId, role.id, "startDate", e.target.value)} />
            <Input type="date" label="End Date" value={role.endDate || ""} onChange={(e: any) => updateLocalRole(expId, role.id, "endDate", e.target.value)} />
          </div>
          <Input label="Description" type="textarea" value={role.description || ""} onChange={(e: any) => updateLocalRole(expId, role.id, "description", e.target.value)} />
          <div className="flex gap-3">
            <BtnSuccess onClick={() => { fetch("/api/admin/roles/update", { method: "POST", body: JSON.stringify(role) }); setEditing(false); }}>Save</BtnSuccess>
            <BtnDanger onClick={() => fetch("/api/admin/roles/delete", { method: "POST", body: JSON.stringify({ id: role.id }) })}>Delete</BtnDanger>
          </div>
        </div>
      )}
    </div>
  );
}

function AddRoleForm({ experienceId, refreshLocal }: any) {
  const [open, setOpen] = useState(false);
  const [role, setRole] = useState({ title: "", employmentType: "", startDate: "", endDate: "", description: "" });

  const createRole = async () => {
    await fetch("/api/admin/roles/create", { method: "POST", body: JSON.stringify({ ...role, experienceId }) });
    const updated = await fetch("/api/admin/experience").then((r) => r.json());
    refreshLocal(experienceId, "roles", updated.find((x: any) => x.id === experienceId).roles);
    setRole({ title: "", employmentType: "", startDate: "", endDate: "", description: "" });
    setOpen(false);
  };

  if (!open) return (
    <button
      onClick={() => setOpen(true)}
      className="w-full rounded-xl border border-dashed border-gray-700 text-gray-500 hover:text-gray-400 hover:border-gray-600 text-xs py-2.5 transition-colors"
    >
      + Add Role
    </button>
  );

  return (
    <div className="rounded-xl border border-dashed border-gray-600/50 bg-gray-900/30 p-4 space-y-3">
      <p className="text-xs font-medium text-gray-400">New Role</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Input placeholder="Role Title" value={role.title} onChange={(e: any) => setRole({ ...role, title: e.target.value })} />
        <Input placeholder="Employment Type" value={role.employmentType} onChange={(e: any) => setRole({ ...role, employmentType: e.target.value })} />
        <Input type="date" label="Start" value={role.startDate} onChange={(e: any) => setRole({ ...role, startDate: e.target.value })} />
        <Input type="date" label="End" value={role.endDate} onChange={(e: any) => setRole({ ...role, endDate: e.target.value })} />
      </div>
      <Input type="textarea" placeholder="Description" value={role.description} onChange={(e: any) => setRole({ ...role, description: e.target.value })} />
      <div className="flex gap-3">
        <BtnPrimary onClick={createRole}>Add Role</BtnPrimary>
        <button onClick={() => setOpen(false)} className="text-sm text-gray-500 hover:text-gray-300 transition-colors">Cancel</button>
      </div>
    </div>
  );
}

/* =========================================================
    CERTIFICATE FORM
========================================================= */
function CertificateForm({ certificates, newCert, setNewCert, addCertificate, updateLocalCert, updateCertificate, deleteCertificate }: any) {
  const [showAdd, setShowAdd] = useState(false);

  const fmt = (d: string) => {
    if (!d) return "—";
    return new Date(d).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
  };

  return (
    <div className="space-y-4">

      {/* ADD TOGGLE */}
      <button
        onClick={() => setShowAdd(!showAdd)}
        className={`w-full rounded-xl border border-dashed px-4 py-3 text-sm font-medium transition-colors ${
          showAdd ? "border-gray-600 text-gray-400 bg-gray-800/30" : "border-gray-700 text-gray-500 hover:border-gray-600 hover:text-gray-400"
        }`}
      >
        {showAdd ? "✕ Cancel" : "+ Add New Certificate"}
      </button>

      {showAdd && (
        <div className="rounded-xl border border-gray-700/60 bg-gray-900/40 p-4 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input placeholder="Title" value={newCert.title} onChange={(e: any) => setNewCert({ ...newCert, title: e.target.value })} />
            <Input placeholder="Issuer" value={newCert.issuer} onChange={(e: any) => setNewCert({ ...newCert, issuer: e.target.value })} />
            <Input type="date" label="Issue Date" value={newCert.issue_date} onChange={(e: any) => setNewCert({ ...newCert, issue_date: e.target.value })} />
            <Input type="date" label="Expiration" value={newCert.expiration_date} onChange={(e: any) => setNewCert({ ...newCert, expiration_date: e.target.value })} />
          </div>
          <Input placeholder="Credential URL" value={newCert.credential_url} onChange={(e: any) => setNewCert({ ...newCert, credential_url: e.target.value })} />
          <BtnPrimary onClick={() => { addCertificate(); setShowAdd(false); }}>Add Certificate</BtnPrimary>
        </div>
      )}

      {/* LIST */}
      {certificates.length === 0 && <p className="text-gray-500 text-sm">No certificates added yet.</p>}
      {certificates.map((c: any) => (
        <CertItem
          key={c.id}
          cert={c}
          fmt={fmt}
          updateLocalCert={updateLocalCert}
          updateCertificate={updateCertificate}
          deleteCertificate={deleteCertificate}
        />
      ))}
    </div>
  );
}

/* =========================================================
    PROJECT FORM
========================================================= */
const STATUS_LABEL: Record<string, string> = {
  completed: "Completed",
  "in-progress": "In Progress",
  archived: "Archived",
};
const STATUS_COLOR: Record<string, string> = {
  completed: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  "in-progress": "bg-blue-500/20 text-blue-400 border-blue-500/30",
  archived: "bg-gray-500/20 text-gray-400 border-gray-500/30",
};

function ProjectForm({ projects, setProjects }: any) {
  const [showAdd, setShowAdd] = useState(false);
  const [newProj, setNewProj] = useState({
    title: "", description: "", role: "", company: "",
    techStack: "", year: "", status: "completed",
    featured: false, isPrivate: false,
    demoUrl: "", repoUrl: "", coverImage: "",
  });

  const dragItem = useRef<number | null>(null);
  const dragOver = useRef<number | null>(null);
  const [draggingIdx, setDraggingIdx] = useState<number | null>(null);
  const [overIdx, setOverIdx] = useState<number | null>(null);

  const handleDragStart = (i: number) => { dragItem.current = i; setDraggingIdx(i); };
  const handleDragEnter = (i: number) => { dragOver.current = i; setOverIdx(i); };
  const handleDragEnd = () => {
    if (dragItem.current !== null && dragOver.current !== null && dragItem.current !== dragOver.current) {
      const reordered = [...projects];
      const [moved] = reordered.splice(dragItem.current, 1);
      reordered.splice(dragOver.current, 0, moved);
      setProjects(reordered);
      fetch("/api/admin/projects/reorder", { method: "POST", body: JSON.stringify({ ids: reordered.map((p: any) => p.id) }) });
    }
    dragItem.current = null; dragOver.current = null;
    setDraggingIdx(null); setOverIdx(null);
  };

  const addProject = async () => {
    if (!newProj.title.trim()) return;
    await fetch("/api/admin/projects/create", {
      method: "POST",
      body: JSON.stringify({ ...newProj, techStack: newProj.techStack.split(",").map((t: string) => t.trim()).filter(Boolean) }),
    });
    const updated = await fetch("/api/admin/projects").then(r => r.json());
    setProjects(Array.isArray(updated) ? updated : []);
    setNewProj({ title: "", description: "", role: "", company: "", techStack: "", year: "", status: "completed", featured: false, isPrivate: false, demoUrl: "", repoUrl: "", coverImage: "" });
    setShowAdd(false);
  };

  const updateLocalProject = (id: string, key: string, val: any) =>
    setProjects((prev: any[]) => prev.map(p => p.id === id ? { ...p, [key]: val } : p));

  const updateLocalFlow = (projId: string, flowId: string, key: string, val: any) =>
    setProjects((prev: any[]) => prev.map(p => p.id === projId
      ? { ...p, flows: p.flows.map((f: any) => f.id === flowId ? { ...f, [key]: val } : f) }
      : p));

  return (
    <div className="space-y-4">
      {/* ADD TOGGLE */}
      <button
        onClick={() => setShowAdd(!showAdd)}
        className={`w-full rounded-xl border border-dashed px-4 py-3 text-sm font-medium transition-colors ${showAdd ? "border-gray-600 text-gray-400 bg-gray-800/30" : "border-gray-700 text-gray-500 hover:border-gray-600 hover:text-gray-400"}`}
      >
        {showAdd ? "✕ Cancel" : "+ Add New Project"}
      </button>

      {showAdd && (
        <div className="rounded-xl border border-gray-700/60 bg-gray-900/40 p-4 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input label="Title *" value={newProj.title} onChange={(e: any) => setNewProj({ ...newProj, title: e.target.value })} />
            <Input label="Role" value={newProj.role} onChange={(e: any) => setNewProj({ ...newProj, role: e.target.value })} />
            <Input label="Company" value={newProj.company} onChange={(e: any) => setNewProj({ ...newProj, company: e.target.value })} />
            <Input label="Year" value={newProj.year} onChange={(e: any) => setNewProj({ ...newProj, year: e.target.value })} />
            <Input label="Demo URL" value={newProj.demoUrl} onChange={(e: any) => setNewProj({ ...newProj, demoUrl: e.target.value })} />
            <Input label="Repo URL" value={newProj.repoUrl} onChange={(e: any) => setNewProj({ ...newProj, repoUrl: e.target.value })} />
          </div>
          <Input label="Tech Stack (comma separated)" value={newProj.techStack} onChange={(e: any) => setNewProj({ ...newProj, techStack: e.target.value })} />
          <ImageUpload label="Cover Image" value={newProj.coverImage} onChange={(url) => setNewProj({ ...newProj, coverImage: url })} />
          <Input label="Description" type="textarea" value={newProj.description} onChange={(e: any) => setNewProj({ ...newProj, description: e.target.value })} />
          <div className="flex items-center gap-4 text-sm">
            <label className="flex items-center gap-2 text-gray-400 cursor-pointer">
              <input type="checkbox" checked={newProj.featured} onChange={(e: any) => setNewProj({ ...newProj, featured: e.target.checked })} className="accent-blue-500" />
              Featured
            </label>
            <label className="flex items-center gap-2 text-gray-400 cursor-pointer">
              <input type="checkbox" checked={newProj.isPrivate} onChange={(e: any) => setNewProj({ ...newProj, isPrivate: e.target.checked })} className="accent-blue-500" />
              Private
            </label>
            <select
              value={newProj.status}
              onChange={(e: any) => setNewProj({ ...newProj, status: e.target.value })}
              className="rounded-xl px-3 py-2 text-sm bg-gray-900/60 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            >
              <option value="completed">Completed</option>
              <option value="in-progress">In Progress</option>
              <option value="archived">Archived</option>
            </select>
          </div>
          <BtnPrimary onClick={addProject}>Add Project</BtnPrimary>
        </div>
      )}

      {projects.length === 0 && <p className="text-gray-500 text-sm">No projects added yet.</p>}
      {projects.map((proj: any, index: number) => (
        <ProjectItem
          key={proj.id}
          proj={proj}
          index={index}
          draggingIdx={draggingIdx}
          overIdx={overIdx}
          onDragStart={handleDragStart}
          onDragEnter={handleDragEnter}
          onDragEnd={handleDragEnd}
          updateLocalProject={updateLocalProject}
          updateLocalFlow={updateLocalFlow}
          setProjects={setProjects}
        />
      ))}
      {projects.length > 1 && <p className="text-xs text-gray-600">Drag card untuk mengubah urutan</p>}
    </div>
  );
}

function ProjectItem({ proj, index, draggingIdx, overIdx, onDragStart, onDragEnter, onDragEnd, updateLocalProject, updateLocalFlow, setProjects }: any) {
  const [editing, setEditing] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [techInput, setTechInput] = useState((proj.techStack || []).join(", "));

  const saveProject = async () => {
    const payload = { ...proj, techStack: techInput.split(",").map((t: string) => t.trim()).filter(Boolean) };
    await fetch("/api/admin/projects/update", { method: "POST", body: JSON.stringify(payload) });
    updateLocalProject(proj.id, "techStack", payload.techStack);
    setEditing(false);
  };

  const deleteProject = async () => {
    await fetch("/api/admin/projects/delete", { method: "POST", body: JSON.stringify({ id: proj.id }) });
    setProjects((prev: any[]) => prev.filter(p => p.id !== proj.id));
  };

  const addFlow = async (flow: any) => {
    const res = await fetch("/api/admin/project-flows/create", { method: "POST", body: JSON.stringify({ ...flow, projectId: proj.id }) });
    const { id } = await res.json();
    updateLocalProject(proj.id, "flows", [...(proj.flows || []), { ...flow, id, sortOrder: (proj.flows || []).length }]);
  };

  const updateFlow = async (flow: any) => {
    await fetch("/api/admin/project-flows/update", { method: "POST", body: JSON.stringify(flow) });
  };

  const deleteFlow = async (flowId: string) => {
    await fetch("/api/admin/project-flows/delete", { method: "POST", body: JSON.stringify({ id: flowId }) });
    updateLocalProject(proj.id, "flows", proj.flows.filter((f: any) => f.id !== flowId));
  };

  return (
    <div
      draggable
      onDragStart={() => onDragStart(index)}
      onDragEnter={() => onDragEnter(index)}
      onDragEnd={onDragEnd}
      onDragOver={(e: any) => e.preventDefault()}
      className={`rounded-2xl border overflow-hidden transition-all select-none
        ${draggingIdx === index ? "opacity-40 scale-95" : ""}
        ${overIdx === index && draggingIdx !== index ? "border-blue-500 bg-blue-500/5" : "border-gray-700/60 bg-gray-900/30"}`}
    >
      {/* DISPLAY HEADER */}
      <div className="px-5 py-4 flex gap-4 items-start">
        <span className="text-gray-600 text-sm mt-1 cursor-grab">⠿</span>
        {proj.coverImage && (
          <img src={proj.coverImage} alt={proj.title} className="w-14 h-14 rounded-xl object-cover shrink-0 bg-gray-800" />
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="font-semibold text-white">{proj.title}</p>
            {proj.featured && <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">⭐ Featured</span>}
            {proj.isPrivate && <span className="text-xs px-2 py-0.5 rounded-full bg-gray-700 text-gray-400">🔒 Private</span>}
            <span className={`text-xs px-2 py-0.5 rounded-full border ${STATUS_COLOR[proj.status] || STATUS_COLOR.completed}`}>
              {STATUS_LABEL[proj.status] || proj.status}
            </span>
          </div>
          <p className="text-xs text-gray-400 mt-0.5">{[proj.role, proj.company, proj.year].filter(Boolean).join(" · ")}</p>
          {(proj.techStack || []).length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {proj.techStack.map((t: string) => (
                <span key={t} className="text-xs px-2 py-0.5 rounded-full bg-gray-700/60 text-gray-300">{t}</span>
              ))}
            </div>
          )}
          <div className="flex gap-3 mt-2">
            {proj.demoUrl && <a href={proj.demoUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-400 hover:underline">Demo →</a>}
            {proj.repoUrl && <a href={proj.repoUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-400 hover:underline">Repo →</a>}
          </div>
        </div>
        <div className="flex gap-2 shrink-0">
          <button onClick={() => setEditing(!editing)} className="px-3 py-1.5 rounded-lg text-xs font-medium bg-gray-700/60 text-gray-300 hover:bg-gray-700 transition-colors">
            {editing ? "Done" : "✏️ Edit"}
          </button>
          <button onClick={() => setExpanded(!expanded)} className="px-3 py-1.5 rounded-lg text-xs text-gray-500 hover:text-gray-300 transition-colors">
            {expanded ? "▲" : "▼"}
          </button>
        </div>
      </div>

      {/* EDIT FORM */}
      {editing && (
        <div className="px-5 pb-5 border-t border-gray-700/40 pt-4 space-y-3 bg-gray-800/20">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input label="Title" value={proj.title} onChange={(e: any) => updateLocalProject(proj.id, "title", e.target.value)} />
            <Input label="Role" value={proj.role || ""} onChange={(e: any) => updateLocalProject(proj.id, "role", e.target.value)} />
            <Input label="Company" value={proj.company || ""} onChange={(e: any) => updateLocalProject(proj.id, "company", e.target.value)} />
            <Input label="Year" value={proj.year || ""} onChange={(e: any) => updateLocalProject(proj.id, "year", e.target.value)} />
            <Input label="Demo URL" value={proj.demoUrl || ""} onChange={(e: any) => updateLocalProject(proj.id, "demoUrl", e.target.value)} />
            <Input label="Repo URL" value={proj.repoUrl || ""} onChange={(e: any) => updateLocalProject(proj.id, "repoUrl", e.target.value)} />
          </div>
          <Input label="Tech Stack (comma separated)" value={techInput} onChange={(e: any) => setTechInput(e.target.value)} />
          <ImageUpload label="Cover Image" value={proj.coverImage || ""} onChange={(url) => updateLocalProject(proj.id, "coverImage", url)} />
          <Input label="Description" type="textarea" value={proj.description || ""} onChange={(e: any) => updateLocalProject(proj.id, "description", e.target.value)} />
          <div className="flex items-center gap-4 text-sm">
            <label className="flex items-center gap-2 text-gray-400 cursor-pointer">
              <input type="checkbox" checked={!!proj.featured} onChange={(e: any) => updateLocalProject(proj.id, "featured", e.target.checked)} className="accent-blue-500" />
              Featured
            </label>
            <label className="flex items-center gap-2 text-gray-400 cursor-pointer">
              <input type="checkbox" checked={!!proj.isPrivate} onChange={(e: any) => updateLocalProject(proj.id, "isPrivate", e.target.checked)} className="accent-blue-500" />
              Private
            </label>
            <select
              value={proj.status || "completed"}
              onChange={(e: any) => updateLocalProject(proj.id, "status", e.target.value)}
              className="rounded-xl px-3 py-2 text-sm bg-gray-900/60 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            >
              <option value="completed">Completed</option>
              <option value="in-progress">In Progress</option>
              <option value="archived">Archived</option>
            </select>
          </div>
          <div className="flex gap-3">
            <BtnSuccess onClick={saveProject}>Save</BtnSuccess>
            <BtnDanger onClick={deleteProject}>Delete</BtnDanger>
          </div>
        </div>
      )}

      {/* FLOWS */}
      {expanded && (
        <div className="border-t border-gray-700/40 bg-gray-900/20 px-5 py-4 space-y-3">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Flows</p>
          {(proj.flows || []).map((flow: any) => (
            <FlowItem key={flow.id} flow={flow} projId={proj.id} updateLocalFlow={updateLocalFlow} updateFlow={updateFlow} deleteFlow={deleteFlow} />
          ))}
          <AddFlowForm onAdd={addFlow} />
        </div>
      )}
    </div>
  );
}

function FlowItem({ flow, projId, updateLocalFlow, updateFlow, deleteFlow }: any) {
  const [editing, setEditing] = useState(false);

  return (
    <div className="rounded-xl border border-gray-700/40 bg-gray-800/30 overflow-hidden">
      <div className="px-4 py-3 flex gap-3 items-start">
        {flow.imageUrl && (
          <img src={flow.imageUrl} alt={flow.title} className="w-16 h-16 rounded-lg object-cover shrink-0 bg-gray-700" />
        )}
        <div className="flex-1 min-w-0">
          {flow.title && <p className="text-sm font-medium text-white">{flow.title}</p>}
          {flow.description && <p className="text-xs text-gray-400 mt-0.5 line-clamp-2">{flow.description}</p>}
        </div>
        <button onClick={() => setEditing(!editing)} className="shrink-0 px-3 py-1.5 rounded-lg text-xs bg-gray-700/60 text-gray-300 hover:bg-gray-700 transition-colors">
          {editing ? "Done" : "✏️"}
        </button>
      </div>
      {editing && (
        <div className="px-4 pb-4 border-t border-gray-700/40 pt-3 space-y-3 bg-gray-900/30">
          <Input label="Title" value={flow.title || ""} onChange={(e: any) => updateLocalFlow(projId, flow.id, "title", e.target.value)} />
          <ImageUpload label="Image" value={flow.imageUrl || ""} onChange={(url) => updateLocalFlow(projId, flow.id, "imageUrl", url)} />
          <Input label="Description" type="textarea" value={flow.description || ""} onChange={(e: any) => updateLocalFlow(projId, flow.id, "description", e.target.value)} />
          <div className="flex gap-3">
            <BtnSuccess onClick={() => { updateFlow(flow); setEditing(false); }}>Save</BtnSuccess>
            <BtnDanger onClick={() => deleteFlow(flow.id)}>Delete</BtnDanger>
          </div>
        </div>
      )}
    </div>
  );
}

function AddFlowForm({ onAdd }: any) {
  const [open, setOpen] = useState(false);
  const [flow, setFlow] = useState({ title: "", description: "", imageUrl: "" });

  const submit = async () => {
    await onAdd(flow);
    setFlow({ title: "", description: "", imageUrl: "" });
    setOpen(false);
  };

  if (!open) return (
    <button onClick={() => setOpen(true)} className="w-full rounded-xl border border-dashed border-gray-700 text-gray-500 hover:text-gray-400 hover:border-gray-600 text-xs py-2.5 transition-colors">
      + Add Flow
    </button>
  );

  return (
    <div className="rounded-xl border border-dashed border-gray-600/50 bg-gray-900/30 p-4 space-y-3">
      <p className="text-xs font-medium text-gray-400">New Flow</p>
      <Input label="Title" value={flow.title} onChange={(e: any) => setFlow({ ...flow, title: e.target.value })} />
      <ImageUpload label="Image" value={flow.imageUrl} onChange={(url) => setFlow({ ...flow, imageUrl: url })} />
      <Input label="Description" type="textarea" value={flow.description} onChange={(e: any) => setFlow({ ...flow, description: e.target.value })} />
      <div className="flex gap-3">
        <BtnPrimary onClick={submit}>Add Flow</BtnPrimary>
        <button onClick={() => setOpen(false)} className="text-sm text-gray-500 hover:text-gray-300 transition-colors">Cancel</button>
      </div>
    </div>
  );
}

function CertItem({ cert: c, fmt, updateLocalCert, updateCertificate, deleteCertificate }: any) {
  const [editing, setEditing] = useState(false);

  return (
    <div className="rounded-2xl border border-gray-700/60 bg-gray-900/30 overflow-hidden">
      {/* DISPLAY */}
      <div className="px-5 py-4 flex items-start gap-4">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500/20 to-amber-600/10 border border-amber-500/20 flex items-center justify-center shrink-0">
          <span className="text-lg">🎓</span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-white">{c.title}</p>
          <p className="text-xs text-gray-400 mt-0.5">{c.issuer}</p>
          <div className="flex gap-3 mt-1.5 text-xs text-gray-500">
            <span>Issued: {fmt(c.issue_date)}</span>
            {c.expiration_date && <span>· Exp: {fmt(c.expiration_date)}</span>}
          </div>
          {c.credential_url && (
            <a href={c.credential_url} target="_blank" rel="noopener noreferrer"
              className="text-xs text-blue-400 hover:underline mt-1 inline-block">
              View Credential →
            </a>
          )}
        </div>
        <button
          onClick={() => setEditing(!editing)}
          className="shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium bg-gray-700/60 text-gray-300 hover:bg-gray-700 transition-colors"
        >
          {editing ? "Done" : "✏️ Edit"}
        </button>
      </div>

      {/* EDIT */}
      {editing && (
        <div className="px-5 pb-5 border-t border-gray-700/40 pt-4 space-y-3 bg-gray-800/20">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input label="Title" value={c.title} onChange={(e: any) => updateLocalCert(c.id, "title", e.target.value)} />
            <Input label="Issuer" value={c.issuer} onChange={(e: any) => updateLocalCert(c.id, "issuer", e.target.value)} />
            <Input type="date" label="Issue Date" value={c.issue_date} onChange={(e: any) => updateLocalCert(c.id, "issue_date", e.target.value)} />
            <Input type="date" label="Expiration" value={c.expiration_date} onChange={(e: any) => updateLocalCert(c.id, "expiration_date", e.target.value)} />
          </div>
          <Input label="Credential URL" value={c.credential_url} onChange={(e: any) => updateLocalCert(c.id, "credential_url", e.target.value)} />
          <div className="flex gap-3">
            <BtnSuccess onClick={() => { updateCertificate(c); setEditing(false); }}>Save</BtnSuccess>
            <BtnDanger onClick={() => deleteCertificate(c.id)}>Delete</BtnDanger>
          </div>
        </div>
      )}
    </div>
  );
}
