import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../../store/AuthContext";
import { useEditor } from "../../store/EditorContext";
import { cn } from "../../lib/classnames";

const NAV = [
  { to: "/dashboard", label: "Dashboard", icon: HomeIcon },
  { to: "/templates", label: "Templates", icon: GridIcon },
];

export default function AppShell() {
  const { user, logout } = useAuth();
  const { saveStatus, lastSavedAt } = useEditor();
  const navigate = useNavigate();
  const location = useLocation();
  const isEditor = location.pathname.startsWith("/editor/");

  return (
    <div className="flex min-h-screen bg-ink-50 text-ink-800">
      <aside
        className={cn(
          "hidden w-64 shrink-0 flex-col border-r border-ink-100 bg-white px-4 py-6 lg:flex",
          isEditor && "lg:hidden",
        )}
      >
        <button
          type="button"
          onClick={() => navigate("/dashboard")}
          className="mb-8 flex items-center gap-2 text-left"
        >
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand-600 text-white shadow-pop">
            <SparkIcon className="h-5 w-5" />
          </span>
          <div>
            <div className="text-base font-bold tracking-tight">ResumeCraft</div>
            <div className="text-[11px] uppercase tracking-[0.18em] text-ink-400">Pro Builder</div>
          </div>
        </button>
        <nav className="flex flex-col gap-1">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition",
                  isActive
                    ? "bg-brand-50 text-brand-700"
                    : "text-ink-600 hover:bg-ink-50 hover:text-ink-900",
                )
              }
              end
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </NavLink>
          ))}
        </nav>


      </aside>

      <div className="flex min-h-screen flex-1 flex-col">
        <header className="sticky top-0 z-20 flex items-center justify-between gap-3 border-b border-ink-100 bg-white/85 px-4 py-3 backdrop-blur lg:px-8">
          <div className="flex items-center gap-3 lg:hidden">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand-600 text-white">
              <SparkIcon className="h-4 w-4" />
            </span>
            <span className="text-sm font-bold">ResumeCraft</span>
          </div>
          {/* Logo (Desktop) - Shown only when sidebar is hidden (Editor) */}
          {isEditor && (
            <div className="hidden items-center gap-2 lg:flex">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand-600 text-white shadow-pop">
                <SparkIcon className="h-4.5 w-4.5" />
              </span>
              <span className="text-[15px] font-bold tracking-tight text-ink-900">ResumeCraft</span>
            </div>
          )}
          <div className="hidden flex-1 lg:block" />
          <div className="flex items-center gap-2">
            <span className="hidden rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700 sm:inline-flex">
              ATS Ready
            </span>
            <UserMenu 
              name={user?.name ?? "You"} 
              email={user?.email ?? ""} 
              color={user?.avatarColor ?? "#4f46e5"} 
              onLogout={logout} 
              onProfile={() => navigate("/profile")}
            />
          </div>
        </header>

        <main className="flex-1">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.18 }}
          >
            <Outlet />
          </motion.div>
        </main>
      </div>
    </div>
  );
}

function SaveStatus({ saveStatus, lastSavedAt }: { saveStatus: string; lastSavedAt: number | null }) {
  let label = "Auto-save ready";
  let dot = "bg-ink-300";
  if (saveStatus === "saving") {
    label = "Saving changes…";
    dot = "bg-amber-400 animate-pulse";
  } else if (saveStatus === "saved") {
    label = `Saved${lastSavedAt ? ` · ${new Date(lastSavedAt).toLocaleTimeString()}` : ""}`;
    dot = "bg-emerald-500";
  }
  return (
    <span className="inline-flex items-center gap-2">
      <span className={cn("h-2 w-2 rounded-full", dot)} />
      {label}
    </span>
  );
}

function UserMenu({ 
  name, 
  email, 
  color, 
  onLogout, 
  onProfile 
}: { 
  name: string; 
  email: string; 
  color: string; 
  onLogout: () => void; 
  onProfile: () => void;
}) {
  return (
    <div className="group relative">
      <button
        type="button"
        className="flex items-center gap-2 rounded-xl border border-ink-100 bg-white px-2 py-1.5 text-sm hover:border-ink-200"
      >
        <span
          className="grid h-7 w-7 place-items-center rounded-full text-xs font-bold text-white"
          style={{ background: color }}
        >
          {(name?.[0] ?? "U").toUpperCase()}
        </span>
        <span className="hidden text-left sm:block">
          <span className="block text-xs font-semibold leading-tight">{name}</span>
          <span className="block text-[10px] text-ink-400">{email}</span>
        </span>
        <ChevronIcon className="h-3 w-3 text-ink-400" />
      </button>
      <div className="invisible absolute right-0 top-full z-30 mt-2 w-56 rounded-2xl border border-ink-100 bg-white p-2 opacity-0 shadow-soft transition-all group-hover:visible group-hover:opacity-100">
        <div className="px-3 py-2">
          <div className="text-sm font-semibold">{name}</div>
          <div className="truncate text-xs text-ink-500">{email}</div>
        </div>
        <div className="my-1 h-px bg-ink-100" />
        <button
          type="button"
          onClick={onProfile}
          className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm text-ink-700 hover:bg-ink-50"
        >
          My Profile
          <span aria-hidden>👤</span>
        </button>
        <button
          type="button"
          onClick={onLogout}
          className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm text-ink-700 hover:bg-ink-50 text-red-600"
        >
          Sign out
          <span aria-hidden>↩</span>
        </button>
      </div>
    </div>
  );
}

function HomeIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M3 11.5 12 4l9 7.5" />
      <path d="M5 10v9a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1v-9" />
    </svg>
  );
}
function GridIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="3" y="3" width="7" height="7" rx="2" />
      <rect x="14" y="3" width="7" height="7" rx="2" />
      <rect x="3" y="14" width="7" height="7" rx="2" />
      <rect x="14" y="14" width="7" height="7" rx="2" />
    </svg>
  );
}
function SparkIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12 3v4" />
      <path d="M12 17v4" />
      <path d="M3 12h4" />
      <path d="M17 12h4" />
      <path d="M5.6 5.6 8 8" />
      <path d="M16 16l2.4 2.4" />
      <path d="M5.6 18.4 8 16" />
      <path d="M16 8l2.4-2.4" />
    </svg>
  );
}
function ChevronIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}
