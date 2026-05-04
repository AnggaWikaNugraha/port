"use client";

import { useState, useEffect, useRef } from "react";

export default function AdminProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [skills, setSkills] = useState<any[]>([]);
  const [interests, setInterests] = useState<any[]>([]);
  const [experiences, setExperiences] = useState<any[]>([]);
  const [certificates, setCertificates] = useState<any[]>([]);
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
    ]).then(([u, s, i, e, c]) => {
      setUser(u);
      setSkills(Array.isArray(s) ? s : []);
      setInterests(Array.isArray(i) ? i : []);
      setExperiences(Array.isArray(e) ? e : []);
      setCertificates(Array.isArray(c) ? c : []);
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
  const [openExp, setOpenExp] = useState<any>(null);
  const [openRole, setOpenRole] = useState<any>(null);

  function updateLocalRole(expId: string, roleId: string, key: string, value: any) {
    updateLocalExp(
      expId, "roles",
      experiences.find((x: any) => x.id === expId).roles.map((r: any) => (r.id === roleId ? { ...r, [key]: value } : r))
    );
  }

  return (
    <div className="space-y-5">
      {/* ADD EXPERIENCE */}
      <div className="rounded-xl border border-gray-700/60 bg-gray-900/40 p-4 space-y-3">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Add New Experience</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Input placeholder="Company name" value={newExp.company} onChange={(e: any) => setNewExp({ ...newExp, company: e.target.value })} />
          <Input placeholder="Logo URL" value={newExp.companyLogoUrl} onChange={(e: any) => setNewExp({ ...newExp, companyLogoUrl: e.target.value })} />
          <Input placeholder="Location" value={newExp.location} onChange={(e: any) => setNewExp({ ...newExp, location: e.target.value })} />
        </div>
        <BtnPrimary onClick={addExperience}>Add Experience</BtnPrimary>
      </div>

      {/* LIST */}
      <div className="space-y-3">
        {experiences.length === 0 && <p className="text-gray-500 text-sm">No experiences added yet.</p>}
        {experiences.map((exp: any) => (
          <div key={exp.id} className="rounded-xl border border-gray-700/60 bg-gray-900/30 overflow-hidden">
            <div
              className="px-5 py-4 flex justify-between items-center cursor-pointer hover:bg-gray-800/40 transition"
              onClick={() => setOpenExp(openExp === exp.id ? null : exp.id)}
            >
              <div>
                <p className="font-semibold text-white">{exp.company}</p>
                <p className="text-xs text-gray-400 mt-0.5">{exp.location}</p>
              </div>
              <span className="text-gray-500 text-xs">{openExp === exp.id ? "▲" : "▼"}</span>
            </div>

            {openExp === exp.id && (
              <div className="px-5 pb-5 border-t border-gray-700/60 pt-4 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <Input label="Company" value={exp.company} onChange={(e: any) => updateLocalExp(exp.id, "company", e.target.value)} />
                  <Input label="Logo URL" value={exp.companyLogoUrl} onChange={(e: any) => updateLocalExp(exp.id, "companyLogoUrl", e.target.value)} />
                  <Input label="Location" value={exp.location} onChange={(e: any) => updateLocalExp(exp.id, "location", e.target.value)} />
                </div>
                <div className="flex gap-3">
                  <BtnSuccess onClick={() => updateExperience(exp)}>Update</BtnSuccess>
                  <BtnDanger onClick={() => deleteExperience(exp.id)}>Delete</BtnDanger>
                </div>

                {/* ROLES */}
                <div className="pt-2 space-y-3">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Roles</p>
                  <AddRoleForm experienceId={exp.id} refreshLocal={updateLocalExp} />
                  {exp.roles?.map((role: any) => (
                    <div key={role.id} className="rounded-xl border border-gray-700/40 bg-gray-800/30 overflow-hidden">
                      <div
                        className="px-4 py-3 flex justify-between cursor-pointer hover:bg-gray-800/60 transition"
                        onClick={() => setOpenRole(openRole === role.id ? null : role.id)}
                      >
                        <div>
                          <p className="text-sm font-medium text-white">{role.title}</p>
                          <p className="text-xs text-gray-500">{role.employmentType}</p>
                        </div>
                        <span className="text-gray-500 text-xs">{openRole === role.id ? "▲" : "▼"}</span>
                      </div>

                      {openRole === role.id && (
                        <div className="px-4 pb-4 pt-3 border-t border-gray-700/40 space-y-3">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <Input label="Title" value={role.title} onChange={(e: any) => updateLocalRole(exp.id, role.id, "title", e.target.value)} />
                            <Input label="Employment Type" value={role.employmentType} onChange={(e: any) => updateLocalRole(exp.id, role.id, "employmentType", e.target.value)} />
                            <Input type="date" label="Start Date" value={role.startDate} onChange={(e: any) => updateLocalRole(exp.id, role.id, "startDate", e.target.value)} />
                            <Input type="date" label="End Date" value={role.endDate || ""} onChange={(e: any) => updateLocalRole(exp.id, role.id, "endDate", e.target.value)} />
                          </div>
                          <Input label="Description" type="textarea" value={role.description || ""} onChange={(e: any) => updateLocalRole(exp.id, role.id, "description", e.target.value)} />
                          <div className="flex gap-3">
                            <BtnSuccess onClick={() => fetch("/api/admin/roles/update", { method: "POST", body: JSON.stringify(role) })}>Update</BtnSuccess>
                            <BtnDanger onClick={() => fetch("/api/admin/roles/delete", { method: "POST", body: JSON.stringify({ id: role.id }) })}>Delete</BtnDanger>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function AddRoleForm({ experienceId, refreshLocal }: any) {
  const [role, setRole] = useState({ title: "", employmentType: "", startDate: "", endDate: "", description: "" });

  const createRole = async () => {
    await fetch("/api/admin/roles/create", { method: "POST", body: JSON.stringify({ ...role, experienceId }) });
    const updated = await fetch("/api/admin/experience").then((r) => r.json());
    refreshLocal(experienceId, "roles", updated.find((x: any) => x.id === experienceId).roles);
    setRole({ title: "", employmentType: "", startDate: "", endDate: "", description: "" });
  };

  return (
    <div className="rounded-xl border border-dashed border-gray-600/50 bg-gray-900/30 p-4 space-y-3">
      <p className="text-xs text-gray-500">Add role</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Input placeholder="Role Title" value={role.title} onChange={(e: any) => setRole({ ...role, title: e.target.value })} />
        <Input placeholder="Employment Type" value={role.employmentType} onChange={(e: any) => setRole({ ...role, employmentType: e.target.value })} />
        <Input type="date" label="Start" value={role.startDate} onChange={(e: any) => setRole({ ...role, startDate: e.target.value })} />
        <Input type="date" label="End" value={role.endDate} onChange={(e: any) => setRole({ ...role, endDate: e.target.value })} />
      </div>
      <Input type="textarea" placeholder="Description" value={role.description} onChange={(e: any) => setRole({ ...role, description: e.target.value })} />
      <BtnPrimary onClick={createRole}>Add Role</BtnPrimary>
    </div>
  );
}

/* =========================================================
    CERTIFICATE FORM
========================================================= */
function CertificateForm({ certificates, newCert, setNewCert, addCertificate, updateLocalCert, updateCertificate, deleteCertificate }: any) {
  const [open, setOpen] = useState<any>(null);

  return (
    <div className="space-y-5">
      {/* ADD */}
      <div className="rounded-xl border border-gray-700/60 bg-gray-900/40 p-4 space-y-3">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Add New Certificate</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input placeholder="Title" value={newCert.title} onChange={(e: any) => setNewCert({ ...newCert, title: e.target.value })} />
          <Input placeholder="Issuer" value={newCert.issuer} onChange={(e: any) => setNewCert({ ...newCert, issuer: e.target.value })} />
          <Input type="date" label="Issue Date" value={newCert.issue_date} onChange={(e: any) => setNewCert({ ...newCert, issue_date: e.target.value })} />
          <Input type="date" label="Expiration" value={newCert.expiration_date} onChange={(e: any) => setNewCert({ ...newCert, expiration_date: e.target.value })} />
        </div>
        <Input placeholder="Credential URL" value={newCert.credential_url} onChange={(e: any) => setNewCert({ ...newCert, credential_url: e.target.value })} />
        <BtnPrimary onClick={addCertificate}>Add Certificate</BtnPrimary>
      </div>

      {/* LIST */}
      <div className="space-y-3">
        {certificates.length === 0 && <p className="text-gray-500 text-sm">No certificates added yet.</p>}
        {certificates.map((c: any) => (
          <div key={c.id} className="rounded-xl border border-gray-700/60 bg-gray-900/30 overflow-hidden">
            <div
              onClick={() => setOpen(open === c.id ? null : c.id)}
              className="px-5 py-4 flex justify-between items-center cursor-pointer hover:bg-gray-800/40 transition"
            >
              <div>
                <p className="font-semibold text-white">{c.title}</p>
                <p className="text-xs text-gray-400 mt-0.5">{c.issuer}</p>
              </div>
              <span className="text-gray-500 text-xs">{open === c.id ? "▲" : "▼"}</span>
            </div>

            {open === c.id && (
              <div className="px-5 pb-5 border-t border-gray-700/60 pt-4 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Input label="Title" value={c.title} onChange={(e: any) => updateLocalCert(c.id, "title", e.target.value)} />
                  <Input label="Issuer" value={c.issuer} onChange={(e: any) => updateLocalCert(c.id, "issuer", e.target.value)} />
                  <Input type="date" label="Issue Date" value={c.issue_date} onChange={(e: any) => updateLocalCert(c.id, "issue_date", e.target.value)} />
                  <Input type="date" label="Expiration" value={c.expiration_date} onChange={(e: any) => updateLocalCert(c.id, "expiration_date", e.target.value)} />
                </div>
                <Input label="Credential URL" value={c.credential_url} onChange={(e: any) => updateLocalCert(c.id, "credential_url", e.target.value)} />
                <div className="flex gap-3">
                  <BtnSuccess onClick={() => updateCertificate(c)}>Update</BtnSuccess>
                  <BtnDanger onClick={() => deleteCertificate(c.id)}>Delete</BtnDanger>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
