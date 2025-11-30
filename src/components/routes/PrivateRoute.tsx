import { Navigate, Outlet, useLocation } from "react-router-dom";
import PageLoading from "@/components/ui/PageLoading";
import { useRequireAuth } from "@/hooks/useAuth";

const PrivateRoute = () => {
  const location = useLocation();
  const { loading, authenticated } = useRequireAuth();

  if (loading) {
    return <PageLoading message="Checking authentication..." />;
  }

  if (!authenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
};

export default PrivateRoute;
