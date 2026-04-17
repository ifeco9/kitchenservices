'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { profileService } from '@/services/profileService';
import { supabase } from '@/lib/supabaseClient';
import Icon from '@/components/ui/AppIcon';
import ImageUpload from '@/components/common/ImageUpload';
import Link from 'next/link';
import toast, { Toaster } from 'react-hot-toast';

export default function ProviderProfilePage() {
  const { user, loading, refreshProfile } = useAuth();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [saving, setSaving] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState('');

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [bio, setBio] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState(''); // Nigerian state

  const [hourlyRate, setHourlyRate] = useState('');
  const [calloutFee, setCalloutFee] = useState('');
  const [serviceRadius, setServiceRadius] = useState('10');
  const [yearsExperience, setYearsExperience] = useState('');
  const [specializations, setSpecializations] = useState<string[]>([]);
  const [availabilityStatus, setAvailabilityStatus] = useState('available');

  const availableSpecializations = [
    'Refrigerator', 'Washing Machine', 'Dishwasher', 'Oven',
    'Cooker Hood', 'Microwave', 'Tumble Dryer', 'Hob', 'All Appliances'
  ];

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      setFullName(user.profile?.full_name || '');
      setPhone(user.profile?.phone || '');
      setAvatarUrl(user.profile?.avatar_url || '');
      setAddress(user.profile?.address || '');
      setCity(user.profile?.city || '');
      setState(user.profile?.state || '');

      const { data } = await supabase
        .from('technicians')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      if (data) {
        setBio(data.bio || '');
        setHourlyRate(data.hourly_rate?.toString() || '');
        setCalloutFee(data.callout_fee?.toString() || '');
        setServiceRadius(data.service_radius_km?.toString() || '10');
        setYearsExperience(data.years_experience?.toString() || '');
        setSpecializations(data.specializations || []);
        setAvailabilityStatus(data.availability_status || 'available');
      }
    };
    load();
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#0a0710' }}>
        <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user || user.profile?.role !== 'technician') {
    router.push('/auth/signin');
    return null;
  }

  const toggleSpec = (spec: string) => {
    setSpecializations(prev =>
      prev.includes(spec) ? prev.filter(s => s !== spec) : [...prev, spec]
    );
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await profileService.updateProfile(user.id, {
        full_name: fullName,
        phone,
        address,
        city,
        state,
        avatar_url: avatarUrl || undefined,
      });

      await supabase
        .from('technicians')
        .update({
          bio,
          hourly_rate: parseFloat(hourlyRate) || 0,
          callout_fee: parseFloat(calloutFee) || 0,
          service_radius_km: parseInt(serviceRadius),
          years_experience: parseInt(yearsExperience) || 0,
          specializations,
          availability_status: availabilityStatus,
        })
        .eq('id', user.id);

      await refreshProfile();
      toast.success('Profile updated successfully!');
    } catch (err: any) {
      console.error('Profile update error:', err);
      toast.error(err.message || 'Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  const navItems = [
    { num: '01', label: 'Dashboard', href: '/dashboard/provider', active: false },
    { num: '02', label: 'Bookings', href: '/dashboard/provider/bookings', active: false },
    { num: '03', label: 'Availability', href: '/dashboard/provider/availability', active: false },
    { num: '04', label: 'Services', href: '/dashboard/provider/services', active: false },
    { num: '05', label: 'Profile', href: '/dashboard/provider/profile', active: true },
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
            {(user?.profile?.full_name || user?.email || 'P').slice(0, 2).toUpperCase()}
          </div>
          <div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#ffffff', fontFamily: '"Space Grotesk", sans-serif' }}>{user?.profile?.full_name || 'Provider'}</div>
            <div style={{ fontSize: '11px', color: '#4b5563', fontFamily: 'Inter, sans-serif' }}>Technician</div>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#0a0710' }}>
      <Toaster position="top-right" />
      <div className="flex" style={{ minHeight: '100vh' }}>

        {/* Mobile sidebar backdrop */}
        {sidebarOpen && <div className="fixed inset-0 z-40 bg-black/60 lg:hidden" onClick={() => setSidebarOpen(false)} />}

        {/* Sidebar */}
        <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-64 flex-shrink-0 flex flex-col transform transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
          style={{ backgroundColor: '#0e0a1a', borderRight: '1px solid #1a1030', minHeight: '100vh' }}>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden absolute top-4 right-4 p-1 text-white/50 hover:text-white">
            <Icon name="XMarkIcon" size={20} />
          </button>
          <SidebarContent />
        </aside>

        {/* Main */}
        <main className="flex-1 flex flex-col" style={{ padding: 'clamp(16px, 3vw, 40px) clamp(16px, 4vw, 48px)' }}>
          <div className="flex items-center justify-between pb-7 flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 -ml-2" style={{ color: '#9ca3af' }}>
                <Icon name="Bars3Icon" size={24} />
              </button>
              <h1 className="text-3xl lg:text-5xl" style={{ fontWeight: 700, fontFamily: '"Space Grotesk", sans-serif', color: '#ffffff', letterSpacing: '-2px', lineHeight: 1 }}>
                Edit Profile
              </h1>
            </div>
            <Link href="/dashboard/provider" className="flex items-center gap-2 text-sm" style={{ color: '#9333ea', fontFamily: 'Inter, sans-serif' }}>
              <Icon name="ArrowLeftIcon" size={16} />
              Back to Dashboard
            </Link>
          </div>

          <form onSubmit={handleSave} className="space-y-8 max-w-3xl">

            {/* Profile Photo */}
            <div className="p-4 sm:p-6 rounded-lg" style={{ backgroundColor: '#0d0918', border: '1px solid #1a1030' }}>
              <h2 style={{ fontSize: '16px', fontWeight: 600, color: '#ffffff', fontFamily: '"Space Grotesk", sans-serif', marginBottom: '20px' }}>Profile Photo</h2>
              <ImageUpload
                currentImageUrl={avatarUrl}
                onUploadComplete={(url) => setAvatarUrl(url)}
                userId={user.id}
                persistToProfile={true}
              />
            </div>

            {/* Personal Info */}
            <div className="p-4 sm:p-6 rounded-lg space-y-4" style={{ backgroundColor: '#0d0918', border: '1px solid #1a1030' }}>
              <h2 style={{ fontSize: '16px', fontWeight: 600, color: '#ffffff', fontFamily: '"Space Grotesk", sans-serif' }}>Personal Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm mb-1" style={{ color: '#9ca3af', fontFamily: 'Inter, sans-serif' }}>Full Name</label>
                  <input type="text" value={fullName} onChange={e => setFullName(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg text-sm"
                    style={{ backgroundColor: '#13091f', border: '1px solid #2d1f44', color: '#ffffff', fontFamily: 'Inter, sans-serif' }}
                    placeholder="Your full name" />
                </div>
                <div>
                  <label className="block text-sm mb-1" style={{ color: '#9ca3af', fontFamily: 'Inter, sans-serif' }}>Phone Number</label>
                  <input type="tel" value={phone} onChange={e => setPhone(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg text-sm"
                    style={{ backgroundColor: '#13091f', border: '1px solid #2d1f44', color: '#ffffff', fontFamily: 'Inter, sans-serif' }}
                    placeholder="+44 7700 900000" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm mb-1" style={{ color: '#9ca3af' }}>Street Address</label>
                  <input type="text" value={address} onChange={e => setAddress(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg text-sm"
                    style={{ backgroundColor: '#13091f', border: '1px solid #2d1f44', color: '#ffffff' }}
                    placeholder="Street address" />
                </div>
                <div>
                  <label className="block text-sm mb-1" style={{ color: '#9ca3af' }}>State</label>
                  <input type="text" value={state} onChange={e => setState(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg text-sm"
                    style={{ backgroundColor: '#13091f', border: '1px solid #2d1f44', color: '#ffffff' }}
                    placeholder="e.g., Lagos, Abuja" />
                </div>
              </div>
            </div>

            {/* Professional Info */}
            <div className="p-4 sm:p-6 rounded-lg space-y-4" style={{ backgroundColor: '#0d0918', border: '1px solid #1a1030' }}>
              <h2 style={{ fontSize: '16px', fontWeight: 600, color: '#ffffff', fontFamily: '"Space Grotesk", sans-serif' }}>Professional Details</h2>
              <div>
                <label className="block text-sm mb-1" style={{ color: '#9ca3af' }}>Bio / Business Description</label>
                <textarea value={bio} onChange={e => setBio(e.target.value)} rows={4}
                  className="w-full px-4 py-3 rounded-lg text-sm resize-none"
                  style={{ backgroundColor: '#13091f', border: '1px solid #2d1f44', color: '#ffffff', fontFamily: 'Inter, sans-serif' }}
                  placeholder="Tell customers about your skills and experience..." />
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm mb-1" style={{ color: '#9ca3af' }}>Hourly Rate (₦)</label>
                  <input type="number" min="10" value={hourlyRate} onChange={e => setHourlyRate(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg text-sm"
                    style={{ backgroundColor: '#13091f', border: '1px solid #2d1f44', color: '#ffffff' }}
                    placeholder="65" />
                </div>
                <div>
                  <label className="block text-sm mb-1" style={{ color: '#9ca3af' }}>Callout Fee (₦)</label>
                  <input type="number" min="0" value={calloutFee} onChange={e => setCalloutFee(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg text-sm"
                    style={{ backgroundColor: '#13091f', border: '1px solid #2d1f44', color: '#ffffff' }}
                    placeholder="45" />
                </div>
                <div>
                  <label className="block text-sm mb-1" style={{ color: '#9ca3af' }}>Years Exp</label>
                  <input type="number" min="0" value={yearsExperience} onChange={e => setYearsExperience(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg text-sm"
                    style={{ backgroundColor: '#13091f', border: '1px solid #2d1f44', color: '#ffffff' }}
                    placeholder="5" />
                </div>
                <div>
                  <label className="block text-sm mb-1" style={{ color: '#9ca3af' }}>Radius</label>
                  <select value={serviceRadius} onChange={e => setServiceRadius(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg text-sm"
                    style={{ backgroundColor: '#13091f', border: '1px solid #2d1f44', color: '#ffffff' }}>
                    {['5', '10', '15', '20', '25', '30', '50'].map(r => (
                      <option key={r} value={r}>{r} mi</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm mb-1" style={{ color: '#9ca3af' }}>Availability Status</label>
                <select value={availabilityStatus} onChange={e => setAvailabilityStatus(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg text-sm"
                  style={{ backgroundColor: '#13091f', border: '1px solid #2d1f44', color: '#ffffff' }}>
                  <option value="available">Available</option>
                  <option value="busy">Busy</option>
                  <option value="unavailable">Unavailable</option>
                </select>
              </div>
              <div>
                <label className="block text-sm mb-2" style={{ color: '#9ca3af' }}>Specializations</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {availableSpecializations.map(spec => (
                    <label key={spec}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer text-sm transition-colors"
                      style={{
                        backgroundColor: specializations.includes(spec) ? 'rgba(147,51,234,0.15)' : '#13091f',
                        border: specializations.includes(spec) ? '1px solid #9333ea' : '1px solid #2d1f44',
                        color: specializations.includes(spec) ? '#a855f7' : '#6b7280',
                      }}>
                      <input type="checkbox" checked={specializations.includes(spec)} onChange={() => toggleSpec(spec)} className="hidden" />
                      {spec}
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Save Button */}
            <button
              type="submit" disabled={saving}
              className="w-full py-4 text-sm font-semibold rounded-lg transition-opacity disabled:opacity-50"
              style={{ backgroundColor: '#9333ea', color: '#ffffff', fontFamily: '"Space Grotesk", sans-serif', fontSize: '15px' }}>
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </main>
      </div>
    </div>
  );
}
