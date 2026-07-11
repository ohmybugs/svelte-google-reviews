<script lang="ts">
  import type { Theme } from '../types/review.js';
  import GoogleIcon from './GoogleIcon.svelte';

  /** Average star rating value between 0 and 5 to display in the badge. */
  export let averageRating: number;
  /** Total number of reviews, shown in the subheading below the stars. */
  export let totalReviewCount: number;
  /** URL of the Google Business Profile page. When provided, the subheading becomes a clickable link. `null` renders plain text instead. */
  export let profileUrl: string | null = null;
  /** Colour scheme applied to text and backgrounds. Use `light` on light-coloured pages and `dark` on dark-coloured pages. */
  export let theme: Theme = 'light';
  /** Heading text displayed inside the badge (e.g. "Google Rating"). */
  export let badgeLabel: string = 'Google Rating';
  /** Formats the subheading string. Receives the review count and returns a display string. */
  export let badgeSubheadingFormatter: (n: number) => string = (n) => `Read our ${n} reviews`;

  /** CSS class added to the badge root element. */
  export let badgeClassName: string = '';
  /** Inline styles applied to the badge root element. */
  export let badgeStyle: string = '';
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

  $: percentageFill = (averageRating / 5) * 100;
</script>

<div class="badge {badgeClassName}" style={badgeStyle}>
  <div
    class="badge-container {theme === 'light'
      ? 'badge-container-light'
      : 'badge-container-dark'} {badgeContainerClassName} {theme === 'light'
      ? badgeContainerLightClassName
      : badgeContainerDarkClassName}"
    style="{badgeContainerStyle}; {theme === 'light'
      ? badgeContainerLightStyle
      : badgeContainerDarkStyle}"
  >
    <GoogleIcon
      className="badge-google-icon {badgeGoogleIconClassName}"
      style={badgeGoogleIconStyle}
    />
    <div
      class="badge-inner-container {badgeInnerContainerClassName}"
      style={badgeInnerContainerStyle}
    >
      <span
        class="badge-label {theme === 'light'
          ? 'badge-label-light'
          : 'badge-label-dark'} {badgeLabelClassName} {theme === 'light'
          ? badgeLabelLightClassName
          : badgeLabelDarkClassName}"
        style="{badgeLabelStyle}; {theme === 'light' ? badgeLabelLightStyle : badgeLabelDarkStyle}"
      >
        {badgeLabel}
      </span>

      <div
        class="badge-rating-container {badgeRatingContainerClassName}"
        style={badgeRatingContainerStyle}
      >
        <span
          class="badge-rating {theme === 'light'
            ? 'badge-rating-light'
            : 'badge-rating-dark'} {badgeRatingClassName} {theme === 'light'
            ? badgeRatingLightClassName
            : badgeRatingDarkClassName}"
          style="{badgeRatingStyle}; {theme === 'light'
            ? badgeRatingLightStyle
            : badgeRatingDarkStyle}"
        >
          {averageRating.toFixed(1)}
        </span>

        <div class="badge-stars {badgeStarsClassName}" style={badgeStarsStyle} aria-hidden="true">
          <div
            class="badge-stars-container {badgeStarsContainerClassName}"
            style={badgeStarsContainerStyle}
          >
            <div
              class="badge-stars-filled {badgeStarsFilledClassName}"
              style="width: {percentageFill}%; {badgeStarsFilledStyle}"
            >
              <span>★★★★★</span>
            </div>
            <div class="badge-stars-empty {badgeStarsEmptyClassName}" style={badgeStarsEmptyStyle}>
              <span>★★★★★</span>
            </div>
          </div>
        </div>
      </div>

      <div
        class="badge-link-container {badgeLinkContainerClassName}"
        style={badgeLinkContainerStyle}
      >
        {#if profileUrl}
          <a
            target="_blank"
            rel="nofollow noopener noreferrer"
            href={profileUrl}
            class="badge-link badge-link-inline {theme === 'light'
              ? 'badge-link-light'
              : 'badge-link-dark'} {badgeLinkClassName} {theme === 'light'
              ? badgeLinkLightClassName
              : badgeLinkDarkClassName} {badgeLinkInlineClassName}"
            style="{badgeLinkStyle}; {theme === 'light'
              ? badgeLinkLightStyle
              : badgeLinkDarkStyle}; {badgeLinkInlineStyle}"
          >
            {badgeSubheadingFormatter(totalReviewCount)}
          </a>
        {:else}
          <span
            class="badge-link badge-link-inline {theme === 'light'
              ? 'badge-link-light'
              : 'badge-link-dark'} {badgeLinkClassName} {theme === 'light'
              ? badgeLinkLightClassName
              : badgeLinkDarkClassName} {badgeLinkInlineClassName}"
            style="{badgeLinkStyle}; {badgeLinkInlineStyle}; {theme === 'light'
              ? badgeLinkLightStyle
              : badgeLinkDarkStyle}"
          >
            {badgeSubheadingFormatter(totalReviewCount)}
          </span>
        {/if}
      </div>
    </div>
  </div>
</div>

<style>
  .badge {
    text-align: center;
    width: 100%;
  }

  .badge-container {
    text-align: left;
    display: inline-flex;
    align-items: center;
    border-top: 4px solid #10b981;
    border-radius: 6px;
    padding: 12px 16px;
    margin: 0 auto;
    box-shadow:
      0 1px 3px 0 rgb(0 0 0 / 0.1),
      0 1px 2px -1px rgb(0 0 0 / 0.1);
  }

  .badge-container-light {
    background: white;
  }

  .badge-container-dark {
    background: #111827;
  }

  :global(.badge-google-icon) {
    height: 42px;
    width: 42px;
  }

  .badge-inner-container {
    padding-left: 1rem;
    line-height: normal;
  }

  .badge-label {
    font-size: 1rem;
    font-weight: 500;
    line-height: 1;
  }

  .badge-label-light {
    color: #111827;
  }

  .badge-label-dark {
    color: #f9fafb;
  }

  .badge-rating-container {
    display: flex;
    align-items: center;
    margin-top: 6px;
  }

  .badge-rating {
    font-size: 16px;
    font-weight: 600;
    display: inline-block;
  }

  .badge-rating-light {
    color: #d97706;
  }

  .badge-rating-dark {
    color: #f59e0b;
  }

  .badge-stars {
    margin-left: 4px;
  }

  .badge-stars-container {
    position: relative;
    font-size: 20px;
    line-height: 1;
    padding: 0;
    margin: 0;
  }

  .badge-stars-filled {
    display: flex;
    align-items: center;
    position: absolute;
    left: 0;
    top: 0;
    overflow: hidden;
    color: #f8af0d;
  }

  .badge-stars-empty {
    display: flex;
    align-items: center;
    color: #d1d5db;
  }

  .badge-link-container {
    font-size: 12px;
    margin-top: 8px;
  }

  .badge-link:hover {
    text-decoration: underline;
  }

  .badge-link-light {
    color: #6b7280;
  }

  .badge-link-dark {
    color: #9ca3af;
  }

  .badge-link-inline {
    display: inline-block;
  }
</style>
