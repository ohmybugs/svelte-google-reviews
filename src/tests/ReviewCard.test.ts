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

  it('applies review-body-card class when reviewVariant="card"', () => {
    const { container } = render(ReviewCard, {
      props: { review: baseReview, reviewVariant: 'card' },
    });
    expect(container.querySelector('.review-body-card')).toBeInTheDocument();
  });

  it('applies review-body-testimonial class when reviewVariant="testimonial"', () => {
    const { container } = render(ReviewCard, {
      props: { review: baseReview, reviewVariant: 'testimonial' },
    });
    expect(container.querySelector('.review-body-testimonial')).toBeInTheDocument();
  });

  it('renders google-icon SVG when logoVariant="icon"', () => {
    const { container } = render(ReviewCard, {
      props: { review: baseReview, logoVariant: 'icon' },
    });
    expect(container.querySelector('.google-icon')).toBeInTheDocument();
    expect(container.querySelector('.google-logo')).not.toBeInTheDocument();
  });

  it('renders google-logo SVG when logoVariant="full"', () => {
    const { container } = render(ReviewCard, {
      props: { review: baseReview, logoVariant: 'full' },
    });
    expect(container.querySelector('.google-logo')).toBeInTheDocument();
    expect(container.querySelector('.google-icon')).not.toBeInTheDocument();
  });

  it('renders no logo when logoVariant="none"', () => {
    const { container } = render(ReviewCard, {
      props: { review: baseReview, logoVariant: 'none' },
    });
    expect(container.querySelector('.google-icon')).not.toBeInTheDocument();
    expect(container.querySelector('.google-logo')).not.toBeInTheDocument();
  });

  it('hides date when dateDisplay="none"', () => {
    const { container } = render(ReviewCard, {
      props: { review: baseReview, dateDisplay: 'none' },
    });
    expect(container.querySelector('.reviewer-date')).not.toBeInTheDocument();
  });

  it('shows date when dateDisplay="relative"', () => {
    const { container } = render(ReviewCard, {
      props: { review: baseReview, dateDisplay: 'relative' },
    });
    expect(container.querySelector('.reviewer-date')).toBeInTheDocument();
  });

  it('shows date when dateDisplay="absolute"', () => {
    const { container } = render(ReviewCard, {
      props: { review: baseReview, dateDisplay: 'absolute' },
    });
    expect(container.querySelector('.reviewer-date')).toBeInTheDocument();
  });

  it('renders full name when nameDisplay="fullNames"', () => {
    const { container } = render(ReviewCard, {
      props: { review: baseReview, nameDisplay: 'fullNames' },
    });
    expect(container.textContent).toContain('Jane Smith');
  });

  it('renders first name only when nameDisplay="firstNamesOnly"', () => {
    const { container } = render(ReviewCard, {
      props: { review: baseReview, nameDisplay: 'firstNamesOnly' },
    });
    expect(container.textContent).toContain('Jane');
    expect(container.textContent).not.toContain('Smith');
  });

  it('uses custom readMoreLabel', () => {
    const review: GoogleReview = { ...baseReview, comment: longComment };
    const { getByText } = render(ReviewCard, {
      props: { review, maxCharacters: 200, readMoreLabel: 'Expand' },
    });
    expect(getByText('Expand')).toBeInTheDocument();
  });

  it('uses custom readLessLabel after expanding', async () => {
    const review: GoogleReview = { ...baseReview, comment: longComment };
    const { getByText } = render(ReviewCard, {
      props: { review, maxCharacters: 200, readMoreLabel: 'Expand', readLessLabel: 'Collapse' },
    });
    await fireEvent.click(getByText('Expand'));
    expect(getByText('Collapse')).toBeInTheDocument();
  });
});
