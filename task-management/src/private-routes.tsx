import { Navigate } from "react-router-dom";
import { useAuth } from "./context/auth-context";
import { LoaderCircle } from "lucide-react";

export function RequireAuth({ children }: { children: JSX.Element }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <LoaderCircle className="animate-spin" size={60} />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth/sign-in" replace />;
  }

  return children;
}
