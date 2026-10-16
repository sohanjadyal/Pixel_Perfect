import { Component, ReactNode } from "react";
import { RouterProvider } from 'react-router';
import { router } from './routes';
import { TurfProvider } from './context/TurfContext';
import { AuthProvider } from './context/AuthContext';

// Class-based boundary — catches render errors in AuthProvider before
// they blank out the whole app. Falls back to running without AuthProvider
// (the rest of the app uses localStorage directly for auth state).
class AppErrorBoundary extends Component<
  { children: ReactNode },
  { crashed: boolean }
> {
  state = { crashed: false };

  static getDerivedStateFromError() {
    return { crashed: true };
  }

  render() {
    if (this.state.crashed) {
      return (
        <TurfProvider>
          <RouterProvider router={router} />
        </TurfProvider>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  return (
    <AppErrorBoundary>
      <AuthProvider>
        <TurfProvider>
          <RouterProvider router={router} />
        </TurfProvider>
      </AuthProvider>
    </AppErrorBoundary>
  );
}
