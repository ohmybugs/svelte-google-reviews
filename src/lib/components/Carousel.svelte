<script lang="ts">
  import emblaCarouselSvelte from 'embla-carousel-svelte';
  import Autoplay from 'embla-carousel-autoplay';
  import type { EmblaCarouselType } from 'embla-carousel';
  import type {
    GoogleReview,
    NameDisplay,
    LogoVariant,
    DateDisplay,
    ReviewVariant,
    Theme,
  } from '../types/review.js';
  import type { CarouselCSSProps, ReviewCardCSSProps } from '../types/cssProps.js';
  import ReviewCard from './ReviewCard.svelte';

  interface Props extends CarouselCSSProps, ReviewCardCSSProps {
    reviews: GoogleReview[];
    maxCharacters?: number;
    nameDisplay?: NameDisplay;
    logoVariant?: LogoVariant;
    dateDisplay?: DateDisplay;
    reviewVariant?: ReviewVariant;
    carouselAutoplay?: boolean;
    carouselSpeed?: number;
    maxItems?: number;
    theme?: Theme;
    accessibility?: boolean;
    readMoreLabel?: string;
    readLessLabel?: string;
    getAbsoluteDate?: (date: Date) => string;
    getRelativeDate?: (date: Date) => string;
    showDots?: boolean;
    imageLoading?: 'lazy' | 'eager';
  }

  let {
    reviews,
    maxCharacters = 200,
    nameDisplay = 'firstAndLastInitials',
    logoVariant = 'icon',
    dateDisplay = 'relative',
    reviewVariant = 'card',
    carouselAutoplay = true,
    carouselSpeed = 3000,
    maxItems = 3,
    theme = 'light',
    accessibility = true,
    readMoreLabel = 'Read more',
    readLessLabel = 'Read less',
    getAbsoluteDate = undefined,
    getRelativeDate = undefined,
    showDots = true,
    imageLoading = 'lazy',
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

  let emblaApi: EmblaCarouselType | undefined = $state(undefined);
  let selectedIndex = $state(0);
  let scrollSnaps: number[] = $state([]);

  function extendArray<T>(array: T[], targetLength: number): T[] {
    if (array.length === 0) return [];
    const result: T[] = [...array];
    while (result.length < targetLength) {
      const remaining = targetLength - result.length;
      const itemsToCopy = Math.min(result.length, remaining);
      result.push(...result.slice(0, itemsToCopy));
    }
    return result;
  }

  let displayReviews = $derived(
    reviews.length < maxItems ? extendArray(reviews, maxItems) : reviews
  );

  let plugins = $derived(
    carouselAutoplay ? [Autoplay({ delay: carouselSpeed, stopOnInteraction: false })] : []
  );

  let options = $derived({
    loop: true,
    align: 'start' as const,
  });

  function onInit(event: CustomEvent<EmblaCarouselType>) {
    emblaApi = event.detail;
    scrollSnaps = emblaApi.scrollSnapList();
    emblaApi.on('select', () => {
      selectedIndex = emblaApi!.selectedScrollSnap();
    });
  }

  function prev() {
    emblaApi?.scrollPrev();
  }
  function next() {
    emblaApi?.scrollNext();
  }

  let btnThemeClass = $derived(theme === 'light' ? 'carousel-btn-light' : 'carousel-btn-dark');
  let btnThemeClassName = $derived(
    theme === 'light' ? carouselBtnLightClassName : carouselBtnDarkClassName
  );
  let btnThemeStyle = $derived(theme === 'light' ? carouselBtnLightStyle : carouselBtnDarkStyle);
</script>

<div
  class="carousel {carouselClassName}"
  style={carouselStyle}
  role="region"
  aria-label="Customer Reviews Carousel"
>
  <button
    onclick={prev}
    class="carousel-btn carousel-btn-left {btnThemeClass} {carouselBtnClassName} {carouselBtnLeftClassName} {btnThemeClassName}"
    style="{carouselBtnStyle}; {carouselBtnLeftStyle}; {btnThemeStyle}"
    aria-label="Previous Review"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke-width="1.5"
      stroke="currentColor"
      class="carousel-btn-icon {carouselBtnIconClassName}"
      style={carouselBtnIconStyle}
    >
      <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
    </svg>
  </button>

  <button
    onclick={next}
    class="carousel-btn carousel-btn-right {btnThemeClass} {carouselBtnClassName} {carouselBtnRightClassName} {btnThemeClassName}"
    style="{carouselBtnStyle}; {carouselBtnRightStyle}; {btnThemeStyle}"
    aria-label="Next Review"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke-width="1.5"
      stroke="currentColor"
      class="carousel-btn-icon {carouselBtnIconClassName}"
      style={carouselBtnIconStyle}
    >
      <path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
    </svg>
  </button>

  {#key `${carouselAutoplay}-${carouselSpeed}`}
    <div use:emblaCarouselSvelte={{ options, plugins }} onemblaInit={onInit} class="embla">
      <div class="embla__container">
        {#each displayReviews as review, index (index)}
          <div
            class="embla__slide carousel-card {carouselCardClassName}"
            style={carouselCardStyle}
            role={accessibility ? 'group' : undefined}
            aria-label="Review {index + 1}"
          >
            <ReviewCard
              {review}
              {maxCharacters}
              {nameDisplay}
              {logoVariant}
              {dateDisplay}
              {reviewVariant}
              {theme}
              {readMoreLabel}
              {readLessLabel}
              {getRelativeDate}
              {getAbsoluteDate}
              {imageLoading}
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
          </div>
        {/each}
      </div>
    </div>
  {/key}

  {#if showDots && scrollSnaps.length > 1}
    <div class="carousel-dots" aria-hidden="true">
      {#each scrollSnaps as _, i}
        <button
          class="carousel-dot"
          class:carousel-dot-active={i === selectedIndex}
          onclick={() => emblaApi?.scrollTo(i)}
          aria-label="Go to review {i + 1}"
        ></button>
      {/each}
    </div>
  {/if}
</div>

<style>
  .carousel {
    max-width: 1280px;
    margin: 0 auto;
    padding: 0 40px 32px;
    position: relative;
  }

  .embla {
    overflow: hidden;
  }

  .embla__container {
    display: flex;
  }

  .embla__slide {
    flex: 0 0 calc(100% / 3);
    min-width: 0;
    padding: 8px;
    box-sizing: border-box;
  }

  @media (max-width: 768px) {
    .embla__slide {
      flex: 0 0 50%;
    }
  }

  @media (max-width: 640px) {
    .embla__slide {
      flex: 0 0 100%;
    }
  }

  .carousel-btn {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    height: 40px;
    width: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 100%;
    transition: all 0.2s;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    cursor: pointer;
    z-index: 1;
  }

  .carousel-btn:hover {
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  }

  .carousel-btn-left {
    left: 0;
  }

  .carousel-btn-right {
    right: 0;
  }

  .carousel-btn-light {
    background: white;
    color: hsl(0, 0%, 20%);
    border: 1px solid hsl(0, 0%, 80%);
  }

  .carousel-btn-light:hover {
    background: hsl(0, 0%, 95%);
    border: 1px solid hsl(0, 0%, 80%);
  }

  .carousel-btn-dark {
    background: #111827;
    color: #d1d5db;
    border: 1px solid #374151;
  }

  .carousel-btn-dark:hover {
    background: #0b0f19;
    border: 1px solid #272e3a;
  }

  .carousel-btn-icon {
    width: 24px;
    height: 24px;
  }

  .carousel-dots {
    display: flex;
    justify-content: center;
    gap: 6px;
    margin-top: 16px;
  }

  .carousel-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #d1d5db;
    border: none;
    cursor: pointer;
    padding: 0;
    transition: background 0.2s;
  }

  .carousel-dot-active {
    background: #6b7280;
  }
</style>
