import type { Meta, StoryObj } from '@storybook/svelte';
import ReviewCard from '../lib/components/ReviewCard.svelte';
import { sampleReviews, longCommentReview } from './sampleReviews';

const meta: Meta<typeof ReviewCard> = {
  title: 'Components/ReviewCard',
  component: ReviewCard,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
Renders a single Google review. Used internally by the carousel but also
exportable for building custom layouts.

### Key props

| Prop | Default | Description |
|------|---------|-------------|
| \`review\` | — | **Required.** A \`GoogleReview\` object |
| \`reviewVariant\` | \`'card'\` | \`'card'\` — bordered card with footer; \`'testimonial'\` — minimal quote style |
| \`theme\` | \`'light'\` | \`'light'\` or \`'dark'\` |
| \`nameDisplay\` | \`'firstAndLastInitials'\` | \`'fullNames'\` · \`'firstAndLastInitials'\` · \`'firstNamesOnly'\` |
| \`logoVariant\` | \`'icon'\` | \`'icon'\` — Google G icon; \`'logo'\` — full Google wordmark |
| \`dateDisplay\` | \`'relative'\` | \`'relative'\` (e.g. "2 months ago") or \`'absolute'\` (formatted date) |
| \`maxCharacters\` | \`200\` | Truncates long comments and shows a Read more / Read less toggle |
| \`getRelativeDate\` | built-in | Override the relative date formatter with your own function |
| \`getAbsoluteDate\` | built-in | Override the absolute date formatter with your own function |
        `,
      },
    },
  },
  argTypes: {
    theme: { control: 'radio', options: ['light', 'dark'] },
    reviewVariant: { control: 'radio', options: ['card', 'testimonial'] },
    nameDisplay: {
      control: 'radio',
      options: ['fullNames', 'firstAndLastInitials', 'firstNamesOnly'],
    },
  },
};
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    review: sampleReviews[0],
    theme: 'light',
    reviewVariant: 'card',
  },
};

/** Dark theme variant — place on a dark background for correct contrast. */
export const Dark: Story = {
  args: {
    review: sampleReviews[2],
    theme: 'dark',
    reviewVariant: 'card',
  },
  parameters: { backgrounds: { default: 'dark' } },
};

/**
 * The `'testimonial'` variant strips the card border and footer, showing
 * just the quote and reviewer name. Useful for hero sections or pull-quotes.
 */
export const Testimonial: Story = {
  args: {
    review: sampleReviews[1],
    theme: 'light',
    reviewVariant: 'testimonial',
  },
};

/**
 * When a comment exceeds `maxCharacters`, the text is truncated and a
 * "Read more" toggle is shown. Clicking it expands the full comment in place.
 * The labels are customisable via `readMoreLabel` and `readLessLabel`.
 */
export const LongComment: Story = {
  args: {
    review: longCommentReview,
    theme: 'light',
    reviewVariant: 'card',
    maxCharacters: 200,
  },
};

/**
 * When `reviewer.isAnonymous` is `true` or no profile photo is available,
 * the card renders a fallback avatar initial instead of a broken image.
 */
export const AnonymousReviewer: Story = {
  args: {
    review: sampleReviews[4],
    theme: 'light',
    reviewVariant: 'card',
  },
};
