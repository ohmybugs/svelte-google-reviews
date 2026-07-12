<script lang="ts">
  import { onMount } from 'svelte';
  import type { Snippet } from 'svelte';
  import type {
    GoogleReview,
    NameDisplay,
    LogoVariant,
    DateDisplay,
    ReviewVariant,
    Theme,
    WidgetVersion,
    FeaturableAPIResponse,
    FeaturableAPIResponseV1,
  } from '../types/review.js';
  import type {
    ErrorStateCSSProps,
    LoadingStateCSSProps,
    CarouselCSSProps,
    ReviewCardCSSProps,
    BadgeCSSProps,
  } from '../types/cssProps.js';
  import { isV2Response, transformV2ResponseToV1 } from '../utils/apiTransformers.js';
  import Badge from './Badge.svelte';
  import Carousel from './Carousel.svelte';
  import ErrorState from './ErrorState.svelte';
  import LoadingState from './LoadingState.svelte';

  interface Props
    extends
      ErrorStateCSSProps,
      LoadingStateCSSProps,
      CarouselCSSProps,
      ReviewCardCSSProps,
      Omit<BadgeCSSProps, 'badgeStyle'> {
    // --- Data source (mutually exclusive) ---
    /** Your Featurable widget ID. When provided, reviews are fetched from the API on mount. Mutually exclusive with `reviews`. */
    featurableId?: string;
    /** Pre-fetched reviews array. Use when you already have the data and don't need an API call. Mutually exclusive with `featurableId`. */
    reviews?: GoogleReview[];
    /** Overrides the internal loading state. Leave `undefined` to derive it from the fetch lifecycle; set `true` to force the indicator on, `false` to force it off. */
    isLoading?: boolean;
    /** Featurable API version to use when fetching via `featurableId`. */
    widgetVersion?: WidgetVersion;
    /** Base URL for the Featurable API. Override for a custom proxy or self-hosted instance. */
    apiBaseUrl?: string;

    // --- Layout ---
    /** Controls how reviews are rendered. `carousel` shows a swipeable slider; `badge` shows a compact rating summary; `custom` exposes reviews via the `children` snippet for fully custom markup. */
    layout?: 'carousel' | 'badge' | 'custom';

    // --- Display options ---
    /** How reviewer names are formatted. `fullNames` → "Jane Smith"; `firstAndLastInitials` → "Jane S."; `firstNamesOnly` → "Jane". */
    nameDisplay?: NameDisplay;
    /** Which Google branding to render alongside the stars. `icon` shows the coloured G icon; `logo` shows the full Google wordmark. */
    logoVariant?: LogoVariant;
    /** Maximum number of review text characters shown before a "Read more" link is offered. */
    maxCharacters?: number;
    /** How review dates are presented. `relative` → "3 days ago"; `absolute` → formatted date string; `none` → date hidden. */
    dateDisplay?: DateDisplay;
    /** Visual style for individual review cards. `card` adds a bordered panel; `testimonial` renders as a flat quote block. */
    reviewVariant?: ReviewVariant;
    /** Colour scheme applied to text and backgrounds. Use `light` on light-coloured pages and `dark` on dark-coloured pages. */
    theme?: Theme;
    /** When `true`, reviews with no text content are filtered out before display. */
    hideEmptyReviews?: boolean;
    /** When `true`, strips Google's translation wrapper and shows only the original review text. */
    disableTranslation?: boolean;
    /** When `true`, carousel navigation buttons include `aria-label` attributes for screen readers. */
    accessibility?: boolean;

    // --- Carousel-specific ---
    /** Milliseconds between automatic slide advances. Only applies when `carouselAutoplay` is `true`. */
    carouselSpeed?: number;
    /** Whether the carousel advances slides automatically on a timer. */
    carouselAutoplay?: boolean;
    /** Maximum number of review cards visible at one time in the carousel. */
    maxItems?: number;
    /** Label for the expand button shown when a review exceeds `maxCharacters`. */
    readMoreLabel?: string;
    /** Label for the collapse button shown after a review has been expanded. */
    readLessLabel?: string;
    /** Whether to show pagination dot indicators below the carousel track. */
    showDots?: boolean;
    /** Custom formatter for relative dates (e.g. "2 hours ago"). Receives a `Date`, returns a string. Overrides the built-in formatter when `dateDisplay="relative"`. */
    getRelativeDate?: (date: Date) => string;
    /** Custom formatter for absolute dates. Receives a `Date`, returns a string. Overrides the built-in formatter when `dateDisplay="absolute"`. */
    getAbsoluteDate?: (date: Date) => string;
    /** Native `loading` attribute applied to reviewer avatars. Defaults to `lazy`; set to `eager` when the widget is above the fold to avoid delaying LCP. */
    imageLoading?: 'lazy' | 'eager';

    // --- Badge-specific ---
    /** URL of your Google Business Profile, linked from the badge subheading. Falls back to the URL returned by the API when using `featurableId`. */
    profileUrl?: string;
    /** Heading text displayed inside the badge (e.g. "Google Rating"). */
    badgeLabel?: string;
    /** Formats the badge subheading. Receives the review count and returns a display string, e.g. `(n) => \`Read our ${n} reviews\``. */
    badgeSubheadingFormatter?: (n: number) => string;
    /** Inline styles applied to the badge root element. */
    badgeStyle_?: string;

    // --- Structured data ---
    /** When `true`, injects a JSON-LD `Product` schema block for SEO. Requires `averageRating` and `totalReviewCount` to be available. */
    structuredData?: boolean;
    /** Brand name used in the JSON-LD schema `brand` field. Defaults to `document.title` when not provided. */
    brandName?: string;
    /** Product name used in the JSON-LD schema `name` field. Defaults to `document.title` when not provided. */
    productName?: string;
    /** Product description used in the JSON-LD schema `description` field. */
    productDescription?: string;
    /** Override the total review count used in the badge and structured data. Required when passing `reviews` directly instead of fetching via `featurableId`. */
    totalReviewCountOverride?: number;
    /** Override the average star rating used in the badge and structured data. Required when passing `reviews` directly instead of fetching via `featurableId`. */
    averageRatingOverride?: number;

    // --- Error/Loading messages ---
    /** Message displayed when the API fetch fails or required badge data is unavailable. */
    errorMessage?: string;
    /** Message displayed below the spinner while reviews are being fetched. */
    loadingMessage?: string;

    // --- Custom layout ---
    /** Rendered when `layout="custom"`. Receives `{ reviews }` — the processed `GoogleReview[]` — so you can render your own markup. */
    children?: Snippet<[{ reviews: GoogleReview[] }]>;
  }

  let {
    featurableId = undefined,
    reviews = undefined,
    isLoading = undefined,
    widgetVersion = 'v1',
    apiBaseUrl = 'https://api.featurable.com',
    layout = 'carousel',
    nameDisplay = 'firstAndLastInitials',
    logoVariant = 'icon',
    maxCharacters = 200,
    dateDisplay = 'relative',
    reviewVariant = 'card',
    theme = 'light',
    hideEmptyReviews = false,
    disableTranslation = false,
    accessibility = true,
    carouselSpeed = 3000,
    carouselAutoplay = true,
    maxItems = 3,
    readMoreLabel = 'Read more',
    readLessLabel = 'Read less',
    showDots = true,
    getRelativeDate = undefined,
    getAbsoluteDate = undefined,
    imageLoading = 'lazy',
    profileUrl = undefined,
    badgeLabel = 'Google Rating',
    badgeSubheadingFormatter = undefined,
    structuredData = false,
    brandName = undefined,
    productName = undefined,
    productDescription = '',
    totalReviewCountOverride = undefined,
    averageRatingOverride = undefined,
    errorMessage = 'Failed to load Google reviews. Please try again later.',
    loadingMessage = 'Loading reviews...',
    errorClassName = '',
    errorStyle = '',
    loaderClassName = '',
    loaderStyle = '',
    loaderSpinnerClassName = '',
    loaderSpinnerStyle = '',
    loaderLabelClassName = '',
    loaderLabelStyle = '',
    carouselClassName = '',
    carouselStyle = '',
    carouselBtnClassName = '',
    carouselBtnStyle = '',
    carouselBtnLeftClassName = '',
    carouselBtnLeftStyle = '',
    carouselBtnRightClassName = '',
    carouselBtnRightStyle = '',
    carouselBtnLightClassName = '',
    carouselBtnLightStyle = '',
    carouselBtnDarkClassName = '',
    carouselBtnDarkStyle = '',
    carouselBtnIconClassName = '',
    carouselBtnIconStyle = '',
    carouselCardClassName = '',
    carouselCardStyle = '',
    badgeClassName = '',
    badgeStyle_ = '', // avoid conflict with HTML style attr
    badgeContainerClassName = '',
    badgeContainerStyle = '',
    badgeContainerLightClassName = '',
    badgeContainerLightStyle = '',
    badgeContainerDarkClassName = '',
    badgeContainerDarkStyle = '',
    badgeGoogleIconClassName = '',
    badgeGoogleIconStyle = '',
    badgeInnerContainerClassName = '',
    badgeInnerContainerStyle = '',
    badgeLabelClassName = '',
    badgeLabelStyle = '',
    badgeLabelLightClassName = '',
    badgeLabelLightStyle = '',
    badgeLabelDarkClassName = '',
    badgeLabelDarkStyle = '',
    badgeRatingContainerClassName = '',
    badgeRatingContainerStyle = '',
    badgeRatingClassName = '',
    badgeRatingStyle = '',
    badgeRatingLightClassName = '',
    badgeRatingLightStyle = '',
    badgeRatingDarkClassName = '',
    badgeRatingDarkStyle = '',
    badgeStarsClassName = '',
    badgeStarsStyle = '',
    badgeStarsContainerClassName = '',
    badgeStarsContainerStyle = '',
    badgeStarsFilledClassName = '',
    badgeStarsFilledStyle = '',
    badgeStarsEmptyClassName = '',
    badgeStarsEmptyStyle = '',
    badgeLinkContainerClassName = '',
    badgeLinkContainerStyle = '',
    badgeLinkClassName = '',
    badgeLinkStyle = '',
    badgeLinkLightClassName = '',
    badgeLinkLightStyle = '',
    badgeLinkDarkClassName = '',
    badgeLinkDarkStyle = '',
    badgeLinkInlineClassName = '',
    badgeLinkInlineStyle = '',
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
    children,
  }: Props = $props();

  // --- Internal state ---
  let internalReviews: GoogleReview[] = $state([]);
  let loading = $state(true);
  let error = $state(false);
  let fetchedProfileUrl: string | null = $state(null);
  let totalReviewCount: number | null = $state(totalReviewCountOverride ?? null);
  let averageRating: number | null = $state(averageRatingOverride ?? null);

  function mapReview(review: GoogleReview): GoogleReview {
    let comment = review.comment;
    if (disableTranslation) {
      if (review.comment.includes('(Original)')) {
        const split = review.comment.split('(Original)');
        if (split.length > 1) comment = split[1].trim();
      } else if (review.comment.includes('(Translated by Google)')) {
        const split = review.comment.split('(Translated by Google)');
        if (split.length > 1) comment = split[0].trim();
      }
    }
    return { ...review, comment };
  }

  function filterReview(review: GoogleReview): boolean {
    if (hideEmptyReviews) return review.comment.trim().length !== 0;
    return true;
  }

  // Sync manual reviews prop
  $effect(() => {
    if (reviews) {
      internalReviews = reviews.filter(filterReview).map(mapReview);
    }
  });

  onMount(async () => {
    if (featurableId) {
      try {
        const version = widgetVersion ?? 'v1';
        const base = (apiBaseUrl ?? 'https://api.featurable.com').replace(/\/+$/, '');
        const res = await fetch(`${base}/${version}/widgets/${featurableId}`);
        const data: FeaturableAPIResponse = await res.json();

        let normalizedData: FeaturableAPIResponseV1;
        if (version === 'v2' && isV2Response(data)) {
          normalizedData = transformV2ResponseToV1(data);
        } else {
          normalizedData = data as FeaturableAPIResponseV1;
        }

        if (!normalizedData.success) {
          error = true;
          return;
        }

        internalReviews = normalizedData.reviews.filter(filterReview).map(mapReview);
        fetchedProfileUrl = normalizedData.profileUrl;
        totalReviewCount = normalizedData.totalReviewCount;
        averageRating = normalizedData.averageRating;
      } catch {
        error = true;
      } finally {
        loading = false;
      }
    } else {
      loading = false;
    }
  });

  let showLoading = $derived((loading && isLoading === undefined) || isLoading === true);

  let showError = $derived(
    error || (layout === 'badge' && (averageRating === null || totalReviewCount === null))
  );

  let resolvedProfileUrl = $derived(fetchedProfileUrl ?? profileUrl ?? null);

  let structuredDataJson = $derived.by(() => {
    if (!structuredData || averageRating === null || totalReviewCount === null) return null;
    if (typeof window === 'undefined') return null;
    const name = productName ?? document.title;
    const brand = brandName ?? document.title;
    const url = document.location.href;
    const reviewItems = internalReviews
      .filter((r) => !r.reviewer.isAnonymous)
      .filter(filterReview)
      .slice(0, 10)
      .map((r) =>
        JSON.stringify({
          '@type': 'Review',
          reviewBody: r.comment,
          datePublished: r.createTime,
          author: { '@type': 'Person', name: r.reviewer.displayName },
          reviewRating: { '@type': 'Rating', ratingValue: r.starRating },
        })
      );

    return `{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": ${JSON.stringify(name)},
  "url": ${JSON.stringify(url)},
  "brand": { "@type": "Brand", "name": ${JSON.stringify(brand)} },
  "description": ${JSON.stringify(productDescription)},
  "image": [],
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": ${averageRating},
    "reviewCount": ${totalReviewCount},
    "bestRating": 5,
    "worstRating": 1
  },
  "review": [${reviewItems.join(',')}]
}`;
  });
</script>

{#if showLoading}
  <LoadingState
    {loadingMessage}
    {loaderClassName}
    {loaderStyle}
    {loaderSpinnerClassName}
    {loaderSpinnerStyle}
    {loaderLabelClassName}
    {loaderLabelStyle}
  />
{:else if showError}
  <ErrorState {errorMessage} {errorClassName} {errorStyle} />
{:else}
  <div class="sgr-root">
    {#if structuredDataJson}
      {@html `<script type="application/ld+json">${structuredDataJson}<\/script>`}
    {/if}

    {#if layout === 'carousel'}
      <Carousel
        reviews={internalReviews}
        {maxCharacters}
        {nameDisplay}
        {logoVariant}
        {dateDisplay}
        {reviewVariant}
        {carouselSpeed}
        {carouselAutoplay}
        {maxItems}
        {theme}
        {readMoreLabel}
        {readLessLabel}
        {getRelativeDate}
        {getAbsoluteDate}
        {imageLoading}
        {showDots}
        {accessibility}
        {carouselClassName}
        {carouselStyle}
        {carouselBtnClassName}
        {carouselBtnStyle}
        {carouselBtnLeftClassName}
        {carouselBtnLeftStyle}
        {carouselBtnRightClassName}
        {carouselBtnRightStyle}
        {carouselBtnLightClassName}
        {carouselBtnLightStyle}
        {carouselBtnDarkClassName}
        {carouselBtnDarkStyle}
        {carouselBtnIconClassName}
        {carouselBtnIconStyle}
        {carouselCardClassName}
        {carouselCardStyle}
        {reviewCardClassName}
        {reviewCardStyle}
        {reviewCardLightClassName}
        {reviewCardLightStyle}
        {reviewCardDarkClassName}
        {reviewCardDarkStyle}
        {reviewBodyCardClassName}
        {reviewBodyCardStyle}
        {reviewBodyTestimonialClassName}
        {reviewBodyTestimonialStyle}
        {reviewTextClassName}
        {reviewTextStyle}
        {reviewTextLightClassName}
        {reviewTextLightStyle}
        {reviewTextDarkClassName}
        {reviewTextDarkStyle}
        {reviewReadMoreClassName}
        {reviewReadMoreStyle}
        {reviewReadMoreLightClassName}
        {reviewReadMoreLightStyle}
        {reviewReadMoreDarkClassName}
        {reviewReadMoreDarkStyle}
        {reviewFooterClassName}
        {reviewFooterStyle}
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
    {:else if layout === 'badge'}
      <Badge
        averageRating={averageRating!}
        totalReviewCount={totalReviewCount!}
        profileUrl={resolvedProfileUrl}
        {theme}
        {badgeLabel}
        {badgeSubheadingFormatter}
        {badgeClassName}
        badgeStyle={badgeStyle_}
        {badgeContainerClassName}
        {badgeContainerStyle}
        {badgeContainerLightClassName}
        {badgeContainerLightStyle}
        {badgeContainerDarkClassName}
        {badgeContainerDarkStyle}
        {badgeGoogleIconClassName}
        {badgeGoogleIconStyle}
        {badgeInnerContainerClassName}
        {badgeInnerContainerStyle}
        {badgeLabelClassName}
        {badgeLabelStyle}
        {badgeLabelLightClassName}
        {badgeLabelLightStyle}
        {badgeLabelDarkClassName}
        {badgeLabelDarkStyle}
        {badgeRatingContainerClassName}
        {badgeRatingContainerStyle}
        {badgeRatingClassName}
        {badgeRatingStyle}
        {badgeRatingLightClassName}
        {badgeRatingLightStyle}
        {badgeRatingDarkClassName}
        {badgeRatingDarkStyle}
        {badgeStarsClassName}
        {badgeStarsStyle}
        {badgeStarsContainerClassName}
        {badgeStarsContainerStyle}
        {badgeStarsFilledClassName}
        {badgeStarsFilledStyle}
        {badgeStarsEmptyClassName}
        {badgeStarsEmptyStyle}
        {badgeLinkContainerClassName}
        {badgeLinkContainerStyle}
        {badgeLinkClassName}
        {badgeLinkStyle}
        {badgeLinkLightClassName}
        {badgeLinkLightStyle}
        {badgeLinkDarkClassName}
        {badgeLinkDarkStyle}
        {badgeLinkInlineClassName}
        {badgeLinkInlineStyle}
      />
    {:else if layout === 'custom'}
      {@render children?.({ reviews: internalReviews })}
    {/if}
  </div>
{/if}

<style>
  .sgr-root {
    font-family:
      -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif,
      'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol';
  }
</style>
