import { Navigate } from "react-router-dom";
import { useUserAuth } from "../../contexts/UserAuthContext";

export default function PrivateRoute({ children }) {
  const { user, loading } = useUserAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return children;
}
