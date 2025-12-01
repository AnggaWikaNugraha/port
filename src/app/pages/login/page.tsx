"use client";

import { useState } from "react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPass] = useState("");
  const [error, setError] = useState("");

  const onLogin = async () => {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error);
      return;
    }

    window.location.href = "/pages/dashboard";
  };

  return (
    <div className="px-4 py-10 space-y-12 text-white bg-gradient-to-b from-gray-900 to-gray-800 h-[100vh]">
      <div className="p-5 max-w-sm mx-auto space-y-2">
        <h1 className="text-xl font-bold">Admin Login</h1>

        <input
          className="border p-2 w-full"
          placeholder="email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          className="border p-2 w-full"
          placeholder="password"
          onChange={(e) => setPass(e.target.value)}
        />

        {error && <p className="text-red-500">{error}</p>}

        <button
          onClick={onLogin}
          className="bg-blue-600 text-white p-2 rounded w-full"
        >
          Login
        </button>
      </div>
    </div>
  );
}
