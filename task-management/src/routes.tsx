import { createBrowserRouter } from "react-router-dom";

import { SignIn } from "./pages/auth/sign-in";
import { SignUp } from "./pages/auth/sign-up";
import { Home } from "./pages/app/home/home";
import { AuthLayout } from "./pages/layouts/auth-layout";
import { AppLayout } from "./pages/layouts/app-layout";
import { RequireAuth } from "./private-routes";
import { Credit } from "./pages/app/credit";

export const routes = createBrowserRouter([
  {
    path: "/",
    element: (
      <RequireAuth>
        <AppLayout />
      </RequireAuth>
    ),
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/credit",
        element: <Credit />,
      },
    ],
  },
  {
    path: "/auth",
    element: <AuthLayout />,

    children: [
      {
        path: "sign-in",
        element: <SignIn />,
      },
      {
        path: "sign-up",
        element: <SignUp />,
      },
    ],
  },
]);
