'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Icon from '@/components/ui/AppIcon';
import { profileService } from '@/services/profileService';
import Link from 'next/link';
import Header from '@/components/common/Header';

export default function AdminDashboardPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalTechnicians: 0,
    pendingTechnicians: 0,
    totalBookings: 0
  });
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await profileService.getUserStats();
        setStats(data);
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setLoadingStats(false);
      }
    };
    if (user?.role === 'admin') {
      fetchStats();
    }
  }, [user]);

  useEffect(() => {
    if (!loading && (!user || user.role !== 'admin')) {
      router.push('/');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#0a0710' }}>
        <Icon name="ArrowPathIcon" size={32} className="animate-spin" style={{ color: '#4b5563' } as any} />
      </div>
    );
  }

  const todayStr = new Date().toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });

  const navItems = [
    { num: '01', label: 'Overview', href: '/dashboard/admin', active: true },
    { num: '02', label: 'Technicians', href: '/dashboard/admin/technicians', active: false },
    { num: '03', label: 'Users', href: '/dashboard/admin/users', active: false },
    { num: '04', label: 'Bookings', href: '/dashboard/admin/bookings', active: false },
  ];

  const SidebarContent = () => (
    <>
      <div className="flex items-center gap-2 px-7 py-6" style={{ borderBottom: '1px solid #1a1030', marginBottom: '24px' }}>
        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#9333ea' }} />
        <span style={{ fontSize: '15px', fontWeight: 700, color: '#ffffff', fontFamily: '"Space Grotesk", sans-serif' }}>KitchenServices</span>
      </div>
      <nav className="flex-1 py-4">
        {navItems.map(item => (
          <Link key={item.num} href={item.href} onClick={() => setSidebarOpen(false)}
            className="flex items-center gap-4 px-7 py-3 transition-colors duration-150"
            style={{ backgroundColor: item.active ? '#9333ea' : 'transparent', borderLeft: item.active ? '3px solid #9333ea' : '3px solid transparent' }}>
            <span style={{ fontSize: '11px', fontWeight: 600, color: item.active ? '#ffffff' : '#2d1f44', fontFamily: '"Space Grotesk", sans-serif', letterSpacing: '0.5px' }}>{item.num}</span>
            <span style={{ fontSize: '14px', fontWeight: item.active ? 600 : 400, color: item.active ? '#ffffff' : '#4b5563', fontFamily: '"Space Grotesk", sans-serif' }}>{item.label}</span>
          </Link>
        ))}
      </nav>
      {!loadingStats && stats.pendingTechnicians > 0 && (
        <div className="mx-4 mb-4 flex items-center gap-3 px-4 py-3" style={{ backgroundColor: '#130820', border: '1px solid #9333ea' }}>
          <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: '#9333ea', flexShrink: 0 }} />
          <span style={{ fontSize: '12px', color: '#9333ea', fontFamily: 'Inter, sans-serif' }}>{stats.pendingTechnicians} pending verifications</span>
        </div>
      )}
      <div className="px-7 py-5" style={{ borderTop: '1px solid #1a1030' }}>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 flex items-center justify-center font-bold text-sm" style={{ backgroundColor: '#9333ea', color: '#ffffff', fontFamily: '"Space Grotesk", sans-serif' }}>AD</div>
          <div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#ffffff', fontFamily: '"Space Grotesk", sans-serif' }}>Admin</div>
            <div style={{ fontSize: '11px', color: '#4b5563', fontFamily: 'Inter, sans-serif' }}>Super Admin</div>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#0a0710' }}>
      <Header />
      <div className="flex pt-16" style={{ minHeight: 'calc(100vh - 64px)' }}>

        {/* Mobile sidebar backdrop */}
        {sidebarOpen && <div className="fixed inset-0 z-40 bg-black/60 lg:hidden" onClick={() => setSidebarOpen(false)} />}

        {/* Sidebar — desktop: static, mobile: slide-over */}
        <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-64 flex-shrink-0 flex flex-col transform transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
          style={{ backgroundColor: '#0e0a1a', borderRight: '1px solid #1a1030', minHeight: '100vh' }}>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden absolute top-4 right-4 p-1 text-white/50 hover:text-white">
            <Icon name="XMarkIcon" size={20} />
          </button>
          <SidebarContent />
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col" style={{ minHeight: '100vh', padding: 'clamp(16px, 3vw, 40px) clamp(16px, 4vw, 48px)' }}>

          {/* Page Header */}
          <div className="flex items-center justify-between pb-7 flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 -ml-2" style={{ color: '#9ca3af' }}>
                <Icon name="Bars3Icon" size={24} />
              </button>
              <h1 className="text-3xl lg:text-5xl" style={{ fontWeight: 700, fontFamily: '"Space Grotesk", sans-serif', color: '#ffffff', letterSpacing: '-2px', lineHeight: 1 }}>
                Admin Overview
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden sm:block px-4 py-2" style={{ backgroundColor: '#13091f', border: '1px solid #1a1030', color: '#9ca3af', fontFamily: 'Inter, sans-serif', fontSize: '13px' }}>
                {todayStr}
              </div>
              <button
                onClick={() => router.push('/dashboard/admin/technicians')}
                className="px-4 py-2 font-semibold transition-opacity hover:opacity-90"
                style={{ backgroundColor: '#9333ea', color: '#ffffff', fontFamily: '"Space Grotesk", sans-serif', fontSize: '13px', cursor: 'pointer', border: 'none' }}
              >
                Export Report ↓
              </button>
            </div>
          </div>

          {/* Metrics Strip — responsive grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-px mb-8" style={{ backgroundColor: '#1a1030' }}>
            <div className="flex flex-col justify-between p-5 lg:px-7 lg:py-6" style={{ backgroundColor: '#9333ea', minHeight: '110px' }}>
              <div style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '2px', color: '#ffffff', fontFamily: '"Space Grotesk", sans-serif' }}>TOTAL USERS</div>
              <div>
                <div className="text-2xl lg:text-4xl" style={{ fontWeight: 700, color: '#ffffff', fontFamily: '"Space Grotesk", sans-serif', letterSpacing: '-2px', lineHeight: 1 }}>
                  {loadingStats ? '—' : stats.totalUsers.toLocaleString()}
                </div>
                <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.75)', fontFamily: 'Inter, sans-serif', marginTop: '4px' }}>Registered</div>
              </div>
            </div>
            <div className="flex flex-col justify-between p-5 lg:px-7 lg:py-6" style={{ backgroundColor: '#0d0918', minHeight: '110px' }}>
              <div style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '2px', color: '#4b5563', fontFamily: '"Space Grotesk", sans-serif' }}>TECHNICIANS</div>
              <div>
                <div className="text-2xl lg:text-4xl" style={{ fontWeight: 700, color: '#a855f7', fontFamily: '"Space Grotesk", sans-serif', letterSpacing: '-2px', lineHeight: 1 }}>
                  {loadingStats ? '—' : stats.totalTechnicians}
                </div>
                <div style={{ fontSize: '12px', color: '#4b5563', fontFamily: 'Inter, sans-serif', marginTop: '4px' }}>Active</div>
              </div>
            </div>
            <div className="flex flex-col justify-between p-5 lg:px-7 lg:py-6" style={{ backgroundColor: '#0d0918', minHeight: '110px' }}>
              <div style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '2px', color: '#4b5563', fontFamily: '"Space Grotesk", sans-serif' }}>PENDING</div>
              <div>
                <div className="text-2xl lg:text-4xl" style={{ fontWeight: 700, color: stats.pendingTechnicians > 0 ? '#9333ea' : '#666666', fontFamily: '"Space Grotesk", sans-serif', letterSpacing: '-2px', lineHeight: 1 }}>
                  {loadingStats ? '—' : stats.pendingTechnicians}
                </div>
                <button onClick={() => router.push('/dashboard/admin/technicians')}
                  style={{ fontSize: '12px', color: '#9333ea', fontFamily: 'Inter, sans-serif', marginTop: '4px', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                  {stats.pendingTechnicians > 0 ? 'Action →' : 'All clear'}
                </button>
              </div>
            </div>
            <div className="flex flex-col justify-between p-5 lg:px-7 lg:py-6" style={{ backgroundColor: '#0d0918', minHeight: '110px' }}>
              <div style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '2px', color: '#4b5563', fontFamily: '"Space Grotesk", sans-serif' }}>BOOKINGS</div>
              <div>
                <div className="text-2xl lg:text-4xl" style={{ fontWeight: 700, color: '#ffffff', fontFamily: '"Space Grotesk", sans-serif', letterSpacing: '-2px', lineHeight: 1 }}>
                  {loadingStats ? '—' : stats.totalBookings.toLocaleString()}
                </div>
                <div style={{ fontSize: '12px', color: '#4b5563', fontFamily: 'Inter, sans-serif', marginTop: '4px' }}>All time</div>
              </div>
            </div>
          </div>

          {/* Quick Action Panels — responsive */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-px flex-1" style={{ backgroundColor: '#1a1030' }}>
            <button
              onClick={() => router.push('/dashboard/admin/technicians')}
              className="flex flex-col justify-between p-6 sm:p-8 text-left group transition-colors duration-200 hover:opacity-90"
              style={{ backgroundColor: '#0d0918', cursor: 'pointer', border: 'none' }}
            >
              <div style={{ fontSize: '28px', fontWeight: 700, fontFamily: '"Space Grotesk", sans-serif', color: '#9333ea', letterSpacing: '-1px' }}>01</div>
              <div>
                <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#ffffff', fontFamily: '"Space Grotesk", sans-serif', marginBottom: '8px', lineHeight: 1.2 }}>
                  Manage<br />Technicians
                </h3>
                <p style={{ fontSize: '13px', color: '#4b5563', fontFamily: 'Inter, sans-serif', marginBottom: '16px' }}>
                  Verify pending technicians and manage existing ones
                </p>
                {!loadingStats && stats.pendingTechnicians > 0 && (
                  <div className="inline-block px-3 py-1 mb-3" style={{ backgroundColor: '#130820', border: '1px solid #9333ea' }}>
                    <span style={{ fontSize: '11px', fontWeight: 600, color: '#9333ea', fontFamily: '"Space Grotesk", sans-serif' }}>
                      {stats.pendingTechnicians} Pending
                    </span>
                  </div>
                )}
                <div style={{ fontSize: '13px', fontWeight: 600, color: '#a855f7', fontFamily: '"Space Grotesk", sans-serif' }}>Manage now →</div>
              </div>
            </button>

            <button
              onClick={() => router.push('/dashboard/admin/users')}
              className="flex flex-col justify-between p-6 sm:p-8 text-left group transition-colors duration-200 hover:opacity-90"
              style={{ backgroundColor: '#0d0918', cursor: 'pointer', border: 'none' }}
            >
              <div style={{ fontSize: '28px', fontWeight: 700, fontFamily: '"Space Grotesk", sans-serif', color: '#2d1f44', letterSpacing: '-1px' }}>02</div>
              <div>
                <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#ffffff', fontFamily: '"Space Grotesk", sans-serif', marginBottom: '8px', lineHeight: 1.2 }}>
                  Manage<br />Users
                </h3>
                <p style={{ fontSize: '13px', color: '#4b5563', fontFamily: 'Inter, sans-serif', marginBottom: '16px' }}>
                  View and manage all platform users and their accounts
                </p>
                <div style={{ fontSize: '13px', fontWeight: 600, color: '#22C55E', fontFamily: '"Space Grotesk", sans-serif' }}>View users →</div>
              </div>
            </button>

            <button
              onClick={() => router.push('/dashboard/admin/bookings')}
              className="flex flex-col justify-between p-6 sm:p-8 text-left group transition-colors duration-200 hover:opacity-90"
              style={{ backgroundColor: '#110920', cursor: 'pointer', border: 'none' }}
            >
              <div style={{ fontSize: '28px', fontWeight: 700, fontFamily: '"Space Grotesk", sans-serif', color: '#2d1f44', letterSpacing: '-1px' }}>03</div>
              <div>
                <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#ffffff', fontFamily: '"Space Grotesk", sans-serif', marginBottom: '8px', lineHeight: 1.2 }}>
                  View<br />Bookings
                </h3>
                <p style={{ fontSize: '13px', color: '#4b5563', fontFamily: 'Inter, sans-serif', marginBottom: '16px' }}>
                  Monitor all bookings and transactions in real-time
                </p>
                <div style={{ fontSize: '13px', fontWeight: 600, color: '#a855f7', fontFamily: '"Space Grotesk", sans-serif' }}>View bookings →</div>
              </div>
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}
