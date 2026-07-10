<script lang="ts">
  import StarIcon from './StarIcon.svelte';

  export let rating: number;
  export let className: string = '';
</script>

<div class="star-rating {className}">
  {#each Array.from({ length: 5 }) as _, i}
    <StarIcon className="star {rating >= i + 1 ? 'star-filled' : 'star-empty'}" />
  {/each}
</div>

<style>
  .star-rating {
    display: flex;
    align-items: center;
  }

  :global(.star) {
    height: 20px;
    width: 20px;
  }

  :global(.star-filled) {
    color: #f8af0d;
  }

  :global(.star-empty) {
    color: #6b7280;
  }
</style>
