import type { Meta, StoryObj } from '@storybook/svelte';
import SvelteGoogleReviews from '../lib/components/SvelteGoogleReviews.svelte';
import { sampleReviews } from './sampleReviews';

const meta: Meta<typeof SvelteGoogleReviews> = {
  title: 'Components/SvelteGoogleReviews',
  component: SvelteGoogleReviews,
  tags: ['autodocs'],
  argTypes: {
    layout: { control: 'radio', options: ['carousel', 'badge', 'custom'] },
    theme: { control: 'radio', options: ['light', 'dark'] },
  },
};
export default meta;

type Story = StoryObj<typeof meta>;

export const CarouselLayout: Story = {
  args: {
    reviews: sampleReviews,
    layout: 'carousel',
    isLoading: false,
  },
};

export const BadgeLayout: Story = {
  args: {
    reviews: sampleReviews,
    layout: 'badge',
    isLoading: false,
    averageRatingOverride: 4.7,
    totalReviewCountOverride: sampleReviews.length,
    profileUrl: 'https://g.page/r/example',
  },
};

export const CustomSlotLayout: Story = {
  args: {
    reviews: sampleReviews,
    layout: 'custom',
    isLoading: false,
  },
};
