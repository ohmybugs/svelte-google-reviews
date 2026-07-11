import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/svelte';
import SvelteGoogleReviews from '../lib/components/SvelteGoogleReviews.svelte';
import ReviewCard from '../lib/components/ReviewCard.svelte';
import type { GoogleReview } from '../lib/types/review';

/**
 * Regression tests for https://github.com/featurable/react-google-reviews/issues/10
 *
 * Upstream Lighthouse audit reported:
 *   - DOM depth: 30
 *   - Max child elements: 35
 *   - Images not in next-gen format / not optimised
 *
 * We assert budgets for the Svelte port so the same regressions can't sneak in.
 * Lighthouse warns above 32 depth / 60 children — we set stricter budgets since
 * these components are typically embedded inside a host page's own layout.
 */

const DEPTH_BUDGET = 20;
const CHILDREN_BUDGET = 20;

function makeReview(i: number): GoogleReview {
  return {
    reviewId: `${i}`,
    reviewer: {
      profilePhotoUrl: `https://lh3.googleusercontent.com/a/example-${i}=s120`,
      displayName: `Reviewer ${i}`,
      isAnonymous: false,
    },
    starRating: 5,
    comment: `Review number ${i} — great service!`,
    createTime: '2024-01-15T10:00:00Z',
    updateTime: null,
  };
}

function maxDepth(root: Element): { depth: number; path: string } {
  let best = { depth: 0, path: root.tagName };
  const walk = (el: Element, d: number, path: string) => {
    if (d > best.depth) best = { depth: d, path };
    for (const child of Array.from(el.children)) {
      walk(child, d + 1, `${path} > ${child.tagName.toLowerCase()}`);
    }
  };
  walk(root, 1, root.tagName.toLowerCase());
  return best;
}

function maxChildren(root: Element): { count: number; tag: string } {
  let best = { count: root.children.length, tag: root.tagName.toLowerCase() };
  const walk = (el: Element) => {
    if (el.children.length > best.count) {
      best = { count: el.children.length, tag: el.tagName.toLowerCase() };
    }
    for (const c of Array.from(el.children)) walk(c);
  };
  walk(root);
  return best;
}

describe('DOM metrics (Lighthouse regression)', () => {
  it('single ReviewCard stays under depth budget', () => {
    const { container } = render(ReviewCard, { props: { review: makeReview(1) } });
    const { depth, path } = maxDepth(container);
    expect(depth, `deepest path: ${path}`).toBeLessThanOrEqual(DEPTH_BUDGET);
  });

  it('SvelteGoogleReviews carousel with 6 reviews stays under budgets', () => {
    const reviews = Array.from({ length: 6 }, (_, i) => makeReview(i));
    const { container } = render(SvelteGoogleReviews, { props: { reviews, layout: 'carousel' } });
    const d = maxDepth(container);
    const c = maxChildren(container);

    console.log(`[metrics] depth=${d.depth} path="${d.path}" maxChildren=${c.count} on <${c.tag}>`);
    expect(d.depth, `deepest path: ${d.path}`).toBeLessThanOrEqual(DEPTH_BUDGET);
    expect(c.count, `busiest node: <${c.tag}>`).toBeLessThanOrEqual(CHILDREN_BUDGET);
  });

  it('reviewer <img> is lazy-loaded, async-decoded, and dimension-hinted', () => {
    const { container } = render(ReviewCard, { props: { review: makeReview(1) } });
    const img = container.querySelector('img');
    expect(img, 'reviewer image should render').not.toBeNull();
    expect(img!.getAttribute('loading')).toBe('lazy');
    expect(img!.getAttribute('decoding')).toBe('async');
    expect(img!.getAttribute('width')).toBe('40');
    expect(img!.getAttribute('height')).toBe('40');
  });

  it('appends =s96-c when the Google avatar URL has no existing size hint', () => {
    const review = makeReview(1);
    review.reviewer.profilePhotoUrl = 'https://lh3.googleusercontent.com/a/ACg8ocK';
    const { container } = render(ReviewCard, { props: { review } });
    expect(container.querySelector('img')!.getAttribute('src')).toBe(
      'https://lh3.googleusercontent.com/a/ACg8ocK=s96-c'
    );
  });

  it('leaves non-Google URLs untouched', () => {
    const review = makeReview(1);
    review.reviewer.profilePhotoUrl = 'https://cdn.example.com/avatars/1.jpg?v=2';
    const { container } = render(ReviewCard, { props: { review } });
    expect(container.querySelector('img')!.getAttribute('src')).toBe(
      'https://cdn.example.com/avatars/1.jpg?v=2'
    );
  });

  it('imageLoading prop overrides the loading attribute (for above-the-fold use)', () => {
    const { container } = render(ReviewCard, {
      props: { review: makeReview(1), imageLoading: 'eager' },
    });
    expect(container.querySelector('img')!.getAttribute('loading')).toBe('eager');
  });

  it('reviewer <img> requests an appropriately sized Google avatar (=s… param)', () => {
    const { container } = render(ReviewCard, { props: { review: makeReview(1) } });
    const img = container.querySelector('img');
    // Avatar box is 40×40 CSS px; up to =s96 covers 2× DPR without wasting bytes.
    // Bare Google URLs (no size hint) serve ~250×250 JPEGs — that's what triggers
    // Lighthouse's "properly size images" + "modern image formats" warnings.
    const src = img!.getAttribute('src')!;
    const match = src.match(/=s(\d+)(-c)?$/);
    expect(match, `avatar URL should include a size hint, got: ${src}`).not.toBeNull();
    const size = Number(match![1]);
    expect(size).toBeLessThanOrEqual(96);
    // Guard against someone dropping the size too far — 2× the 40px box is the floor.
    expect(size).toBeGreaterThanOrEqual(48);
  });
});
