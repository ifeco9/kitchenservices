'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Header from '@/components/common/Header';

export default function SignInPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const router = useRouter();
  const { signIn } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    setIsLoading(true);
    try {
      await signIn(email, password);
      // After successful sign in, redirect to homepage where role will be properly determined
      router.push('/homepage');
    } catch (err) {
      setError('Invalid email or password. Please try again.');
      console.error('Sign in error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-16">
        <div className="max-w-md mx-auto px-4 py-12">
          <div className="bg-card p-8 rounded-xl border border-border shadow-lg">
            <h1 className="text-3xl font-bold text-text-primary mb-2">Welcome Back</h1>
            <p className="text-text-secondary mb-8">Sign in to your account</p>
            
            {error && (
              <div className="mb-6 p-3 bg-error/10 text-error rounded-lg border border-error/20">
                {error}
              </div>
            )}
            
            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <label htmlFor="email" className="block text-sm font-medium text-text-secondary mb-2">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-surface border border-border rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent transition-smooth"
                  placeholder="Enter your email"
                  required
                />
              </div>
              
              <div className="mb-8">
                <label htmlFor="password" className="block text-sm font-medium text-text-secondary mb-2">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-surface border border-border rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent transition-smooth"
                  placeholder="Enter your password"
                  required
                />
              </div>
              
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 px-6 text-sm font-semibold text-accent-foreground bg-accent rounded-lg hover:bg-success shadow-cta hover:shadow-lg transition-smooth disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Signing In...' : 'Sign In'}
              </button>
            </form>
            
            <div className="mt-6 text-center">
              <p className="text-text-secondary">
                Don't have an account?{' '}
                <a href="/auth/signup" className="text-accent hover:underline font-medium">
                  Sign up
                </a>
              </p>
              <p className="text-text-secondary mt-4">
                <a href="/auth/forgot-password" className="text-accent hover:underline font-medium">
                  Forgot your password?
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}