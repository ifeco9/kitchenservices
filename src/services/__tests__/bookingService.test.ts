import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockFrom = vi.fn();
const mockGetUser = vi.fn();

vi.mock('@/lib/supabase/client', () => ({
  createClient: () => ({
    auth: { getUser: mockGetUser },
    from: mockFrom,
  }),
}));

const { bookingService } = await import('../bookingService');

function createBuilder(result: any = null) {
  const defaultResult = { data: null, error: null };
  const resolveTo = result ?? defaultResult;
  const builder: any = {
    eq: () => builder,
    neq: () => builder,
    gte: () => builder,
    lte: () => builder,
    order: () => builder,
    range: () => builder,
    select: () => builder,
    maybeSingle: () => Promise.resolve(resolveTo),
    single: () => Promise.resolve(resolveTo),
    insert: () => builder,
    update: () => builder,
    upsert: () => builder,
    then: (resolve: any) => resolve(resolveTo),
  };
  return builder;
}

describe('bookingService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('checkAvailability', () => {
    it('returns unavailable when no schedule exists', async () => {
      mockFrom.mockReturnValue(createBuilder({ data: null, error: null }));

      const result = await bookingService.checkAvailability('tech-1', '2026-06-01T10:00:00', 2);
      expect(result.available).toBe(false);
    });

    it('returns unavailable when schedule says not available', async () => {
      mockFrom.mockReturnValue(createBuilder({ data: { is_available: false }, error: null }));

      const result = await bookingService.checkAvailability('tech-1', '2026-06-01T10:00:00', 2);
      expect(result.available).toBe(false);
    });

    it('returns unavailable when booking outside schedule hours', async () => {
      const schedule = { is_available: true, start_time: '09:00', end_time: '17:00' };
      mockFrom.mockReturnValue(createBuilder({ data: schedule, error: null }));

      const result = await bookingService.checkAvailability('tech-1', '2026-06-01T18:00:00', 2);
      expect(result.available).toBe(false);
    });

    it('returns available when booking fits schedule and no conflicts', async () => {
      const schedule = { is_available: true, start_time: '08:00', end_time: '20:00' };
      mockFrom.mockReturnValue(createBuilder({ data: schedule, error: null }));

      const result = await bookingService.checkAvailability('tech-1', '2026-06-01T10:00:00', 2);
      expect(result.available).toBe(true);
    });

    it('detects conflicting bookings', async () => {
      const schedule = { is_available: true, start_time: '08:00', end_time: '20:00' };
      const conflictingBooking = { scheduled_date: '2026-06-01T11:00:00', duration_hours: 2 };

      let callCount = 0;
      mockFrom.mockImplementation(() => {
        callCount++;
        if (callCount === 1) {
          return createBuilder({ data: schedule, error: null });
        }
        return createBuilder({ data: [conflictingBooking], error: null });
      });

      const result = await bookingService.checkAvailability('tech-1', '2026-06-01T10:00:00', 2);
      expect(result.available).toBe(false);
    });
  });

  describe('updateBookingStatus', () => {
    beforeEach(() => {
      mockGetUser.mockResolvedValue({ data: { user: { id: 'user-1' } }, error: null });
    });

    it.each(['pending', 'confirmed', 'in_progress'])('allows transition from %s to cancelled', async (status) => {
      mockFrom.mockReturnValue(createBuilder({ data: { id: 'b-1', status: 'cancelled' }, error: null }));

      const result = await bookingService.updateBookingStatus('b-1', 'cancelled');
      expect(result.status).toBe('cancelled');
    });

    it('allows pending to confirmed', async () => {
      mockFrom.mockReturnValue(createBuilder({ data: { id: 'b-1', status: 'confirmed' }, error: null }));

      const result = await bookingService.updateBookingStatus('b-1', 'confirmed');
      expect(result.status).toBe('confirmed');
    });

    it('allows confirmed to in_progress', async () => {
      mockFrom.mockReturnValue(createBuilder({ data: { id: 'b-1', status: 'in_progress' }, error: null }));

      const result = await bookingService.updateBookingStatus('b-1', 'in_progress');
      expect(result.status).toBe('in_progress');
    });

    it('allows in_progress to completed', async () => {
      mockFrom.mockReturnValue(createBuilder({ data: { id: 'b-1', status: 'completed' }, error: null }));

      const result = await bookingService.updateBookingStatus('b-1', 'completed');
      expect(result.status).toBe('completed');
    });

    it.each([
      ['pending', 'in_progress'],
      ['pending', 'completed'],
      ['confirmed', 'pending'],
      ['confirmed', 'completed'],
      ['in_progress', 'pending'],
      ['in_progress', 'confirmed'],
      ['completed', 'pending'],
      ['completed', 'confirmed'],
      ['completed', 'in_progress'],
      ['completed', 'cancelled'],
    ])('rejects transition from %s to %s', async (current, target) => {
      mockFrom.mockReturnValue(createBuilder({ data: { status: current }, error: null }));

      await expect(bookingService.updateBookingStatus('b-1', target as any))
        .rejects.toThrow(`Invalid status transition from ${current} to ${target}`);
    });
  });
});
