import { Navigate, Route, Routes } from "react-router-dom";
import Home from "@/pages/Home";
import Register from "@/pages/Register";
import Login from "@/pages/Login";
import Setting from "@/pages/Setting";
import Profile from "@/pages/Profile";

import { useAuthStore } from "@/store/useAuthStore";
import NotFound from "@/pages/NotFound";
import Layout from "@/components/Layout";
import ChangePassword from "@/pages/ChangePassword";

// const ProtectedRoute = ({
//   children,
//   redirectPath = "/",
// }: {
//   children: React.ReactNode;
//   redirectPath?: string;
// }) => {
//   const { authUser, isCheckingAuth } = useAuthStore();

//   if (isCheckingAuth && !authUser) {
//     return <Loader />;
//   }
//   if (authUser) {
//     return <Navigate to={redirectPath} replace />;
//   }
//   return children;
// };

export const Approuter = () => {
  const { authUser } = useAuthStore();

  return (
    <Routes>
      <Route
        path="/"
        element={authUser ? <Layout /> : <Navigate to="/login" />}
      >
        <Route index element={<Home />} />
        <Route path="/setting" element={<Setting />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/change-password" element={<ChangePassword />} />
      </Route>
      <Route
        path="/register"
        element={!authUser ? <Register /> : <Navigate to="/" replace />}
      />
      <Route
        path="/login"
        element={!authUser ? <Login /> : <Navigate to="/" replace />}
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};
