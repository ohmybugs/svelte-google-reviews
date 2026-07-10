<script lang="ts">
  import type {
    GoogleReview,
    NameDisplay,
    LogoVariant,
    DateDisplay,
    ReviewVariant,
    Theme,
  } from '../types/review';
  import { trim } from '../utils/trim';
  import StarRating from './StarRating.svelte';
  import GoogleIcon from './GoogleIcon.svelte';
  import GoogleLogo from './GoogleLogo.svelte';
  import ReviewCardReviewer from './ReviewCardReviewer.svelte';

  export let review: GoogleReview;
  export let maxCharacters: number = 200;
  export let nameDisplay: NameDisplay = 'firstAndLastInitials';
  export let logoVariant: LogoVariant = 'icon';
  export let dateDisplay: DateDisplay = 'relative';
  export let reviewVariant: ReviewVariant = 'card';
  export let theme: Theme = 'light';
  export let readMoreLabel: string = 'Read more';
  export let readLessLabel: string = 'Read less';
  export let getAbsoluteDate: ((date: Date) => string) | undefined = undefined;
  export let getRelativeDate: ((date: Date) => string) | undefined = undefined;

  export let reviewCardClassName: string = '';
  export let reviewCardStyle: string = '';
  export let reviewCardLightClassName: string = '';
  export let reviewCardLightStyle: string = '';
  export let reviewCardDarkClassName: string = '';
  export let reviewCardDarkStyle: string = '';
  export let reviewBodyCardClassName: string = '';
  export let reviewBodyCardStyle: string = '';
  export let reviewBodyTestimonialClassName: string = '';
  export let reviewBodyTestimonialStyle: string = '';
  export let reviewTextClassName: string = '';
  export let reviewTextStyle: string = '';
  export let reviewTextLightClassName: string = '';
  export let reviewTextLightStyle: string = '';
  export let reviewTextDarkClassName: string = '';
  export let reviewTextDarkStyle: string = '';
  export let reviewReadMoreClassName: string = '';
  export let reviewReadMoreStyle: string = '';
  export let reviewReadMoreLightClassName: string = '';
  export let reviewReadMoreLightStyle: string = '';
  export let reviewReadMoreDarkClassName: string = '';
  export let reviewReadMoreDarkStyle: string = '';
  export let reviewFooterClassName: string = '';
  export let reviewFooterStyle: string = '';
  export let reviewerClassName: string = '';
  export let reviewerStyle: string = '';
  export let reviewerProfileClassName: string = '';
  export let reviewerProfileStyle: string = '';
  export let reviewerProfileImageClassName: string = '';
  export let reviewerProfileImageStyle: string = '';
  export let reviewerProfileFallbackClassName: string = '';
  export let reviewerProfileFallbackStyle: string = '';
  export let reviewerNameClassName: string = '';
  export let reviewerNameStyle: string = '';
  export let reviewerNameLightClassName: string = '';
  export let reviewerNameLightStyle: string = '';
  export let reviewerNameDarkClassName: string = '';
  export let reviewerNameDarkStyle: string = '';
  export let reviewerDateClassName: string = '';
  export let reviewerDateStyle: string = '';
  export let reviewerDateLightClassName: string = '';
  export let reviewerDateLightStyle: string = '';
  export let reviewerDateDarkClassName: string = '';
  export let reviewerDateDarkStyle: string = '';

  let isOpen = false;

  $: hasMore = review.comment.length > maxCharacters;
  $: comment = isOpen ? review.comment : trim(review.comment, maxCharacters);

  $: cardClass = [
    'review-card',
    theme === 'light' ? 'review-card-light' : 'review-card-dark',
    reviewCardClassName,
    theme === 'light' ? reviewCardLightClassName : reviewCardDarkClassName,
  ]
    .filter(Boolean)
    .join(' ');

  $: cardStyle = `${reviewCardStyle}; ${theme === 'light' ? reviewCardLightStyle : reviewCardDarkStyle}`;
</script>

<div class={cardClass} style={cardStyle}>
  <div>
    {#if reviewVariant === 'card'}
      <ReviewCardReviewer
        {review}
        {nameDisplay}
        {dateDisplay}
        {theme}
        {getRelativeDate}
        {getAbsoluteDate}
        {reviewerClassName}
        {reviewerStyle}
        {reviewerProfileClassName}
        {reviewerProfileStyle}
        {reviewerProfileImageClassName}
        {reviewerProfileImageStyle}
        {reviewerProfileFallbackClassName}
        {reviewerProfileFallbackStyle}
        {reviewerNameClassName}
        {reviewerNameStyle}
        {reviewerNameLightClassName}
        {reviewerNameLightStyle}
        {reviewerNameDarkClassName}
        {reviewerNameDarkStyle}
        {reviewerDateClassName}
        {reviewerDateStyle}
        {reviewerDateLightClassName}
        {reviewerDateLightStyle}
        {reviewerDateDarkClassName}
        {reviewerDateDarkStyle}
      />
    {/if}

    {#if reviewVariant === 'testimonial'}
      <StarRating rating={review.starRating} />
    {/if}

    <div
      class="review-body {reviewVariant === 'testimonial'
        ? 'review-body-testimonial'
        : 'review-body-card'} {reviewBodyCardClassName} {reviewVariant === 'testimonial'
        ? reviewBodyTestimonialClassName
        : ''}"
      style="{reviewBodyCardStyle}; {reviewVariant === 'testimonial'
        ? reviewBodyTestimonialStyle
        : ''}"
    >
      <p
        class="review-text {theme === 'light'
          ? 'review-text-light'
          : 'review-text-dark'} {reviewTextClassName} {theme === 'light'
          ? reviewTextLightClassName
          : reviewTextDarkClassName}"
        style="{reviewTextStyle}; {theme === 'light' ? reviewTextLightStyle : reviewTextDarkStyle}"
        data-review-comment
        data-review-id={review.reviewId}
      >
        {comment}
      </p>

      {#if hasMore}
        <button
          on:click={() => (isOpen = !isOpen)}
          class="read-more {theme === 'light'
            ? 'read-more-light'
            : 'read-more-dark'} {reviewReadMoreClassName} {theme === 'light'
            ? reviewReadMoreLightClassName
            : reviewReadMoreDarkClassName}"
          style="{reviewReadMoreStyle}; {theme === 'light'
            ? reviewReadMoreLightStyle
            : reviewReadMoreDarkStyle}"
        >
          {isOpen ? readLessLabel : readMoreLabel}
        </button>
      {/if}
    </div>
  </div>

  <div class="review-footer {reviewFooterClassName}" style={reviewFooterStyle}>
    {#if reviewVariant === 'card'}
      <StarRating rating={review.starRating} />
    {/if}

    {#if reviewVariant === 'testimonial'}
      <ReviewCardReviewer
        {review}
        {nameDisplay}
        {dateDisplay}
        {theme}
        {getRelativeDate}
        {getAbsoluteDate}
        {reviewerClassName}
        {reviewerStyle}
        {reviewerProfileClassName}
        {reviewerProfileStyle}
        {reviewerProfileImageClassName}
        {reviewerProfileImageStyle}
        {reviewerProfileFallbackClassName}
        {reviewerProfileFallbackStyle}
        {reviewerNameClassName}
        {reviewerNameStyle}
        {reviewerNameLightClassName}
        {reviewerNameLightStyle}
        {reviewerNameDarkClassName}
        {reviewerNameDarkStyle}
        {reviewerDateClassName}
        {reviewerDateStyle}
        {reviewerDateLightClassName}
        {reviewerDateLightStyle}
        {reviewerDateDarkClassName}
        {reviewerDateDarkStyle}
      />
    {/if}

    {#if logoVariant === 'full'}
      <GoogleLogo />
    {:else if logoVariant === 'icon'}
      <GoogleIcon />
    {/if}
  </div>
</div>

<style>
  .review-card {
    max-width: 65ch;
    margin: 0 auto;
    height: 100%;
    width: 100%;
    box-shadow:
      0 1px 3px 0 rgb(0 0 0 / 0.1),
      0 1px 2px -1px rgb(0 0 0 / 0.1);
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    transition: all;
    padding: 12px;
    box-sizing: border-box;
  }

  .review-card-light {
    background: white;
    border: 1px solid #e5e7eb;
  }

  .review-card-dark {
    background: #111827;
    border: 1px solid #374151;
  }

  .review-body-card {
    margin-top: 16px;
  }

  .review-body-testimonial {
    margin-top: 20px;
  }

  .review-text {
    line-height: 1.5;
    margin: 0;
    font-size: 16px;
  }

  .review-text-light {
    color: #030712;
  }

  .review-text-dark {
    color: white;
  }

  .read-more {
    margin-top: 4px;
    display: inline-block;
    text-decoration: none;
    border: none;
    background: none;
    outline: none;
    font-size: 16px;
    cursor: pointer;
    padding: 0;
  }

  .read-more:hover {
    text-decoration: underline;
  }

  .read-more-light {
    color: #6b7280;
  }

  .read-more-dark {
    color: #9ca3af;
  }

  .review-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 16px;
  }
</style>
