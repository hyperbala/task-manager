"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from 'next/link';
import { CheckSquare, User, KeyRound } from 'lucide-react';

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await signIn("credentials", {
        redirect: false,
        // Using username and password as requested
        username,
        password,
      });

      if (res.ok && !res.error) {
        router.replace("/"); // Use replace to avoid user going back to login page
      } else {
        setError("Invalid username or password. Please try again.");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
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
          <p className="text-gray-500">Welcome back! Please log in to your account.</p>
        </div>

        {/* Login Form */}
        <div className="bg-white p-8 border border-gray-200 rounded-xl shadow-md">
          <form onSubmit={handleLogin} className="space-y-5">
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
                  placeholder="Your username"
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

            {/* Error Message */}
            {error && (
              <div className="p-3 text-center text-sm text-red-700 bg-red-50 rounded-lg">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3 cursor-pointer px-4 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? 'Logging in...' : 'Log In'}
              </button>
            </div>
          </form>
        </div>

        {/* Link to Sign Up */}
        <p className="mt-6 text-center text-sm text-gray-600">
          Don&apos;t have an account?{' '}
          <Link href="/signup" className="font-medium text-gray-900 hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </main>
  );
}