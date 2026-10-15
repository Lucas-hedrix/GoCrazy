import { useState } from "react";
import { motion } from "motion/react";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../components/Logo";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { isAppwriteConfigured } from "../lib/appwrite";

const AUTH_ERRORS = {
  user_invalid_credentials: "Wrong email or password.",
  user_already_exists: "An account with this email already exists.",
  user_not_found: "No account found with that email.",
  general_rate_limited: "Too many attempts. Try again in a minute.",
};

function prettyError(err) {
  return AUTH_ERRORS[err?.code] ?? err?.message ?? "Something went wrong.";
}

export default function Auth() {
  const { login, register } = useAuth();
  const { push } = useToast();
  const navigate = useNavigate();

  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (mode === "register" && form.password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setBusy(true);
    try {
      if (mode === "login") {
        await login(form.email, form.password);
      } else {
        await register(form.name, form.email, form.password);
      }
      push({ title: mode === "login" ? "Welcome back!" : "Account created!", message: "Happy hunting." });
      navigate("/");
    } catch (err) {
      setError(prettyError(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="auth-glow flex min-h-screen flex-col items-center justify-center px-4 py-10 text-cream">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-between">
          <Logo />
          <Link
            to="/"
            className="flex items-center gap-1.5 text-sm font-semibold text-muted transition-colors hover:text-cream"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to store
          </Link>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="mt-8 rounded-3xl border border-line bg-panel p-8"
        >
          <h1 className="font-display text-3xl tracking-wide">
            {mode === "login" ? "SIGN IN" : "CREATE ACCOUNT"}
          </h1>
          <p className="mt-1.5 text-sm text-muted">
            {mode === "login"
              ? "Sign in to checkout and track your deals."
              : "Join Go Crazy Deals and start hunting."}
          </p>

          {!isAppwriteConfigured && (
            <div className="mt-5 rounded-2xl border border-brand/40 bg-brand/10 px-4 py-3 text-xs leading-relaxed text-cream">
              <span className="font-bold text-brand">Demo mode.</span> Appwrite isn&apos;t configured
              yet — add your keys to <code className="font-bold">.env</code> and restart the dev
              server to enable accounts and checkout.
            </div>
          )}

          <div className="mt-6 grid grid-cols-2 gap-1 rounded-2xl border border-line bg-card p-1">
            {["login", "register"].map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => {
                  setMode(m);
                  setError("");
                }}
                className={`rounded-xl py-2.5 text-sm font-bold transition-colors ${
                  mode === m ? "bg-brand text-white shadow-lg shadow-brand/25" : "text-muted hover:text-cream"
                }`}
              >
                {m === "login" ? "Sign In" : "Register"}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            {mode === "register" && (
              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-muted">
                  Name
                </label>
                <input
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full rounded-xl border border-line bg-card px-4 py-3 text-sm outline-none transition-colors focus:border-brand/50"
                  placeholder="Dollar Bill"
                />
              </div>
            )}
            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-muted">
                Email
              </label>
              <input
                required
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full rounded-xl border border-line bg-card px-4 py-3 text-sm outline-none transition-colors focus:border-brand/50"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-muted">
                Password
              </label>
              <input
                required
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full rounded-xl border border-line bg-card px-4 py-3 text-sm outline-none transition-colors focus:border-brand/50"
                placeholder={mode === "register" ? "At least 8 characters" : "••••••••"}
              />
            </div>

            {error && (
              <p className="rounded-xl border border-brand/40 bg-brand/10 px-4 py-2.5 text-xs font-semibold text-brand">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={busy || !isAppwriteConfigured}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-brand py-3.5 text-sm font-bold text-white shadow-lg shadow-brand/25 transition-colors hover:bg-brand-strong disabled:cursor-not-allowed disabled:opacity-50"
            >
              {busy && <Loader2 className="h-4 w-4 animate-spin" />}
              {mode === "login" ? "Sign In" : "Create Account"}
            </button>
          </form>

          <p className="mt-5 text-center text-xs text-muted">
            {mode === "login" ? "New to Go Crazy Deals?" : "Already have an account?"}{" "}
            <button
              type="button"
              onClick={() => setMode(mode === "login" ? "register" : "login")}
              className="font-bold text-brand hover:text-brand-strong"
            >
              {mode === "login" ? "Create an account" : "Sign in"}
            </button>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
