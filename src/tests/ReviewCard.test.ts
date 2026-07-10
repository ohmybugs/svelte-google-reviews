import { describe, it, expect } from 'vitest';
import { render, fireEvent } from '@testing-library/svelte';
import ReviewCard from '../lib/components/ReviewCard.svelte';
import type { GoogleReview } from '../lib/types/review';

const baseReview: GoogleReview = {
  reviewId: '1',
  reviewer: { profilePhotoUrl: '', displayName: 'Jane Smith', isAnonymous: false },
  starRating: 5,
  comment: 'Excellent service! Highly recommend.',
  createTime: '2024-01-15T10:00:00Z',
  updateTime: null,
};

const longComment = 'a'.repeat(201);

const longReview: GoogleReview = {
  ...baseReview,
  reviewId: '2',
  comment: 'This is a very detailed review that is definitely longer than two hundred characters. ' +
    'I want to make sure the Read more button appears and functions correctly when toggled by the user.',
};

describe('ReviewCard', () => {
  it('renders the review comment', () => {
    const { getByText } = render(ReviewCard, { props: { review: baseReview } });
    expect(getByText(/Excellent service/)).toBeInTheDocument();
  });

  it('renders the reviewer name', () => {
    const { container } = render(ReviewCard, { props: { review: baseReview } });
    expect(container.textContent).toContain('Jane');
  });

  it('shows "Read more" when comment exceeds maxCharacters', () => {
    const review: GoogleReview = { ...baseReview, comment: longComment };
    const { getByText } = render(ReviewCard, { props: { review, maxCharacters: 200 } });
    expect(getByText('Read more')).toBeInTheDocument();
  });

  it('does not show "Read more" for short comments', () => {
    const { queryByText } = render(ReviewCard, { props: { review: baseReview } });
    expect(queryByText('Read more')).not.toBeInTheDocument();
  });

  it('toggles to full comment when "Read more" is clicked', async () => {
    const review: GoogleReview = { ...baseReview, comment: longComment };
    const { getByText } = render(ReviewCard, { props: { review, maxCharacters: 200 } });
    const btn = getByText('Read more');
    await fireEvent.click(btn);
    expect(getByText('Read less')).toBeInTheDocument();
  });

  it('applies dark theme class when theme="dark"', () => {
    const { container } = render(ReviewCard, { props: { review: baseReview, theme: 'dark' } });
    expect(container.querySelector('.review-card-dark')).toBeInTheDocument();
  });

  it('applies light theme class by default', () => {
    const { container } = render(ReviewCard, { props: { review: baseReview } });
    expect(container.querySelector('.review-card-light')).toBeInTheDocument();
  });
});
