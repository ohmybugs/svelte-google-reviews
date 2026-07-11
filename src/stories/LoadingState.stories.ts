import type { Meta, StoryObj } from '@storybook/svelte';
import LoadingState from '../lib/components/LoadingState.svelte';

const meta: Meta<typeof LoadingState> = {
  title: 'Components/LoadingState',
  component: LoadingState,
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const CustomMessage: Story = {
  args: {
    loadingMessage: 'Fetching reviews...',
  },
};

export const WithClassName: Story = {
  args: {
    loaderClassName: 'custom-loader',
    loaderStyle: 'background: #f0f0f0;',
    loaderSpinnerClassName: 'custom-spinner',
    loaderLabelClassName: 'custom-label',
  },
};
