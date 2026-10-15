import { AnimatePresence, motion } from "motion/react";
import { Home, LifeBuoy, LogOut, ShoppingBag } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import Logo from "./Logo";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useUI } from "../context/UIContext";
import { useToast } from "../context/ToastContext";

const NAV_ITEMS = [
  { label: "Dashboard", icon: Home, to: "/" },
  { label: "My Cart", icon: ShoppingBag },
  { label: "Support", icon: LifeBuoy, to: "/support" },
];

function NavList() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { count, openCart, setIsCollapsed } = useCart();
  const { setSidebarOpen } = useUI();
  const { push } = useToast();

  const closeMobile = () => setSidebarOpen(false);

  const handleCartClick = () => {
    closeMobile();
    if (window.matchMedia("(min-width: 1280px)").matches) {
      setIsCollapsed(false);
    } else {
      openCart();
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      push({ title: "Signed out", message: "See you soon." });
      navigate("/");
    } catch (err) {
      push({ title: "Sign out failed", message: err?.message, tone: "error" });
    }
  };

  return (
    <nav className="flex h-full flex-col">
      <div className="flex flex-col gap-1.5">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const inner = (
            <>
              <Icon className="h-5 w-5 shrink-0" />
              {item.label}
              {item.label === "My Cart" && count > 0 && (
                <span className="ml-auto rounded-full bg-brand px-2 py-0.5 text-[11px] font-extrabold text-white">
                  {count}
                </span>
              )}
            </>
          );
          const base =
            "flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition-colors";

          if (item.to) {
            return (
              <NavLink
                key={item.label}
                to={item.to}
                end={item.to === "/"}
                onClick={closeMobile}
                className={({ isActive }) =>
                  `${base} ${
                    isActive
                      ? "bg-brand text-white shadow-lg shadow-brand/25"
                      : "text-muted hover:bg-card hover:text-cream"
                  }`
                }
              >
                {inner}
              </NavLink>
            );
          }

          return (
            <button
              key={item.label}
              onClick={handleCartClick}
              className={`${base} text-muted hover:bg-card hover:text-cream`}
            >
              {inner}
            </button>
          );
        })}
      </div>

      <div className="mt-auto">
        {user ? (
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold text-brand transition-colors hover:bg-brand/10"
          >
            <LogOut className="h-5 w-5" />
            Logout
          </button>
        ) : (
          <NavLink
            to="/auth"
            onClick={closeMobile}
            className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold text-brand transition-colors hover:bg-brand/10"
          >
            <LogOut className="h-5 w-5" />
            Sign In
          </NavLink>
        )}
      </div>
    </nav>
  );
}

export default function Sidebar() {
  const { sidebarOpen, setSidebarOpen } = useUI();

  return (
    <>
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-line bg-panel px-5 py-7 lg:flex">
        <Logo />
        <div className="mt-10 flex-1 overflow-y-auto">
          <NavList />
        </div>
      </aside>

      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden"
            />
            <motion.aside
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: "spring", stiffness: 320, damping: 32 }}
              className="fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-line bg-panel px-5 py-7 lg:hidden"
            >
              <Logo />
              <div className="mt-10 flex-1 overflow-y-auto">
                <NavList />
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
