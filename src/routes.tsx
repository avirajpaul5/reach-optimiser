import React from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import LandingPage from "./components/LandingPage";
import AuthForm from "./components/AuthForm";
import KeywordAnalyzer from "./components/KeywordAnalyzer";
import { useAuth } from "./components/AuthProvider";

// Protected route component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600'></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

// Auth route component (redirects to dashboard if already logged in)
const AuthRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600'></div>
      </div>
    );
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

// Create router with routes
export const createAppRouter = () => {
  return createBrowserRouter([
    {
      path: "/",
      element: <LandingPage />,
    },
    {
      path: "/login",
      element: (
        <AuthRoute>
          <AuthForm isSignUp={false} />
        </AuthRoute>
      ),
    },
    {
      path: "/signup",
      element: (
        <AuthRoute>
          <AuthForm isSignUp={true} />
        </AuthRoute>
      ),
    },
    {
      path: "/dashboard",
      element: (
        <ProtectedRoute>
          <KeywordAnalyzer />
        </ProtectedRoute>
      ),
    },
    // Fallback route
    {
      path: "*",
      element: <Navigate to="/" replace />,
    },
  ]);
};
