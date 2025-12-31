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
    <div className="min-h-screen bg-gradient-midnight relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-mesh-cool opacity-40"></div>
      <div className="absolute top-20 right-10 w-96 h-96 bg-gradient-ocean opacity-20 rounded-full blur-3xl animate-float-slow"></div>
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-gradient-sunset opacity-20 rounded-full blur-3xl float-gentle"></div>

      <Header />
      <div className="pt-16 relative z-10">
        <div className="max-w-md mx-auto px-4 py-12">
          <div className="glass-dark p-8 rounded-2xl shadow-2xl magnetic-hover animate-fade-in">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-display font-bold text-white mb-2">
                Welcome <span className="gradient-text bg-gradient-animated">Back</span>
              </h1>
              <p className="text-white/70 font-heading">Sign in to your account</p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-error/20 backdrop-blur-sm text-white rounded-xl border border-error/30 animate-bounce-in">
                <div className="flex items-center space-x-2">
                  <span className="text-lg">⚠️</span>
                  <span className="font-heading">{error}</span>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-heading font-medium text-white/90 mb-2">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent focus:bg-white/20 transition-smooth font-heading"
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-heading font-medium text-white/90 mb-2">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent focus:bg-white/20 transition-smooth font-heading"
                  placeholder="Enter your password"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 px-6 text-base font-heading font-semibold text-white bg-gradient-sunset rounded-xl shadow-cta hover:shadow-lg magnetic-hover glow-pulse focus-ring disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? '🔄 Signing In...' : '🚀 Sign In'}
              </button>
            </form>

            <div className="mt-8 text-center space-y-4">
              <p className="text-white/70 font-heading">
                Don't have an account?{' '}
                <a href="/auth/signup" className="text-white font-semibold hover:text-accent transition-smooth gradient-text-ocean">
                  Sign up
                </a>
              </p>
              <p className="text-white/70 font-heading">
                <a href="/auth/forgot-password" className="text-white/90 hover:text-white transition-smooth">
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