<script lang="ts">
  import SvelteGoogleReviews from '../lib/components/SvelteGoogleReviews.svelte';
  import type { GoogleReview } from '../lib/types/review';

  export let reviews: GoogleReview[] = [];
  export let isLoading: boolean | undefined = undefined;
  export let hideEmptyReviews: boolean = false;
  export let disableTranslation: boolean = false;
</script>

<!--
  Example: layout="custom" exposes `reviews` as a slot prop.
  Use `let:reviews` to receive the processed review data and render
  anything you like — a grid, a table, a masonry layout, etc.
-->
<SvelteGoogleReviews
  {reviews}
  {isLoading}
  {hideEmptyReviews}
  {disableTranslation}
  layout="custom"
  let:reviews={processedReviews}
>
  <div class="custom-grid">
    {#each processedReviews as review (review.reviewId)}
      <div class="custom-card">
        <div class="custom-card__header">
          <img
            src={review.reviewer.profilePhotoUrl}
            alt={review.reviewer.displayName}
            class="custom-card__avatar"
          />
          <div>
            <strong class="custom-card__name">{review.reviewer.displayName}</strong>
            <div class="custom-card__stars">
              {'★'.repeat(review.starRating)}{'☆'.repeat(5 - review.starRating)}
            </div>
          </div>
        </div>
        <p class="custom-card__comment">{review.comment}</p>
      </div>
    {/each}
  </div>
</SvelteGoogleReviews>

<style>
  .custom-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
    gap: 1rem;
    padding: 1rem;
    font-family: sans-serif;
  }

  .custom-card {
    border: 1px solid #e2e8f0;
    border-radius: 12px;
    padding: 1rem;
    background: #fff;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .custom-card__header {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .custom-card__avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    object-fit: cover;
  }

  .custom-card__name {
    display: block;
    font-size: 0.875rem;
    color: #1a202c;
  }

  .custom-card__stars {
    color: #f6ad55;
    font-size: 0.875rem;
    letter-spacing: 1px;
  }

  .custom-card__comment {
    font-size: 0.85rem;
    color: #4a5568;
    line-height: 1.5;
    margin: 0;
  }
</style>
