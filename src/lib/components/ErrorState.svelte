<script lang="ts">
  export let errorMessage: string = 'Failed to load Google reviews. Please try again later.';
  export let errorClassName: string = '';
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
