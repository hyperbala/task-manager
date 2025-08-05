"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from 'next/link';
import { CheckSquare, User, KeyRound } from 'lucide-react';

export default function SignUpPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (res.ok) {
        setSuccess("Signup successful! Redirecting to login...");
        setUsername("");
        setPassword("");
        setTimeout(() => {
          router.push("/login");
        }, 1500);
      } else {
        const data = await res.json();
        setError(data.message || "Signup failed. Username may already be taken.");
      }
    } catch (err) {
        console.error("Signup error:", err);
        setError("An unexpected error occurred.");
    } finally {
        // We don't set loading to false on success because we're redirecting.
        if(!res.ok) setLoading(false);
    }
  };

  return (
    <main className="min-h-screen w-full flex flex-col items-center justify-center bg-stone-50 p-4">
      <div className="w-full max-w-md">
        {/* Header with App Name and Description */}
        <div className="text-center mb-8">
          <div className="flex justify-center items-center gap-2.5 mb-3">
            <div className="p-2 bg-gray-900 rounded-lg">
              <CheckSquare className="h-6 w-6 text-white" />
            </div>
            <span className="text-3xl font-bold text-gray-900 tracking-tight">Taskly</span>
          </div>
          <p className="text-gray-500">Create an account to start managing your tasks.</p>
        </div>

        {/* Sign-up Form */}
        <div className="bg-white p-8 border border-gray-200 rounded-xl shadow-md">
          <form onSubmit={handleSignup} className="space-y-5">
            {/* Username Field */}
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700"
              >
                Username
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="username"
                  name="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Choose a username"
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:ring-1 focus:ring-gray-800 focus:border-gray-800 outline-none transition"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <KeyRound className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:ring-1 focus:ring-gray-800 focus:border-gray-800 outline-none transition"
                  required
                />
              </div>
            </div>

            {/* Messages */}
            {error && (
              <div className="p-3 text-center text-sm text-red-700 bg-red-50 rounded-lg">
                {error}
              </div>
            )}
            {success && (
              <div className="p-3 text-center text-sm text-green-700 bg-green-50 rounded-lg">
                {success}
              </div>
            )}

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3 px-4 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? 'Creating Account...' : 'Sign Up'}
              </button>
            </div>
          </form>
        </div>

        {/* Link to Login */}
        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link href="/login" className="font-medium text-gray-900 hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </main>
  );
}