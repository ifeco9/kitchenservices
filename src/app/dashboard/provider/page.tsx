'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Icon from '@/components/ui/AppIcon';
import ErrorBoundary from '@/components/common/ErrorBoundary';
import { bookingService } from '@/services/bookingService';
import { Booking } from '@/types';
import toast, { Toaster } from 'react-hot-toast';
import Link from 'next/link';
import Header from '@/components/common/Header';

export default function ProviderDashboardPage() {
  const router = useRouter();
  const { user, loading, signOut } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push('/');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [earnings, setEarnings] = useState(0);
  const [todayCount, setTodayCount] = useState(0);
  const [loadingStats, setLoadingStats] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (user && user.profile?.role === 'technician') {
        try {
          const data = await bookingService.getBookingsByTechnician(user.id);
          setBookings(data as any);
          const total = data.reduce((acc, b) => acc + (b.total_amount || 0), 0);
          setEarnings(total);
          const today = new Date().toISOString().split('T')[0];
          const todayBookings = data.filter(b => b.scheduled_date.startsWith(today));
          setTodayCount(todayBookings.length);
        } catch (err) {
          console.error('Error fetching dashboard data:', err);
          toast.error('Failed to load dashboard data. Please try again.');
        } finally {
          setLoadingStats(false);
        }
      } else {
        setLoadingStats(false);
      }
    };
    if (user) fetchDashboardData();
  }, [user]);

  const handleStatusUpdate = async (bookingId: string, newStatus: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled') => {
    const confirmMessage = `Are you sure you want to change this booking status to "${newStatus}"?`;
    if (!confirm(confirmMessage)) return;
    setUpdatingStatus(bookingId);
    try {
      await bookingService.updateBookingStatus(bookingId, newStatus);
      if (user) {
        const data = await bookingService.getBookingsByTechnician(user.id);
        setBookings(data as any);
      }
      toast.success(`Booking status updated to ${newStatus}`);
    } catch (error: any) {
      console.error('Failed to update status:', error);
      toast.error(error.message || 'Failed to update booking status');
    } finally {
      setUpdatingStatus(null);
    }
  };

  const getNextStatus = (currentStatus: string): string | null => {
    const statusFlow: Record<string, string> = {
      'pending': 'confirmed',
      'confirmed': 'in_progress',
      'in_progress': 'completed'
    };
    return statusFlow[currentStatus] || null;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#0a0710' }}>
        <div className="text-center">
          <Icon name="ArrowPathIcon" size={32} className="mx-auto animate-spin" style={{ color: '#4b5563' }} />
          <p className="mt-4" style={{ color: '#4b5563', fontFamily: 'Inter, sans-serif' }}>Loading...</p>
        </div>
      </div>
    );
  }

  if (!user || user.profile?.role !== 'technician') {
    if (!user) { router.push('/auth/signin'); } else { router.push('/auth/role-selection'); }
    return null;
  }

  const statusColors: Record<string, { bg: string; text: string; border?: string }> = {
    completed:   { bg: '#0d1a0d', text: '#22C55E', border: '#22C55E' },
    in_progress: { bg: '#11102a', text: '#a855f7', border: '#a855f7' },
    confirmed:   { bg: '#0d1a0d', text: '#22C55E', border: '#22C55E' },
    pending:     { bg: '#1a0f0a', text: '#d97706', border: '#d97706' },
    cancelled:   { bg: '#1e0a0f', text: '#ef4444', border: '#ef4444' },
  };

  const todayStr = new Date().toLocaleDateString('en-NG', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });

  const navItems = [
    { num: '01', label: 'Dashboard', href: '/dashboard/provider', active: true },
    { num: '02', label: 'Bookings', href: '/dashboard/provider/bookings', active: false },
    { num: '03', label: 'Availability', href: '/dashboard/provider/availability', active: false },
    { num: '04', label: 'Services', href: '/dashboard/provider/services', active: false },
    { num: '05', label: 'Profile', href: '/dashboard/provider/profile', active: false },
  ];

  const SidebarContent = () => (
    <>
      <div className="flex items-center gap-2 px-7 py-6" style={{ borderBottom: '1px solid #1a1030', marginBottom: '24px' }}>
        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#9333ea' }} />
        <span style={{ fontSize: '15px', fontWeight: 700, color: '#ffffff', fontFamily: '"Space Grotesk", sans-serif' }}>KitchenServices</span>
      </div>
      <nav className="flex-1 py-4">
        {navItems.map(item => (
          <Link
            key={item.num}
            href={item.href}
            onClick={() => setSidebarOpen(false)}
            className="flex items-center gap-4 px-7 py-3 transition-colors duration-150"
            style={{
              backgroundColor: item.active ? '#9333ea' : 'transparent',
              borderLeft: item.active ? '3px solid #9333ea' : '3px solid transparent',
            }}
          >
            <span style={{ fontSize: '11px', fontWeight: 600, color: item.active ? '#ffffff' : '#2d1f44', fontFamily: '"Space Grotesk", sans-serif', letterSpacing: '0.5px' }}>{item.num}</span>
            <span style={{ fontSize: '14px', fontWeight: item.active ? 600 : 400, color: item.active ? '#ffffff' : '#4b5563', fontFamily: '"Space Grotesk", sans-serif' }}>{item.label}</span>
          </Link>
        ))}
      </nav>
      <div className="px-7 py-5" style={{ borderTop: '1px solid #1a1030' }}>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 flex items-center justify-center text-sm font-bold" style={{ backgroundColor: '#9333ea', color: '#ffffff', fontFamily: '"Space Grotesk", sans-serif' }}>
            {(user?.profile?.full_name || user?.email || 'P').slice(0, 2).toUpperCase()}
          </div>
          <div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#ffffff', fontFamily: '"Space Grotesk", sans-serif' }}>{user?.profile?.full_name || 'Provider'}</div>
            <div style={{ fontSize: '11px', color: '#4b5563', fontFamily: 'Inter, sans-serif' }}>Technician</div>
          </div>
        </div>
        <button
          onClick={handleSignOut}
          className="flex items-center gap-2 w-full text-sm transition-colors duration-150 hover:text-white"
          style={{ color: '#4b5563', fontFamily: 'Inter, sans-serif' }}
        >
          <Icon name="ArrowRightStartOnRectangleIcon" size={16} />
          Sign Out
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#0a0710' }}>
      <Header />
      <Toaster position="top-right" />
      <ErrorBoundary>
      <div className="flex pt-16" style={{ minHeight: 'calc(100vh - 64px)' }}>

        {/* Mobile sidebar backdrop */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-40 bg-black/60 lg:hidden" onClick={() => setSidebarOpen(false)} />
        )}

        {/* Sidebar — desktop: static, mobile: slide-over drawer */}
        <aside
          className={`
            fixed lg:static inset-y-0 left-0 z-50 w-64 flex-shrink-0 flex flex-col
            transform transition-transform duration-300 ease-in-out
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          `}
          style={{ backgroundColor: '#0e0a1a', borderRight: '1px solid #1a1030', minHeight: '100vh' }}
        >
          {/* Close button for mobile */}
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden absolute top-4 right-4 p-1 text-white/50 hover:text-white"
          >
            <Icon name="XMarkIcon" size={20} />
          </button>
          <SidebarContent />
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col" style={{ minHeight: '100vh', padding: 'clamp(16px, 3vw, 40px) clamp(16px, 4vw, 48px)' }}>

          {/* Mobile hamburger + page header */}
          <div className="flex items-center justify-between pb-7">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 -ml-2"
                style={{ color: '#9ca3af' }}
              >
                <Icon name="Bars3Icon" size={24} />
              </button>
              <h1 className="text-3xl lg:text-5xl" style={{ fontWeight: 700, fontFamily: '"Space Grotesk", sans-serif', color: '#ffffff', letterSpacing: '-2px', lineHeight: 1 }}>
                Dashboard
              </h1>
            </div>
            <div className="hidden sm:block px-4 py-2 text-sm" style={{ backgroundColor: '#13091f', border: '1px solid #1a1030', color: '#9ca3af', fontFamily: 'Inter, sans-serif' }}>
              {todayStr}
            </div>
          </div>

          {/* Metrics Strip — responsive grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-px mb-8" style={{ backgroundColor: '#1a1030' }}>
            <div className="flex flex-col justify-between p-5 lg:px-7 lg:py-6" style={{ backgroundColor: '#9333ea', minHeight: '110px' }}>
              <div style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '2px', color: '#ffffff', fontFamily: '"Space Grotesk", sans-serif' }}>TOTAL EARNINGS</div>
              <div>
                <div className="text-2xl lg:text-4xl" style={{ fontWeight: 700, color: '#ffffff', fontFamily: '"Space Grotesk", sans-serif', letterSpacing: '-2px', lineHeight: 1 }}>
                  ₦{loadingStats ? '—' : earnings.toLocaleString('en-NG')}
                </div>
                <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.8)', fontFamily: 'Inter, sans-serif', marginTop: '4px' }}>All time</div>
              </div>
            </div>
            <div className="flex flex-col justify-between p-5 lg:px-7 lg:py-6" style={{ backgroundColor: '#0d0918', minHeight: '110px' }}>
              <div style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '2px', color: '#4b5563', fontFamily: '"Space Grotesk", sans-serif' }}>TODAY</div>
              <div>
                <div className="text-2xl lg:text-4xl" style={{ fontWeight: 700, color: '#ffffff', fontFamily: '"Space Grotesk", sans-serif', letterSpacing: '-2px', lineHeight: 1 }}>
                  {loadingStats ? '—' : todayCount}
                </div>
                <div style={{ fontSize: '12px', color: '#4b5563', fontFamily: 'Inter, sans-serif', marginTop: '4px' }}>Bookings</div>
              </div>
            </div>
            <div className="flex flex-col justify-between p-5 lg:px-7 lg:py-6" style={{ backgroundColor: '#0d0918', minHeight: '110px' }}>
              <div style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '2px', color: '#4b5563', fontFamily: '"Space Grotesk", sans-serif' }}>ALL-TIME</div>
              <div>
                <div className="text-2xl lg:text-4xl" style={{ fontWeight: 700, color: '#ffffff', fontFamily: '"Space Grotesk", sans-serif', letterSpacing: '-2px', lineHeight: 1 }}>
                  {loadingStats ? '—' : bookings.length}
                </div>
                <div style={{ fontSize: '12px', color: '#4b5563', fontFamily: 'Inter, sans-serif', marginTop: '4px' }}>Bookings</div>
              </div>
            </div>
            <div className="flex flex-col justify-between p-5 lg:px-7 lg:py-6" style={{ backgroundColor: '#0d0918', minHeight: '110px' }}>
              <div style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '2px', color: '#4b5563', fontFamily: '"Space Grotesk", sans-serif' }}>AVAILABILITY</div>
              <div>
                <div className="text-2xl lg:text-4xl" style={{ fontWeight: 700, color: '#a855f7', fontFamily: '"Space Grotesk", sans-serif', letterSpacing: '-2px', lineHeight: 1 }}>Open</div>
                <button
                  onClick={() => router.push('/dashboard/provider/availability')}
                  style={{ fontSize: '12px', color: '#9333ea', fontFamily: 'Inter, sans-serif', marginTop: '4px', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                >
                  Update →
                </button>
              </div>
            </div>
          </div>

          {/* Bookings — desktop: table, mobile: cards */}
          <div className="flex-1 mb-10" style={{ backgroundColor: '#0d0918' }}>
            {/* Header */}
            <div className="flex items-center justify-between px-4 sm:px-6 py-4" style={{ backgroundColor: '#08060f' }}>
              <h2 style={{ fontSize: '14px', fontWeight: 600, color: '#ffffff', fontFamily: '"Space Grotesk", sans-serif' }}>Recent Bookings</h2>
              <button
                onClick={() => router.push('/dashboard/provider/bookings')}
                style={{ fontSize: '12px', color: '#9333ea', fontFamily: 'Inter, sans-serif', background: 'none', border: 'none', cursor: 'pointer' }}
              >
                View all →
              </button>
            </div>

            {/* Desktop table header */}
            <div className="hidden lg:flex items-center px-6 py-3" style={{ borderBottom: '1px solid #1a1030' }}>
              {['SERVICE', 'CUSTOMER', 'DATE & TIME', 'STATUS', 'AMOUNT', 'ACTIONS'].map(col => (
                <div
                  key={col}
                  style={{
                    fontSize: '10px', fontWeight: 600, letterSpacing: '1px', color: '#4b5563',
                    fontFamily: '"Space Grotesk", sans-serif',
                    flex: col === 'SERVICE' ? 1.5 : col === 'ACTIONS' ? 1.2 : 1,
                  }}
                >
                  {col}
                </div>
              ))}
            </div>

            {loadingStats ? (
              <div className="flex items-center justify-center py-16">
                <Icon name="ArrowPathIcon" size={24} className="animate-spin" style={{ color: '#4b5563' }} />
              </div>
            ) : bookings.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16">
                <p style={{ color: '#4b5563', fontFamily: 'Inter, sans-serif', fontSize: '15px' }}>No bookings yet.</p>
              </div>
            ) : (
              <>
                {/* Desktop rows */}
                <div className="hidden lg:block">
                  {bookings.slice(0, 6).map((booking: any) => {
                    const sc = statusColors[booking.status] || { bg: '#1a1a2a', text: '#999999', border: '#333' };
                    const nextStatus = getNextStatus(booking.status);
                    const scheduledDate = new Date(booking.scheduled_date);
                    return (
                      <div key={booking.id} className="flex items-center px-6 py-4" style={{ borderBottom: '1px solid #1a1030', backgroundColor: '#0d0918' }}>
                        <div style={{ flex: 1.5, fontSize: '14px', fontWeight: 600, color: '#ffffff', fontFamily: '"Space Grotesk", sans-serif' }}>
                          {booking.services?.name || 'Service'}
                        </div>
                        <div style={{ flex: 1, fontSize: '13px', color: '#9ca3af', fontFamily: 'Inter, sans-serif' }}>
                          {booking.profiles?.full_name || 'Customer'}
                        </div>
                        <div style={{ flex: 1, fontSize: '13px', color: '#6b7280', fontFamily: 'Inter, sans-serif' }}>
                          {scheduledDate.toLocaleDateString()} · {scheduledDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                        <div style={{ flex: 1 }}>
                          <span className="inline-block px-2 py-1 text-xs font-semibold" style={{ backgroundColor: sc.bg, color: sc.text, border: `1px solid ${sc.border || sc.text}`, fontFamily: '"Space Grotesk", sans-serif' }}>
                            {booking.status.replace('_', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}
                          </span>
                        </div>
                        <div style={{ flex: 1, fontSize: '14px', fontWeight: 700, color: '#a855f7', fontFamily: '"Space Grotesk", sans-serif' }}>
                          ₦{booking.total_amount?.toLocaleString('en-NG') || '—'}
                        </div>
                        <div style={{ flex: 1.2, display: 'flex', gap: '8px' }}>
                          {nextStatus && (
                            <button
                              onClick={() => handleStatusUpdate(booking.id, nextStatus as any)}
                              disabled={updatingStatus === booking.id}
                              className="px-3 py-1 text-xs font-medium transition-opacity disabled:opacity-50"
                              style={{ backgroundColor: '#1a1030', color: '#a855f7', border: '1px solid #3d1f6e', fontFamily: '"Space Grotesk", sans-serif', cursor: 'pointer' }}
                            >
                              {updatingStatus === booking.id ? '...' : `→ ${nextStatus.replace('_', ' ')}`}
                            </button>
                          )}
                          {booking.status !== 'cancelled' && booking.status !== 'completed' && (
                            <button
                              onClick={() => handleStatusUpdate(booking.id, 'cancelled')}
                              disabled={updatingStatus === booking.id}
                              className="px-3 py-1 text-xs font-medium transition-opacity disabled:opacity-50"
                              style={{ backgroundColor: '#1e0a0f', color: '#ef4444', border: '1px solid #ef4444', fontFamily: '"Space Grotesk", sans-serif', cursor: 'pointer' }}
                            >
                              Cancel
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Mobile cards */}
                <div className="lg:hidden space-y-3 p-4">
                  {bookings.slice(0, 6).map((booking: any) => {
                    const sc = statusColors[booking.status] || { bg: '#1a1a2a', text: '#999999', border: '#333' };
                    const nextStatus = getNextStatus(booking.status);
                    const scheduledDate = new Date(booking.scheduled_date);
                    return (
                      <div key={booking.id} className="p-4 rounded-lg" style={{ backgroundColor: '#13091f', border: '1px solid #1a1030' }}>
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <div style={{ fontSize: '15px', fontWeight: 600, color: '#ffffff', fontFamily: '"Space Grotesk", sans-serif' }}>
                              {booking.services?.name || 'Service'}
                            </div>
                            <div style={{ fontSize: '12px', color: '#6b7280', fontFamily: 'Inter, sans-serif', marginTop: '2px' }}>
                              {booking.profiles?.full_name || 'Customer'}
                            </div>
                          </div>
                          <span className="px-2 py-1 text-xs font-semibold" style={{ backgroundColor: sc.bg, color: sc.text, border: `1px solid ${sc.border || sc.text}`, fontFamily: '"Space Grotesk", sans-serif' }}>
                            {booking.status.replace('_', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div style={{ fontSize: '12px', color: '#6b7280', fontFamily: 'Inter, sans-serif' }}>
                            {scheduledDate.toLocaleDateString()} · {scheduledDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                          <div style={{ fontSize: '15px', fontWeight: 700, color: '#a855f7', fontFamily: '"Space Grotesk", sans-serif' }}>
                            ₦{booking.total_amount?.toLocaleString('en-NG') || '—'}
                          </div>
                        </div>
                        {(nextStatus || (booking.status !== 'cancelled' && booking.status !== 'completed')) && (
                          <div className="flex gap-2 mt-3 pt-3" style={{ borderTop: '1px solid #1a1030' }}>
                            {nextStatus && (
                              <button
                                onClick={() => handleStatusUpdate(booking.id, nextStatus as any)}
                                disabled={updatingStatus === booking.id}
                                className="flex-1 px-3 py-2 text-xs font-medium disabled:opacity-50"
                                style={{ backgroundColor: '#1a1030', color: '#a855f7', border: '1px solid #3d1f6e', fontFamily: '"Space Grotesk", sans-serif', cursor: 'pointer' }}
                              >
                                {updatingStatus === booking.id ? '...' : `→ ${nextStatus.replace('_', ' ')}`}
                              </button>
                            )}
                            {booking.status !== 'cancelled' && booking.status !== 'completed' && (
                              <button
                                onClick={() => handleStatusUpdate(booking.id, 'cancelled')}
                                disabled={updatingStatus === booking.id}
                                className="px-3 py-2 text-xs font-medium disabled:opacity-50"
                                style={{ backgroundColor: '#1e0a0f', color: '#ef4444', border: '1px solid #ef4444', fontFamily: '"Space Grotesk", sans-serif', cursor: 'pointer' }}
                              >
                                Cancel
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </main>
      </div>
      </ErrorBoundary>
    </div>
  );
}