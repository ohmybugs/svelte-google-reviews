<script lang="ts">
  /** Message text displayed when an error occurs (e.g. failed API fetch or missing badge data). */
  export let errorMessage: string = 'Failed to load Google reviews. Please try again later.';
  /** CSS class added to the error wrapper `<div>`. */
  export let errorClassName: string = '';
  /** Inline styles applied to the error wrapper `<div>`. */
  export let errorStyle: string = '';
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
