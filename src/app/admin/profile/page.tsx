"use client";

import { useState, useEffect } from "react";

export default function AdminProfilePage() {
  const [user, setUser] = useState<any>(null);

  const [skills, setSkills] = useState<any[]>([]);
  const [newSkill, setNewSkill] = useState("");

  const [interests, setInterests] = useState<any[]>([]);
  const [newInterest, setNewInterest] = useState("");

  const [experiences, setExperiences] = useState<any[]>([]);
  const [newExp, setNewExp] = useState({
    company: "",
    companyLogoUrl: "",
    location: "",
  });

  const [certificates, setCertificates] = useState<any[]>([]);
  const [newCert, setNewCert] = useState<any>({
    title: "",
    issuer: "",
    issue_date: "",
    expiration_date: "",
    credential_url: "",
  });

  const [loading, setLoading] = useState(true);

  // ============= FETCH ALL DATA =============
  useEffect(() => {
    Promise.all([
      fetch("/api/profile").then((r) => r.json()),
      fetch("/api/admin/skills").then((r) => r.json()),
      fetch("/api/admin/interests").then((r) => r.json()),
      fetch("/api/admin/experience").then((r) => r.json()),
      fetch("/api/admin/certificates").then((r) => r.json()), // ⬅️ NEW
    ]).then(([userData, skillData, interestData, expData, certData]) => {
      setUser(userData);
      setSkills(skillData);
      setInterests(interestData);
      setExperiences(expData);
      setCertificates(certData); // ⬅️ NEW
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="p-10 text-center">Loading...</div>;

  // ================================
  // PROFILE SAVE
  // ================================
  const saveProfile = async () => {
    await fetch("/api/profile/update", {
      method: "POST",
      body: JSON.stringify(user),
    });

    alert("Profile Updated!");
  };

  // ================================
  // SKILLS CRUD
  // ================================
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

  // ================================
  // INTEREST CRUD
  // ================================
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

  // ================================
  // EXPERIENCE CRUD
  // ================================
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

  // ================================
  // ROLES CRUD
  // ================================
  const addRole = async (expId: string, role: any) => {
    await fetch("/api/admin/roles/create", {
      method: "POST",
      body: JSON.stringify({ ...role, experienceId: expId }),
    });

    setExperiences(await refresh("/api/admin/experience"));
  };

  const updateRole = async (role: any) => {
    await fetch("/api/admin/roles/update", {
      method: "POST",
      body: JSON.stringify(role),
    });

    alert("Role updated!");
  };

  const deleteRole = async (id: string) => {
    await fetch("/api/admin/roles/delete", {
      method: "POST",
      body: JSON.stringify({ id }),
    });

    setExperiences(await refresh("/api/admin/experience"));
  };

  // helper refresh
  async function refresh(url: string) {
    return await fetch(url).then((x) => x.json());
  }

  function updateLocalRole(
    expId: string,
    roleId: string,
    key: string,
    value: any
  ) {
    setExperiences((prev: any[]) =>
      prev.map((exp) =>
        exp.id === expId
          ? {
              ...exp,
              roles: exp.roles.map((r: any) =>
                r.id === roleId ? { ...r, [key]: value } : r
              ),
            }
          : exp
      )
    );
  }

  // ================================
  // CERTIFICATES CRUD
  // ================================

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

  // local update input
  function updateLocalCert(id: string, key: string, value: any) {
    setCertificates((prev) =>
      prev.map((c) => (c.id === id ? { ...c, [key]: value } : c))
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-sm space-y-10">
        {/* ================= PROFILE ================= */}
        <section>
          <h2 className="text-2xl font-bold mb-4">Profile</h2>

          <div className="grid grid-cols-1 gap-4">
            <Input
              label="Name"
              value={user.name}
              onChange={(e: any) => setUser({ ...user, name: e.target.value })}
            />
            <Input
              label="Username"
              value={user.username}
              onChange={(e: any) =>
                setUser({ ...user, username: e.target.value })
              }
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
              onChange={(e: any) =>
                setUser({ ...user, location: e.target.value })
              }
            />
            <Input
              label="Website"
              value={user.website}
              onChange={(e: any) =>
                setUser({ ...user, website: e.target.value })
              }
            />
            <Input
              label="Job Title"
              value={user.job_title}
              onChange={(e: any) =>
                setUser({ ...user, job_title: e.target.value })
              }
            />
            <Input
              label="Company"
              value={user.company}
              onChange={(e: any) =>
                setUser({ ...user, company: e.target.value })
              }
            />
          </div>

          <Input
            label="Avatar URL"
            value={user.avatar_url}
            onChange={(e: any) =>
              setUser({ ...user, avatar_url: e.target.value })
            }
            className="mt-3"
          />
          <Input
            label="Bio"
            type="textarea"
            value={user.bio}
            onChange={(e: any) => setUser({ ...user, bio: e.target.value })}
            className="mt-3"
          />

          <button
            className="mt-4 px-5 py-2 bg-blue-600 text-white rounded"
            onClick={saveProfile}
          >
            Save Profile
          </button>
        </section>

        {/* ================= SKILLS ================= */}
        <SectionCRUD
          title="Skills"
          items={skills.map((s) => ({ id: s.id, label: s.skill }))}
          newValue={newSkill}
          setNewValue={setNewSkill}
          addFn={addSkill}
          deleteFn={deleteSkill}
          placeholder="Add skill..."
        />

        {/* ================= INTERESTS ================= */}
        <SectionCRUD
          title="Interests"
          items={interests.map((i) => ({ id: i.id, label: i.interest }))}
          newValue={newInterest}
          setNewValue={setNewInterest}
          addFn={addInterest}
          deleteFn={deleteInterest}
          placeholder="Add interest..."
        />

        {/* ================= EXPERIENCE ================= */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold">Experience</h2>

          {/* add exp */}
          <div className="bg-gray-50 p-4 rounded-lg border space-y-2">
            <Input
              placeholder="Company"
              value={newExp.company}
              onChange={(e: any) =>
                setNewExp({ ...newExp, company: e.target.value })
              }
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
              onChange={(e: any) =>
                setNewExp({ ...newExp, location: e.target.value })
              }
            />

            <button
              className="px-4 py-2 bg-blue-600 text-white rounded"
              onClick={addExperience}
            >
              Add Experience
            </button>
          </div>

          {/* list exp */}
          {experiences.map((exp) => (
            <div
              key={exp.id}
              className="border rounded-lg p-4 bg-white space-y-3"
            >
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

              <button
                className="px-4 py-2 bg-green-600 text-white rounded"
                onClick={() => updateExperience(exp)}
              >
                Update Experience
              </button>

              <button
                className="px-4 py-2 bg-red-600 text-white rounded ml-2"
                onClick={() => deleteExperience(exp.id)}
              >
                Delete
              </button>

              {/* ROLES */}
              <RoleSection
                updateLocalRole={updateLocalRole}
                exp={exp}
                addRole={addRole}
                updateRole={updateRole}
                deleteRole={deleteRole}
              />

              {/* ================= CERTIFICATES ================= */}
              <section className="space-y-6">
                <h2 className="text-2xl font-bold">Certificates</h2>

                {/* ADD CERTIFICATE */}
                <div className="bg-gray-50 p-4 rounded-lg border space-y-2">
                  <Input
                    placeholder="Certificate Title"
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
                    label="Expiration Date"
                    value={newCert.expiration_date}
                    onChange={(e: any) =>
                      setNewCert({
                        ...newCert,
                        expiration_date: e.target.value,
                      })
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
                    className="px-4 py-2 bg-blue-600 text-white rounded"
                    onClick={addCertificate}
                  >
                    Add Certificate
                  </button>
                </div>

                {/* LIST CERTIFICATES */}
                {certificates.map((cert: any) => (
                  <div
                    key={cert.id}
                    className="border p-4 rounded-lg bg-white space-y-3"
                  >
                    <Input
                      label="Title"
                      value={cert.title}
                      onChange={(e: any) =>
                        updateLocalCert(cert.id, "title", e.target.value)
                      }
                    />

                    <Input
                      label="Issuer"
                      value={cert.issuer}
                      onChange={(e: any) =>
                        updateLocalCert(cert.id, "issuer", e.target.value)
                      }
                    />

                    <Input
                      type="date"
                      label="Issue Date"
                      value={cert.issue_date}
                      onChange={(e: any) =>
                        updateLocalCert(cert.id, "issue_date", e.target.value)
                      }
                    />

                    <Input
                      type="date"
                      label="Expiration Date"
                      value={cert.expiration_date}
                      onChange={(e: any) =>
                        updateLocalCert(
                          cert.id,
                          "expiration_date",
                          e.target.value
                        )
                      }
                    />

                    <Input
                      label="Credential URL"
                      value={cert.credential_url}
                      onChange={(e: any) =>
                        updateLocalCert(
                          cert.id,
                          "credential_url",
                          e.target.value
                        )
                      }
                    />

                    <button
                      className="px-3 py-1 bg-green-600 text-white rounded"
                      onClick={() => updateCertificate(cert)}
                    >
                      Update
                    </button>

                    <button
                      className="ml-2 px-3 py-1 bg-red-600 text-white rounded"
                      onClick={() => deleteCertificate(cert.id)}
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </section>
            </div>
          ))}
        </section>
      </div>
    </div>
  );

  // LOCAL UI UPDATE
  function updateLocalExp(id: string, key: string, val: any) {
    setExperiences((prev) =>
      prev.map((x) => (x.id === id ? { ...x, [key]: val } : x))
    );
  }
}

/* ---------- SMALL REUSABLES ---------- */

function Input({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  className = "",
}: any) {
  return (
    <div className={`flex flex-col ${className}`}>
      {label && (
        <label className="font-medium text-gray-700 mb-1">{label}</label>
      )}
      {type === "textarea" ? (
        <textarea
          className="border p-2 rounded w-full"
          value={value}
          onChange={onChange}
          placeholder={placeholder}
        />
      ) : (
        <input
          className="border p-2 rounded w-full"
          value={value}
          onChange={onChange}
          placeholder={placeholder}
        />
      )}
    </div>
  );
}

/* TAG CRUD SECTIONS (SKILL/INTEREST) */
function SectionCRUD({
  title,
  items,
  newValue,
  setNewValue,
  addFn,
  deleteFn,
  placeholder,
}: any) {
  return (
    <section>
      <h2 className="text-2xl font-bold mb-3">{title}</h2>

      <div className="flex gap-3">
        <input
          className="flex-1 border p-2 rounded"
          placeholder={placeholder}
          value={newValue}
          onChange={(e: any) => setNewValue(e.target.value)}
        />

        <button onClick={addFn} className="px-4 bg-blue-600 text-white rounded">
          Add
        </button>
      </div>

      <div className="flex flex-wrap gap-2 mt-4">
        {items.map((item: any) => (
          <div
            key={item.id}
            className="bg-gray-200 px-3 py-1 rounded-full flex items-center gap-2"
          >
            <span>{item.label}</span>
            <button className="text-red-600" onClick={() => deleteFn(item.id)}>
              ✕
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ROLE SECTION */
function RoleSection({
  exp,
  addRole,
  updateRole,
  deleteRole,
  updateLocalRole,
}: any) {
  const [role, setRole] = useState({
    title: "",
    employmentType: "",
    startDate: "",
    endDate: "",
    duration: "",
    description: "",
  });

  return (
    <div className="mt-4 space-y-4">
      <h3 className="font-semibold text-lg">Roles</h3>

      {/* Add Role */}
      <div className="bg-gray-50 p-3 border rounded space-y-2">
        <Input
          placeholder="Role Title"
          value={role.title}
          onChange={(e: any) => setRole({ ...role, title: e.target.value })}
        />
        <Input
          placeholder="Employment Type"
          value={role.employmentType}
          onChange={(e: any) =>
            setRole({ ...role, employmentType: e.target.value })
          }
        />
        <Input
          type="date"
          label="Start Date"
          value={role.startDate}
          onChange={(e: any) => setRole({ ...role, startDate: e.target.value })}
        />
        <Input
          type="date"
          label="End Date"
          value={role.endDate}
          onChange={(e: any) => setRole({ ...role, endDate: e.target.value })}
        />

        <textarea
          className="border p-2 w-full rounded"
          value={role.description}
          placeholder="Description"
          onChange={(e: any) =>
            setRole({ ...role, description: e.target.value })
          }
        />

        <button
          className="px-4 py-2 bg-blue-600 text-white rounded"
          onClick={() => addRole(exp.id, role)}
        >
          Add Role
        </button>
      </div>

      {/* List Roles */}
      {exp.roles?.map((r: any) => (
        <div key={r.id} className="p-3 bg-gray-100 rounded border space-y-2">
          <Input
            label="Title"
            value={r.title}
            onChange={(e: any) =>
              updateLocalRole(exp.id, r.id, "title", e.target.value)
            }
          />
          <Input
            label="Type"
            value={r.employmentType}
            onChange={(e: any) =>
              updateLocalRole(exp.id, r.id, "employmentType", e.target.value)
            }
          />
          <Input
            type="date"
            label="Start"
            value={r.startDate}
            onChange={(e: any) =>
              updateLocalRole(exp.id, r.id, "startDate", e.target.value)
            }
          />
          <Input
            type="date"
            label="End"
            value={r.endDate || ""}
            onChange={(e: any) =>
              updateLocalRole(exp.id, r.id, "endDate", e.target.value)
            }
          />

          <textarea
            className="border p-2 w-full rounded"
            value={r.description}
            onChange={(e: any) =>
              updateLocalRole(exp.id, r.id, "description", e.target.value)
            }
          />

          <button
            className="px-3 py-1 bg-green-600 text-white rounded"
            onClick={() => updateRole(r)}
          >
            Update Role
          </button>

          <button
            className="ml-2 px-3 py-1 bg-red-600 text-white rounded"
            onClick={() => deleteRole(r.id)}
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}
