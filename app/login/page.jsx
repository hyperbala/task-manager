"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleLogin(e) {
    e.preventDefault();
    setError("");

    const res = await signIn("credentials", {
      redirect: false,
      username,
      password,
    });

    if (res.ok && !res.error) {
      router.push("/");
    } else {
      setError("Invalid username or password");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 px-4">
      <form
        onSubmit={handleLogin}
        className="bg-white/10 backdrop-blur-lg border border-white/20 shadow-lg rounded-2xl px-8 py-10 w-full max-w-md space-y-6 text-white"
      >
        <h1 className="text-3xl font-bold text-center mb-2">Login</h1>

        {error && (
          <p className="bg-red-500/20 text-red-400 text-sm px-4 py-2 rounded-md border border-red-400/30">
            {error}
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
          Login
        </button>

        <p className="text-sm text-center text-gray-300">
          Don&apos;t have an account?{" "}
          <a
            href="/signup"
            className="text-indigo-400 hover:underline font-medium"
          >
            Sign Up
          </a>
        </p>
      </form>
    </div>
  );
}
