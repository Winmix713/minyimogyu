import { Navigate, Outlet, useLocation } from "react-router-dom";
import PageLoading from "@/components/ui/PageLoading";
import { useRequireAuth, useRequireRole } from "@/hooks/useAuth";

const AdminRoute = () => {
  const location = useLocation();
  const { loading: authLoading, authenticated } = useRequireAuth();
  const { loading: roleLoading, authorized } = useRequireRole(['admin', 'analyst']);

  if (authLoading || roleLoading) {
    return <PageLoading message="Checking permissions..." />;
  }

  if (!authenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (!authorized) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};

export default AdminRoute;
