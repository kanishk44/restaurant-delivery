import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

export default function AdminLayout() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/admin/login");
    } catch (error) {
      console.error("Failed to log out:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex h-screen">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-lg">
          <div className="p-4">
            <h1 className="text-2xl font-bold text-gray-800">Admin Panel</h1>
          </div>
          <nav className="mt-6">
            <div className="px-4 space-y-2">
              <button
                onClick={() => navigate("/admin")}
                className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
              >
                Dashboard
              </button>
              <button
                onClick={() => navigate("/admin/categories")}
                className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
              >
                Categories
              </button>
              <button
                onClick={() => navigate("/admin/recipes")}
                className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
              >
                Recipes
              </button>
            </div>
          </nav>
          <div className="absolute bottom-0 w-64 p-4">
            <button
              onClick={handleLogout}
              className="w-full px-4 py-2 text-white bg-red-600 hover:bg-red-700 rounded-md"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          <div className="p-6">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}
