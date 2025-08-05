"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  async function handleSignup(e) {
    e.preventDefault();
    setError("");
    setSuccess("");

    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (res.ok) {
      setSuccess("Signup successful! You can now log in.");
      setUsername("");
      setPassword("");
      setTimeout(() => {
        router.push("/login");
      }, 1500);
    } else {
      setError("Signup failed. Username may be taken.");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 px-4">
      <form
        onSubmit={handleSignup}
        className="bg-white/10 backdrop-blur-lg border border-white/20 shadow-lg rounded-2xl px-8 py-10 w-full max-w-md space-y-6 text-white"
      >
        <h1 className="text-3xl font-bold text-center mb-2">Sign Up</h1>

        {error && (
          <p className="bg-red-500/20 text-red-400 text-sm px-4 py-2 rounded-md border border-red-400/30">
            {error}
          </p>
        )}
        {success && (
          <p className="bg-green-500/20 text-green-400 text-sm px-4 py-2 rounded-md border border-green-400/30">
            {success}
          </p>
        )}

        <div>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
            className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 focus:ring-2 focus:ring-indigo-400 focus:outline-none text-white placeholder-gray-300"
          />
        </div>

        <div>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 focus:ring-2 focus:ring-indigo-400 focus:outline-none text-white placeholder-gray-300"
          />
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-indigo-500 hover:bg-indigo-600 transition-colors rounded-lg font-semibold text-white shadow-md"
        >
          Sign Up
        </button>

        <p className="text-sm text-center text-gray-300">
          Already have an account?{" "}
          <a
            href="/login"
            className="text-indigo-400 hover:underline font-medium"
          >
            Log In
          </a>
        </p>
      </form>
    </div>
  );
}
