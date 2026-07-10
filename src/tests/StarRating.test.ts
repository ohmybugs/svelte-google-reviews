import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/svelte';
import StarRating from '../lib/components/StarRating.svelte';

describe('StarRating', () => {
  it('renders 5 stars total', () => {
    const { container } = render(StarRating, { props: { rating: 5 } });
    const stars = container.querySelectorAll('.star');
    expect(stars).toHaveLength(5);
  });

  it('marks correct stars as filled and empty for rating=3', () => {
    const { container } = render(StarRating, { props: { rating: 3 } });
    const filled = container.querySelectorAll('.star-filled');
    const empty = container.querySelectorAll('.star-empty');
    expect(filled).toHaveLength(3);
    expect(empty).toHaveLength(2);
  });

  it('marks all stars filled for rating=5', () => {
    const { container } = render(StarRating, { props: { rating: 5 } });
    expect(container.querySelectorAll('.star-filled')).toHaveLength(5);
    expect(container.querySelectorAll('.star-empty')).toHaveLength(0);
  });

  it('marks all stars empty for rating=0', () => {
    const { container } = render(StarRating, { props: { rating: 0 } });
    expect(container.querySelectorAll('.star-filled')).toHaveLength(0);
    expect(container.querySelectorAll('.star-empty')).toHaveLength(5);
  });
});
