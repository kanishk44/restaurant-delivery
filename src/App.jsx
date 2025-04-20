import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { UserAuthProvider } from "./contexts/UserAuthContext";
import AdminLayout from "./components/admin/AdminLayout";
import Login from "./components/admin/Login";
import Dashboard from "./components/admin/Dashboard";
import Categories from "./components/admin/Categories";
import Recipes from "./components/admin/Recipes";
import Orders from "./components/admin/Orders";
import PrivateRoute from "./components/admin/PrivateRoute";
import UserLayout from "./components/user/UserLayout";
import UserLogin from "./components/user/Login";
import UserSignup from "./components/user/SignUp";
import UserPrivateRoute from "./components/user/PrivateRoute";
import ForgotPassword from "./components/user/ForgotPassword";
import Profile from "./components/user/Profile";
import UserCategories from "./components/user/UserCategories";
import CategoryRecipes from "./components/user/CategoryRecipes";

function App() {
  return (
    <AuthProvider>
      <UserAuthProvider>
        <Router>
          <Routes>
            {/* Admin Routes */}
            <Route path="/admin/login" element={<Login />} />
            <Route
              path="/admin"
              element={
                <PrivateRoute>
                  <AdminLayout />
                </PrivateRoute>
              }
            >
              <Route index element={<Dashboard />} />
              <Route path="categories" element={<Categories />} />
              <Route path="recipes" element={<Recipes />} />
              <Route path="orders" element={<Orders />} />
            </Route>

            {/* User Routes */}
            <Route path="/login" element={<UserLogin />} />
            <Route path="/signup" element={<UserSignup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route
              path="/"
              element={
                <UserPrivateRoute>
                  <UserLayout />
                </UserPrivateRoute>
              }
            >
              <Route index element={<Navigate to="/home" replace />} />
              <Route path="home" element={<UserCategories />} />
              <Route
                path="category/:categoryId"
                element={<CategoryRecipes />}
              />
              <Route path="profile" element={<Profile />} />
              <Route path="cart" element={<div>Cart Page</div>} />
            </Route>

            {/* Root route redirects to user login */}
            <Route path="/" element={<Navigate to="/login" replace />} />

            {/* Catch all route */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </Router>
      </UserAuthProvider>
    </AuthProvider>
  );
}

export default App;
