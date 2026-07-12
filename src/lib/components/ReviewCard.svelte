<script lang="ts">
  import type {
    GoogleReview,
    NameDisplay,
    LogoVariant,
    DateDisplay,
    ReviewVariant,
    Theme,
  } from '../types/review.js';
  import type { ReviewCardCSSProps } from '../types/cssProps.js';
  import { trim } from '../utils/trim.js';
  import StarRating from './StarRating.svelte';
  import GoogleIcon from './GoogleIcon.svelte';
  import GoogleLogo from './GoogleLogo.svelte';
  import ReviewCardReviewer from './ReviewCardReviewer.svelte';

  interface Props extends ReviewCardCSSProps {
    review: GoogleReview;
    maxCharacters?: number;
    nameDisplay?: NameDisplay;
    logoVariant?: LogoVariant;
    dateDisplay?: DateDisplay;
    reviewVariant?: ReviewVariant;
    theme?: Theme;
    readMoreLabel?: string;
    readLessLabel?: string;
    getAbsoluteDate?: (date: Date) => string;
    getRelativeDate?: (date: Date) => string;
    imageLoading?: 'lazy' | 'eager';
  }

  let {
    review,
    maxCharacters = 200,
    nameDisplay = 'firstAndLastInitials',
    logoVariant = 'icon',
    dateDisplay = 'relative',
    reviewVariant = 'card',
    theme = 'light',
    readMoreLabel = 'Read more',
    readLessLabel = 'Read less',
    getAbsoluteDate = undefined,
    getRelativeDate = undefined,
    imageLoading = 'lazy',
    reviewCardClassName = '',
    reviewCardStyle = '',
    reviewCardLightClassName = '',
    reviewCardLightStyle = '',
    reviewCardDarkClassName = '',
    reviewCardDarkStyle = '',
    reviewBodyCardClassName = '',
    reviewBodyCardStyle = '',
    reviewBodyTestimonialClassName = '',
    reviewBodyTestimonialStyle = '',
    reviewTextClassName = '',
    reviewTextStyle = '',
    reviewTextLightClassName = '',
    reviewTextLightStyle = '',
    reviewTextDarkClassName = '',
    reviewTextDarkStyle = '',
    reviewReadMoreClassName = '',
    reviewReadMoreStyle = '',
    reviewReadMoreLightClassName = '',
    reviewReadMoreLightStyle = '',
    reviewReadMoreDarkClassName = '',
    reviewReadMoreDarkStyle = '',
    reviewFooterClassName = '',
    reviewFooterStyle = '',
    reviewerClassName = '',
    reviewerStyle = '',
    reviewerProfileClassName = '',
    reviewerProfileStyle = '',
    reviewerProfileImageClassName = '',
    reviewerProfileImageStyle = '',
    reviewerProfileFallbackClassName = '',
    reviewerProfileFallbackStyle = '',
    reviewerNameClassName = '',
    reviewerNameStyle = '',
    reviewerNameLightClassName = '',
    reviewerNameLightStyle = '',
    reviewerNameDarkClassName = '',
    reviewerNameDarkStyle = '',
    reviewerDateClassName = '',
    reviewerDateStyle = '',
    reviewerDateLightClassName = '',
    reviewerDateLightStyle = '',
    reviewerDateDarkClassName = '',
    reviewerDateDarkStyle = '',
  }: Props = $props();

  let isOpen = $state(false);

  let hasMore = $derived(review.comment.length > maxCharacters);
  let comment = $derived(isOpen ? review.comment : trim(review.comment, maxCharacters));

  let cardClass = $derived(
    [
      'review-card',
      theme === 'light' ? 'review-card-light' : 'review-card-dark',
      reviewCardClassName,
      theme === 'light' ? reviewCardLightClassName : reviewCardDarkClassName,
    ]
      .filter(Boolean)
      .join(' ')
  );

  let cardStyle = $derived(
    `${reviewCardStyle}; ${theme === 'light' ? reviewCardLightStyle : reviewCardDarkStyle}`
  );
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
        {imageLoading}
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
          onclick={() => (isOpen = !isOpen)}
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
        {imageLoading}
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
