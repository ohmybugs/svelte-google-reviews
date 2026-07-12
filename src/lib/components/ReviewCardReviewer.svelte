<script lang="ts">
  import type { GoogleReview, NameDisplay, DateDisplay, Theme } from '../types/review.js';
  import type { ReviewCardCSSProps } from '../types/cssProps.js';
  import { displayName } from '../utils/displayName.js';
  import { getRelativeDate as defaultGetRelativeDate } from '../utils/getRelativeDate.js';

  type ReviewerCSSProps = Pick<
    ReviewCardCSSProps,
    | 'reviewerClassName'
    | 'reviewerStyle'
    | 'reviewerProfileClassName'
    | 'reviewerProfileStyle'
    | 'reviewerProfileImageClassName'
    | 'reviewerProfileImageStyle'
    | 'reviewerProfileFallbackClassName'
    | 'reviewerProfileFallbackStyle'
    | 'reviewerNameClassName'
    | 'reviewerNameStyle'
    | 'reviewerNameLightClassName'
    | 'reviewerNameLightStyle'
    | 'reviewerNameDarkClassName'
    | 'reviewerNameDarkStyle'
    | 'reviewerDateClassName'
    | 'reviewerDateStyle'
    | 'reviewerDateLightClassName'
    | 'reviewerDateLightStyle'
    | 'reviewerDateDarkClassName'
    | 'reviewerDateDarkStyle'
  >;

  interface Props extends ReviewerCSSProps {
    review: GoogleReview;
    nameDisplay?: NameDisplay;
    dateDisplay?: DateDisplay;
    theme?: Theme;
    getAbsoluteDate?: (date: Date) => string;
    getRelativeDate?: (date: Date) => string;
    imageLoading?: 'lazy' | 'eager';
  }

  let {
    review,
    nameDisplay = 'firstAndLastInitials',
    dateDisplay = 'relative',
    theme = 'light',
    getAbsoluteDate = (date) =>
      date.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }),
    getRelativeDate = defaultGetRelativeDate,
    imageLoading = 'lazy',
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

  let fallback = $state(review.reviewer.isAnonymous || !review.reviewer.profilePhotoUrl);

  // Reset fallback when `review` changes, since components can be reused
  // across different reviews (e.g. Carousel keys slides by index).
  $effect(() => {
    fallback = review.reviewer.isAnonymous || !review.reviewer.profilePhotoUrl;
  });

  function getFallbackBgColor(char: string): string {
    switch (char) {
      case 'a':
        return '#660091';
      case 'b':
        return '#4B53B2';
      case 'c':
        return '#B1004A';
      case 'd':
        return '#972BB0';
      case 'e':
        return '#0F72C8';
      case 'f':
        return '#094389';
      case 'g':
        return '#118797';
      case 'h':
        return '#0F7868';
      case 'i':
        return '#073D30';
      case 'j':
        return '#57922C';
      case 'k':
        return '#E42567';
      case 'l':
        return '#364852';
      case 'm':
        return '#295817';
      case 'n':
        return '#795B50';
      case 'o':
        return '#4A322B';
      case 'p':
        return '#693EB4';
      case 'q':
        return '#3E1796';
      case 'r':
        return '#E95605';
      case 's':
        return '#F03918';
      case 't':
        return '#AE230D';
      case 'u':
      case 'v':
        return '#647F8C';
      case 'w':
      case 'x':
      case 'y':
      case 'z':
      default:
        return '#6b7280';
    }
  }

  let dateStr = $derived.by(() => {
    if (dateDisplay === 'none') return '';
    const time = review.updateTime ?? review.createTime ?? '';
    const date = new Date(time);
    return dateDisplay === 'absolute' ? getAbsoluteDate(date) : getRelativeDate(date);
  });

  let nameStr = $derived(
    review.reviewer.isAnonymous
      ? 'Anonymous'
      : displayName(review.reviewer.displayName, nameDisplay)
  );

  let fallbackBg = $derived(
    getFallbackBgColor(
      review.reviewer.isAnonymous ? 'a' : review.reviewer.displayName[0].toLowerCase()
    )
  );

  let fallbackChar = $derived(
    review.reviewer.isAnonymous ? 'A' : review.reviewer.displayName[0].toUpperCase()
  );

  // Rewrite Google avatar URLs to request a 96px source (2× the 40px CSS box,
  // covering hi-DPI displays without paying for the ~250px default). The size
  // hint lives in the pathname (e.g. `/a/ACg...=s120-c`), so we manipulate the
  // path via the URL API to stay safe against query strings and fragments.
  // Non-Google or unparseable URLs pass through unchanged.
  let profileSrc = $derived.by((): string => {
    const url = review.reviewer.profilePhotoUrl;
    if (!url) return '';
    if (!/googleusercontent\.com|ggpht\.com/.test(url)) return url;
    try {
      const u = new URL(url);
      u.pathname = u.pathname.replace(/=s\d+(-c)?$/, '') + '=s96-c';
      return u.toString();
    } catch {
      return url;
    }
  });
</script>

<div class="reviewer {reviewerClassName}" style={reviewerStyle}>
  <div class="reviewer-profile {reviewerProfileClassName}" style={reviewerProfileStyle}>
    {#if !review.reviewer.isAnonymous && review.reviewer.profilePhotoUrl && !fallback}
      <img
        src={profileSrc}
        onerror={() => {
          fallback = true;
        }}
        class="reviewer-profile-image {reviewerProfileImageClassName}"
        style={reviewerProfileImageStyle}
        alt={review.reviewer.displayName}
        loading={imageLoading}
        decoding="async"
        width="40"
        height="40"
      />
    {/if}

    {#if fallback}
      <div
        class="reviewer-profile-fallback {reviewerProfileFallbackClassName}"
        style="background-color: {fallbackBg}; {reviewerProfileFallbackStyle}"
      >
        {fallbackChar}
      </div>
    {/if}
  </div>

  <div>
    <p
      class="reviewer-name {theme === 'light'
        ? 'reviewer-name-light'
        : 'reviewer-name-dark'} {reviewerNameClassName} {theme === 'light'
        ? reviewerNameLightClassName
        : reviewerNameDarkClassName}"
      style="{reviewerNameStyle}; {theme === 'light'
        ? reviewerNameLightStyle
        : reviewerNameDarkStyle}"
    >
      {nameStr}
    </p>

    {#if dateDisplay !== 'none' && (review.updateTime || review.createTime)}
      <p
        class="reviewer-date {theme === 'light'
          ? 'reviewer-date-light'
          : 'reviewer-date-dark'} {reviewerDateClassName} {theme === 'light'
          ? reviewerDateLightClassName
          : reviewerDateDarkClassName}"
        style="{reviewerDateStyle}; {theme === 'light'
          ? reviewerDateLightStyle
          : reviewerDateDarkStyle}"
      >
        {dateStr}
      </p>
    {/if}
  </div>
</div>

<style>
  .reviewer {
    display: flex;
    align-items: center;
  }

  .reviewer-profile {
    position: relative;
    border-radius: 100%;
    width: 40px;
    height: 40px;
    margin-right: 12px;
    flex-shrink: 0;
  }

  .reviewer-profile-image {
    border-radius: 100%;
    width: 100%;
    height: 100%;
  }

  .reviewer-profile-fallback {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 500;
    color: white;
    border-radius: 100%;
    font-size: 20px;
  }

  .reviewer-name {
    font-weight: 600;
    font-size: 16px;
    margin: 0;
  }

  .reviewer-name-light {
    color: #030712;
  }

  .reviewer-name-dark {
    color: #ffffff;
  }

  .reviewer-date {
    font-size: 16px;
    margin: 0;
  }

  .reviewer-date-light {
    color: #6b7280;
  }

  .reviewer-date-dark {
    color: #9ca3af;
  }
</style>
