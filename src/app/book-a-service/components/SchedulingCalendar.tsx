'use client';

import { useState, useEffect } from 'react';
import Icon from '@/components/ui/AppIcon';

interface SchedulingCalendarProps {
  onSelectSlot: (date: string, time: string) => void;
  selectedDate: string;
  selectedTime: string;
}

interface TimeSlot {
  time: string;
  available: boolean;
}

const SchedulingCalendar = ({ onSelectSlot, selectedDate, selectedTime }: SchedulingCalendarProps) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [availableDates, setAvailableDates] = useState<Date[]>([]);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) return;

    // Generate available dates (next 30 days)
    const dates: Date[] = [];
    const today = new Date();
    for (let i = 1; i <= 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date);
    }
    setAvailableDates(dates);
  }, [isHydrated]);

  useEffect(() => {
    if (!isHydrated || !selectedDate) return;

    // Generate time slots for selected date
    const slots: TimeSlot[] = [
      { time: '08:00', available: true },
      { time: '09:00', available: true },
      { time: '10:00', available: false },
      { time: '11:00', available: true },
      { time: '12:00', available: true },
      { time: '13:00', available: false },
      { time: '14:00', available: true },
      { time: '15:00', available: true },
      { time: '16:00', available: true },
      { time: '17:00', available: false },
    ];
    setTimeSlots(slots);
  }, [selectedDate, isHydrated]);

  if (!isHydrated) {
    return (
      <div className="space-y-6">
        <div className="h-80 bg-surface rounded-lg animate-pulse" />
        <div className="h-64 bg-surface rounded-lg animate-pulse" />
      </div>
    );
  }

  const getDaysInMonth = (date: Date): Date[] => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days: Date[] = [];

    // Add empty slots for days before month starts
    const startDay = firstDay.getDay();
    for (let i = 0; i < startDay; i++) {
      days.push(new Date(0));
    }

    // Add all days in month
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push(new Date(year, month, i));
    }

    return days;
  };

  const isDateAvailable = (date: Date): boolean => {
    if (date.getTime() === 0) return false;
    return availableDates.some(
      (d) => d.getDate() === date.getDate() && d.getMonth() === date.getMonth() && d.getFullYear() === date.getFullYear()
    );
  };

  const isDateSelected = (date: Date): boolean => {
    if (!selectedDate || date.getTime() === 0) return false;
    const selected = new Date(selectedDate);
    return (
      date.getDate() === selected.getDate() &&
      date.getMonth() === selected.getMonth() &&
      date.getFullYear() === selected.getFullYear()
    );
  };

  const formatDateForInput = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleDateClick = (date: Date) => {
    if (isDateAvailable(date)) {
      onSelectSlot(formatDateForInput(date), '');
    }
  };

  const handleTimeClick = (time: string, available: boolean) => {
    if (available && selectedDate) {
      onSelectSlot(selectedDate, time);
    }
  };

  const previousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="space-y-6">
      {/* Calendar */}
      <div className="bg-card border border-border rounded-lg p-4">
        {/* Calendar Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-text-primary">
            {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
          </h3>
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={previousMonth}
              className="p-2 text-text-secondary hover:text-primary hover:bg-surface rounded-lg transition-smooth focus-ring"
              aria-label="Previous month"
            >
              <Icon name="ChevronLeftIcon" size={20} />
            </button>
            <button
              type="button"
              onClick={nextMonth}
              className="p-2 text-text-secondary hover:text-primary hover:bg-surface rounded-lg transition-smooth focus-ring"
              aria-label="Next month"
            >
              <Icon name="ChevronRightIcon" size={20} />
            </button>
          </div>
        </div>

        {/* Day Names */}
        <div className="grid grid-cols-7 gap-2 mb-2">
          {dayNames.map((day) => (
            <div key={day} className="text-center text-xs font-medium text-text-secondary py-2">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7 gap-2">
          {getDaysInMonth(currentMonth).map((date, index) => {
            const isEmpty = date.getTime() === 0;
            const available = isDateAvailable(date);
            const selected = isDateSelected(date);

            return (
              <button
                key={index}
                type="button"
                onClick={() => handleDateClick(date)}
                disabled={isEmpty || !available}
                className={`aspect-square flex items-center justify-center text-sm font-medium rounded-lg transition-smooth focus-ring ${
                  isEmpty
                    ? 'invisible'
                    : selected
                    ? 'bg-accent text-accent-foreground'
                    : available
                    ? 'bg-surface text-text-primary hover:bg-muted' :'bg-background text-text-secondary opacity-40 cursor-not-allowed'
                }`}
              >
                {!isEmpty && date.getDate()}
              </button>
            );
          })}
        </div>
      </div>

      {/* Time Slots */}
      {selectedDate && (
        <div className="bg-card border border-border rounded-lg p-4">
          <h3 className="text-lg font-semibold text-text-primary mb-4">Available Time Slots</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {timeSlots.map((slot) => (
              <button
                key={slot.time}
                type="button"
                onClick={() => handleTimeClick(slot.time, slot.available)}
                disabled={!slot.available}
                className={`px-4 py-3 text-sm font-medium rounded-lg transition-smooth focus-ring ${
                  selectedTime === slot.time
                    ? 'bg-accent text-accent-foreground'
                    : slot.available
                    ? 'bg-surface text-text-primary hover:bg-muted' :'bg-background text-text-secondary opacity-40 cursor-not-allowed'
                }`}
              >
                {slot.time}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SchedulingCalendar;