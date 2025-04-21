import React, { useState } from "react";
import { useAuth } from "./AuthProvider";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";

const AuthForm: React.FC = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { signIn, signUp } = useAuth();

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

  return (
    <div className='flex justify-center items-center min-h-screen bg-gray-50'>
      <Card className='w-full max-w-md shadow-lg'>
        <CardHeader className='text-center'>
          <CardTitle className='text-2xl'>
            {isSignUp ? "Create Account" : "Welcome Back"}
          </CardTitle>
          <p className='text-neutral-500 mt-2'>
            {isSignUp
              ? "Create an account to optimize your YouTube metadata"
              : "Sign in to access your YouTube metadata optimization tools"}
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className='space-y-4'>
            <div className='space-y-2'>
              <label htmlFor='email' className='text-sm font-medium'>
                Email
              </label>
              <input
                id='email'
                type='email'
                placeholder='your.email@example.com'
                className='w-full p-3 rounded-md border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-blue-500'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className='space-y-2'>
              <label htmlFor='password' className='text-sm font-medium'>
                Password
              </label>
              <input
                id='password'
                type='password'
                placeholder='••••••••'
                className='w-full p-3 rounded-md border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-blue-500'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {error && (
              <div className='p-3 bg-red-50 text-red-600 text-sm rounded-md'>
                {error}
              </div>
            )}

            <Button
              type='submit'
              className='w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors'
              disabled={loading}>
              {loading ? (
                <div className='flex items-center justify-center gap-2'>
                  <svg
                    className='animate-spin h-5 w-5 text-white'
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'>
                    <circle
                      className='opacity-25'
                      cx='12'
                      cy='12'
                      r='10'
                      stroke='currentColor'
                      strokeWidth='4'></circle>
                    <path
                      className='opacity-75'
                      fill='currentColor'
                      d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'></path>
                  </svg>
                  <span>Processing...</span>
                </div>
              ) : (
                <span>{isSignUp ? "Create Account" : "Sign In"}</span>
              )}
            </Button>

            <div className='text-center mt-4'>
              <button
                type='button'
                className='text-blue-600 hover:underline text-sm'
                onClick={() => setIsSignUp(!isSignUp)}>
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
