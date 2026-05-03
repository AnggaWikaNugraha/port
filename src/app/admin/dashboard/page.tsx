"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  User,
  Briefcase,
  Award,
  Lightbulb,
  Star,
  ExternalLink,
  LayoutDashboard,
  Globe,
  FileText,
  FolderOpen,
} from "lucide-react";

export default function Dashboard() {
  const [stats, setStats] = useState({
    skills: 0,
    interests: 0,
    experiences: 0,
    certificates: 0,
  });
  const [user, setUser] = useState<any>(null);
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
      setStats({
        skills: Array.isArray(s) ? s.length : 0,
        interests: Array.isArray(i) ? i.length : 0,
        experiences: Array.isArray(e) ? e.length : 0,
        certificates: Array.isArray(c) ? c.length : 0,
      });
      setLoading(false);
    });
  }, []);

  const statCards = [
    {
      label: "Skills",
      value: stats.skills,
      icon: Star,
      color: "from-violet-500/20 to-violet-600/10",
      border: "border-violet-500/30",
      text: "text-violet-400",
    },
    {
      label: "Interests",
      value: stats.interests,
      icon: Lightbulb,
      color: "from-amber-500/20 to-amber-600/10",
      border: "border-amber-500/30",
      text: "text-amber-400",
    },
    {
      label: "Experiences",
      value: stats.experiences,
      icon: Briefcase,
      color: "from-blue-500/20 to-blue-600/10",
      border: "border-blue-500/30",
      text: "text-blue-400",
    },
    {
      label: "Certificates",
      value: stats.certificates,
      icon: Award,
      color: "from-emerald-500/20 to-emerald-600/10",
      border: "border-emerald-500/30",
      text: "text-emerald-400",
    },
  ];

  const quickLinks = [
    {
      label: "Manage Profile",
      desc: "Edit bio, skills, experience & certificates",
      href: "/admin/profile",
      icon: User,
      color: "from-blue-600 to-indigo-600",
    },
    {
      label: "Public Portfolio",
      desc: "Preview your public portfolio page",
      href: "/",
      icon: Globe,
      color: "from-emerald-600 to-teal-600",
      external: true,
    },
    {
      label: "About Page",
      desc: "View your public about section",
      href: "/pages/about",
      icon: FileText,
      color: "from-violet-600 to-purple-600",
      external: true,
    },
    {
      label: "Projects Page",
      desc: "View your public projects section",
      href: "/pages/projects",
      icon: FolderOpen,
      color: "from-amber-600 to-orange-600",
      external: true,
    },
  ];

  return (
    <div className="min-h-screen px-6 py-10">
      <div className="max-w-5xl mx-auto space-y-10">

        {/* Header */}
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-gradient-to-br from-blue-500/20 to-indigo-500/10 border border-blue-500/30">
            <LayoutDashboard className="w-7 h-7 text-blue-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">
              {loading ? "Loading..." : `Welcome, ${user?.name || "Admin"}`}
            </h1>
            <p className="text-gray-400 text-sm mt-0.5">
              {user?.job_title || "Portfolio Admin Dashboard"}
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {statCards.map(({ label, value, icon: Icon, color, border, text }) => (
            <div
              key={label}
              className={`rounded-2xl border ${border} bg-gradient-to-br ${color} p-5 space-y-3`}
            >
              <Icon className={`w-5 h-5 ${text}`} />
              <div>
                <p className="text-3xl font-bold text-white">
                  {loading ? "—" : value}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">{label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Links */}
        <div>
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-4">
            Quick Access
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {quickLinks.map(({ label, desc, href, icon: Icon, color, external }) => (
              <Link
                key={label}
                href={href}
                target={external ? "_blank" : undefined}
                className="group flex items-center gap-4 rounded-2xl border border-gray-700/60 bg-gray-800/40 hover:bg-gray-800/70 p-5 transition-all duration-200 hover:border-gray-600"
              >
                <div className={`p-3 rounded-xl bg-gradient-to-br ${color} shrink-0`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-semibold text-sm group-hover:text-blue-300 transition-colors">
                    {label}
                  </p>
                  <p className="text-gray-400 text-xs mt-0.5 truncate">{desc}</p>
                </div>
                <ExternalLink className="w-4 h-4 text-gray-600 group-hover:text-gray-400 shrink-0 transition-colors" />
              </Link>
            ))}
          </div>
        </div>

        {/* Profile snapshot */}
        {!loading && user && (
          <div className="rounded-2xl border border-gray-700/60 bg-gray-800/40 p-6 space-y-4">
            <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-widest">
              Profile Snapshot
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              {[
                { label: "Email", value: user.email },
                { label: "Username", value: user.username },
                { label: "Location", value: user.location },
                { label: "Company", value: user.company },
                { label: "Website", value: user.website },
                { label: "Phone", value: user.phone },
              ].map(({ label, value }) => (
                <div key={label} className="flex gap-2">
                  <span className="text-gray-500 w-20 shrink-0">{label}</span>
                  <span className="text-gray-200 truncate">{value || "—"}</span>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
