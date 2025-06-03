// app/admin/layout.js
import ProtectedRoute from "@/components/ProtectedRoute";

export default function AdminLayout({ children }) {
  return <ProtectedRoute adminOnly={true}>{children}</ProtectedRoute>;
}
