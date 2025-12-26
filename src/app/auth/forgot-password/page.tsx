'use client';

import { useState } from 'react';
import Header from '@/components/common/Header';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // TODO: Implement password reset logic
        setIsSubmitted(true);
    };

    return (
        <div className="min-h-screen bg-background">
            <Header />
            <div className="pt-24 pb-12 px-4">
                <div className="max-w-md mx-auto">
                    <div className="bg-card p-8 rounded-xl border border-border shadow-lg">
                        <h1 className="text-3xl font-bold text-text-primary mb-2">Reset Password</h1>
                        <p className="text-text-secondary mb-8">
                            Enter your email address and we'll send you a link to reset your password.
                        </p>

                        {isSubmitted ? (
                            <div className="text-center py-8">
                                <p className="text-success mb-4">Check your email!</p>
                                <p className="text-text-secondary">
                                    If an account exists with that email, you'll receive password reset instructions.
                                </p>
                            </div>
                        ) : (
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

                                <button
                                    type="submit"
                                    className="w-full py-3.5 px-6 text-sm font-semibold text-accent-foreground bg-accent rounded-lg hover:bg-success shadow-cta hover:shadow-lg transition-smooth"
                                >
                                    Send Reset Link
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
