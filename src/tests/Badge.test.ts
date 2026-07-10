import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/svelte';
import Badge from '../lib/components/Badge.svelte';

describe('Badge', () => {
  it('renders averageRating formatted to 1 decimal place', () => {
    const { container } = render(Badge, {
      props: { averageRating: 4.8, totalReviewCount: 100 },
    });
    expect(container.textContent).toContain('4.8');
  });

  it('renders review count text', () => {
    const { container } = render(Badge, {
      props: { averageRating: 4.5, totalReviewCount: 42 },
    });
    expect(container.textContent).toContain('42');
  });

  it('renders an <a> tag when profileUrl is given', () => {
    const { container } = render(Badge, {
      props: { averageRating: 4.5, totalReviewCount: 42, profileUrl: 'https://g.page/r/test' },
    });
    expect(container.querySelector('a')).toBeInTheDocument();
    expect(container.querySelector('a')?.getAttribute('href')).toBe('https://g.page/r/test');
  });

  it('renders a <span> instead of <a> when no profileUrl given', () => {
    const { container } = render(Badge, {
      props: { averageRating: 4.5, totalReviewCount: 42, profileUrl: null },
    });
    expect(container.querySelector('a')).not.toBeInTheDocument();
    expect(container.querySelector('.badge-link-inline')).toBeInTheDocument();
  });

  it('applies dark theme class when theme="dark"', () => {
    const { container } = render(Badge, {
      props: { averageRating: 4.5, totalReviewCount: 42, theme: 'dark' },
    });
    expect(container.querySelector('.badge-container-dark')).toBeInTheDocument();
  });
});
