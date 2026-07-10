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
    import type { CarouselCSSProps, BadgeCSSProps, ReviewCardCSSProps, ErrorStateCSSProps, LoadingStateCSSProps } from '../types/cssProps';
    import { isV2Response, transformV2ResponseToV1 } from '../utils/apiTransformers';
    import Badge from './Badge.svelte';
    import Carousel from './Carousel.svelte';
    import ErrorState from './ErrorState.svelte';
    import LoadingState from './LoadingState.svelte';

    // --- Data source (mutually exclusive) ---
    export let featurableId: string | undefined = undefined;
    export let reviews: GoogleReview[] | undefined = undefined;
    export let isLoading: boolean | undefined = undefined;
    export let widgetVersion: WidgetVersion = 'v1';
    export let apiBaseUrl: string = 'https://api.featurable.com';

    // --- Layout ---
    export let layout: 'carousel' | 'badge' | 'custom' = 'carousel';

    // --- Display options ---
    export let nameDisplay: NameDisplay = 'firstAndLastInitials';
    export let logoVariant: LogoVariant = 'icon';
    export let maxCharacters: number = 200;
    export let dateDisplay: DateDisplay = 'relative';
    export let reviewVariant: ReviewVariant = 'card';
    export let theme: Theme = 'light';
    export let hideEmptyReviews: boolean = false;
    export let disableTranslation: boolean = false;
    export let accessibility: boolean = true;

    // --- Carousel-specific ---
    export let carouselSpeed: number = 3000;
    export let carouselAutoplay: boolean = true;
    export let maxItems: number = 3;
    export let readMoreLabel: string = 'Read more';
    export let readLessLabel: string = 'Read less';
    export let showDots: boolean = true;
    export let getRelativeDate: ((date: Date) => string) | undefined = undefined;
    export let getAbsoluteDate: ((date: Date) => string) | undefined = undefined;

    // --- Badge-specific ---
    export let profileUrl: string | undefined = undefined;
    export let badgeLabel: string = 'Google Rating';
    export let badgeSubheadingFormatter: ((n: number) => string) | undefined = undefined;

    // --- Structured data ---
    export let structuredData: boolean = false;
    export let brandName: string | undefined = undefined;
    export let productName: string | undefined = undefined;
    export let productDescription: string = '';
    export let totalReviewCountOverride: number | undefined = undefined;
    export let averageRatingOverride: number | undefined = undefined;

    // --- Error/Loading messages ---
    export let errorMessage: string = 'Failed to load Google reviews. Please try again later.';
    export let loadingMessage: string = 'Loading reviews...';

    // --- CSS Props ---
    export let errorClassName: string = '';
    export let errorStyle: string = '';
    export let loaderClassName: string = '';
    export let loaderStyle: string = '';
    export let loaderSpinnerClassName: string = '';
    export let loaderSpinnerStyle: string = '';
    export let loaderLabelClassName: string = '';
    export let loaderLabelStyle: string = '';

    // Carousel CSS
    export let carouselClassName: string = '';
    export let carouselStyle: string = '';
    export let carouselBtnClassName: string = '';
    export let carouselBtnStyle: string = '';
    export let carouselBtnLeftClassName: string = '';
    export let carouselBtnLeftStyle: string = '';
    export let carouselBtnRightClassName: string = '';
    export let carouselBtnRightStyle: string = '';
    export let carouselBtnLightClassName: string = '';
    export let carouselBtnLightStyle: string = '';
    export let carouselBtnDarkClassName: string = '';
    export let carouselBtnDarkStyle: string = '';
    export let carouselBtnIconClassName: string = '';
    export let carouselBtnIconStyle: string = '';
    export let carouselCardClassName: string = '';
    export let carouselCardStyle: string = '';

    // Badge CSS
    export let badgeClassName: string = '';
    export let badgeStyle_: string = '';  // avoid conflict with HTML style attr
    export let badgeContainerClassName: string = '';
    export let badgeContainerStyle: string = '';
    export let badgeContainerLightClassName: string = '';
    export let badgeContainerLightStyle: string = '';
    export let badgeContainerDarkClassName: string = '';
    export let badgeContainerDarkStyle: string = '';
    export let badgeGoogleIconClassName: string = '';
    export let badgeGoogleIconStyle: string = '';
    export let badgeInnerContainerClassName: string = '';
    export let badgeInnerContainerStyle: string = '';
    export let badgeLabelClassName: string = '';
    export let badgeLabelStyle: string = '';
    export let badgeLabelLightClassName: string = '';
    export let badgeLabelLightStyle: string = '';
    export let badgeLabelDarkClassName: string = '';
    export let badgeLabelDarkStyle: string = '';
    export let badgeRatingContainerClassName: string = '';
    export let badgeRatingContainerStyle: string = '';
    export let badgeRatingClassName: string = '';
    export let badgeRatingStyle: string = '';
    export let badgeRatingLightClassName: string = '';
    export let badgeRatingLightStyle: string = '';
    export let badgeRatingDarkClassName: string = '';
    export let badgeRatingDarkStyle: string = '';
    export let badgeStarsClassName: string = '';
    export let badgeStarsStyle: string = '';
    export let badgeStarsContainerClassName: string = '';
    export let badgeStarsContainerStyle: string = '';
    export let badgeStarsFilledClassName: string = '';
    export let badgeStarsFilledStyle: string = '';
    export let badgeStarsEmptyClassName: string = '';
    export let badgeStarsEmptyStyle: string = '';
    export let badgeLinkContainerClassName: string = '';
    export let badgeLinkContainerStyle: string = '';
    export let badgeLinkClassName: string = '';
    export let badgeLinkStyle: string = '';
    export let badgeLinkLightClassName: string = '';
    export let badgeLinkLightStyle: string = '';
    export let badgeLinkDarkClassName: string = '';
    export let badgeLinkDarkStyle: string = '';
    export let badgeLinkInlineClassName: string = '';
    export let badgeLinkInlineStyle: string = '';

    // ReviewCard CSS
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
        error ||
        (layout === 'badge' && (averageRating === null || totalReviewCount === null));

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
            .map((r) => JSON.stringify({
                '@type': 'Review',
                reviewBody: r.comment,
                datePublished: r.createTime,
                author: { '@type': 'Person', name: r.reviewer.displayName },
                reviewRating: { '@type': 'Rating', ratingValue: r.starRating },
            }));

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
    <ErrorState
        {errorMessage}
        {errorClassName}
        {errorStyle}
    />
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
                badgeSubheadingFormatter={badgeSubheadingFormatter}
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
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif,
            'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol';
    }
</style>
