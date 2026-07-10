import type { Meta, StoryObj } from '@storybook/svelte';
import ReviewCard from '../lib/components/ReviewCard.svelte';
import { sampleReviews, longCommentReview } from './sampleReviews';

const meta: Meta<typeof ReviewCard> = {
  title: 'Components/ReviewCard',
  component: ReviewCard,
  tags: ['autodocs'],
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

export const Dark: Story = {
  args: {
    review: sampleReviews[2],
    theme: 'dark',
    reviewVariant: 'card',
  },
  parameters: { backgrounds: { default: 'dark' } },
};

export const Testimonial: Story = {
  args: {
    review: sampleReviews[1],
    theme: 'light',
    reviewVariant: 'testimonial',
  },
};

export const LongComment: Story = {
  args: {
    review: longCommentReview,
    theme: 'light',
    reviewVariant: 'card',
    maxCharacters: 200,
  },
};

export const AnonymousReviewer: Story = {
  args: {
    review: sampleReviews[4],
    theme: 'light',
    reviewVariant: 'card',
  },
};
