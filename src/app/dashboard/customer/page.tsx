'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Header from '@/components/common/Header';
import Icon from '@/components/ui/AppIcon';
import ReviewModal from '@/components/common/ReviewModal';
import ErrorBoundary from '@/components/common/ErrorBoundary';
import { bookingService } from '@/services/bookingService';
import Link from 'next/link';

export default function CustomerDashboardPage() {
  const router = useRouter();
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, loading, signOut } = useAuth();

  const [bookings, setBookings] = useState<any[]>([]);
  const [stats, setStats] = useState({ active: 0, upcoming: 0, favorites: 0 });
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (user) {
      const fetchData = async () => {
        try {
          const userBookings = await bookingService.getBookingsByCustomer(user.id);
          setBookings(userBookings);
          const active = userBookings.filter((b: any) => ['pending', 'confirmed', 'in_progress'].includes(b.status)).length;
          const upcoming = userBookings.filter((b: any) =>
            ['pending', 'confirmed'].includes(b.status) && new Date(b.scheduled_date) > new Date()
          ).length;
          setStats({ active, upcoming, favorites: 0 });
        } catch (error) {
          console.error('Error fetching dashboard data:', error);
        } finally {
          setLoadingData(false);
        }
      };
      fetchData();
    }
  }, [user]);

  if (loading || (user && loadingData)) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#0a0710' }}>
        <Icon name="ArrowPathIcon" size={32} className="animate-spin" style={{ color: '#4b5563' }} />
      </div>
    );
  }

  if (!user || user.profile?.role !== 'customer') {
    if (!loading) {
      if (!user) { router.push('/auth/signin'); } else { router.push('/auth/role-selection'); }
    }
    return null;
  }

  const handleSignOut = async () => {
    try { await signOut(); router.push('/'); } catch (error) { console.error('Sign out error:', error); }
  };

  const todayStr = new Date().toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });

  const statusColors: Record<string, { bg: string; text: string }> = {
    completed:   { bg: '#0d1a0d', text: '#22C55E' },
    in_progress: { bg: '#11102a', text: '#a855f7' },
    confirmed:   { bg: '#0d1a0d', text: '#22C55E' },
    pending:     { bg: '#1a0f0a', text: '#d97706' },
    cancelled:   { bg: '#1e0a0f', text: '#ef4444' },
  };

  const navItems = [
    { num: '01', label: 'Dashboard', href: '/dashboard/customer', active: true },
    { num: '02', label: 'My Bookings', href: '/dashboard/customer/bookings', active: false },
    { num: '03', label: 'Book a Service', href: '/book-a-service', active: false },
    { num: '04', label: 'Find Technician', href: '/find-a-technician', active: false },
    { num: '05', label: 'Profile', href: '/dashboard/customer', active: false },
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
      <div className="px-7 py-5" style={{ borderTop: '1px solid #1a1030' }}>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 flex items-center justify-center text-sm font-bold" style={{ backgroundColor: '#9333ea', color: '#ffffff', fontFamily: '"Space Grotesk", sans-serif' }}>
            {(user?.profile?.full_name || user?.email || 'C').slice(0, 2).toUpperCase()}
          </div>
          <div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#ffffff', fontFamily: '"Space Grotesk", sans-serif' }}>{user?.profile?.full_name || 'Customer'}</div>
            <div style={{ fontSize: '11px', color: '#4b5563', fontFamily: 'Inter, sans-serif' }}>Customer</div>
          </div>
        </div>
        <button onClick={handleSignOut} className="flex items-center gap-2 w-full text-sm transition-colors duration-150 hover:text-white" style={{ color: '#4b5563', fontFamily: 'Inter, sans-serif' }}>
          <Icon name="ArrowRightStartOnRectangleIcon" size={16} /> Sign Out
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#0a0710' }}>
      <Header />
      <ErrorBoundary>
      <div className="flex pt-16" style={{ minHeight: 'calc(100vh - 64px)' }}>

        {/* Mobile sidebar backdrop */}
        {sidebarOpen && <div className="fixed inset-0 z-40 bg-black/60 lg:hidden" onClick={() => setSidebarOpen(false)} />}

        {/* Sidebar — desktop: static, mobile: slide-over drawer */}
        <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-64 flex-shrink-0 flex flex-col transform transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
          style={{ backgroundColor: '#0e0a1a', borderRight: '1px solid #1a1030', minHeight: '100vh' }}>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden absolute top-4 right-4 p-1 text-white/50 hover:text-white">
            <Icon name="XMarkIcon" size={20} />
          </button>
          <SidebarContent />
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col" style={{ minHeight: '100vh', padding: 'clamp(16px, 3vw, 40px) clamp(16px, 4vw, 48px)' }}>

          {/* Header */}
          <div className="flex items-center justify-between pb-7">
            <div className="flex items-center gap-3">
              <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 -ml-2" style={{ color: '#9ca3af' }}>
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

          {/* Welcome */}
          <div className="mb-8 p-4 sm:p-6 rounded-lg" style={{ backgroundColor: '#0e0a1a', border: '1px solid #1a1030' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 600, fontFamily: '"Space Grotesk", sans-serif', color: '#ffffff', marginBottom: '4px' }}>
              Welcome back, {user.profile?.full_name?.split(' ')[0] || 'Customer'}!
            </h2>
            <p style={{ fontSize: '14px', color: '#6b7280', fontFamily: 'Inter, sans-serif' }}>Here&apos;s what&apos;s happening with your account</p>
          </div>

          {/* Stats Cards — responsive */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            {[
              { label: 'Active Bookings', value: stats.active, icon: 'CalendarIcon', color: '#a855f7' },
              { label: 'Upcoming Service', value: stats.upcoming, icon: 'ClockIcon', color: '#22C55E' },
              { label: 'Favorites', value: stats.favorites, icon: 'HeartIcon', color: '#9333ea' },
            ].map(card => (
              <div key={card.label} className="p-4 sm:p-5 rounded-lg" style={{ backgroundColor: '#0e0a1a', border: '1px solid #1a1030' }}>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 flex items-center justify-center rounded-lg" style={{ backgroundColor: `${card.color}15` }}>
                    <Icon name={card.icon as any} size={20} style={{ color: card.color }} />
                  </div>
                  <div>
                    <div style={{ fontSize: '12px', color: '#6b7280', fontFamily: 'Inter, sans-serif' }}>{card.label}</div>
                    <div style={{ fontSize: '28px', fontWeight: 700, fontFamily: '"Space Grotesk", sans-serif', color: '#ffffff', lineHeight: 1 }}>{card.value}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Recent Bookings */}
          <div className="p-4 sm:p-6 rounded-lg mb-6" style={{ backgroundColor: '#0e0a1a', border: '1px solid #1a1030' }}>
            <div className="flex items-center justify-between mb-6">
              <h2 style={{ fontSize: '18px', fontWeight: 600, fontFamily: '"Space Grotesk", sans-serif', color: '#ffffff' }}>Recent Bookings</h2>
              <button onClick={() => router.push('/dashboard/customer/bookings')} style={{ fontSize: '13px', color: '#9333ea', fontFamily: 'Inter, sans-serif' }} className="hover:underline">
                View all →
              </button>
            </div>

            {bookings.length === 0 ? (
              <div className="text-center py-12">
                <Icon name="CalendarIcon" size={40} style={{ color: '#2d1f44' }} className="mx-auto mb-4" />
                <p style={{ fontSize: '15px', color: '#6b7280', fontFamily: 'Inter, sans-serif', marginBottom: '12px' }}>No bookings yet</p>
                <Link href="/book-a-service" className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold transition-all hover:opacity-90"
                  style={{ backgroundColor: '#9333ea', color: '#ffffff', fontFamily: '"Space Grotesk", sans-serif' }}>
                  Book your first service <Icon name="ArrowRightIcon" size={14} />
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {bookings.slice(0, 5).map((booking) => {
                  const sc = statusColors[booking.status] || statusColors.pending;
                  return (
                    <div key={booking.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-lg"
                      style={{ backgroundColor: '#13091f', border: '1px solid #1a1030' }}>
                      <div className="flex items-center gap-4 mb-2 sm:mb-0">
                        <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-lg" style={{ backgroundColor: '#1a1030' }}>
                          <Icon name="WrenchScrewdriverIcon" size={18} style={{ color: '#a855f7' }} />
                        </div>
                        <div>
                          <div style={{ fontSize: '14px', fontWeight: 600, color: '#ffffff', fontFamily: '"Space Grotesk", sans-serif' }}>
                            {booking.services?.name || 'Service'}
                          </div>
                          <div style={{ fontSize: '12px', color: '#6b7280', fontFamily: 'Inter, sans-serif' }}>
                            with {booking.technicians?.full_name || 'Technician'} · {new Date(booking.scheduled_date).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 ml-14 sm:ml-0">
                        <span className="px-3 py-1 text-xs font-semibold rounded-full"
                          style={{ backgroundColor: sc.bg, color: sc.text, fontFamily: '"Space Grotesk", sans-serif' }}>
                          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1).replace('_', ' ')}
                        </span>
                        {booking.status === 'completed' && (
                          <button
                            onClick={() => { setSelectedBooking({ id: booking.id, technicianId: booking.technician_id, technicianName: booking.technicians?.full_name }); setIsReviewOpen(true); }}
                            style={{ fontSize: '12px', color: '#9333ea', fontFamily: 'Inter, sans-serif' }} className="hover:underline font-semibold">
                            Review
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Quick Actions — responsive */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { label: 'Book New Service', desc: 'Schedule a repair or installation', icon: 'PlusCircleIcon', href: '/book-a-service' },
              { label: 'Find a Technician', desc: 'Browse verified professionals', icon: 'MagnifyingGlassIcon', href: '/find-a-technician' },
            ].map(action => (
              <Link key={action.label} href={action.href}
                className="group p-4 sm:p-5 rounded-lg flex items-center gap-4 transition-colors duration-150"
                style={{ backgroundColor: '#0e0a1a', border: '1px solid #1a1030' }}>
                <div className="w-10 h-10 flex items-center justify-center rounded-lg" style={{ backgroundColor: '#1a1030' }}>
                  <Icon name={action.icon as any} size={20} style={{ color: '#9333ea' }} />
                </div>
                <div className="flex-1">
                  <div style={{ fontSize: '15px', fontWeight: 600, color: '#ffffff', fontFamily: '"Space Grotesk", sans-serif' }}>{action.label}</div>
                  <div style={{ fontSize: '12px', color: '#6b7280', fontFamily: 'Inter, sans-serif' }}>{action.desc}</div>
                </div>
                <Icon name="ChevronRightIcon" size={16} style={{ color: '#2d1f44' }} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            ))}
          </div>
        </main>
      </div>
      </ErrorBoundary>

      {user && (
        <ReviewModal isOpen={isReviewOpen} onClose={() => setIsReviewOpen(false)}
          bookingId={selectedBooking?.id || ''} technicianId={selectedBooking?.technicianId || ''}
          technicianName={selectedBooking?.technicianName || ''} customerId={user.id} />
      )}
    </div>
  );
}