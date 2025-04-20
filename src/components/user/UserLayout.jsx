import { Outlet, Link, useNavigate } from "react-router-dom";
import { useUserAuth } from "../../contexts/UserAuthContext";
import { useEffect, useState } from "react";

export default function UserLayout() {
  const { user, logout } = useUserAuth();
  const navigate = useNavigate();
  const [displayName, setDisplayName] = useState("");

  useEffect(() => {
    if (user) {
      setDisplayName(user.displayName || "User");
    }
  }, [user]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Failed to log out:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navigation */}
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <Link to="/home" className="text-xl font-bold text-indigo-600">
                  Restaurant Delivery
                </Link>
              </div>
            </div>
            <div className="flex items-center">
              <div className="ml-3 relative">
                <div className="flex items-center space-x-4">
                  <span className="text-gray-700">Welcome, {displayName}</span>
                  <button
                    onClick={handleLogout}
                    className="text-gray-700 hover:text-gray-900"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  );
}
