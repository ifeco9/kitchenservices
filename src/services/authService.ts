import { createClient } from '@/lib/supabase/client';
const supabase = createClient();

export const authService = {
    async signUp(email: string, password: string, fullName: string, role?: 'customer' | 'technician') {
        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            throw new Error('Invalid email format');
        }
        if (!password || password.length < 8) {
            throw new Error('Password must be at least 8 characters');
        }
        if (!fullName || !fullName.trim()) {
            throw new Error('Full name is required');
        }

        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: fullName,
                    ...(role ? { role } : {}),
                },
            },
        });
        if (error) throw new Error(error.message);
        return data;
    },

    async signIn(email: string, password: string) {
        if (!email || !password) {
            throw new Error('Email and password are required');
        }

        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });
        if (error) throw new Error(error.message);
        return data;
    },

    async signOut() {
        const { error } = await supabase.auth.signOut();
        if (error) throw new Error(error.message);
    },

    async getCurrentSession() {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
            console.error('Failed to get session:', error);
            return null;
        }
        return session;
    },

    async getUser() {
        const { data: { user }, error } = await supabase.auth.getUser();
        if (error) {
            console.error('Failed to get user:', error);
            return null;
        }
        return user;
    },

    async resetPasswordRequest(email: string) {
        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            throw new Error('Invalid email format');
        }

        const redirectUrl = process.env.NEXT_PUBLIC_APP_URL || '';
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${redirectUrl}/auth/reset-password`,
        });
        if (error) throw new Error(error.message);
    },

    async updatePassword(newPassword: string) {
        if (!newPassword || newPassword.length < 8) {
            throw new Error('Password must be at least 8 characters');
        }

        const { error } = await supabase.auth.updateUser({
            password: newPassword,
        });
        if (error) throw new Error(error.message);
    }
};
