'use client';

import { useState, useEffect } from 'react';
import Icon from '@/components/ui/AppIcon';

interface TimeSlot {
  time: string;
  status: 'available' | 'limited' | 'booked';
}

interface DaySchedule {
  date: string;
  dayName: string;
  slots: TimeSlot[];
}

interface AvailabilityCalendarProps {
  onSlotSelect: (date: string, time: string) => void;
}

const AvailabilityCalendar = ({ onSlotSelect }: AvailabilityCalendarProps) => {
  const [isHydrated, setIsHydrated] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [currentWeekStart, setCurrentWeekStart] = useState<Date | null>(null);

  useEffect(() => {
    setIsHydrated(true);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    setCurrentWeekStart(today);
    setSelectedDate(today.toISOString().split('T')[0]);
  }, []);

  if (!isHydrated || !currentWeekStart) {
    return (
      <div className="bg-card rounded-lg shadow-card border border-border p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/3"></div>
          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: 7 }).map((_, i) => (
              <div key={i} className="h-20 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const generateWeekSchedule = (): DaySchedule[] => {
    const schedule: DaySchedule[] = [];
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(currentWeekStart);
      date.setDate(date.getDate() + i);
      
      const timeSlots: TimeSlot[] = [
        { time: '09:00', status: i % 3 === 0 ? 'available' : i % 3 === 1 ? 'limited' : 'booked' },
        { time: '11:00', status: i % 3 === 1 ? 'available' : i % 3 === 2 ? 'limited' : 'booked' },
        { time: '14:00', status: i % 3 === 2 ? 'available' : i % 3 === 0 ? 'limited' : 'booked' },
        { time: '16:00', status: i % 3 === 0 ? 'available' : i % 3 === 1 ? 'limited' : 'booked' },
      ];

      schedule.push({
        date: date.toISOString().split('T')[0],
        dayName: dayNames[date.getDay()],
        slots: timeSlots,
      });
    }
    
    return schedule;
  };

  const weekSchedule = generateWeekSchedule();

  const handlePreviousWeek = () => {
    const newStart = new Date(currentWeekStart);
    newStart.setDate(newStart.getDate() - 7);
    setCurrentWeekStart(newStart);
  };

  const handleNextWeek = () => {
    const newStart = new Date(currentWeekStart);
    newStart.setDate(newStart.getDate() + 7);
    setCurrentWeekStart(newStart);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-accent hover:bg-success text-accent-foreground';
      case 'limited':
        return 'bg-warning hover:bg-warning/80 text-warning-foreground';
      case 'booked':
        return 'bg-muted text-muted-foreground cursor-not-allowed';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.getDate();
  };

  return (
    <div className="bg-card rounded-lg shadow-card border border-border p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-text-primary">Available Time Slots</h3>
        <div className="flex items-center gap-2">
          <button
            onClick={handlePreviousWeek}
            className="p-2 text-text-secondary hover:text-primary hover:bg-surface rounded-lg transition-smooth focus-ring"
            aria-label="Previous week"
          >
            <Icon name="ChevronLeftIcon" size={20} />
          </button>
          <button
            onClick={handleNextWeek}
            className="p-2 text-text-secondary hover:text-primary hover:bg-surface rounded-lg transition-smooth focus-ring"
            aria-label="Next week"
          >
            <Icon name="ChevronRightIcon" size={20} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2 mb-6">
        {weekSchedule.map((day) => (
          <button
            key={day.date}
            onClick={() => setSelectedDate(day.date)}
            className={`p-3 rounded-lg text-center transition-smooth focus-ring ${
              selectedDate === day.date
                ? 'bg-primary text-primary-foreground'
                : 'bg-surface hover:bg-muted text-text-primary'
            }`}
          >
            <p className="text-xs font-medium mb-1">{day.dayName}</p>
            <p className="text-lg font-semibold">{formatDate(day.date)}</p>
          </button>
        ))}
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-accent"></div>
            <span className="text-text-secondary">Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-warning"></div>
            <span className="text-text-secondary">Limited</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-muted"></div>
            <span className="text-text-secondary">Booked</span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {weekSchedule
            .find((day) => day.date === selectedDate)
            ?.slots.map((slot, index) => (
              <button
                key={index}
                onClick={() => slot.status !== 'booked' && onSlotSelect(selectedDate, slot.time)}
                disabled={slot.status === 'booked'}
                className={`px-4 py-3 rounded-lg text-sm font-semibold transition-smooth focus-ring ${getStatusColor(slot.status)}`}
              >
                {slot.time}
              </button>
            ))}
        </div>
      </div>
    </div>
  );
};

export default AvailabilityCalendar;