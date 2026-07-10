# Svelte Google Reviews

> **This is a Svelte adaptation of [react-google-reviews](https://github.com/Featurable/react-google-reviews) by [Featurable](https://featurable.com).** The original library is a React component for displaying Google reviews. This package ports it to Svelte 5 with full feature parity, idiomatic Svelte patterns, and no React dependencies.

---

<div align="center">
  <strong>Making adding Google reviews to any Svelte app beautiful, easy, and free!</strong>
</div>

---

**What is it?** A Svelte component to display Google reviews on your website. Uses the Google Places API —or— the free Featurable API to fetch and display reviews.

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

See the [Storybook docs](#storybook) for a full interactive reference.

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

Interactive component docs are published to GitHub Pages via the included workflow.

Run locally:

```sh
npm run storybook
```

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
