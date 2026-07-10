<script lang="ts">
    import type { Theme } from '../types/review';
    import GoogleIcon from './GoogleIcon.svelte';

    export let averageRating: number;
    export let totalReviewCount: number;
    export let profileUrl: string | null = null;
    export let theme: Theme = 'light';
    export let badgeLabel: string = 'Google Rating';
    export let badgeSubheadingFormatter: (n: number) => string = (n) => `Read our ${n} reviews`;

    export let badgeClassName: string = '';
    export let badgeStyle: string = '';
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

    $: percentageFill = (averageRating / 5) * 100;
</script>

<div class="badge {badgeClassName}" style={badgeStyle}>
    <div
        class="badge-container {theme === 'light' ? 'badge-container-light' : 'badge-container-dark'} {badgeContainerClassName} {theme === 'light' ? badgeContainerLightClassName : badgeContainerDarkClassName}"
        style="{badgeContainerStyle}; {theme === 'light' ? badgeContainerLightStyle : badgeContainerDarkStyle}"
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
                class="badge-label {theme === 'light' ? 'badge-label-light' : 'badge-label-dark'} {badgeLabelClassName} {theme === 'light' ? badgeLabelLightClassName : badgeLabelDarkClassName}"
                style="{badgeLabelStyle}; {theme === 'light' ? badgeLabelLightStyle : badgeLabelDarkStyle}"
            >
                {badgeLabel}
            </span>

            <div
                class="badge-rating-container {badgeRatingContainerClassName}"
                style={badgeRatingContainerStyle}
            >
                <span
                    class="badge-rating {theme === 'light' ? 'badge-rating-light' : 'badge-rating-dark'} {badgeRatingClassName} {theme === 'light' ? badgeRatingLightClassName : badgeRatingDarkClassName}"
                    style="{badgeRatingStyle}; {theme === 'light' ? badgeRatingLightStyle : badgeRatingDarkStyle}"
                >
                    {averageRating.toFixed(1)}
                </span>

                <div
                    class="badge-stars {badgeStarsClassName}"
                    style={badgeStarsStyle}
                    aria-hidden="true"
                >
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
                        <div
                            class="badge-stars-empty {badgeStarsEmptyClassName}"
                            style={badgeStarsEmptyStyle}
                        >
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
                        class="badge-link badge-link-inline {theme === 'light' ? 'badge-link-light' : 'badge-link-dark'} {badgeLinkClassName} {theme === 'light' ? badgeLinkLightClassName : badgeLinkDarkClassName} {badgeLinkInlineClassName}"
                        style="{badgeLinkStyle}; {theme === 'light' ? badgeLinkLightStyle : badgeLinkDarkStyle}; {badgeLinkInlineStyle}"
                    >
                        {badgeSubheadingFormatter(totalReviewCount)}
                    </a>
                {:else}
                    <span
                        class="badge-link badge-link-inline {theme === 'light' ? 'badge-link-light' : 'badge-link-dark'} {badgeLinkClassName} {theme === 'light' ? badgeLinkLightClassName : badgeLinkDarkClassName} {badgeLinkInlineClassName}"
                        style="{badgeLinkStyle}; {badgeLinkInlineStyle}; {theme === 'light' ? badgeLinkLightStyle : badgeLinkDarkStyle}"
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
        box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
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
