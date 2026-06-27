import { useState } from "react";
import { imageUrl } from "../../shared/api/imageUrl";
import {
  useAddRoleToUserMutation,
  useDeleteUserMutation,
  useGetUserProfilesQuery,
  useGetUserRolesQuery,
  useRemoveRoleFromUserMutation,
  type UserProfile,
} from "../../shared/api/storeApi";
import ConfirmDialog from "../ConfirmDialog";

const PAGE_SIZE = 12;

// Аватар с фолбэком: если картинки нет или она битая (404) — показываем инициал.
function Avatar({ src, name }: { src: string; name: string }) {
  const [failed, setFailed] = useState(false);
  if (!src || failed) {
    return (
      <span className="grid h-9 w-9 place-items-center rounded-full bg-slate-200 dark:bg-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300">
        {name.charAt(0).toUpperCase()}
      </span>
    );
  }
  return (
    <img
      src={imageUrl(src)}
      alt=""
      onError={() => setFailed(true)}
      className="h-9 w-9 rounded-full object-cover"
    />
  );
}

export default function AdminUsers() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [toDelete, setToDelete] = useState<UserProfile | null>(null);

  const { data, isFetching } = useGetUserProfilesQuery({
    PageNumber: page,
    PageSize: PAGE_SIZE,
    UserName: search || undefined,
  });
  const { data: rolesResponse } = useGetUserRolesQuery();
  const [addRole] = useAddRoleToUserMutation();
  const [removeRole] = useRemoveRoleFromUserMutation();
  const [deleteUser] = useDeleteUserMutation();

  const users = data?.data ?? [];
  const totalRecord = data?.totalRecord ?? 0;
  const totalPage = data?.totalPage ?? 1;
  const adminRole = rolesResponse?.data?.find((role) => role.name === "Admin");

  // Роль SuperAdmin не приходит в get-user-roles — берём её id из ролей существующих юзеров.
  const SUPERADMIN_FALLBACK_ID = "1282250a-469f-436d-96c0-f35d08e4bb8d";
  const superAdminRoleId =
    rolesResponse?.data?.find((role) => role.name === "SuperAdmin")?.id ??
    users.flatMap((user) => user.userRoles).find((role) => role.name === "SuperAdmin")?.id ??
    SUPERADMIN_FALLBACK_ID;

  function isAdmin(user: UserProfile) {
    return user.userRoles.some((role) => role.name === "Admin" || role.name === "SuperAdmin");
  }

  function isSuperAdmin(user: UserProfile) {
    return user.userRoles.some((role) => role.name === "SuperAdmin");
  }

  function toggleAdmin(user: UserProfile) {
    if (!adminRole) return;
    const has = user.userRoles.find((role) => role.name === "Admin");
    if (has) {
      removeRole({ UserId: user.userId, RoleId: has.id });
    } else {
      addRole({ UserId: user.userId, RoleId: adminRole.id });
    }
  }

  function toggleSuperAdmin(user: UserProfile) {
    const has = user.userRoles.find((role) => role.name === "SuperAdmin");
    if (has) {
      removeRole({ UserId: user.userId, RoleId: has.id });
    } else {
      addRole({ UserId: user.userId, RoleId: superAdminRoleId });
    }
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Users</h1>
        <span className="text-sm text-slate-500 dark:text-slate-400">{totalRecord} total</span>
      </div>

      <div className="mb-4 flex items-center gap-3">
        <input
          value={search}
          onChange={(event) => {
            setSearch(event.target.value);
            setPage(1);
          }}
          placeholder="Search by username..."
          className="w-72 rounded-lg border border-slate-200 dark:border-slate-700 bg-white px-4 py-2 text-sm outline-none focus:border-blue-500 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500"
        />
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-100 dark:border-slate-700 text-slate-500 dark:text-slate-400">
            <tr>
              <th className="px-5 py-4 font-medium">User</th>
              <th className="px-5 py-4 font-medium">Email</th>
              <th className="px-5 py-4 font-medium">Phone</th>
              <th className="px-5 py-4 font-medium">Roles</th>
              <th className="px-5 py-4 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isFetching ? (
              <tr>
                <td colSpan={5} className="px-5 py-10 text-center text-slate-400">
                  Loading...
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-5 py-10 text-center text-slate-400">
                  No users found.
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.userId} className="border-b border-slate-50 dark:border-slate-700 last:border-0 hover:bg-slate-50 dark:hover:bg-white/5">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <Avatar src={user.image} name={user.userName} />
                      <div>
                        <div className="font-medium text-slate-800 dark:text-slate-100">{user.userName}</div>
                        {user.firstName || user.lastName ? (
                          <div className="text-xs text-slate-400">
                            {user.firstName} {user.lastName}
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-slate-600 dark:text-slate-300">{user.email || "—"}</td>
                  <td className="px-5 py-3 text-slate-600 dark:text-slate-300">{user.phoneNumber || "—"}</td>
                  <td className="px-5 py-3">
                    <div className="flex flex-wrap gap-1">
                      {user.userRoles.length === 0 ? (
                        <span className="text-slate-400">—</span>
                      ) : (
                        user.userRoles.map((role) => (
                          <span
                            key={role.id}
                            className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                              role.name === "User"
                                ? "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300"
                                : "bg-blue-100 text-blue-700"
                            }`}
                          >
                            {role.name}
                          </span>
                        ))
                      )}
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => toggleAdmin(user)}
                        disabled={!adminRole}
                        className="rounded-lg border border-slate-200 dark:border-slate-700 px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-200 hover:border-blue-500 hover:text-blue-600 disabled:opacity-40"
                      >
                        {isAdmin(user) ? "Remove admin" : "Make admin"}
                      </button>
                      <button
                        type="button"
                        onClick={() => toggleSuperAdmin(user)}
                        className="rounded-lg border border-purple-200 dark:border-purple-500/40 px-3 py-1.5 text-xs font-medium text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-500/15"
                      >
                        {isSuperAdmin(user) ? "Remove superadmin" : "Make superadmin"}
                      </button>
                      <button
                        type="button"
                        onClick={() => setToDelete(user)}
                        className="rounded-lg border border-red-200 dark:border-red-500/40 px-3 py-1.5 text-xs font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-500/15"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-1">
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => setPage((value) => value - 1)}
            className="rounded-md px-3 py-1.5 hover:bg-slate-100 dark:bg-slate-700 disabled:opacity-40"
          >
            ←
          </button>
          <span className="px-2">
            Page {page} / {totalPage}
          </span>
          <button
            type="button"
            disabled={page >= totalPage}
            onClick={() => setPage((value) => value + 1)}
            className="rounded-md px-3 py-1.5 hover:bg-slate-100 dark:bg-slate-700 disabled:opacity-40"
          >
            →
          </button>
        </div>
        <span>{totalRecord} Results</span>
      </div>

      <ConfirmDialog
        open={toDelete !== null}
        title="Delete user"
        message={`Are you sure you want to delete ${toDelete?.userName}?`}
        onCancel={() => setToDelete(null)}
        onConfirm={() => {
          if (toDelete) deleteUser(toDelete.userId);
          setToDelete(null);
        }}
      />
    </div>
  );
}
