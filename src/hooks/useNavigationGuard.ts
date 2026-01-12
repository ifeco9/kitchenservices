import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export const useNavigationGuard = (
    {
        requireAuth = false,
        requireRole = false,
        requireOnboarding = false
    } = {}
) => {
    const { user, loading } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        // 1. Wait for auth to load
        if (loading) return;

        // 2. Handle Unauthenticated Users
        if (!user) {
            // If page requires auth (like onboarding or dashboard), redirect to signin
            // We assume protected pages will set requireAuth=true
            // But we can also infer from path
            const isProtectedRoute = pathname?.startsWith('/dashboard') || pathname?.startsWith('/onboarding') || pathname === '/auth/role-selection';

            if (isProtectedRoute) {
                router.push('/auth/signin');
            }
            return;
        }

        // 3. Handle Authenticated Users
        const role = user.profile?.role;

        // Case A: No Role -> Must go to Role Selection
        if (!role) {
            if (pathname !== '/auth/role-selection') {
                router.push('/auth/role-selection');
            }
            return;
        }

        // Case B: Has Role -> Check Profile Completeness (Onboarding)
        // We use 'phone' as a proxy for completed onboarding for both customers and providers
        // (Assuming provider onboarding also captures some profile data like phone/address)
        const isProfileComplete = !!user.profile?.phone;

        if (!isProfileComplete) {
            // Must go to Onboarding
            if (role === 'customer') {
                if (pathname !== '/onboarding/customer') {
                    router.push('/onboarding/customer');
                }
            } else if (role === 'provider' || role === 'technician') {
                if (pathname !== '/onboarding/provider') {
                    router.push('/onboarding/provider');
                }
            }
            return;
        }

        // Case C: Profile Complete -> Should be in Dashboard (not Auth/Onboarding pages)
        const isAuthPage = pathname?.startsWith('/auth/');
        const isOnboardingPage = pathname?.startsWith('/onboarding/');
        const isRoot = pathname === '/';

        if (isProfileComplete && (isAuthPage || isOnboardingPage || isRoot)) {
            if (role === 'customer') {
                router.push('/dashboard/customer');
            } else if (role === 'provider' || role === 'technician') {
                router.push('/dashboard/provider');
            } else if (role === 'admin') {
                router.push('/dashboard/admin');
            }
        }

    }, [user, loading, pathname, router]);

    return { loading };
};
