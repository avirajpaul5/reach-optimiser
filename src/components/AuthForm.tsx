import React, { useState } from "react";
import { useAuth } from "./AuthProvider";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";

interface AuthFormProps {
  isSignUp?: boolean;
}

const AuthForm: React.FC<AuthFormProps> = ({
  isSignUp: initialIsSignUp = false,
}) => {
  const [isSignUp, setIsSignUp] = useState(initialIsSignUp);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { signIn, signUp, user } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isSignUp) {
        await signUp(email, password);
      } else {
        await signIn(email, password);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  // Extract user name from email if available
  const userName = user?.email ? user.email.split("@")[0] : null;
  const welcomeMessage = userName
    ? `Welcome ${userName} to Reach Optimizer`
    : "Welcome to Reach Optimizer";

  return (
    <div className="flex flex-col justify-center items-center h-[100vh]">
      <h1 className="text-3xl font-bold text-orange-800 dark:text-orange-300 mb-6">
        {welcomeMessage}
      </h1>
      <Card className="w-full max-w-md shadow-lg bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border border-orange-100 dark:border-orange-800/30">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl text-orange-800 dark:text-orange-300">
            {isSignUp ? "Create Account" : "Welcome Back"}
          </CardTitle>
          <p className="text-orange-700/80 dark:text-orange-200/80 mt-2">
            {isSignUp
              ? "Create an account to optimize your YouTube metadata"
              : "Sign in to access your YouTube metadata optimization tools"}
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="text-sm font-medium text-orange-900 dark:text-orange-200 text-left block"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="your.email@example.com"
                className="w-full p-3 rounded-md border border-orange-200 dark:border-orange-700/50 bg-white/70 dark:bg-gray-800/70 focus:outline-none focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-400"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="password"
                className="text-sm font-medium text-orange-900 dark:text-orange-200 text-left block"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                className="w-full p-3 rounded-md border border-orange-200 dark:border-orange-700/50 bg-white/70 dark:bg-gray-800/70 focus:outline-none focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-400"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {error && (
              <div className="p-3 bg-red-50/80 text-red-600 text-sm rounded-md backdrop-blur-sm">
                {error}
              </div>
            )}

            <Button
              type="submit"
              className="w-full py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-md transition-colors"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  <span>Processing...</span>
                </div>
              ) : (
                <span>{isSignUp ? "Create Account" : "Sign In"}</span>
              )}
            </Button>

            <div className="text-center mt-4">
              <button
                type="button"
                className="text-orange-600 hover:text-orange-700 dark:text-orange-400 dark:hover:text-orange-300 hover:underline text-sm"
                onClick={() => {
                  if (isSignUp) {
                    navigate("/login");
                  } else {
                    navigate("/signup");
                  }
                }}
              >
                {isSignUp
                  ? "Already have an account? Sign in"
                  : "Don't have an account? Sign up"}
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthForm;
