const ROLE_CLAIM = "http://schemas.microsoft.com/ws/2008/06/identity/claims/role";

// Достаём роль из JWT (payload — вторая часть токена, base64url).
export function getRoleFromToken(token: string | null): string | null {
  if (!token) return null;
  try {
    const part = token.split(".")[1];
    const json = atob(part.replace(/-/g, "+").replace(/_/g, "/"));
    const payload = JSON.parse(decodeURIComponent(escape(json)));
    const role = payload[ROLE_CLAIM] ?? payload.role ?? null;
    return Array.isArray(role) ? role[0] : role;
  } catch {
    return null;
  }
}

export function isAdminRole(role: string | null): boolean {
  return role === "Admin" || role === "SuperAdmin";
}

export function getNameFromToken(token: string | null): string {
  if (!token) return "Admin";
  try {
    const json = atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/"));
    const payload = JSON.parse(decodeURIComponent(escape(json)));
    return payload.name ?? payload.unique_name ?? "Admin";
  } catch {
    return "Admin";
  }
}
