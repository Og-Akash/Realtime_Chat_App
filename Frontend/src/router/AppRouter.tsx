import { Navigate, Route, Routes } from "react-router-dom";
import { JSX, lazy, Suspense, useEffect } from "react";

const Home = lazy(() => import("@/pages/Home"));
const Register = lazy(() => import("@/pages/Register"));
const Login = lazy(() => import("@/pages/Login"));
const Setting = lazy(() => import("@/pages/Setting"));
const Profile = lazy(() => import("@/pages/Profile"));
const ChangePassword = lazy(() => import("@/pages/ChangePassword"));
const NotFound = lazy(() => import("@/pages/NotFound"));

import { useAuthStore } from "@/store/useAuthStore";
import Layout from "@/components/Layout";
import Loader from "@/components/ui/Loader";

export const Approuter = () => {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, []);

  const ProtectedLayoutRoute = ({ children }: { children: JSX.Element }) => {
    if (isCheckingAuth) return <Loader />;
    return authUser ? children : <Navigate to="/login" replace />;
  };

  const PublicOnlyRoute = ({ element }: { element: JSX.Element }) => {
    return !authUser ? element : <Navigate to="/" replace />;
  };

  return (
    <Suspense fallback={<Loader />}>
      <Routes>
        {/* Publicly accessible homepage */}
        <Route path="/" element={<Layout />}>
          <Route
            index
            element={
              <ProtectedLayoutRoute>
                <Home />
              </ProtectedLayoutRoute>
            }
          />
          <Route
            path="/setting"
            element={
              <ProtectedLayoutRoute>
                <Setting />
              </ProtectedLayoutRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedLayoutRoute>
                <Profile />
              </ProtectedLayoutRoute>
            }
          />
          <Route
            path="/change-password"
            element={
              <ProtectedLayoutRoute>
                <ChangePassword />
              </ProtectedLayoutRoute>
            }
          />
        </Route>
        {/* Public-only pages */}
        <Route
          path="/login"
          element={<PublicOnlyRoute element={<Login />} />}
        />
        <Route
          path="/register"
          element={<PublicOnlyRoute element={<Register />} />}
        />

        {/* 404 fallback */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};
