'use client';

import { useState, useEffect } from 'react';
import Icon from '@/components/ui/AppIcon';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface MetricCard {
  label: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
  icon: string;
}

const PerformanceDashboard = () => {
  const [isHydrated, setIsHydrated] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const metrics: MetricCard[] = [
    {
      label: "Total Bookings",
      value: "127",
      change: "+23%",
      trend: "up",
      icon: "CalendarDaysIcon"
    },
    {
      label: "Revenue",
      value: "£4,850",
      change: "+18%",
      trend: "up",
      icon: "CurrencyPoundIcon"
    },
    {
      label: "Customer Rating",
      value: "4.9",
      change: "+0.2",
      trend: "up",
      icon: "StarIcon"
    },
    {
      label: "Response Time",
      value: "12 min",
      change: "-5 min",
      trend: "up",
      icon: "ClockIcon"
    }
  ];

  const bookingData = [
    { month: 'Jan', bookings: 45, revenue: 2100 },
    { month: 'Feb', bookings: 52, revenue: 2450 },
    { month: 'Mar', bookings: 68, revenue: 3200 },
    { month: 'Apr', bookings: 71, revenue: 3350 },
    { month: 'May', bookings: 89, revenue: 4200 },
    { month: 'Jun', bookings: 127, revenue: 4850 }
  ];

  const serviceBreakdown = [
    { service: 'Gas Cookers', count: 42, percentage: 33 },
    { service: 'Dishwashers', count: 35, percentage: 28 },
    { service: 'Ovens', count: 28, percentage: 22 },
    { service: 'Washing Machines', count: 22, percentage: 17 }
  ];

  const recentReviews = [
    {
      id: 1,
      customer: "Sarah Johnson",
      rating: 5,
      date: "2 days ago",
      comment: "Excellent service! Fixed my oven quickly and explained everything clearly. Highly recommend."
    },
    {
      id: 2,
      customer: "Michael Brown",
      rating: 5,
      date: "5 days ago",
      comment: "Very professional and knowledgeable. Arrived on time and completed the repair efficiently."
    },
    {
      id: 3,
      customer: "Emma Wilson",
      rating: 4,
      date: "1 week ago",
      comment: "Good service overall. The technician was friendly and did a thorough job."
    }
  ];

  return (
    <section className="bg-surface py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-4 py-2 bg-accent/10 border border-accent/20 rounded-full mb-4">
            <Icon name="ChartBarIcon" size={20} className="text-accent mr-2" />
            <span className="text-sm font-medium text-accent">Performance Analytics</span>
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold text-primary mb-4">
            Your Business Dashboard
          </h2>
          <p className="text-lg text-text-secondary max-w-3xl mx-auto">
            Track your performance, monitor growth, and make data-driven decisions to optimize your business success.
          </p>
        </div>

        {/* Period Selector */}
        <div className="flex items-center justify-center space-x-2 mb-8">
          {['week', 'month', 'quarter', 'year'].map((period) => (
            <button
              key={period}
              onClick={() => isHydrated && setSelectedPeriod(period)}
              disabled={!isHydrated}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-smooth focus-ring ${
                selectedPeriod === period
                  ? 'bg-accent text-white' :'bg-white text-text-secondary border border-border hover:border-accent'
              }`}
            >
              {period.charAt(0).toUpperCase() + period.slice(1)}
            </button>
          ))}
        </div>

        {/* Metrics Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {metrics.map((metric, index) => (
            <div key={index} className="bg-white rounded-xl p-6 shadow-card hover:shadow-lg transition-smooth">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center justify-center w-12 h-12 bg-accent/10 rounded-lg">
                  <Icon name={metric.icon as any} size={24} className="text-accent" />
                </div>
                <div className={`flex items-center space-x-1 text-sm font-medium ${
                  metric.trend === 'up' ? 'text-success' : 'text-error'
                }`}>
                  <Icon 
                    name={metric.trend === 'up' ? 'ArrowTrendingUpIcon' : 'ArrowTrendingDownIcon'} 
                    size={16} 
                  />
                  <span>{metric.change}</span>
                </div>
              </div>
              <h3 className="text-2xl lg:text-3xl font-bold text-primary mb-1">{metric.value}</h3>
              <p className="text-sm text-text-secondary">{metric.label}</p>
            </div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Bookings Chart */}
          <div className="bg-white rounded-xl p-6 shadow-card">
            <h3 className="text-lg font-semibold text-primary mb-6">Booking Trends</h3>
            <div className="w-full h-64" aria-label="Monthly bookings line chart">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={bookingData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="month" stroke="#64748b" style={{ fontSize: '12px' }} />
                  <YAxis stroke="#64748b" style={{ fontSize: '12px' }} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#ffffff', 
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      fontSize: '12px'
                    }} 
                  />
                  <Legend wrapperStyle={{ fontSize: '12px' }} />
                  <Line 
                    type="monotone" 
                    dataKey="bookings" 
                    stroke="#10b981" 
                    strokeWidth={2}
                    dot={{ fill: '#10b981', r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Revenue Chart */}
          <div className="bg-white rounded-xl p-6 shadow-card">
            <h3 className="text-lg font-semibold text-primary mb-6">Revenue Growth</h3>
            <div className="w-full h-64" aria-label="Monthly revenue bar chart">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={bookingData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="month" stroke="#64748b" style={{ fontSize: '12px' }} />
                  <YAxis stroke="#64748b" style={{ fontSize: '12px' }} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#ffffff', 
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      fontSize: '12px'
                    }} 
                  />
                  <Legend wrapperStyle={{ fontSize: '12px' }} />
                  <Bar 
                    dataKey="revenue" 
                    fill="#10b981" 
                    radius={[8, 8, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Service Breakdown & Reviews */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Service Breakdown */}
          <div className="bg-white rounded-xl p-6 shadow-card">
            <h3 className="text-lg font-semibold text-primary mb-6">Service Breakdown</h3>
            <div className="space-y-4">
              {serviceBreakdown.map((service, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-primary">{service.service}</span>
                    <span className="text-sm text-text-secondary">{service.count} bookings</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                    <div 
                      className="h-full bg-accent transition-all duration-500"
                      style={{ width: `${service.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Reviews */}
          <div className="bg-white rounded-xl p-6 shadow-card">
            <h3 className="text-lg font-semibold text-primary mb-6">Recent Reviews</h3>
            <div className="space-y-4">
              {recentReviews.map((review) => (
                <div key={review.id} className="pb-4 border-b border-border last:border-0 last:pb-0">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-primary">{review.customer}</span>
                    <div className="flex items-center space-x-1">
                      {[...Array(review.rating)].map((_, i) => (
                        <Icon key={i} name="StarIcon" size={14} className="text-yellow-400" variant="solid" />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-text-secondary mb-2">{review.date}</p>
                  <p className="text-sm text-text-secondary leading-relaxed">{review.comment}</p>
                </div>
              ))}
            </div>
            <button className="w-full mt-4 inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-accent border border-accent rounded-lg hover:bg-accent hover:text-white transition-smooth focus-ring">
              View All Reviews
              <Icon name="ArrowRightIcon" size={16} className="ml-2" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PerformanceDashboard;