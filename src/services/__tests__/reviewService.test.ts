import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockFrom = vi.fn();
const mockGetUser = vi.fn();

vi.mock('@/lib/supabase/client', () => ({
  createClient: () => ({
    auth: { getUser: mockGetUser },
    from: mockFrom,
  }),
}));

const { reviewService } = await import('../reviewService');

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

describe('reviewService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('createReview', () => {
    it('throws on rating below 1', async () => {
      await expect(reviewService.createReview({ rating: 0, booking_id: 'b-1' }))
        .rejects.toThrow('Rating must be between 1 and 5');
    });

    it('throws on rating above 5', async () => {
      await expect(reviewService.createReview({ rating: 6, booking_id: 'b-1' }))
        .rejects.toThrow('Rating must be between 1 and 5');
    });

    it('throws on comment exceeding 1000 characters', async () => {
      const longComment = 'a'.repeat(1001);
      await expect(reviewService.createReview({ rating: 4, comment: longComment, booking_id: 'b-1' }))
        .rejects.toThrow('Comment must not exceed 1000 characters');
    });

    it('throws on duplicate review for same booking', async () => {
      mockFrom.mockReturnValue(createBuilder({ data: { id: 'existing-review' }, error: null }));

      await expect(reviewService.createReview({ rating: 4, booking_id: 'b-1' }))
        .rejects.toThrow('You have already reviewed this booking');
    });

    it('inserts review when valid and no duplicate', async () => {
      let callCount = 0;
      mockFrom.mockImplementation(() => {
        callCount++;
        if (callCount === 1) {
          return createBuilder({ data: null, error: null });
        }
        return createBuilder({ data: { id: 'r-1', rating: 4, booking_id: 'b-1' }, error: null });
      });

      const result = await reviewService.createReview({ rating: 4, booking_id: 'b-1', comment: 'Great service!' });
      expect(result.id).toBe('r-1');
    });
  });

  describe('getAverageRating', () => {
    it('returns 0 when no reviews', async () => {
      mockFrom.mockReturnValue(createBuilder({ data: [], error: null, count: 0 }));

      const result = await reviewService.getAverageRating('tech-1');
      expect(result).toEqual({ average: 0, count: 0 });
    });

    it('calculates average correctly', async () => {
      mockFrom.mockReturnValue(createBuilder({ data: [{ rating: 5 }, { rating: 4 }, { rating: 3 }], error: null, count: 3 }));

      const result = await reviewService.getAverageRating('tech-1');
      expect(result.average).toBe(4);
      expect(result.count).toBe(3);
    });

    it('rounds average to one decimal place', async () => {
      mockFrom.mockReturnValue(createBuilder({ data: [{ rating: 5 }, { rating: 4 }, { rating: 4 }], error: null, count: 3 }));

      const result = await reviewService.getAverageRating('tech-1');
      expect(result.average).toBe(4.3);
      expect(result.count).toBe(3);
    });
  });

  describe('updateReview', () => {
    it('throws on invalid rating update', async () => {
      await expect(reviewService.updateReview('r-1', { rating: 0 }))
        .rejects.toThrow('Rating must be between 1 and 5');
    });

    it('throws on comment exceeding 1000 chars during update', async () => {
      const longComment = 'a'.repeat(1001);
      await expect(reviewService.updateReview('r-1', { comment: longComment }))
        .rejects.toThrow('Comment must not exceed 1000 characters');
    });

    it('throws when user is not the review author', async () => {
      mockGetUser.mockResolvedValue({ data: { user: { id: 'user-2' } }, error: null });
      mockFrom.mockReturnValue(createBuilder({ data: { customer_id: 'user-1' }, error: null }));

      await expect(reviewService.updateReview('r-1', { rating: 4 }))
        .rejects.toThrow('Unauthorized');
    });

    it('updates review when authorized', async () => {
      mockGetUser.mockResolvedValue({ data: { user: { id: 'user-1' } }, error: null });

      let callCount = 0;
      mockFrom.mockImplementation(() => {
        callCount++;
        if (callCount === 1) {
          return createBuilder({ data: { customer_id: 'user-1' }, error: null });
        }
        return createBuilder({ data: { id: 'r-1', rating: 4 }, error: null });
      });

      const result = await reviewService.updateReview('r-1', { rating: 4 });
      expect(result.rating).toBe(4);
    });
  });
});
