import { useState } from "react";
import { Bell, Menu, Search, UserRound } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useUI } from "../context/UIContext";
import { useToast } from "../context/ToastContext";

export default function TopBar() {
  const { user } = useAuth();
  const { setSidebarOpen } = useUI();
  const { push } = useToast();
  const navigate = useNavigate();
  const [q, setQ] = useState("");

  const firstName = user?.name?.trim()?.split(/\s+/)[0];

  const handleSubmit = (e) => {
    e.preventDefault();
    const term = q.trim();
    navigate(term ? `/collection?q=${encodeURIComponent(term)}` : "/collection");
  };

  return (
    <header className="flex flex-wrap items-center gap-x-4 gap-y-3 px-4 pt-6 sm:px-6 lg:px-10">
      <button
        onClick={() => setSidebarOpen(true)}
        className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-line bg-card text-cream lg:hidden"
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      <div className="min-w-0">
        <h1 className="truncate text-2xl font-extrabold tracking-tight sm:text-[28px]">
          Hi, {firstName ?? "there"}!
        </h1>
        <p className="text-sm text-muted">Welcome back</p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="hidden w-full max-w-sm items-center gap-2.5 rounded-xl border border-line bg-card px-4 py-2.5 transition-colors focus-within:border-brand/50 md:flex"
      >
        <Search className="h-4 w-4 shrink-0 text-muted" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search shirts, pants, brands..."
          className="w-full bg-transparent text-sm text-cream outline-none placeholder:text-muted"
        />
      </form>

      <div className="ml-auto flex shrink-0 items-center gap-3">
        <button
          onClick={() => push({ title: "You're all caught up", message: "No new notifications." })}
          className="relative grid h-10 w-10 place-items-center rounded-full border border-line bg-card text-muted transition-colors hover:text-cream"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-brand" />
        </button>

        {user ? (
          <div
            className="grid h-10 w-10 place-items-center rounded-full bg-brand text-sm font-extrabold text-white"
            title={user.name || user.email}
          >
            {(user.name || user.email || "?").trim().charAt(0).toUpperCase()}
          </div>
        ) : (
          <Link
            to="/auth"
            className="grid h-10 w-10 place-items-center rounded-full border border-line bg-card text-muted transition-colors hover:border-brand/50 hover:text-cream"
            aria-label="Sign in"
            title="Sign in"
          >
            <UserRound className="h-5 w-5" />
          </Link>
        )}
      </div>
    </header>
  );
}
