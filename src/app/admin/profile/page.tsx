"use client";

import { useState, useEffect, useRef } from "react";

export default function AdminProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [skills, setSkills] = useState<any[]>([]);
  const [skillCategories, setSkillCategories] = useState<any[]>([]);
  const [interests, setInterests] = useState<any[]>([]);
  const [experiences, setExperiences] = useState<any[]>([]);
  const [certificates, setCertificates] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [newInterest, setNewInterest] = useState("");
  const [newExp, setNewExp] = useState({ company: "", companyLogoUrl: "", location: "" });
  const [newCert, setNewCert] = useState({ title: "", issuer: "", issue_date: "", expiration_date: "", credential_url: "" });
  const [activeTab, setActiveTab] = useState("profile");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/profile").then((r) => r.json()),
      fetch("/api/admin/skills").then((r) => r.json()),
      fetch("/api/admin/skill-categories").then((r) => r.json()),
      fetch("/api/admin/interests").then((r) => r.json()),
      fetch("/api/admin/experience").then((r) => r.json()),
      fetch("/api/admin/certificates").then((r) => r.json()),
      fetch("/api/admin/projects").then((r) => r.json()),
    ]).then(([u, s, sc, i, e, c, p]) => {
      setUser(u);
      setSkills(Array.isArray(s) ? s : []);
      setSkillCategories(Array.isArray(sc) ? sc : []);
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

  const reloadSkills = async () => setSkills(await refresh("/api/admin/skills"));

  const reloadSkillCategories = async () =>
    setSkillCategories(await refresh("/api/admin/skill-categories"));

  const addSkill = async (skill: string, categoryId: number | null) => {
    if (!skill.trim()) return;
    await fetch("/api/admin/skills/create", { method: "POST", body: JSON.stringify({ skill, categoryId }) });
    await reloadSkills();
  };

  const deleteSkill = async (id: string) => {
    await fetch("/api/admin/skills/delete", { method: "POST", body: JSON.stringify({ id }) });
    await reloadSkills();
  };

  const moveSkill = async (id: string, categoryId: number | null) => {
    await fetch("/api/admin/skills/update", { method: "POST", body: JSON.stringify({ id, categoryId }) });
    await reloadSkills();
  };

  const reorderSkills = async (ids: string[]) => {
    await fetch("/api/admin/skills/reorder", { method: "POST", body: JSON.stringify({ ids }) });
  };

  const addSkillCategory = async (name: string) => {
    if (!name.trim()) return;
    await fetch("/api/admin/skill-categories/create", { method: "POST", body: JSON.stringify({ name }) });
    await reloadSkillCategories();
  };

  const renameSkillCategory = async (id: number, name: string) => {
    if (!name.trim()) return;
    await fetch("/api/admin/skill-categories/update", { method: "POST", body: JSON.stringify({ id, name }) });
    await reloadSkillCategories();
    await reloadSkills();
  };

  const deleteSkillCategory = async (id: number) => {
    await fetch("/api/admin/skill-categories/delete", { method: "POST", body: JSON.stringify({ id }) });
    await reloadSkillCategories();
    await reloadSkills();
  };

  const reorderSkillCategories = async (ids: number[]) => {
    await fetch("/api/admin/skill-categories/reorder", { method: "POST", body: JSON.stringify({ ids }) });
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
              <SkillForm
                skills={skills}
                setSkills={setSkills}
                categories={skillCategories}
                setCategories={setSkillCategories}
                addSkill={addSkill}
                deleteSkill={deleteSkill}
                moveSkill={moveSkill}
                reorderSkills={reorderSkills}
                addCategory={addSkillCategory}
                renameCategory={renameSkillCategory}
                deleteCategory={deleteSkillCategory}
                reorderCategories={reorderSkillCategories}
              />
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
            <ProjectForm projects={projects} setProjects={setProjects} allSkills={skills} categories={skillCategories} />
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
function SkillForm({
  skills,
  setSkills,
  categories,
  setCategories,
  addSkill,
  deleteSkill,
  moveSkill,
  reorderSkills,
  addCategory,
  renameCategory,
  deleteCategory,
  reorderCategories,
}: any) {
  const [newCategory, setNewCategory] = useState("");
  const [drafts, setDrafts] = useState<Record<string, string>>({});

  // skill yang sedang di-drag: { id, key } — key = id kategori atau "none"
  const [dragSkill, setDragSkill] = useState<{ id: string; key: string } | null>(null);
  const [overSkillId, setOverSkillId] = useState<string | null>(null);
  const [overCategoryKey, setOverCategoryKey] = useState<string | null>(null);

  const dragCategory = useRef<number | null>(null);
  const catMoved = useRef(false);
  const [draggingCatIdx, setDraggingCatIdx] = useState<number | null>(null);

  const keyOf = (categoryId: any) => String(categoryId ?? "none");
  const skillsIn = (key: string) => skills.filter((s: any) => keyOf(s.categoryId) === key);

  const uncategorized = skillsIn("none");

  /* ---------- skill: reorder di dalam kategori ---------- */
  const reorderWithin = (key: string, fromId: string, toId: string) => {
    const group = skillsIn(key);
    const from = group.findIndex((s: any) => String(s.id) === String(fromId));
    const to = group.findIndex((s: any) => String(s.id) === String(toId));
    if (from < 0 || to < 0 || from === to) return;

    const reordered = [...group];
    const [moved] = reordered.splice(from, 1);
    reordered.splice(to, 0, moved);

    // susun ulang array global: posisi grup ini diisi urutan baru
    let cursor = 0;
    setSkills(
      skills.map((s: any) => (keyOf(s.categoryId) === key ? reordered[cursor++] : s))
    );
    reorderSkills(reordered.map((s: any) => s.id));
  };

  /* ---------- skill: drop ke kategori lain ---------- */
  const handleDropOnCategory = (key: string) => {
    if (dragSkill && dragSkill.key !== key) {
      moveSkill(dragSkill.id, key === "none" ? null : Number(key));
    }
    setDragSkill(null);
    setOverSkillId(null);
    setOverCategoryKey(null);
  };

  /* ---------- kategori: reorder (preview langsung saat dilewati) ---------- */
  const previewCategoryMove = (toIndex: number) => {
    const from = dragCategory.current;
    if (from === null || from === toIndex) return;

    const reordered = [...categories];
    const [moved] = reordered.splice(from, 1);
    reordered.splice(toIndex, 0, moved);

    setCategories(reordered);
    dragCategory.current = toIndex;
    setDraggingCatIdx(toIndex);
    catMoved.current = true;
  };

  const handleCatDragEnd = () => {
    if (catMoved.current) reorderCategories(categories.map((c: any) => c.id));
    dragCategory.current = null;
    catMoved.current = false;
    setDraggingCatIdx(null);
  };

  const submitDraft = (key: string, categoryId: number | null) => {
    const value = (drafts[key] || "").trim();
    if (!value) return;
    addSkill(value, categoryId);
    setDrafts((prev) => ({ ...prev, [key]: "" }));
  };

  const renderPill = (s: any, key: string) => (
    <div
      key={s.id}
      draggable
      onDragStart={() => setDragSkill({ id: s.id, key })}
      onDragEnter={() => {
        if (!dragSkill) return;
        setOverSkillId(s.id);
        if (dragSkill.key === key && String(dragSkill.id) !== String(s.id)) {
          reorderWithin(key, dragSkill.id, s.id);
        }
      }}
      onDragEnd={() => {
        setDragSkill(null);
        setOverSkillId(null);
        setOverCategoryKey(null);
      }}
      onDragOver={(e: any) => e.preventDefault()}
      className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm border select-none transition-all cursor-grab active:cursor-grabbing
        ${dragSkill && String(dragSkill.id) === String(s.id) ? "opacity-40 scale-95" : ""}
        ${overSkillId === s.id && dragSkill && String(dragSkill.id) !== String(s.id)
          ? "border-blue-500 bg-blue-500/10 text-white"
          : "bg-gray-700/50 border-gray-600/50 text-gray-200"
        }`}
    >
      <span className="text-gray-500 text-xs">⠿</span>
      <span>{s.skill}</span>
      <button
        onClick={() => deleteSkill(s.id)}
        className="text-gray-500 hover:text-red-400 transition-colors leading-none"
      >
        ✕
      </button>
    </div>
  );

  const renderAddInput = (key: string, categoryId: number | null) => (
    <div className="flex gap-2 mt-3">
      <input
        className="flex-1 rounded-xl px-3 py-2 text-sm bg-gray-900/60 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition"
        placeholder="Add a skill..."
        value={drafts[key] || ""}
        onChange={(e: any) => setDrafts((prev) => ({ ...prev, [key]: e.target.value }))}
        onKeyDown={(e: any) => e.key === "Enter" && submitDraft(key, categoryId)}
      />
      <BtnPrimary onClick={() => submitDraft(key, categoryId)}>Add</BtnPrimary>
    </div>
  );

  return (
    <div className="space-y-5">
      {/* tambah kategori */}
      <div className="flex gap-3 flex-col sm:flex-row">
        <input
          className="flex-1 rounded-xl px-4 py-2.5 text-sm bg-gray-900/60 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition"
          placeholder="Add a category... (Frontend, Backend, Database)"
          value={newCategory}
          onChange={(e: any) => setNewCategory(e.target.value)}
          onKeyDown={(e: any) => {
            if (e.key === "Enter") {
              addCategory(newCategory);
              setNewCategory("");
            }
          }}
        />
        <BtnPrimary
          onClick={() => {
            addCategory(newCategory);
            setNewCategory("");
          }}
        >
          Add Category
        </BtnPrimary>
      </div>

      {categories.length === 0 && uncategorized.length === 0 && (
        <p className="text-gray-500 text-sm">No skills added yet.</p>
      )}

      {/* daftar kategori */}
      {categories.map((cat: any, index: number) => {
        const key = keyOf(cat.id);
        const items = skillsIn(key);
        return (
          <div
            key={cat.id}
            onDragEnter={() => {
              // kartu penuh jadi target, bukan cuma ikon ⠿
              if (!dragSkill && draggingCatIdx !== null) previewCategoryMove(index);
            }}
            onDragOver={(e: any) => {
              e.preventDefault();
              if (dragSkill && dragSkill.key !== key) setOverCategoryKey(key);
            }}
            onDragLeave={() => setOverCategoryKey((prev) => (prev === key ? null : prev))}
            onDrop={() => handleDropOnCategory(key)}
            className={`rounded-2xl border p-4 transition-all
              ${draggingCatIdx === index ? "opacity-50 border-blue-500 ring-2 ring-blue-500/30" : ""}
              ${overCategoryKey === key
                ? "border-blue-500 bg-blue-500/[0.06]"
                : "border-gray-700/50 bg-gray-900/30"
              }`}
          >
            <div className="flex items-center gap-2">
              <span
                draggable
                onDragStart={(e: any) => {
                  e.stopPropagation();
                  dragCategory.current = index;
                  catMoved.current = false;
                  setDraggingCatIdx(index);
                }}
                onDragEnd={handleCatDragEnd}
                className="text-gray-500 hover:text-gray-300 text-sm cursor-grab active:cursor-grabbing px-1 transition-colors"
                title="Drag untuk mengubah urutan kategori"
              >
                ⠿
              </span>
              <input
                className="flex-1 bg-transparent text-sm font-semibold text-white focus:outline-none focus:bg-gray-800/60 rounded-lg px-2 py-1 transition"
                defaultValue={cat.name}
                onBlur={(e: any) => {
                  if (e.target.value.trim() && e.target.value !== cat.name) {
                    renameCategory(cat.id, e.target.value);
                  } else {
                    e.target.value = cat.name;
                  }
                }}
                onKeyDown={(e: any) => e.key === "Enter" && e.target.blur()}
              />
              <span className="text-xs text-gray-500 tabular-nums">{items.length}</span>
              <button
                onClick={() => {
                  if (confirm(`Hapus kategori "${cat.name}"? Skill di dalamnya jadi uncategorized.`)) {
                    deleteCategory(cat.id);
                  }
                }}
                className="text-gray-500 hover:text-red-400 transition-colors text-sm leading-none px-1"
              >
                ✕
              </button>
            </div>

            <div className="flex flex-wrap gap-2 mt-3 min-h-[38px]">
              {items.length === 0 && (
                <p className="text-gray-600 text-xs self-center">Kosong — tarik skill ke sini</p>
              )}
              {items.map((s: any) => renderPill(s, key))}
            </div>

            {renderAddInput(key, cat.id)}
          </div>
        );
      })}

      {/* skill tanpa kategori */}
      {(uncategorized.length > 0 || categories.length > 0) && (
        <div
          onDragOver={(e: any) => {
            e.preventDefault();
            if (dragSkill && dragSkill.key !== "none") setOverCategoryKey("none");
          }}
          onDragLeave={() => setOverCategoryKey((prev) => (prev === "none" ? null : prev))}
          onDrop={() => handleDropOnCategory("none")}
          className={`rounded-2xl border border-dashed p-4 transition-all
            ${overCategoryKey === "none"
              ? "border-blue-500 bg-blue-500/[0.06]"
              : "border-gray-700/50 bg-gray-900/20"
            }`}
        >
          <div className="flex items-center gap-2">
            <h4 className="flex-1 text-sm font-semibold text-gray-400">Uncategorized</h4>
            <span className="text-xs text-gray-500 tabular-nums">{uncategorized.length}</span>
          </div>

          <div className="flex flex-wrap gap-2 mt-3 min-h-[38px]">
            {uncategorized.length === 0 && (
              <p className="text-gray-600 text-xs self-center">Semua skill sudah punya kategori</p>
            )}
            {uncategorized.map((s: any) => renderPill(s, "none"))}
          </div>

          {renderAddInput("none", null)}
        </div>
      )}

      <p className="text-xs text-gray-600">
        Drag pill untuk mengubah urutan, atau tarik ke kategori lain untuk memindahkan. Klik nama kategori untuk rename.
      </p>
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

/* =========================================================
    SKILL PICKER — pilih kategori lalu pilih skill dari master
========================================================= */
function SkillPicker({ label = "Tech Stack", allSkills, categories, selectedIds, onChange }: any) {
  const [activeCat, setActiveCat] = useState<string>("all");
  const [query, setQuery] = useState("");

  const selected = selectedIds.map(Number);
  const isPicked = (id: any) => selected.includes(Number(id));

  const toggle = (id: any) => {
    const n = Number(id);
    onChange(isPicked(n) ? selected.filter((x: number) => x !== n) : [...selected, n]);
  };

  const q = query.trim().toLowerCase();

  // pencarian berlaku lintas kategori, kalau kosong ikut kategori aktif
  const visible = allSkills.filter((s: any) => {
    if (q) return s.skill.toLowerCase().includes(q);
    if (activeCat === "all") return true;
    if (activeCat === "none") return !s.categoryId;
    return String(s.categoryId) === activeCat;
  });

  const countIn = (catId: any) =>
    allSkills.filter((s: any) =>
      catId === "all" ? true : catId === "none" ? !s.categoryId : String(s.categoryId) === String(catId)
    ).length;

  const pickedSkills = selected
    .map((id: number) => allSkills.find((s: any) => Number(s.id) === id))
    .filter(Boolean);

  const uncategorizedCount = countIn("none");

  const chip = (id: string, name: string, count: number) => (
    <button
      key={id}
      type="button"
      onClick={() => setActiveCat(id)}
      className={`whitespace-nowrap px-2.5 py-1 rounded-lg text-xs transition-colors border ${
        activeCat === id && !q
          ? "bg-blue-600 border-blue-500 text-white"
          : "bg-gray-800/60 border-gray-700 text-gray-400 hover:text-gray-200"
      }`}
    >
      {name} <span className="opacity-60">{count}</span>
    </button>
  );

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-xs text-gray-400">{label}</label>
        <span className="text-xs text-gray-500">{selected.length} dipilih</span>
      </div>

      {/* yang sudah dipilih */}
      <div className="flex flex-wrap gap-1.5 min-h-[32px] rounded-xl border border-gray-700 bg-gray-900/60 p-2">
        {pickedSkills.length === 0 && (
          <span className="text-xs text-gray-600 self-center px-1">Belum ada skill dipilih</span>
        )}
        {pickedSkills.map((s: any) => (
          <button
            key={s.id}
            type="button"
            onClick={() => toggle(s.id)}
            className="flex items-center gap-1.5 text-xs px-2 py-1 rounded-lg bg-blue-500/15 border border-blue-500/40 text-blue-200 hover:bg-red-500/15 hover:border-red-500/40 hover:text-red-200 transition-colors"
            title="Klik untuk melepas"
          >
            {s.skill}
            <span className="opacity-60">✕</span>
          </button>
        ))}
      </div>

      {/* filter kategori + pencarian */}
      <input
        className="w-full rounded-xl px-3 py-2 text-sm bg-gray-900/60 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition"
        placeholder="Cari skill di semua kategori..."
        value={query}
        onChange={(e: any) => setQuery(e.target.value)}
      />

      <div className="flex gap-1.5 overflow-x-auto pb-1">
        {chip("all", "Semua", countIn("all"))}
        {categories.map((c: any) => chip(String(c.id), c.name, countIn(c.id)))}
        {uncategorizedCount > 0 && chip("none", "Tanpa kategori", uncategorizedCount)}
      </div>

      {/* daftar skill yang bisa dipilih */}
      <div className="flex flex-wrap gap-1.5 max-h-52 overflow-y-auto rounded-xl border border-gray-700/60 bg-gray-900/30 p-2">
        {visible.length === 0 && (
          <p className="text-xs text-gray-600 px-1 py-2">
            {q ? `Tidak ada skill cocok dengan "${query}".` : "Kategori ini masih kosong."} Tambah dulu di tab Skills.
          </p>
        )}
        {visible.map((s: any) => (
          <button
            key={s.id}
            type="button"
            onClick={() => toggle(s.id)}
            className={`text-xs px-2 py-1 rounded-lg border transition-colors ${
              isPicked(s.id)
                ? "bg-blue-500/20 border-blue-500/50 text-blue-200"
                : "bg-gray-800/60 border-gray-700 text-gray-300 hover:border-gray-500 hover:text-white"
            }`}
          >
            {isPicked(s.id) && <span className="mr-1">✓</span>}
            {s.skill}
            {q && s.categoryName && <span className="ml-1.5 opacity-50">{s.categoryName}</span>}
          </button>
        ))}
      </div>
    </div>
  );
}

function ProjectForm({ projects, setProjects, allSkills, categories }: any) {
  const [showAdd, setShowAdd] = useState(false);
  const [newProj, setNewProj] = useState({
    title: "", description: "", role: "", company: "",
    skillIds: [] as number[], year: "", status: "completed",
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
      body: JSON.stringify(newProj),
    });
    const updated = await fetch("/api/admin/projects").then(r => r.json());
    setProjects(Array.isArray(updated) ? updated : []);
    setNewProj({ title: "", description: "", role: "", company: "", skillIds: [], year: "", status: "completed", featured: false, isPrivate: false, demoUrl: "", repoUrl: "", coverImage: "" });
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
          <SkillPicker
            allSkills={allSkills}
            categories={categories}
            selectedIds={newProj.skillIds}
            onChange={(ids: number[]) => setNewProj({ ...newProj, skillIds: ids })}
          />
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
          allSkills={allSkills}
          categories={categories}
        />
      ))}
      {projects.length > 1 && <p className="text-xs text-gray-600">Drag card untuk mengubah urutan</p>}
    </div>
  );
}

function ProjectItem({ proj, index, draggingIdx, overIdx, onDragStart, onDragEnter, onDragEnd, updateLocalProject, updateLocalFlow, setProjects, allSkills, categories }: any) {
  const [editing, setEditing] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [skillIds, setSkillIds] = useState<number[]>((proj.skillIds || []).map(Number));

  const dragFlowItem = useRef<number | null>(null);
  const dragFlowOver = useRef<number | null>(null);
  const [draggingFlowIdx, setDraggingFlowIdx] = useState<number | null>(null);
  const [overFlowIdx, setOverFlowIdx] = useState<number | null>(null);

  const handleFlowDragStart = (i: number) => { dragFlowItem.current = i; setDraggingFlowIdx(i); };
  const handleFlowDragEnter = (i: number) => { dragFlowOver.current = i; setOverFlowIdx(i); };
  const handleFlowDragEnd = () => {
    if (dragFlowItem.current !== null && dragFlowOver.current !== null && dragFlowItem.current !== dragFlowOver.current) {
      const flows = [...(proj.flows || [])];
      const [moved] = flows.splice(dragFlowItem.current, 1);
      flows.splice(dragFlowOver.current, 0, moved);
      updateLocalProject(proj.id, "flows", flows);
      fetch("/api/admin/project-flows/reorder", {
        method: "POST",
        body: JSON.stringify({ ids: flows.map((f: any) => f.id) }),
      });
    }
    dragFlowItem.current = null;
    dragFlowOver.current = null;
    setDraggingFlowIdx(null);
    setOverFlowIdx(null);
  };

  const saveProject = async () => {
    await fetch("/api/admin/projects/update", { method: "POST", body: JSON.stringify({ ...proj, skillIds }) });

    // pill di header ikut menyesuaikan tanpa perlu reload
    const picked = skillIds
      .map(id => allSkills.find((s: any) => Number(s.id) === Number(id)))
      .filter(Boolean);
    updateLocalProject(proj.id, "skillIds", skillIds);
    updateLocalProject(proj.id, "techStack", picked.map((s: any) => s.skill));
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
          <SkillPicker
            allSkills={allSkills}
            categories={categories}
            selectedIds={skillIds}
            onChange={setSkillIds}
          />
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
          {(proj.flows || []).map((flow: any, fi: number) => (
            <FlowItem
              key={flow.id}
              flow={flow}
              projId={proj.id}
              index={fi}
              draggingFlowIdx={draggingFlowIdx}
              overFlowIdx={overFlowIdx}
              onFlowDragStart={handleFlowDragStart}
              onFlowDragEnter={handleFlowDragEnter}
              onFlowDragEnd={handleFlowDragEnd}
              updateLocalFlow={updateLocalFlow}
              updateFlow={updateFlow}
              deleteFlow={deleteFlow}
            />
          ))}
          <AddFlowForm onAdd={addFlow} />
        </div>
      )}
    </div>
  );
}

function FlowItem({ flow, projId, index, draggingFlowIdx, overFlowIdx, onFlowDragStart, onFlowDragEnter, onFlowDragEnd, updateLocalFlow, updateFlow, deleteFlow }: any) {
  const [editing, setEditing] = useState(false);

  return (
    <div
      draggable
      onDragStart={(e) => { e.stopPropagation(); onFlowDragStart(index); }}
      onDragEnter={(e) => { e.stopPropagation(); onFlowDragEnter(index); }}
      onDragEnd={(e) => { e.stopPropagation(); onFlowDragEnd(); }}
      onDragOver={(e) => e.preventDefault()}
      className={`rounded-xl border overflow-hidden transition-all select-none
        ${draggingFlowIdx === index ? "opacity-40 scale-95" : ""}
        ${overFlowIdx === index && draggingFlowIdx !== index ? "border-blue-500 bg-blue-500/5" : "border-gray-700/40 bg-gray-800/30"}`}
    >
      <div className="px-4 py-3 flex gap-3 items-start">
        <span className="text-gray-500 cursor-grab active:cursor-grabbing mt-1 shrink-0">⠿</span>
        {flow.imageUrl && (
          <img src={flow.imageUrl} alt={flow.title} className="w-16 h-16 rounded-lg object-contain shrink-0 bg-gray-700" />
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
