import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { useNotifStore } from "../store/notificationsStore";
import { getNameFromToken } from "../shared/auth/jwt";
import { useGetUserProfilesQuery } from "../shared/api/storeApi";
import BrandLogo from "../components/BrandLogo";
import ThemeToggle from "../components/ThemeToggle";
import NotificationsModal from "./NotificationsModal";
import { BellIcon, FolderIcon, HomeIcon, SearchIconSm, TagIcon, UsersIcon } from "./AdminIcons";

const navItems = [
  { to: "/admin", label: "Dashboard", end: true, Icon: HomeIcon },
  { to: "/admin/users", label: "Users", end: false, Icon: UsersIcon },
  { to: "/admin/products", label: "Products", end: false, Icon: TagIcon },
  { to: "/admin/other", label: "Other", end: false, Icon: FolderIcon },
];

export default function AdminLayout() {
  const token = useAuthStore((state) => state.token);
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();
  const name = getNameFromToken(token);
  const { data: users } = useGetUserProfilesQuery({ PageNumber: 1, PageSize: 1 });
  const usersCount = users?.totalRecord ?? 0;
  const notifCount = useNotifStore((state) => state.items.length);
  const [showNotifs, setShowNotifs] = useState(false);

  function fullLogout() {
    logout();
    navigate("/login");
  }

  return (
    <div className="flex min-h-screen bg-slate-100 text-slate-800 dark:bg-slate-950 dark:text-slate-200">
      {/* sidebar */}
      <aside className="fixed inset-y-0 left-0 flex w-64 flex-col bg-[#16223a] text-slate-300">
        <div className="flex h-16 items-center px-6">
          <BrandLogo className="text-white" />
        </div>

        <nav className="mt-4 flex flex-1 flex-col gap-1 px-4">
          {navItems.map(({ to, label, end, Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                  isActive ? "bg-white text-slate-900" : "text-slate-300 hover:bg-white/10"
                }`
              }
            >
              <Icon />
              <span className="flex-1">{label}</span>
              {label === "Users" && usersCount > 0 ? (
                <span className="rounded-full bg-slate-900/80 px-2 py-0.5 text-xs text-white">
                  {usersCount}
                </span>
              ) : null}
            </NavLink>
          ))}
        </nav>

        <button
          type="button"
          onClick={() => navigate("/")}
          className="m-4 rounded-lg border border-white/15 px-4 py-2.5 text-sm font-medium text-slate-200 transition-colors hover:bg-white/10"
        >
          ← In store
        </button>
      </aside>

      {/* main */}
      <div className="ml-64 flex w-full flex-col">
        <header className="sticky top-0 z-20 flex h-16 items-center gap-4 bg-[#16223a] px-6 text-slate-200">
          <label className="flex flex-1 items-center">
            <div className="flex w-full max-w-xs items-center gap-2 rounded-lg bg-white/5 px-3 py-2 text-slate-400 transition-colors focus-within:bg-white/10">
              <SearchIconSm />
              <input
                className="w-full bg-transparent text-sm text-slate-100 outline-none placeholder:text-slate-400 dark:bg-transparent! dark:text-slate-100"
                placeholder="Search..."
              />
            </div>
          </label>

          <ThemeToggle />

          <button type="button" className="relative" aria-label="Notifications" onClick={() => setShowNotifs(true)}>
            <BellIcon />
            {notifCount > 0 ? (
              <span className="absolute -right-1 -top-1 grid h-4 min-w-4 place-items-center rounded-full bg-blue-600 px-1 text-[10px] text-white">
                {notifCount > 99 ? "99+" : notifCount}
              </span>
            ) : null}
          </button>

          <button
            type="button"
            onClick={fullLogout}
            className="flex items-center gap-2"
            title="Выйти из аккаунта"
          >
            <span className="grid h-9 w-9 place-items-center rounded-full bg-emerald-500 font-semibold text-white">
              {name.charAt(0).toUpperCase()}
            </span>
            <span className="text-sm font-medium text-white">{name}</span>
          </button>
        </header>

        <main className="flex-1 p-8">
          <Outlet />
        </main>
      </div>

      <NotificationsModal open={showNotifs} onClose={() => setShowNotifs(false)} />
    </div>
  );
}
