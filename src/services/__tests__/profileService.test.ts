import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockFrom = vi.fn();
const mockGetUser = vi.fn();

vi.mock('@/lib/supabase/client', () => ({
  createClient: () => ({
    auth: { getUser: mockGetUser },
    from: mockFrom,
  }),
}));

const { profileService } = await import('../profileService');

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

describe('profileService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('calculateDistance', () => {
    it('returns 0 for same point', () => {
      const d = profileService.calculateDistance(40.7128, -74.006, 40.7128, -74.006);
      expect(d).toBeCloseTo(0, 1);
    });

    it('calculates distance between NYC and LA approximately', () => {
      const d = profileService.calculateDistance(40.7128, -74.006, 34.0522, -118.2437);
      expect(d).toBeGreaterThan(2400);
      expect(d).toBeLessThan(2500);
    });

    it('calculates distance between London and Paris approximately', () => {
      const d = profileService.calculateDistance(51.5074, -0.1278, 48.8566, 2.3522);
      expect(d).toBeGreaterThan(200);
      expect(d).toBeLessThan(300);
    });

    it('is symmetric', () => {
      const d1 = profileService.calculateDistance(10, 20, 30, 40);
      const d2 = profileService.calculateDistance(30, 40, 10, 20);
      expect(d1).toBeCloseTo(d2, 5);
    });
  });

  describe('getProfile', () => {
    it('fetches profile by user ID', async () => {
      const mockProfile = { id: 'user-1', full_name: 'John', email: 'john@test.com' };
      mockFrom.mockReturnValue(createBuilder({ data: mockProfile, error: null }));

      const result = await profileService.getProfile('user-1');
      expect(result).toEqual(mockProfile);
      expect(mockFrom).toHaveBeenCalledWith('profiles');
    });

    it('returns null when profile not found', async () => {
      mockFrom.mockReturnValue(createBuilder({ data: null, error: null }));

      const result = await profileService.getProfile('nonexistent');
      expect(result).toBeNull();
    });

    it('throws on supabase error', async () => {
      mockFrom.mockReturnValue(createBuilder({ data: null, error: new Error('DB error') }));

      await expect(profileService.getProfile('user-1')).rejects.toThrow('DB error');
    });
  });

  describe('getTechnicians', () => {
    it('fetches verified technicians ordered by rating', async () => {
      const mockTechs = [
        { id: 't-1', profiles: { full_name: 'Tech One' } },
      ];
      mockFrom.mockReturnValue(createBuilder({ data: mockTechs, error: null }));

      const result = await profileService.getTechnicians(1, 20);
      expect(result).toHaveLength(1);
      expect(result[0].full_name).toBe('Tech One');
    });

    it('calculates correct pagination range', async () => {
      let capturedRange: [number, number] = [0, 0];
      const builder = createBuilder({ data: [], error: null });
      builder.range = vi.fn().mockImplementation((from: number, to: number) => {
        capturedRange = [from, to];
        return builder;
      });
      mockFrom.mockReturnValue(builder);

      await profileService.getTechnicians(3, 20);
      expect(capturedRange).toEqual([40, 59]);
    });
  });

  describe('getTechniciansByService', () => {
    it('filters by service ID and availability', async () => {
      const mockTechs = [
        { id: 't-1', profiles: { full_name: 'Tech One' }, technician_services: [{ service_id: 's-1', custom_price: 150 }] },
      ];
      mockFrom.mockReturnValue(createBuilder({ data: mockTechs, error: null }));

      const result = await profileService.getTechniciansByService('s-1');
      expect(result).toHaveLength(1);
      expect(result[0].service_price).toBe(150);
    });
  });

  describe('updateProfile', () => {
    it('upserts profile with user metadata', async () => {
      mockGetUser.mockResolvedValue({
        data: { user: { email: 'test@test.com', user_metadata: { full_name: 'Test' } } },
        error: null,
      });

      let upsertedData: any = null;
      const builder = createBuilder({ data: { id: 'user-1' }, error: null });
      builder.upsert = vi.fn().mockImplementation((data) => {
        upsertedData = data;
        return builder;
      });
      mockFrom.mockReturnValue(builder);

      await profileService.updateProfile('user-1', { phone: '1234567890' });
      expect(upsertedData).toMatchObject({
        id: 'user-1',
        email: 'test@test.com',
        phone: '1234567890',
      });
    });
  });
});
