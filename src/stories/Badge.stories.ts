import type { Meta, StoryObj } from '@storybook/svelte';
import Badge from '../lib/components/Badge.svelte';

const meta: Meta<typeof Badge> = {
  title: 'Components/Badge',
  component: Badge,
  tags: ['autodocs'],
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

export const Dark: Story = {
  args: {
    averageRating: 4.6,
    totalReviewCount: 89,
    theme: 'dark',
    profileUrl: 'https://g.page/r/example',
  },
  parameters: { backgrounds: { default: 'dark' } },
};

export const NoLink: Story = {
  args: {
    averageRating: 4.2,
    totalReviewCount: 43,
    theme: 'light',
    profileUrl: null,
  },
};
