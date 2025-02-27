import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import Home from "@/pages/Home";
import Register from "@/pages/Register";
import Login from "@/pages/Login";
import Setting from "@/pages/Setting";
import Profile from "@/pages/Profile";
import NotFound from "@/pages/NotFound";
import Layout from "@/components/Layout";
import Loader from "@/components/ui/Loader";
import { useAuthStore } from "@/store/useAuthStore";
import Guard from "@/lib/Gurad";

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

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: "/profile", element: <Profile /> },
      { path: "/setting", element: <Setting /> },
    ],
  },
  {
    path: "/login",
    element: (
      <Guard>
        <Login />
      </Guard>
    ),
  },
  {
    path: "/register",
    element: (
      <Guard>
        <Register />
      </Guard>
    ),
  },
  { path: "*", element: <NotFound /> },
]);

export const AppRouter = () => {
  return <RouterProvider router={router} />;
};
