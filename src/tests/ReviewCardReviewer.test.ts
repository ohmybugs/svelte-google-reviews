import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/svelte';
import ReviewCardReviewer from '../lib/components/ReviewCardReviewer.svelte';
import type { GoogleReview } from '../lib/types/review';

const baseReview: GoogleReview = {
  reviewId: '1',
  reviewer: { profilePhotoUrl: 'https://example.com/photo.jpg', displayName: 'Jane Smith', isAnonymous: false },
  starRating: 5,
  comment: 'Great!',
  createTime: '2024-01-15T10:00:00Z',
  updateTime: null,
};

const anonymousReview: GoogleReview = {
  ...baseReview,
  reviewer: { profilePhotoUrl: '', displayName: '', isAnonymous: true },
};

const noDateReview: GoogleReview = {
  ...baseReview,
  createTime: null,
  updateTime: null,
};

describe('ReviewCardReviewer — dateDisplay', () => {
  it('renders date with relative display by default', () => {
    const { container } = render(ReviewCardReviewer, { props: { review: baseReview } });
    expect(container.querySelector('.reviewer-date')).toBeInTheDocument();
  });

  it('renders date with absolute display', () => {
    const { container } = render(ReviewCardReviewer, {
      props: { review: baseReview, dateDisplay: 'absolute' },
    });
    expect(container.querySelector('.reviewer-date')).toBeInTheDocument();
  });

  it('hides date when dateDisplay is "none"', () => {
    const { container } = render(ReviewCardReviewer, {
      props: { review: baseReview, dateDisplay: 'none' },
    });
    expect(container.querySelector('.reviewer-date')).not.toBeInTheDocument();
  });

  it('hides date when no createTime or updateTime regardless of dateDisplay', () => {
    const { container } = render(ReviewCardReviewer, {
      props: { review: noDateReview, dateDisplay: 'relative' },
    });
    expect(container.querySelector('.reviewer-date')).not.toBeInTheDocument();
  });

  it('calls getRelativeDate when dateDisplay is "relative"', () => {
    let called = false;
    const getRelativeDate = (date: Date) => { called = true; return 'just now'; };
    render(ReviewCardReviewer, { props: { review: baseReview, dateDisplay: 'relative', getRelativeDate } });
    expect(called).toBe(true);
  });

  it('calls getAbsoluteDate when dateDisplay is "absolute"', () => {
    let called = false;
    const getAbsoluteDate = (date: Date) => { called = true; return 'January 15, 2024'; };
    render(ReviewCardReviewer, { props: { review: baseReview, dateDisplay: 'absolute', getAbsoluteDate } });
    expect(called).toBe(true);
  });

  it('does not call getRelativeDate when dateDisplay is "none"', () => {
    let called = false;
    const getRelativeDate = (date: Date) => { called = true; return 'just now'; };
    render(ReviewCardReviewer, { props: { review: baseReview, dateDisplay: 'none', getRelativeDate } });
    expect(called).toBe(false);
  });
});

describe('ReviewCardReviewer — nameDisplay', () => {
  it('renders full name with fullNames', () => {
    const { container } = render(ReviewCardReviewer, {
      props: { review: baseReview, nameDisplay: 'fullNames' },
    });
    expect(container.textContent).toContain('Jane Smith');
  });

  it('renders first name and last initial with firstAndLastInitials', () => {
    const { container } = render(ReviewCardReviewer, {
      props: { review: baseReview, nameDisplay: 'firstAndLastInitials' },
    });
    expect(container.textContent).toContain('Jane S.');
  });

  it('renders first name only with firstNamesOnly', () => {
    const { container } = render(ReviewCardReviewer, {
      props: { review: baseReview, nameDisplay: 'firstNamesOnly' },
    });
    expect(container.textContent).toContain('Jane');
    expect(container.textContent).not.toContain('Smith');
  });

  it('always renders "Anonymous" for anonymous reviewers regardless of nameDisplay', () => {
    for (const nameDisplay of ['fullNames', 'firstAndLastInitials', 'firstNamesOnly'] as const) {
      const { container } = render(ReviewCardReviewer, {
        props: { review: anonymousReview, nameDisplay },
      });
      expect(container.textContent).toContain('Anonymous');
    }
  });
});

describe('ReviewCardReviewer — theme', () => {
  it('applies light theme classes when theme="light"', () => {
    const { container } = render(ReviewCardReviewer, {
      props: { review: baseReview, theme: 'light' },
    });
    expect(container.querySelector('.reviewer-name-light')).toBeInTheDocument();
    expect(container.querySelector('.reviewer-date-light')).toBeInTheDocument();
  });

  it('applies dark theme classes when theme="dark"', () => {
    const { container } = render(ReviewCardReviewer, {
      props: { review: baseReview, theme: 'dark' },
    });
    expect(container.querySelector('.reviewer-name-dark')).toBeInTheDocument();
    expect(container.querySelector('.reviewer-date-dark')).toBeInTheDocument();
  });
});

describe('ReviewCardReviewer — profile image / fallback', () => {
  it('renders profile image when profilePhotoUrl is provided', () => {
    const { container } = render(ReviewCardReviewer, { props: { review: baseReview } });
    expect(container.querySelector('img')).toBeInTheDocument();
  });

  it('renders fallback div when profilePhotoUrl is empty', () => {
    const review = { ...baseReview, reviewer: { ...baseReview.reviewer, profilePhotoUrl: '' } };
    const { container } = render(ReviewCardReviewer, { props: { review } });
    expect(container.querySelector('.reviewer-profile-fallback')).toBeInTheDocument();
    expect(container.querySelector('img')).not.toBeInTheDocument();
  });

  it('renders fallback with "A" for anonymous reviewers', () => {
    const { container } = render(ReviewCardReviewer, { props: { review: anonymousReview } });
    const fallback = container.querySelector('.reviewer-profile-fallback');
    expect(fallback).toBeInTheDocument();
    expect(fallback?.textContent?.trim()).toBe('A');
  });

  it('renders fallback with first letter of reviewer name', () => {
    const review = { ...baseReview, reviewer: { ...baseReview.reviewer, profilePhotoUrl: '' } };
    const { container } = render(ReviewCardReviewer, { props: { review } });
    const fallback = container.querySelector('.reviewer-profile-fallback');
    expect(fallback?.textContent?.trim()).toBe('J');
  });
});
