<script lang="ts">
  import { onMount } from 'svelte';
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
  } from '../types/review';
  import { isV2Response, transformV2ResponseToV1 } from '../utils/apiTransformers';
  import Badge from './Badge.svelte';
  import Carousel from './Carousel.svelte';
  import ErrorState from './ErrorState.svelte';
  import LoadingState from './LoadingState.svelte';

  // --- Data source (mutually exclusive) ---
  /** Your Featurable widget ID. When provided, reviews are fetched from the API on mount. Mutually exclusive with `reviews`. */
  export let featurableId: string | undefined = undefined;
  /** Pre-fetched reviews array. Use when you already have the data and don't need an API call. Mutually exclusive with `featurableId`. */
  export let reviews: GoogleReview[] | undefined = undefined;
  /** Overrides the internal loading state. Leave `undefined` to derive it from the fetch lifecycle; set `true` to force the indicator on, `false` to force it off. */
  export let isLoading: boolean | undefined = undefined;
  /** Featurable API version to use when fetching via `featurableId`. */
  export let widgetVersion: WidgetVersion = 'v1';
  /** Base URL for the Featurable API. Override for a custom proxy or self-hosted instance. */
  export let apiBaseUrl: string = 'https://api.featurable.com';

  // --- Layout ---
  /** Controls how reviews are rendered. `carousel` shows a swipeable slider; `badge` shows a compact rating summary; `custom` exposes reviews as a slot prop for fully custom markup. */
  export let layout: 'carousel' | 'badge' | 'custom' = 'carousel';

  // --- Display options ---
  /** How reviewer names are formatted. `fullNames` → "Jane Smith"; `firstAndLastInitials` → "Jane S."; `firstNamesOnly` → "Jane". */
  export let nameDisplay: NameDisplay = 'firstAndLastInitials';
  /** Which Google branding to render alongside the stars. `icon` shows the coloured G icon; `logo` shows the full Google wordmark. */
  export let logoVariant: LogoVariant = 'icon';
  /** Maximum number of review text characters shown before a "Read more" link is offered. */
  export let maxCharacters: number = 200;
  /** How review dates are presented. `relative` → "3 days ago"; `absolute` → formatted date string; `none` → date hidden. */
  export let dateDisplay: DateDisplay = 'relative';
  /** Visual style for individual review cards. `card` adds a bordered panel; `testimonial` renders as a flat quote block. */
  export let reviewVariant: ReviewVariant = 'card';
  /** Colour scheme applied to text and backgrounds. Use `light` on light-coloured pages and `dark` on dark-coloured pages. */
  export let theme: Theme = 'light';
  /** When `true`, reviews with no text content are filtered out before display. */
  export let hideEmptyReviews: boolean = false;
  /** When `true`, strips Google's translation wrapper and shows only the original review text. */
  export let disableTranslation: boolean = false;
  /** When `true`, carousel navigation buttons include `aria-label` attributes for screen readers. */
  export let accessibility: boolean = true;

  // --- Carousel-specific ---
  /** Milliseconds between automatic slide advances. Only applies when `carouselAutoplay` is `true`. */
  export let carouselSpeed: number = 3000;
  /** Whether the carousel advances slides automatically on a timer. */
  export let carouselAutoplay: boolean = true;
  /** Maximum number of review cards visible at one time in the carousel. */
  export let maxItems: number = 3;
  /** Label for the expand button shown when a review exceeds `maxCharacters`. */
  export let readMoreLabel: string = 'Read more';
  /** Label for the collapse button shown after a review has been expanded. */
  export let readLessLabel: string = 'Read less';
  /** Whether to show pagination dot indicators below the carousel track. */
  export let showDots: boolean = true;
  /** Custom formatter for relative dates (e.g. "2 hours ago"). Receives a `Date`, returns a string. Overrides the built-in formatter when `dateDisplay="relative"`. */
  export let getRelativeDate: ((date: Date) => string) | undefined = undefined;
  /** Custom formatter for absolute dates. Receives a `Date`, returns a string. Overrides the built-in formatter when `dateDisplay="absolute"`. */
  export let getAbsoluteDate: ((date: Date) => string) | undefined = undefined;

  // --- Badge-specific ---
  /** URL of your Google Business Profile, linked from the badge subheading. Falls back to the URL returned by the API when using `featurableId`. */
  export let profileUrl: string | undefined = undefined;
  /** Heading text displayed inside the badge (e.g. "Google Rating"). */
  export let badgeLabel: string = 'Google Rating';
  /** Formats the badge subheading. Receives the review count and returns a display string, e.g. `(n) => \`Read our ${n} reviews\``. */
  export let badgeSubheadingFormatter: ((n: number) => string) | undefined = undefined;

  // --- Structured data ---
  /** When `true`, injects a JSON-LD `Product` schema block for SEO. Requires `averageRating` and `totalReviewCount` to be available. */
  export let structuredData: boolean = false;
  /** Brand name used in the JSON-LD schema `brand` field. Defaults to `document.title` when not provided. */
  export let brandName: string | undefined = undefined;
  /** Product name used in the JSON-LD schema `name` field. Defaults to `document.title` when not provided. */
  export let productName: string | undefined = undefined;
  /** Product description used in the JSON-LD schema `description` field. */
  export let productDescription: string = '';
  /** Override the total review count used in the badge and structured data. Required when passing `reviews` directly instead of fetching via `featurableId`. */
  export let totalReviewCountOverride: number | undefined = undefined;
  /** Override the average star rating used in the badge and structured data. Required when passing `reviews` directly instead of fetching via `featurableId`. */
  export let averageRatingOverride: number | undefined = undefined;

  // --- Error/Loading messages ---
  /** Message displayed when the API fetch fails or required badge data is unavailable. */
  export let errorMessage: string = 'Failed to load Google reviews. Please try again later.';
  /** Message displayed below the spinner while reviews are being fetched. */
  export let loadingMessage: string = 'Loading reviews...';

  // --- CSS Props ---
  /** CSS class added to the error state wrapper element. */
  export let errorClassName: string = '';
  /** Inline styles applied to the error state wrapper element. */
  export let errorStyle: string = '';
  /** CSS class added to the loading state outer wrapper. */
  export let loaderClassName: string = '';
  /** Inline styles applied to the loading state outer wrapper. */
  export let loaderStyle: string = '';
  /** CSS class added to the spinner SVG element. */
  export let loaderSpinnerClassName: string = '';
  /** Inline styles applied to the spinner SVG element. */
  export let loaderSpinnerStyle: string = '';
  /** CSS class added to the loading label `<p>` element. */
  export let loaderLabelClassName: string = '';
  /** Inline styles applied to the loading label `<p>` element. */
  export let loaderLabelStyle: string = '';

  // Carousel CSS
  /** CSS class added to the carousel root element. */
  export let carouselClassName: string = '';
  /** Inline styles applied to the carousel root element. */
  export let carouselStyle: string = '';
  /** CSS class added to both navigation buttons. */
  export let carouselBtnClassName: string = '';
  /** Inline styles applied to both navigation buttons. */
  export let carouselBtnStyle: string = '';
  /** CSS class added to the left (previous) navigation button. */
  export let carouselBtnLeftClassName: string = '';
  /** Inline styles applied to the left (previous) navigation button. */
  export let carouselBtnLeftStyle: string = '';
  /** CSS class added to the right (next) navigation button. */
  export let carouselBtnRightClassName: string = '';
  /** Inline styles applied to the right (next) navigation button. */
  export let carouselBtnRightStyle: string = '';
  /** CSS class added to navigation buttons in light theme. */
  export let carouselBtnLightClassName: string = '';
  /** Inline styles applied to navigation buttons in light theme. */
  export let carouselBtnLightStyle: string = '';
  /** CSS class added to navigation buttons in dark theme. */
  export let carouselBtnDarkClassName: string = '';
  /** Inline styles applied to navigation buttons in dark theme. */
  export let carouselBtnDarkStyle: string = '';
  /** CSS class added to the arrow icon inside navigation buttons. */
  export let carouselBtnIconClassName: string = '';
  /** Inline styles applied to the arrow icon inside navigation buttons. */
  export let carouselBtnIconStyle: string = '';
  /** CSS class added to the card slide wrapper element. */
  export let carouselCardClassName: string = '';
  /** Inline styles applied to the card slide wrapper element. */
  export let carouselCardStyle: string = '';

  // Badge CSS
  /** CSS class added to the badge root element. */
  export let badgeClassName: string = '';
  /** Inline styles applied to the badge root element. */
  export let badgeStyle_: string = ''; // avoid conflict with HTML style attr
  /** CSS class added to the badge container. */
  export let badgeContainerClassName: string = '';
  /** Inline styles applied to the badge container. */
  export let badgeContainerStyle: string = '';
  /** CSS class added to the badge container in light theme. */
  export let badgeContainerLightClassName: string = '';
  /** Inline styles applied to the badge container in light theme. */
  export let badgeContainerLightStyle: string = '';
  /** CSS class added to the badge container in dark theme. */
  export let badgeContainerDarkClassName: string = '';
  /** Inline styles applied to the badge container in dark theme. */
  export let badgeContainerDarkStyle: string = '';
  /** CSS class added to the Google icon inside the badge. */
  export let badgeGoogleIconClassName: string = '';
  /** Inline styles applied to the Google icon inside the badge. */
  export let badgeGoogleIconStyle: string = '';
  /** CSS class added to the inner content container (label + rating + stars). */
  export let badgeInnerContainerClassName: string = '';
  /** Inline styles applied to the inner content container. */
  export let badgeInnerContainerStyle: string = '';
  /** CSS class added to the badge heading label. */
  export let badgeLabelClassName: string = '';
  /** Inline styles applied to the badge heading label. */
  export let badgeLabelStyle: string = '';
  /** CSS class added to the badge heading label in light theme. */
  export let badgeLabelLightClassName: string = '';
  /** Inline styles applied to the badge heading label in light theme. */
  export let badgeLabelLightStyle: string = '';
  /** CSS class added to the badge heading label in dark theme. */
  export let badgeLabelDarkClassName: string = '';
  /** Inline styles applied to the badge heading label in dark theme. */
  export let badgeLabelDarkStyle: string = '';
  /** CSS class added to the rating number container. */
  export let badgeRatingContainerClassName: string = '';
  /** Inline styles applied to the rating number container. */
  export let badgeRatingContainerStyle: string = '';
  /** CSS class added to the rating number text element. */
  export let badgeRatingClassName: string = '';
  /** Inline styles applied to the rating number text element. */
  export let badgeRatingStyle: string = '';
  /** CSS class added to the rating number text in light theme. */
  export let badgeRatingLightClassName: string = '';
  /** Inline styles applied to the rating number text in light theme. */
  export let badgeRatingLightStyle: string = '';
  /** CSS class added to the rating number text in dark theme. */
  export let badgeRatingDarkClassName: string = '';
  /** Inline styles applied to the rating number text in dark theme. */
  export let badgeRatingDarkStyle: string = '';
  /** CSS class added to the star rating row. */
  export let badgeStarsClassName: string = '';
  /** Inline styles applied to the star rating row. */
  export let badgeStarsStyle: string = '';
  /** CSS class added to the star icons container. */
  export let badgeStarsContainerClassName: string = '';
  /** Inline styles applied to the star icons container. */
  export let badgeStarsContainerStyle: string = '';
  /** CSS class added to filled (active) star icons. */
  export let badgeStarsFilledClassName: string = '';
  /** Inline styles applied to filled (active) star icons. */
  export let badgeStarsFilledStyle: string = '';
  /** CSS class added to empty (inactive) star icons. */
  export let badgeStarsEmptyClassName: string = '';
  /** Inline styles applied to empty (inactive) star icons. */
  export let badgeStarsEmptyStyle: string = '';
  /** CSS class added to the container wrapping the review-count link. */
  export let badgeLinkContainerClassName: string = '';
  /** Inline styles applied to the container wrapping the review-count link. */
  export let badgeLinkContainerStyle: string = '';
  /** CSS class added to the "Read our N reviews" link. */
  export let badgeLinkClassName: string = '';
  /** Inline styles applied to the "Read our N reviews" link. */
  export let badgeLinkStyle: string = '';
  /** CSS class added to the review-count link in light theme. */
  export let badgeLinkLightClassName: string = '';
  /** Inline styles applied to the review-count link in light theme. */
  export let badgeLinkLightStyle: string = '';
  /** CSS class added to the review-count link in dark theme. */
  export let badgeLinkDarkClassName: string = '';
  /** Inline styles applied to the review-count link in dark theme. */
  export let badgeLinkDarkStyle: string = '';
  /** CSS class added to the inline link variant (rendered without a wrapping block). */
  export let badgeLinkInlineClassName: string = '';
  /** Inline styles applied to the inline link variant. */
  export let badgeLinkInlineStyle: string = '';

  // ReviewCard CSS
  /** CSS class added to the review card root element. */
  export let reviewCardClassName: string = '';
  /** Inline styles applied to the review card root element. */
  export let reviewCardStyle: string = '';
  /** CSS class added to the review card in light theme. */
  export let reviewCardLightClassName: string = '';
  /** Inline styles applied to the review card in light theme. */
  export let reviewCardLightStyle: string = '';
  /** CSS class added to the review card in dark theme. */
  export let reviewCardDarkClassName: string = '';
  /** Inline styles applied to the review card in dark theme. */
  export let reviewCardDarkStyle: string = '';
  /** CSS class added to the review body section when `reviewVariant="card"`. */
  export let reviewBodyCardClassName: string = '';
  /** Inline styles applied to the review body section when `reviewVariant="card"`. */
  export let reviewBodyCardStyle: string = '';
  /** CSS class added to the review body section when `reviewVariant="testimonial"`. */
  export let reviewBodyTestimonialClassName: string = '';
  /** Inline styles applied to the review body section when `reviewVariant="testimonial"`. */
  export let reviewBodyTestimonialStyle: string = '';
  /** CSS class added to the review text element. */
  export let reviewTextClassName: string = '';
  /** Inline styles applied to the review text element. */
  export let reviewTextStyle: string = '';
  /** CSS class added to the review text in light theme. */
  export let reviewTextLightClassName: string = '';
  /** Inline styles applied to the review text in light theme. */
  export let reviewTextLightStyle: string = '';
  /** CSS class added to the review text in dark theme. */
  export let reviewTextDarkClassName: string = '';
  /** Inline styles applied to the review text in dark theme. */
  export let reviewTextDarkStyle: string = '';
  /** CSS class added to the "Read more" / "Read less" toggle button. */
  export let reviewReadMoreClassName: string = '';
  /** Inline styles applied to the "Read more" / "Read less" toggle button. */
  export let reviewReadMoreStyle: string = '';
  /** CSS class added to the read-more button in light theme. */
  export let reviewReadMoreLightClassName: string = '';
  /** Inline styles applied to the read-more button in light theme. */
  export let reviewReadMoreLightStyle: string = '';
  /** CSS class added to the read-more button in dark theme. */
  export let reviewReadMoreDarkClassName: string = '';
  /** Inline styles applied to the read-more button in dark theme. */
  export let reviewReadMoreDarkStyle: string = '';
  /** CSS class added to the card footer row (reviewer info + logo). */
  export let reviewFooterClassName: string = '';
  /** Inline styles applied to the card footer row. */
  export let reviewFooterStyle: string = '';
  /** CSS class added to the reviewer info container. */
  export let reviewerClassName: string = '';
  /** Inline styles applied to the reviewer info container. */
  export let reviewerStyle: string = '';
  /** CSS class added to the reviewer profile section (avatar + name/date column). */
  export let reviewerProfileClassName: string = '';
  /** Inline styles applied to the reviewer profile section. */
  export let reviewerProfileStyle: string = '';
  /** CSS class added to the reviewer profile `<img>` element. */
  export let reviewerProfileImageClassName: string = '';
  /** Inline styles applied to the reviewer profile `<img>` element. */
  export let reviewerProfileImageStyle: string = '';
  /** CSS class added to the fallback avatar shown when no profile photo is available or the image fails to load. */
  export let reviewerProfileFallbackClassName: string = '';
  /** Inline styles applied to the fallback avatar element. */
  export let reviewerProfileFallbackStyle: string = '';
  /** CSS class added to the reviewer name text. */
  export let reviewerNameClassName: string = '';
  /** Inline styles applied to the reviewer name text. */
  export let reviewerNameStyle: string = '';
  /** CSS class added to the reviewer name text in light theme. */
  export let reviewerNameLightClassName: string = '';
  /** Inline styles applied to the reviewer name text in light theme. */
  export let reviewerNameLightStyle: string = '';
  /** CSS class added to the reviewer name text in dark theme. */
  export let reviewerNameDarkClassName: string = '';
  /** Inline styles applied to the reviewer name text in dark theme. */
  export let reviewerNameDarkStyle: string = '';
  /** CSS class added to the review date text. */
  export let reviewerDateClassName: string = '';
  /** Inline styles applied to the review date text. */
  export let reviewerDateStyle: string = '';
  /** CSS class added to the review date text in light theme. */
  export let reviewerDateLightClassName: string = '';
  /** Inline styles applied to the review date text in light theme. */
  export let reviewerDateLightStyle: string = '';
  /** CSS class added to the review date text in dark theme. */
  export let reviewerDateDarkClassName: string = '';
  /** Inline styles applied to the review date text in dark theme. */
  export let reviewerDateDarkStyle: string = '';

  // --- Internal state ---
  let internalReviews: GoogleReview[] = [];
  let loading = true;
  let error = false;
  let fetchedProfileUrl: string | null = null;
  let totalReviewCount: number | null = totalReviewCountOverride ?? null;
  let averageRating: number | null = averageRatingOverride ?? null;

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
  $: if (reviews) {
    internalReviews = reviews.filter(filterReview).map(mapReview);
  }

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

  $: showLoading = (loading && isLoading === undefined) || isLoading === true;

  $: showError =
    error || (layout === 'badge' && (averageRating === null || totalReviewCount === null));

  $: resolvedProfileUrl = fetchedProfileUrl ?? profileUrl ?? null;

  $: structuredDataJson = (() => {
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
  })();
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
      <slot reviews={internalReviews} />
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
