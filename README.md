# Svelte Google Reviews

[![CI](https://github.com/ohmybugs/svelte-google-reviews/actions/workflows/ci.yml/badge.svg)](https://github.com/ohmybugs/svelte-google-reviews/actions/workflows/ci.yml)
[![npm version](https://img.shields.io/npm/v/svelte-google-reviews.svg)](https://www.npmjs.com/package/svelte-google-reviews)
[![npm downloads](https://img.shields.io/npm/dm/svelte-google-reviews.svg)](https://www.npmjs.com/package/svelte-google-reviews)
[![bundle size](https://img.shields.io/bundlephobia/minzip/svelte-google-reviews)](https://bundlephobia.com/package/svelte-google-reviews)
[![license](https://img.shields.io/npm/l/svelte-google-reviews.svg)](./LICENSE)

Drop Google Reviews into any Svelte 5 or SvelteKit app. Ships three ready-made layouts (badge, carousel, custom slot), pulls data from either the **free Featurable API** or the **Google Places API**, and works out of the box with SSR.

**📖 [Live docs & interactive examples →](https://ohmybugs.github.io/svelte-google-reviews/)**

## Table of contents

- [Features](#features)
- [Installation](#installation)
- [Quickstart](#usage)
- [SvelteKit + SSR](#sveltekit--ssr)
- [Layouts](#layouts)
- [Props](#props)
- [CSS customization](#css-customization)
- [`GoogleReview` type](#googlereview-type)
- [Troubleshooting](#troubleshooting)
- [Differences from `react-google-reviews`](#differences-from-react-google-reviews)
- [License](#license)

## Features

1. 🛠️ **Customizable**: Three layout options with extensive CSS class/style prop overrides
2. 🔎 **SEO-friendly**: JSON-LD structured data for search engines
3. 💻 **Responsive**: Works on all devices and screen sizes
4. ⚡ **Fast**: Lightweight — no React, no Emotion, no jQuery
5. ✨ **Free**: Use the Featurable API at no cost
6. 🌱 **Fresh**: Auto-updates reviews every 48 hours via the Featurable API
7. ♿️ **Accessible**: WAI-ARIA compliant carousel and interactive elements
8. 🪶 **Lightweight**: Scoped CSS, minimal dependencies (embla-carousel only)

## Installation

```sh
npm install svelte-google-reviews
```

```sh
yarn add svelte-google-reviews
```

```sh
pnpm add svelte-google-reviews
```

## Usage

### Using the Featurable API (recommended)

Prerequisites:

1. Create a free account at [https://featurable.com](https://featurable.com)
2. Create a new Featurable widget
3. Click **Embed > API** and copy the widget ID

```svelte
<script>
  import { SvelteGoogleReviews } from 'svelte-google-reviews';

  // Create a free widget at https://featurable.com
  const featurableWidgetId = '842ncdd8-0f40-438d-9c...'; // use "example" for testing
</script>

<SvelteGoogleReviews layout="carousel" featurableId={featurableWidgetId} />
```

> **Note:** The Featurable API is free and provides caching, automatic updates, and unlimited reviews.

### Using static reviews (Google Places API or manual)

The Google Places API is limited to the 5 most recent reviews. Fetch them server-side and pass them directly:

```svelte
<script>
  import { SvelteGoogleReviews } from 'svelte-google-reviews';
  import type { GoogleReview } from 'svelte-google-reviews';

  // Fetched server-side via Google Places API
  export let reviews: GoogleReview[];
</script>

<SvelteGoogleReviews layout="badge" {reviews} isLoading={false} />
```

> **Note:** Never expose your Google API key client-side. Always fetch reviews server-side (e.g. in a SvelteKit `+page.server.ts` load function).

## SvelteKit + SSR

The component is SSR-safe: it renders a placeholder on the server and hydrates on the client. The carousel (embla) only initializes in the browser, so there is no `window is not defined` risk.

### Fetching from Google Places API (server-side)

Create a `+page.server.ts` next to the page that renders `<SvelteGoogleReviews />`:

```ts
// src/routes/+page.server.ts
import { GOOGLE_PLACES_API_KEY, GOOGLE_PLACE_ID } from '$env/static/private';
import type { PageServerLoad } from './$types';
import type { GoogleReview } from 'svelte-google-reviews';

export const load: PageServerLoad = async ({ fetch }) => {
  const url = `https://places.googleapis.com/v1/places/${GOOGLE_PLACE_ID}?fields=reviews,rating,userRatingCount&key=${GOOGLE_PLACES_API_KEY}`;
  const res = await fetch(url);
  const data = await res.json();

  const reviews: GoogleReview[] = (data.reviews ?? []).map((r: any) => ({
    reviewId: r.name ?? null,
    reviewer: {
      displayName: r.authorAttribution?.displayName ?? 'Anonymous',
      profilePhotoUrl: r.authorAttribution?.photoUri ?? '',
      isAnonymous: false,
    },
    starRating: r.rating,
    comment: r.originalText?.text ?? r.text?.text ?? '',
    createTime: r.publishTime ?? null,
    updateTime: r.publishTime ?? null,
  }));

  return { reviews, averageRating: data.rating, totalReviewCount: data.userRatingCount };
};
```

Then consume it in the page:

```svelte
<!-- src/routes/+page.svelte -->
<script lang="ts">
  import { SvelteGoogleReviews } from 'svelte-google-reviews';
  import type { PageData } from './$types';

  export let data: PageData;
</script>

<SvelteGoogleReviews
  layout="carousel"
  reviews={data.reviews}
  isLoading={false}
  structuredData
  averageRatingOverride={data.averageRating}
  totalReviewCountOverride={data.totalReviewCount}
/>
```

> The `$env/static/private` import ensures your API key never ships to the client. Cache the load with `setHeaders({ 'cache-control': 'public, max-age=3600' })` to avoid hitting the Places quota on every request.

### Non-SvelteKit environments

For Vite / Astro / plain Svelte apps, wrap the component in a client-only boundary if your SSR framework doesn't natively support hydration, and fetch reviews at build time or from your own backend.

## Layouts

### Badge

Displays a compact badge with the average rating, star visualization, and a link to your Google profile.

```svelte
<SvelteGoogleReviews layout="badge" featurableId={featurableWidgetId} />
```

### Carousel

An interactive, autoplay carousel showing individual review cards.

```svelte
<SvelteGoogleReviews layout="carousel" featurableId={featurableWidgetId} />
```

### Custom

Provides full control via a Svelte slot. The `reviews` array is passed as a slot prop.

```svelte
<SvelteGoogleReviews layout="custom" featurableId={featurableWidgetId} let:reviews>
  {#each reviews as review}
    <div>
      <strong>{review.reviewer.displayName}</strong>
      <p>{review.comment}</p>
    </div>
  {/each}
</SvelteGoogleReviews>
```

> **Migration note from React:** The React `renderer` prop is replaced by Svelte's `<slot let:reviews />` pattern.

## Props

### Common Props

| Prop                       | Type                                                        | Default                              | Description                                                   |
| -------------------------- | ----------------------------------------------------------- | ------------------------------------ | ------------------------------------------------------------- |
| `featurableId`             | `string`                                                    | —                                    | Featurable widget ID                                          |
| `reviews`                  | `GoogleReview[]`                                            | —                                    | Static reviews array (mutually exclusive with `featurableId`) |
| `isLoading`                | `boolean`                                                   | —                                    | Controls loading state when passing `reviews` manually        |
| `layout`                   | `"carousel" \| "badge" \| "custom"`                         | `"carousel"`                         | Layout variant                                                |
| `widgetVersion`            | `"v1" \| "v2"`                                              | `"v1"`                               | Featurable API version                                        |
| `apiBaseUrl`               | `string`                                                    | `"https://api.featurable.com"`       | Custom API base URL                                           |
| `nameDisplay`              | `"fullNames" \| "firstAndLastInitials" \| "firstNamesOnly"` | `"firstAndLastInitials"`             | How reviewer names are shown                                  |
| `logoVariant`              | `"icon" \| "full" \| "none"`                                | `"icon"`                             | Google logo style                                             |
| `maxCharacters`            | `number`                                                    | `200`                                | Max characters before "Read more" truncation                  |
| `dateDisplay`              | `"relative" \| "absolute" \| "none"`                        | `"relative"`                         | How review dates are shown                                    |
| `reviewVariant`            | `"card" \| "testimonial"`                                   | `"card"`                             | Card layout variant                                           |
| `theme`                    | `"light" \| "dark"`                                         | `"light"`                            | Color scheme                                                  |
| `hideEmptyReviews`         | `boolean`                                                   | `false`                              | Hide reviews without text                                     |
| `disableTranslation`       | `boolean`                                                   | `false`                              | Use original (untranslated) review text                       |
| `accessibility`            | `boolean`                                                   | `true`                               | Enable ARIA roles and focus management                        |
| `structuredData`           | `boolean`                                                   | `false`                              | Inject JSON-LD structured data for SEO                        |
| `brandName`                | `string`                                                    | page title                           | Brand name for structured data                                |
| `productName`              | `string`                                                    | page title                           | Product name for structured data                              |
| `productDescription`       | `string`                                                    | `""`                                 | Product description for structured data                       |
| `totalReviewCountOverride` | `number`                                                    | —                                    | Required for structured data when passing `reviews` manually  |
| `averageRatingOverride`    | `number`                                                    | —                                    | Required for structured data when passing `reviews` manually  |
| `errorMessage`             | `string`                                                    | `"Failed to load Google reviews..."` | Custom error text                                             |
| `loadingMessage`           | `string`                                                    | `"Loading reviews..."`               | Custom loading text                                           |

### Carousel Props

| Prop               | Type                     | Default              | Description                          |
| ------------------ | ------------------------ | -------------------- | ------------------------------------ |
| `carouselSpeed`    | `number`                 | `3000`               | Autoplay interval in ms              |
| `carouselAutoplay` | `boolean`                | `true`               | Enable autoplay                      |
| `maxItems`         | `number`                 | `3`                  | Max slides visible at once (desktop) |
| `readMoreLabel`    | `string`                 | `"Read more"`        | Expand label for truncated reviews   |
| `readLessLabel`    | `string`                 | `"Read less"`        | Collapse label                       |
| `showDots`         | `boolean`                | `true`               | Show navigation dots                 |
| `getRelativeDate`  | `(date: Date) => string` | built-in             | Custom relative date formatter       |
| `getAbsoluteDate`  | `(date: Date) => string` | `toLocaleDateString` | Custom absolute date formatter       |

### Badge Props

| Prop                       | Type                    | Default                | Description                 |
| -------------------------- | ----------------------- | ---------------------- | --------------------------- |
| `profileUrl`               | `string`                | auto-fetched           | Google Business profile URL |
| `badgeLabel`               | `string`                | `"Google Rating"`      | Badge heading               |
| `badgeSubheadingFormatter` | `(n: number) => string` | `"Read our N reviews"` | Custom subheading           |

### CSS Customization

Every element exposes a `*ClassName` and `*Style` prop for targeted overrides. Style props accept inline style strings (e.g. `"color: red; font-size: 14px"`).

```svelte
<SvelteGoogleReviews
  layout="carousel"
  featurableId="example"
  reviewCardLightClassName="my-card"
  reviewReadMoreLightStyle="color: blue;"
/>
```

See the [live Storybook docs](https://ohmybugs.github.io/svelte-google-reviews/) for a full interactive reference of every prop.

## `GoogleReview` Type

```ts
type GoogleReview = {
  reviewId: string | null;
  reviewer: {
    profilePhotoUrl: string;
    displayName: string;
    isAnonymous: boolean;
  };
  starRating: number; // 1–5
  comment: string;
  createTime: string | null;
  updateTime: string | null;
};
```

## Storybook

Interactive docs are hosted at **[ohmybugs.github.io/svelte-google-reviews](https://ohmybugs.github.io/svelte-google-reviews/)** — every prop, layout, and theme variant has a live example.

Run locally:

```sh
npm run storybook
```

## Troubleshooting

### Reviews render but styles are missing

Unlike the React version, this package uses Svelte's scoped `<style>` blocks — **no CSS import is required**. If styles are missing, check that your bundler processes `.svelte` files from `node_modules` (SvelteKit and `@sveltejs/vite-plugin-svelte` do this by default; custom Vite configs may need `include: ['svelte-google-reviews']` in the Svelte plugin options).

### `window is not defined` during SSR

Shouldn't happen — the carousel initializes in `onMount`. If you see it, you're likely rendering the component _before_ your framework's hydration boundary. In SvelteKit, ensure you're not calling it inside a `+page.server.ts` file.

### Google Places API returns only 5 reviews

That is a hard limit of the Places API. Use the [Featurable API](https://featurable.com) (free, includes caching) if you need all reviews.

### Reviews look stale

- **Featurable API:** refreshes every 48 hours by default.
- **Google Places API:** cache your `+page.server.ts` load with `setHeaders({ 'cache-control': 'public, max-age=3600' })` to avoid rate limits — but don't cache longer than a few hours or new reviews won't appear.

### Hydration mismatch warning in the console

Make sure the `reviews` prop is identical between server and client renders. If you compute anything time-based (e.g. relative dates) at the top level, pass a stable value or override `getRelativeDate` with a deterministic formatter.

### TypeScript can't find `GoogleReview` type

Import types explicitly:

```ts
import type { GoogleReview } from 'svelte-google-reviews';
```

If you see `Cannot find module 'svelte-google-reviews' or its corresponding type declarations`, ensure your `tsconfig.json` uses `"moduleResolution": "bundler"` or `"NodeNext"`.

## Differences from `react-google-reviews`

| Feature               | React                             | Svelte                  |
| --------------------- | --------------------------------- | ----------------------- |
| Custom layout         | `renderer` prop (render function) | `<slot let:reviews />`  |
| Style props           | `React.CSSProperties` object      | inline style `string`   |
| Error/loading content | `React.ReactNode`                 | `string`                |
| Carousel library      | `react-slick`                     | `embla-carousel-svelte` |
| CSS                   | Emotion CSS-in-JS                 | Scoped `<style>` blocks |
| CSS import required   | Yes (`dist/index.css`)            | No                      |

## License

MIT — see [LICENSE](LICENSE). By using the Featurable API you agree to the [Featurable Terms of Service](https://featurable.com/terms).

## Acknowledgements

- [react-google-reviews](https://github.com/Featurable/react-google-reviews) by [Featurable](https://featurable.com) — the original library this is adapted from
- [embla-carousel](https://github.com/davidjerleke/embla-carousel) — carousel engine (MIT)
