import { createBrowserRouter } from "react-router";
import { SplashIntro } from "./pages/SplashIntro";
import { Home } from "./pages/Home";
import { Login } from "./pages/Login";
import { Signup } from "./pages/Signup";
import { TurfDetail } from "./pages/TurfDetail";
import { Profile } from "./pages/Profile";
import { TurfOwnerDashboard } from "./pages/TurfOwnerDashboard";
import { OwnerLogin } from "./pages/OwnerLogin";
import { OwnerSignup } from "./pages/OwnerSignup";
import { ErrorBoundary } from "./components/ErrorBoundary";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: SplashIntro,
    ErrorBoundary,
  },
  {
    path: "/home",
    Component: Home,
    ErrorBoundary,
  },
  {
    path: "/animation",
    Component: SplashIntro,
    ErrorBoundary,
  },
  {
    path: "/login",
    Component: Login,
    ErrorBoundary,
  },
  {
    path: "/signup",
    Component: Signup,
    ErrorBoundary,
  },
  {
    path: "/turf/:id",
    Component: TurfDetail,
    ErrorBoundary,
  },
  {
    path: "/profile",
    Component: Profile,
    ErrorBoundary,
  },
  {
    path: "/player",
    Component: Home,
    ErrorBoundary,
  },
  {
    path: "/owner",
    Component: OwnerLogin,
    ErrorBoundary,
  },
  {
    path: "/owner/login",
    Component: OwnerLogin,
    ErrorBoundary,
  },
  {
    path: "/owner/signup",
    Component: OwnerSignup,
    ErrorBoundary,
  },
  {
    path: "/owner/dashboard",
    Component: TurfOwnerDashboard,
    ErrorBoundary,
  },
  {
    path: "*",
    Component: Home,
    ErrorBoundary,
  },
]);