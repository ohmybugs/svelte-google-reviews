import { describe, it, expect } from 'vitest';
import {
  transformV2ReviewToV1,
  transformV2ResponseToV1,
  isV2Response,
} from '../lib/utils/apiTransformers';
import type { GoogleReviewV2, FeaturableAPIResponseV2 } from '../lib/types/review';

const baseReviewV2: GoogleReviewV2 = {
  id: 'review-1',
  platform: 'google',
  text: 'Great service!',
  createdAt: '2024-01-01T00:00:00Z',
  publishedAt: '2024-01-01T00:00:00Z',
};

describe('transformV2ReviewToV1', () => {
  it('maps id to reviewId', () => {
    const result = transformV2ReviewToV1(baseReviewV2);
    expect(result.reviewId).toBe('review-1');
  });

  it('maps rating value when present', () => {
    const review = { ...baseReviewV2, rating: { value: 5, max: 5 } };
    expect(transformV2ReviewToV1(review).starRating).toBe(5);
  });

  it('defaults starRating to 0 when rating is absent', () => {
    expect(transformV2ReviewToV1(baseReviewV2).starRating).toBe(0);
  });

  it('maps author name and photoUrl when present', () => {
    const review = {
      ...baseReviewV2,
      author: { name: 'Jane Smith', photoUrl: 'https://example.com/photo.jpg' },
    };
    const result = transformV2ReviewToV1(review);
    expect(result.reviewer.displayName).toBe('Jane Smith');
    expect(result.reviewer.profilePhotoUrl).toBe('https://example.com/photo.jpg');
    expect(result.reviewer.isAnonymous).toBe(false);
  });

  it('marks reviewer as anonymous when author name is missing', () => {
    const review = { ...baseReviewV2, author: { name: null } };
    const result = transformV2ReviewToV1(review);
    expect(result.reviewer.displayName).toBe('Anonymous');
    expect(result.reviewer.isAnonymous).toBe(true);
  });

  it('marks reviewer as anonymous when author is absent', () => {
    const result = transformV2ReviewToV1(baseReviewV2);
    expect(result.reviewer.isAnonymous).toBe(true);
    expect(result.reviewer.profilePhotoUrl).toBe('');
  });

  it('maps text to comment', () => {
    expect(transformV2ReviewToV1(baseReviewV2).comment).toBe('Great service!');
  });

  it('maps createdAt to createTime', () => {
    expect(transformV2ReviewToV1(baseReviewV2).createTime).toBe('2024-01-01T00:00:00Z');
  });

  it('maps updatedAt to updateTime, defaulting to null', () => {
    expect(transformV2ReviewToV1(baseReviewV2).updateTime).toBeNull();
    const review = { ...baseReviewV2, updatedAt: '2024-02-01T00:00:00Z' };
    expect(transformV2ReviewToV1(review).updateTime).toBe('2024-02-01T00:00:00Z');
  });
});

const successV2Response: FeaturableAPIResponseV2 = {
  success: true,
  widget: {
    gbpLocationSummary: {
      reviewsCount: 42,
      rating: 4.5,
      writeAReviewUri: 'https://g.page/review',
    },
    reviews: [{ ...baseReviewV2, rating: { value: 5, max: 5 } }],
  },
};

describe('transformV2ResponseToV1', () => {
  it('returns success:false unchanged for error responses', () => {
    expect(transformV2ResponseToV1({ success: false })).toEqual({ success: false });
  });

  it('maps widget summary fields to top-level fields', () => {
    const result = transformV2ResponseToV1(successV2Response);
    expect(result.success).toBe(true);
    if (!result.success) return;
    expect(result.totalReviewCount).toBe(42);
    expect(result.averageRating).toBe(4.5);
    expect(result.profileUrl).toBe('https://g.page/review');
  });

  it('transforms all reviews', () => {
    const result = transformV2ResponseToV1(successV2Response);
    if (!result.success) return;
    expect(result.reviews).toHaveLength(1);
    expect(result.reviews[0].reviewId).toBe('review-1');
  });
});

describe('isV2Response', () => {
  it('returns true for V2 success responses', () => {
    expect(isV2Response(successV2Response)).toBe(true);
  });

  it('returns false for V1 success responses', () => {
    const v1 = {
      success: true as const,
      profileUrl: null,
      totalReviewCount: 1,
      averageRating: 5,
      reviews: [],
    };
    expect(isV2Response(v1)).toBe(false);
  });

  it('returns false for error responses', () => {
    expect(isV2Response({ success: false })).toBe(false);
  });
});
