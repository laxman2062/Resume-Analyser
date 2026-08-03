import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ThemeToggle } from "../components/ThemeToggle";
import { registerUser } from "../services/auth.service";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setLoading(true);

    try {
      const data = await registerUser({ name, email, password });
      login(data.user, data.token);
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.response?.data?.error || "Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-bg">
      <header className="flex justify-between items-center px-8 py-6">
        <span className="font-display text-lg text-text-primary tracking-tight">
          Resume<span className="text-accent">.</span>AI
        </span>
        <ThemeToggle />
      </header>

      <main className="flex-1 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-md">
          <div className="w-10 h-[3px] bg-accent rounded-full mb-6" />

          <h1 className="font-display text-3xl text-text-primary mb-2">
            Create your account
          </h1>
          <p className="text-text-secondary font-body text-sm mb-8">
            Start getting AI-powered feedback on your resume
          </p>

          {error && (
            <div className="mb-5 px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm font-body">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm text-text-secondary/70 mb-2 font-body">
                Full name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Laxman Pant"
                className="w-full bg-surface border border-border rounded-lg px-4 py-3 text-text-primary placeholder:text-text-secondary/50 font-body text-sm focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent transition-all"
              />
            </div>

            <div>
              <label className="block text-sm text-text-secondary/70 mb-2 font-body">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
                className="w-full bg-surface border border-border rounded-lg px-4 py-3 text-text-primary placeholder:text-text-secondary/50 font-body text-sm focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent transition-all"
              />
            </div>

            <div>
              <label className="block text-sm text-text-secondary/70 mb-2 font-body">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="At least 8 characters"
                className="w-full bg-surface border border-border rounded-lg px-4 py-3 text-text-primary placeholder:text-text-secondary/50 font-body text-sm focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-accent text-bg font-body font-semibold text-sm rounded-lg py-3 mt-2 hover:brightness-110 active:brightness-95 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Creating account..." : "Create account"}
            </button>
          </form>

          <p className="text-text-secondary text-sm font-body mt-6 text-center">
            Already have an account?{" "}
            <Link to="/login" className="text-accent hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}