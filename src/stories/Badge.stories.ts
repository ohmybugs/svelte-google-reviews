import type { Meta, StoryObj } from '@storybook/svelte';
import Badge from '../lib/components/Badge.svelte';

const meta: Meta<typeof Badge> = {
  title: 'Components/Badge',
  component: Badge,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
A compact summary widget that displays a business's Google rating at a glance.
Typically placed in a footer, sidebar, or hero section to build trust.

### Required props

| Prop | Type | Description |
|------|------|-------------|
| \`averageRating\` | \`number\` | Average star rating (1–5) |
| \`totalReviewCount\` | \`number\` | Total number of reviews |

### Key optional props

| Prop | Default | Description |
|------|---------|-------------|
| \`profileUrl\` | \`null\` | Google Business profile URL — omit to render the badge without a link |
| \`theme\` | \`'light'\` | \`'light'\` or \`'dark'\` |
| \`badgeLabel\` | \`'Google Rating'\` | Heading text above the score |
| \`badgeSubheadingFormatter\` | \`n => \`Read our \${n} reviews\`\` | Function to format the review count line |

When used via \`SvelteGoogleReviews\` with \`layout="badge"\`, \`averageRating\` and \`totalReviewCount\`
are fetched automatically and the badge will show an error state if they cannot be resolved.
        `,
      },
    },
  },
  argTypes: {
    theme: { control: 'radio', options: ['light', 'dark'] },
  },
};
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    averageRating: 4.8,
    totalReviewCount: 127,
    theme: 'light',
    profileUrl: 'https://g.page/r/example',
  },
};

/** Dark theme variant — place on a dark background for correct contrast. */
export const Dark: Story = {
  args: {
    averageRating: 4.6,
    totalReviewCount: 89,
    theme: 'dark',
    profileUrl: 'https://g.page/r/example',
  },
  parameters: { backgrounds: { default: 'dark' } },
};

/**
 * When `profileUrl` is `null` or omitted the badge renders without a link.
 * Use this when you don't have a Google Business profile URL or prefer
 * not to link out to Google.
 */
export const NoLink: Story = {
  args: {
    averageRating: 4.2,
    totalReviewCount: 43,
    theme: 'light',
    profileUrl: null,
  },
};
