import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockFrom = vi.fn();

vi.mock('@/lib/supabase/client', () => ({
  createClient: () => ({
    from: mockFrom,
  }),
}));

const { serviceService } = await import('../serviceService');

describe('serviceService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getServiceByApplianceType', () => {
    const testCases = [
      { appliance: 'Oven', expectedSlug: 'oven-repair' },
      { appliance: 'Dishwasher', expectedSlug: 'dishwasher-repair' },
      { appliance: 'Refrigerator', expectedSlug: 'refrigerator-repair' },
      { appliance: 'Washing Machine', expectedSlug: 'washing-machine-repair' },
      { appliance: 'Dryer', expectedSlug: 'dryer-repair' },
      { appliance: 'Microwave', expectedSlug: 'microwave-repair' },
      { appliance: 'Cooker Hood', expectedSlug: 'cooker-hood-repair' },
      { appliance: 'Hob', expectedSlug: 'hob-repair' },
      { appliance: 'Freezer', expectedSlug: 'freezer-repair' },
      { appliance: 'Range Cooker', expectedSlug: 'range-cooker-repair' },
    ];

    it.each(testCases)('maps $appliance to slug $expectedSlug', async ({ appliance, expectedSlug }) => {
      const mockService = { id: 's-1', slug: expectedSlug, name: appliance };
      mockFrom.mockReturnValue({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        maybeSingle: vi.fn().mockResolvedValue({ data: mockService, error: null }),
      });

      const result = await serviceService.getServiceByApplianceType(appliance);
      expect(result).toEqual(mockService);
    });

    it('returns null for unknown appliance', async () => {
      const result = await serviceService.getServiceByApplianceType('Toaster');
      expect(result).toBeNull();
    });
  });

  describe('getServices', () => {
    it('fetches all services ordered by name', async () => {
      const mockServices = [
        { id: 's-1', name: 'Dishwasher Repair' },
        { id: 's-2', name: 'Oven Repair' },
      ];
      mockFrom.mockReturnValue({
        select: vi.fn().mockReturnThis(),
        order: vi.fn().mockResolvedValue({ data: mockServices, error: null }),
      });

      const result = await serviceService.getServices();
      expect(result).toHaveLength(2);
      expect(mockFrom).toHaveBeenCalledWith('services');
    });
  });

  describe('getServiceBySlug', () => {
    it('fetches service by slug', async () => {
      const mockService = { id: 's-1', slug: 'oven-repair', name: 'Oven Repair' };
      mockFrom.mockReturnValue({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        maybeSingle: vi.fn().mockResolvedValue({ data: mockService, error: null }),
      });

      const result = await serviceService.getServiceBySlug('oven-repair');
      expect(result).toEqual(mockService);
    });

    it('returns null for missing slug', async () => {
      mockFrom.mockReturnValue({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
      });

      const result = await serviceService.getServiceBySlug('nonexistent');
      expect(result).toBeNull();
    });
  });
});
