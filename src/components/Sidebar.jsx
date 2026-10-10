import { NavLink } from "react-router-dom";
import {
  LayoutDashboard, Briefcase, Users, Handshake, Wallet, FileBarChart, Settings as SettingsIcon, X,
} from "lucide-react";
import logoMark from "../assets/logo-mark-dark.svg";

const links = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/jobs", label: "Jobs", icon: Briefcase },
  { to: "/clients", label: "Clients", icon: Users },
  { to: "/middlemen", label: "Middlemen", icon: Handshake },
  { to: "/payments", label: "Payments", icon: Wallet },
  { to: "/reports", label: "Reports", icon: FileBarChart },
  { to: "/settings", label: "Settings", icon: SettingsIcon },
];

export default function Sidebar({ isOpen, onClose }) {
  return (
    <>
      {/* Dimmed backdrop on mobile when menu is open */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={`w-60 shrink-0 bg-ink min-h-screen flex flex-col fixed lg:static top-0 left-0 z-50
          transition-transform duration-200 ease-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
      >
        <div className="flex items-center justify-between px-6 pt-7 pb-6">
          <div className="flex items-center gap-3">
            <img src={logoMark} alt="" className="w-9 h-9 shrink-0" />
            <div>
              <div className="font-serif text-2xl text-paper tracking-tight leading-none">JobLedger</div>
              <div className="text-[11px] text-paper/50 mt-1">License job registry</div>
            </div>
          </div>
          <button onClick={onClose} className="lg:hidden text-paper/60 hover:text-paper" aria-label="Close menu">
            <X size={20} />
          </button>
        </div>

        <nav className="flex flex-col gap-0.5 px-3">
          {links.map((l) => {
            const Icon = l.icon;
            return (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.end}
                onClick={onClose}
                className={({ isActive }) =>
                  `group flex items-center gap-3 px-3 py-2 text-sm transition-colors relative rounded-md ${
                    isActive ? "text-paper bg-white/5" : "text-paper/55 hover:text-paper/90 hover:bg-white/5"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <span
                      className="absolute left-0 top-1 bottom-1 w-[2px] rounded-full transition-colors"
                      style={{ background: isActive ? "var(--color-brass)" : "transparent" }}
                    />
                    <Icon size={16} strokeWidth={1.75} />
                    {l.label}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        <div className="mt-auto px-6 py-5 text-[11px] text-paper/35 border-t border-white/10">
          Every job, from referral to collection.
        </div>
      </aside>
    </>
  );
}
