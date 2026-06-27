import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { isAdminRole } from "../shared/auth/jwt";

// Пускает только Admin/SuperAdmin. Остальных — на логин.
export default function AdminRoute({ children }: { children: ReactNode }) {
  const role = useAuthStore((state) => state.role);

  if (!isAdminRole(role)) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
