<script lang="ts">
  import type { ErrorStateCSSProps } from '../types/cssProps.js';

  interface Props extends ErrorStateCSSProps {
    /** Message text displayed when an error occurs (e.g. failed API fetch or missing badge data). */
    errorMessage?: string;
  }

  let {
    errorMessage = 'Failed to load Google reviews. Please try again later.',
    errorClassName = '',
    errorStyle = '',
  }: Props = $props();
</script>

<div class="error {errorClassName}" style={errorStyle}>
  {errorMessage}
</div>

<style>
  .error {
    padding-top: 64px;
    padding-bottom: 64px;
    text-align: center;
    font-size: 16px;
    font-family:
      -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif,
      'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol';
  }
</style>
