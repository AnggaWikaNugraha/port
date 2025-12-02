"use client";

import { useState, useEffect } from "react";

export default function AdminProfilePage() {
  const [user, setUser] = useState<any>(null);

  const [skills, setSkills] = useState<any[]>([]);
  const [interests, setInterests] = useState<any[]>([]);
  const [experiences, setExperiences] = useState<any[]>([]);
  const [certificates, setCertificates] = useState<any[]>([]);

  const [newSkill, setNewSkill] = useState("");
  const [newInterest, setNewInterest] = useState("");
  const [newExp, setNewExp] = useState({
    company: "",
    companyLogoUrl: "",
    location: "",
  });

  const [newCert, setNewCert] = useState({
    title: "",
    issuer: "",
    issue_date: "",
    expiration_date: "",
    credential_url: "",
  });

  const [activeTab, setActiveTab] = useState("profile");
  const [loading, setLoading] = useState(true);

  // =========================================================
  // FETCH
  // =========================================================
  useEffect(() => {
    Promise.all([
      fetch("/api/profile").then((r) => r.json()),
      fetch("/api/admin/skills").then((r) => r.json()),
      fetch("/api/admin/interests").then((r) => r.json()),
      fetch("/api/admin/experience").then((r) => r.json()),
      fetch("/api/admin/certificates").then((r) => r.json()),
    ]).then(([u, s, i, e, c]) => {
      setUser(u);
      setSkills(s);
      setInterests(i);
      setExperiences(e);
      setCertificates(c);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="p-10 text-center">Loading...</div>;

  // =========================================================
  // HELPERS
  // =========================================================
  async function refresh(url: string) {
    return await fetch(url).then((r) => r.json());
  }

  function updateLocalExp(id: string, key: string, val: any) {
    setExperiences((prev) =>
      prev.map((x) => (x.id === id ? { ...x, [key]: val } : x))
    );
  }

  function updateLocalCert(id: string, key: string, val: any) {
    setCertificates((prev) =>
      prev.map((x) => (x.id === id ? { ...x, [key]: val } : x))
    );
  }

  // =========================================================
  // CRUD API CALLS (tidak berubah)
  // =========================================================

  const saveProfile = async () => {
    await fetch("/api/profile/update", {
      method: "POST",
      body: JSON.stringify(user),
    });
    alert("Profile updated!");
  };

  const addSkill = async () => {
    if (!newSkill.trim()) return;
    await fetch("/api/admin/skills/create", {
      method: "POST",
      body: JSON.stringify({ skill: newSkill }),
    });
    setSkills(await refresh("/api/admin/skills"));
    setNewSkill("");
  };

  const deleteSkill = async (id: string) => {
    await fetch("/api/admin/skills/delete", {
      method: "POST",
      body: JSON.stringify({ id }),
    });
    setSkills(await refresh("/api/admin/skills"));
  };

  const addInterest = async () => {
    if (!newInterest.trim()) return;
    await fetch("/api/admin/interests/create", {
      method: "POST",
      body: JSON.stringify({ interest: newInterest }),
    });
    setInterests(await refresh("/api/admin/interests"));
    setNewInterest("");
  };

  const deleteInterest = async (id: string) => {
    await fetch("/api/admin/interests/delete", {
      method: "POST",
      body: JSON.stringify({ id }),
    });
    setInterests(await refresh("/api/admin/interests"));
  };

  const addExperience = async () => {
    if (!newExp.company) return;
    await fetch("/api/admin/experience/create", {
      method: "POST",
      body: JSON.stringify(newExp),
    });
    setExperiences(await refresh("/api/admin/experience"));
    setNewExp({ company: "", companyLogoUrl: "", location: "" });
  };

  const updateExperience = async (exp: any) => {
    await fetch("/api/admin/experience/update", {
      method: "POST",
      body: JSON.stringify(exp),
    });
    alert("Experience updated!");
  };

  const deleteExperience = async (id: string) => {
    await fetch("/api/admin/experience/delete", {
      method: "POST",
      body: JSON.stringify({ id }),
    });
    setExperiences(await refresh("/api/admin/experience"));
  };

  const addCertificate = async () => {
    if (!newCert.title.trim()) return;
    await fetch("/api/admin/certificates/create", {
      method: "POST",
      body: JSON.stringify(newCert),
    });
    setCertificates(await refresh("/api/admin/certificates"));
    setNewCert({
      title: "",
      issuer: "",
      issue_date: "",
      expiration_date: "",
      credential_url: "",
    });
  };

  const updateCertificate = async (cert: any) => {
    await fetch("/api/admin/certificates/update", {
      method: "POST",
      body: JSON.stringify(cert),
    });
    alert("Certificate updated!");
  };

  const deleteCertificate = async (id: string) => {
    await fetch("/api/admin/certificates/delete", {
      method: "POST",
      body: JSON.stringify({ id }),
    });
    setCertificates(await refresh("/api/admin/certificates"));
  };

  // =========================================================
  // UI COMPONENTS
  // =========================================================
  const TABS = [
    { id: "profile", label: "Profile", icon: "👤" },
    { id: "skills", label: "Skills", icon: "⚡" },
    { id: "interests", label: "Interests", icon: "❤️" },
    { id: "experience", label: "Experience", icon: "🏢" },
    { id: "certificates", label: "Certificates", icon: "🎓" },
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 md:p-10 mt-10">
      <div className="max-w-5xl mx-auto">
        {/* ================= TABS (responsive) ================= */}
        <div className="flex gap-2 overflow-x-auto pb-2 sticky top-0 bg-gray-100 z-10">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`
                whitespace-nowrap px-4 py-2 rounded-full text-sm 
                transition font-medium
                ${
                  activeTab === t.id
                    ? "bg-blue-600 text-white shadow"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }
              `}
            >
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        {/* ================= CONTENT ================= */}
        <div className="mt-6">
          {activeTab === "profile" && (
            <Card>
              <ProfileForm
                user={user}
                setUser={setUser}
                saveProfile={saveProfile}
              />
            </Card>
          )}

          {activeTab === "skills" && (
            <Card>
              <SkillForm
                skills={skills}
                newSkill={newSkill}
                setNewSkill={setNewSkill}
                addSkill={addSkill}
                deleteSkill={deleteSkill}
              />
            </Card>
          )}

          {activeTab === "interests" && (
            <Card>
              <InterestForm
                interests={interests}
                newInterest={newInterest}
                setNewInterest={setNewInterest}
                addInterest={addInterest}
                deleteInterest={deleteInterest}
              />
            </Card>
          )}

          {activeTab === "experience" && (
            <Card>
              <ExperienceForm
                experiences={experiences}
                newExp={newExp}
                setNewExp={setNewExp}
                addExperience={addExperience}
                updateLocalExp={updateLocalExp}
                updateExperience={updateExperience}
                deleteExperience={deleteExperience}
              />
            </Card>
          )}

          {activeTab === "certificates" && (
            <Card>
              <CertificateForm
                certificates={certificates}
                newCert={newCert}
                setNewCert={setNewCert}
                addCertificate={addCertificate}
                updateLocalCert={updateLocalCert}
                updateCertificate={updateCertificate}
                deleteCertificate={deleteCertificate}
              />
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

/* =========================================================
    SUB COMPONENTS (Design Clean + Fully Responsive)
========================================================= */

function Card({ children }: any) {
  return (
    <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border space-y-5">
      {children}
    </div>
  );
}

function Input({ label, type = "text", ...props }: any) {
  return (
    <div className="space-y-1">
      {label && <label className="text-sm text-gray-600">{label}</label>}

      {type === "textarea" ? (
        <textarea
          {...props}
          className="border w-full rounded-lg p-2 bg-gray-50 focus:ring-2 ring-blue-300"
        />
      ) : (
        <input
          {...props}
          type={type}
          className="border w-full rounded-lg p-2 bg-gray-50 focus:ring-2 ring-blue-300"
        />
      )}
    </div>
  );
}

/* ---------------------------------------------------------
      PROFILE FORM
--------------------------------------------------------- */
function ProfileForm({ user, setUser, saveProfile }: any) {
  return (
    <div className="space-y-4">
      {/* GRID RESPONSIVE */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Name"
          value={user.name}
          onChange={(e: any) => setUser({ ...user, name: e.target.value })}
        />
        <Input
          label="Username"
          value={user.username}
          onChange={(e: any) => setUser({ ...user, username: e.target.value })}
        />
        <Input
          label="Email"
          value={user.email}
          onChange={(e: any) => setUser({ ...user, email: e.target.value })}
        />
        <Input
          label="Phone"
          value={user.phone}
          onChange={(e: any) => setUser({ ...user, phone: e.target.value })}
        />
        <Input
          label="Location"
          value={user.location}
          onChange={(e: any) => setUser({ ...user, location: e.target.value })}
        />
        <Input
          label="Website"
          value={user.website}
          onChange={(e: any) => setUser({ ...user, website: e.target.value })}
        />
        <Input
          label="Job Title"
          value={user.job_title}
          onChange={(e: any) => setUser({ ...user, job_title: e.target.value })}
        />
        <Input
          label="Company"
          value={user.company}
          onChange={(e: any) => setUser({ ...user, company: e.target.value })}
        />
      </div>

      <Input
        label="Avatar URL"
        value={user.avatar_url}
        onChange={(e: any) => setUser({ ...user, avatar_url: e.target.value })}
      />

      <Input
        label="Bio"
        type="textarea"
        value={user.bio}
        onChange={(e: any) => setUser({ ...user, bio: e.target.value })}
      />

      <button
        onClick={saveProfile}
        className="bg-blue-600 text-white px-5 py-2 rounded-lg shadow hover:bg-blue-700"
      >
        Save Profile
      </button>
    </div>
  );
}

/* ---------------------------------------------------------
      SKILLS FORM
--------------------------------------------------------- */
function SkillForm({
  skills,
  newSkill,
  setNewSkill,
  addSkill,
  deleteSkill,
}: any) {
  return (
    <div className="space-y-4">
      <div className="flex gap-3 flex-col sm:flex-row">
        <input
          className="flex-1 border rounded-lg p-2 bg-gray-50"
          placeholder="Add skill..."
          value={newSkill}
          onChange={(e: any) => setNewSkill(e.target.value)}
        />

        <button
          className="bg-blue-600 text-white px-4 py-2 rounded-lg"
          onClick={addSkill}
        >
          Add
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {skills.map((s: any) => (
          <div
            key={s.id}
            className="bg-gray-200 px-3 py-1 rounded-full flex items-center gap-2"
          >
            <span>{s.skill}</span>
            <button className="text-red-600" onClick={() => deleteSkill(s.id)}>
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------
      INTEREST FORM
--------------------------------------------------------- */
function InterestForm({
  interests,
  newInterest,
  setNewInterest,
  addInterest,
  deleteInterest,
}: any) {
  return (
    <div className="space-y-4">
      <div className="flex gap-3 flex-col sm:flex-row">
        <input
          className="flex-1 border rounded-lg p-2 bg-gray-50"
          placeholder="Add interest..."
          value={newInterest}
          onChange={(e: any) => setNewInterest(e.target.value)}
        />

        <button
          className="bg-blue-600 text-white px-4 py-2 rounded-lg"
          onClick={addInterest}
        >
          Add
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {interests.map((i: any) => (
          <div
            key={i.id}
            className="bg-gray-200 px-3 py-1 rounded-full flex items-center gap-2"
          >
            <span>{i.interest}</span>
            <button
              className="text-red-600"
              onClick={() => deleteInterest(i.id)}
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------
      EXPERIENCE FORM — RESPONSIVE + ROLES FIX
--------------------------------------------------------- */
function ExperienceForm({
  experiences,
  newExp,
  setNewExp,
  addExperience,
  updateLocalExp,
  updateExperience,
  deleteExperience,
}: any) {
  const [openExp, setOpenExp] = useState<any>(null);
  const [openRole, setOpenRole] = useState<any>(null);

  // Local update role (internal only)
  function updateLocalRole(
    expId: string,
    roleId: string,
    key: string,
    value: any
  ) {
    updateLocalExp(
      expId,
      "roles",
      experiences
        .find((x: any) => x.id === expId)
        .roles.map((r: any) => (r.id === roleId ? { ...r, [key]: value } : r))
    );
  }

  return (
    <div className="space-y-6">
      {/* ADD EXPERIENCE */}
      <div className="border rounded-xl p-4 bg-gray-50 space-y-3">
        <Input
          placeholder="Company"
          value={newExp.company}
          onChange={(e: any) => setNewExp({ ...newExp, company: e.target.value })}
        />
        <Input
          placeholder="Logo URL"
          value={newExp.companyLogoUrl}
          onChange={(e: any) =>
            setNewExp({ ...newExp, companyLogoUrl: e.target.value })
          }
        />
        <Input
          placeholder="Location"
          value={newExp.location}
          onChange={(e: any) => setNewExp({ ...newExp, location: e.target.value })}
        />

        <button
          className="bg-blue-600 text-white px-4 py-2 rounded-lg"
          onClick={addExperience}
        >
          Add Experience
        </button>
      </div>

      {/* LIST EXPERIENCE */}
      {experiences.map((exp: any) => (
        <div key={exp.id} className="border rounded-xl bg-white">
          {/* HEADER */}
          <div
            className="p-4 flex justify-between items-center cursor-pointer hover:bg-gray-50 transition"
            onClick={() => setOpenExp(openExp === exp.id ? null : exp.id)}
          >
            <div>
              <h3 className="font-semibold">{exp.company}</h3>
              <p className="text-sm text-gray-500">{exp.location}</p>
            </div>

            <span>{openExp === exp.id ? "▲" : "▼"}</span>
          </div>

          {/* EXPANDED AREA */}
          {openExp === exp.id && (
            <div className="p-4 border-t space-y-5">
              {/* EDIT EXPERIENCE */}
              <Input
                label="Company"
                value={exp.company}
                onChange={(e: any) =>
                  updateLocalExp(exp.id, "company", e.target.value)
                }
              />
              <Input
                label="Logo URL"
                value={exp.companyLogoUrl}
                onChange={(e: any) =>
                  updateLocalExp(exp.id, "companyLogoUrl", e.target.value)
                }
              />
              <Input
                label="Location"
                value={exp.location}
                onChange={(e: any) =>
                  updateLocalExp(exp.id, "location", e.target.value)
                }
              />

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  className="bg-green-600 text-white px-4 py-2 rounded-lg"
                  onClick={() => updateExperience(exp)}
                >
                  Update
                </button>

                <button
                  className="bg-red-600 text-white px-4 py-2 rounded-lg"
                  onClick={() => deleteExperience(exp.id)}
                >
                  Delete
                </button>
              </div>

              {/* ===================== ROLES START ===================== */}
              <div className="pt-3 space-y-4">
                <h3 className="font-semibold text-lg">Roles</h3>

                {/* ADD ROLE */}
                <AddRoleForm
                  experienceId={exp.id}
                  refreshLocal={updateLocalExp}
                />

                {/* LIST ROLES */}
                {exp.roles?.map((role: any) => (
                  <div key={role.id} className="border rounded-lg bg-gray-50">
                    {/* ROLE HEADER */}
                    <div
                      className="p-3 flex justify-between cursor-pointer hover:bg-gray-100"
                      onClick={() =>
                        setOpenRole(openRole === role.id ? null : role.id)
                      }
                    >
                      <div>
                        <p className="font-semibold">{role.title}</p>
                        <p className="text-xs text-gray-500">
                          {role.employmentType}
                        </p>
                      </div>
                      <span>{openRole === role.id ? "▲" : "▼"}</span>
                    </div>

                    {/* ROLE FORM */}
                    {openRole === role.id && (
                      <div className="p-3 border-t space-y-3">
                        <Input
                          label="Title"
                          value={role.title}
                          onChange={(e: any) =>
                            updateLocalRole(
                              exp.id,
                              role.id,
                              "title",
                              e.target.value
                            )
                          }
                        />

                        <Input
                          label="Employment Type"
                          value={role.employmentType}
                          onChange={(e: any) =>
                            updateLocalRole(
                              exp.id,
                              role.id,
                              "employmentType",
                              e.target.value
                            )
                          }
                        />

                        <Input
                          type="date"
                          label="Start Date"
                          value={role.startDate}
                          onChange={(e: any) =>
                            updateLocalRole(
                              exp.id,
                              role.id,
                              "startDate",
                              e.target.value
                            )
                          }
                        />

                        <Input
                          type="date"
                          label="End Date"
                          value={role.endDate || ""}
                          onChange={(e: any) =>
                            updateLocalRole(
                              exp.id,
                              role.id,
                              "endDate",
                              e.target.value
                            )
                          }
                        />

                        <textarea
                          className="border rounded-lg p-2 w-full bg-white"
                          value={role.description}
                          onChange={(e: any) =>
                            updateLocalRole(
                              exp.id,
                              role.id,
                              "description",
                              e.target.value
                            )
                          }
                        />

                        <div className="flex flex-col sm:flex-row gap-3">
                          <button
                            className="bg-green-600 text-white px-3 py-1 rounded"
                            onClick={() =>
                              fetch("/api/admin/roles/update", {
                                method: "POST",
                                body: JSON.stringify(role),
                              })
                            }
                          >
                            Update
                          </button>

                          <button
                            className="bg-red-600 text-white px-3 py-1 rounded"
                            onClick={() =>
                              fetch("/api/admin/roles/delete", {
                                method: "POST",
                                body: JSON.stringify({ id: role.id }),
                              })
                            }
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              {/* ===================== ROLES END ===================== */}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

/* ADD ROLE FORM */
function AddRoleForm({ experienceId, refreshLocal }: any) {
  const [role, setRole] = useState({
    title: "",
    employmentType: "",
    startDate: "",
    endDate: "",
    description: "",
  });

  const createRole = async () => {
    await fetch("/api/admin/roles/create", {
      method: "POST",
      body: JSON.stringify({ ...role, experienceId }),
    });

    // reload experience data
    const updated = await fetch("/api/admin/experience").then((r) => r.json());

    refreshLocal(
      experienceId,
      "roles",
      updated.find((x: any) => x.id === experienceId).roles
    );

    setRole({
      title: "",
      employmentType: "",
      startDate: "",
      endDate: "",
      description: "",
    });
  };

  return (
    <div className="p-3 border rounded-lg bg-white space-y-2">
      <Input
        placeholder="Role Title"
        value={role.title}
        onChange={(e: any) => setRole({ ...role, title: e.target.value })}
      />
      <Input
        placeholder="Employment Type"
        value={role.employmentType}
        onChange={(e: any) => setRole({ ...role, employmentType: e.target.value })}
      />
      <Input
        type="date"
        label="Start"
        value={role.startDate}
        onChange={(e: any) => setRole({ ...role, startDate: e.target.value })}
      />
      <Input
        type="date"
        label="End"
        value={role.endDate}
        onChange={(e: any) => setRole({ ...role, endDate: e.target.value })}
      />

      <textarea
        className="border rounded-lg p-2 w-full bg-white"
        placeholder="Description"
        value={role.description}
        onChange={(e: any) => setRole({ ...role, description: e.target.value })}
      />

      <button
        className="bg-blue-600 text-white px-4 py-1 rounded"
        onClick={createRole}
      >
        Add Role
      </button>
    </div>
  );
}

/* ---------------------------------------------------------
      CERTIFICATE FORM
--------------------------------------------------------- */
function CertificateForm({
  certificates,
  newCert,
  setNewCert,
  addCertificate,
  updateLocalCert,
  updateCertificate,
  deleteCertificate,
}: any) {
  const [open, setOpen] = useState<any>(null);

  return (
    <div className="space-y-6">
      {/* ADD */}
      <div className="border rounded-xl p-4 bg-gray-50 space-y-3">
        <Input
          placeholder="Title"
          value={newCert.title}
          onChange={(e: any) =>
            setNewCert({ ...newCert, title: e.target.value })
          }
        />
        <Input
          placeholder="Issuer"
          value={newCert.issuer}
          onChange={(e: any) =>
            setNewCert({ ...newCert, issuer: e.target.value })
          }
        />
        <Input
          type="date"
          label="Issue Date"
          value={newCert.issue_date}
          onChange={(e: any) =>
            setNewCert({ ...newCert, issue_date: e.target.value })
          }
        />
        <Input
          type="date"
          label="Expiration"
          value={newCert.expiration_date}
          onChange={(e: any) =>
            setNewCert({ ...newCert, expiration_date: e.target.value })
          }
        />
        <Input
          placeholder="Credential URL"
          value={newCert.credential_url}
          onChange={(e: any) =>
            setNewCert({ ...newCert, credential_url: e.target.value })
          }
        />

        <button
          className="bg-blue-600 text-white px-4 py-2 rounded-lg"
          onClick={addCertificate}
        >
          Add Certificate
        </button>
      </div>

      {/* LIST */}
      {certificates.map((c: any) => (
        <div key={c.id} className="border rounded-xl bg-white">
          <div
            onClick={() => setOpen(open === c.id ? null : c.id)}
            className="p-4 flex justify-between items-center cursor-pointer hover:bg-gray-50"
          >
            <div>
              <h3 className="font-semibold">{c.title}</h3>
              <p className="text-sm text-gray-500">{c.issuer}</p>
            </div>

            <span>{open === c.id ? "▲" : "▼"}</span>
          </div>

          {open === c.id && (
            <div className="p-4 border-t space-y-3">
              <Input
                label="Title"
                value={c.title}
                onChange={(e: any) =>
                  updateLocalCert(c.id, "title", e.target.value)
                }
              />
              <Input
                label="Issuer"
                value={c.issuer}
                onChange={(e: any) =>
                  updateLocalCert(c.id, "issuer", e.target.value)
                }
              />
              <Input
                type="date"
                label="Issue Date"
                value={c.issue_date}
                onChange={(e: any) =>
                  updateLocalCert(c.id, "issue_date", e.target.value)
                }
              />
              <Input
                type="date"
                label="Expiration"
                value={c.expiration_date}
                onChange={(e: any) =>
                  updateLocalCert(c.id, "expiration_date", e.target.value)
                }
              />
              <Input
                label="Credential URL"
                value={c.credential_url}
                onChange={(e: any) =>
                  updateLocalCert(c.id, "credential_url", e.target.value)
                }
              />

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  className="bg-green-600 text-white px-4 py-2 rounded-lg"
                  onClick={() => updateCertificate(c)}
                >
                  Update
                </button>

                <button
                  className="bg-red-600 text-white px-4 py-2 rounded-lg"
                  onClick={() => deleteCertificate(c.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
