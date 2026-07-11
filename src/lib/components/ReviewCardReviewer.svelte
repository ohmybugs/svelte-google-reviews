<script lang="ts">
  import type { GoogleReview, NameDisplay, DateDisplay, Theme } from '../types/review.js';
  import { displayName } from '../utils/displayName.js';
  import { getRelativeDate as defaultGetRelativeDate } from '../utils/getRelativeDate.js';

  export let review: GoogleReview;
  export let nameDisplay: NameDisplay = 'firstAndLastInitials';
  export let dateDisplay: DateDisplay = 'relative';
  export let theme: Theme = 'light';
  export let getAbsoluteDate: (date: Date) => string = (date) =>
    date.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
  export let getRelativeDate: (date: Date) => string = defaultGetRelativeDate;
  export let imageLoading: 'lazy' | 'eager' = 'lazy';

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

  let fallback = review.reviewer.isAnonymous || !review.reviewer.profilePhotoUrl;

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

  $: dateStr = (() => {
    if (dateDisplay === 'none') return '';
    const time = review.updateTime ?? review.createTime ?? '';
    const date = new Date(time);
    return dateDisplay === 'absolute' ? getAbsoluteDate(date) : getRelativeDate(date);
  })();

  $: nameStr = review.reviewer.isAnonymous
    ? 'Anonymous'
    : displayName(review.reviewer.displayName, nameDisplay);

  $: fallbackBg = getFallbackBgColor(
    review.reviewer.isAnonymous ? 'a' : review.reviewer.displayName[0].toLowerCase()
  );

  $: fallbackChar = review.reviewer.isAnonymous
    ? 'A'
    : review.reviewer.displayName[0].toUpperCase();

  // Rewrite Google avatar URLs to request a 96px source (2× the 40px CSS box,
  // covering hi-DPI displays without paying for the ~250px default). The size
  // hint lives in the pathname (e.g. `/a/ACg...=s120-c`), so we manipulate the
  // path via the URL API to stay safe against query strings and fragments.
  // Non-Google or unparseable URLs pass through unchanged.
  $: profileSrc = ((): string => {
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
  })();
</script>

<div class="reviewer {reviewerClassName}" style={reviewerStyle}>
  <div class="reviewer-profile {reviewerProfileClassName}" style={reviewerProfileStyle}>
    {#if !review.reviewer.isAnonymous && review.reviewer.profilePhotoUrl && !fallback}
      <img
        src={profileSrc}
        on:error={() => {
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
