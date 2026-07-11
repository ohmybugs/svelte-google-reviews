import type { Meta, StoryObj } from '@storybook/svelte';
import ErrorState from '../lib/components/ErrorState.svelte';

const meta: Meta<typeof ErrorState> = {
  title: 'Components/ErrorState',
  component: ErrorState,
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const CustomMessage: Story = {
  args: {
    errorMessage: 'Something went wrong. Please refresh the page.',
  },
};

export const WithClassName: Story = {
  args: {
    errorClassName: 'custom-error',
    errorStyle: 'color: red;',
  },
};
