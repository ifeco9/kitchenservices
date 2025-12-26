'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/common/Header';

export default function ResetPasswordPage() {
    const router = useRouter();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            alert('Passwords do not match');
            return;
        }
        // TODO: Implement password reset logic
        router.push('/auth/signin');
    };

    return (
        <div className="min-h-screen bg-background">
            <Header />
            <div className="pt-24 pb-12 px-4">
                <div className="max-w-md mx-auto">
                    <div className="bg-card p-8 rounded-xl border border-border shadow-lg">
                        <h1 className="text-3xl font-bold text-text-primary mb-2">Set New Password</h1>
                        <p className="text-text-secondary mb-8">
                            Enter your new password below.
                        </p>

                        <form onSubmit={handleSubmit}>
                            <div className="mb-6">
                                <label htmlFor="password" className="block text-sm font-medium text-text-secondary mb-2">
                                    New Password
                                </label>
                                <input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-4 py-3 bg-surface border border-border rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent transition-smooth"
                                    placeholder="Enter new password"
                                    required
                                    minLength={6}
                                />
                            </div>

                            <div className="mb-6">
                                <label htmlFor="confirmPassword" className="block text-sm font-medium text-text-secondary mb-2">
                                    Confirm Password
                                </label>
                                <input
                                    id="confirmPassword"
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full px-4 py-3 bg-surface border border-border rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent transition-smooth"
                                    placeholder="Confirm new password"
                                    required
                                    minLength={6}
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full py-3.5 px-6 text-sm font-semibold text-accent-foreground bg-accent rounded-lg hover:bg-success shadow-cta hover:shadow-lg transition-smooth"
                            >
                                Reset Password
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
