import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
  useLocation,
} from "react-router-dom";
import Navbar from "@/components/Navbar";
import Home from "@/pages/Home";
import Register from "@/pages/Register";
import Login from "@/pages/Login";
import Setting from "@/pages/Setting";
import Profile from "@/pages/Profile";
import NotFound from "@/pages/NotFound";
import { useAuthStore } from "@/store/useAuthStore";

const ProtectedRoute = ({
  children,
  redirectPath = "/login",
}: {
  children: React.ReactNode;
  redirectPath?: string;
}) => {
  const { authUser } = useAuthStore();
  const locaton = useLocation();
  
  if (!authUser) {
    return <Navigate to={redirectPath} state={{ from: locaton }} replace />;
  }
  return children;
};

export const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <Navbar />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "/setting",
        element: <Home />,
      },
      {
        path: "/profile",
        element: <Profile />,
      },
      {
        index: true,
        element: <Setting />,
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

export const AppRouter = () => {
  return <RouterProvider router={router} />;
};
