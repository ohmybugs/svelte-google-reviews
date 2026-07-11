import type { Meta, StoryObj } from '@storybook/svelte';
import SvelteGoogleReviews from '../lib/components/SvelteGoogleReviews.svelte';
import CustomSlotExample from './CustomSlotExample.svelte';
import { sampleReviews } from './sampleReviews';
import { transformV2ResponseToV1 } from '../lib/utils/apiTransformers';
import type { FeaturableAPIResponseV2, GoogleReviewV2 } from '../lib/types/review';

const sampleV2Reviews: GoogleReviewV2[] = [
  {
    id: 'v2-1',
    platform: 'google',
    text: 'Outstanding service, highly recommend!',
    createdAt: '2024-06-01T10:00:00Z',
    publishedAt: '2024-06-01T10:00:00Z',
    author: { name: 'Alice Martin', photoUrl: '' },
    rating: { value: 5, max: 5 },
  },
  {
    id: 'v2-2',
    platform: 'google',
    text: 'Very good experience overall.',
    createdAt: '2024-05-15T09:00:00Z',
    publishedAt: '2024-05-15T09:00:00Z',
    author: { name: 'Bob Chen' },
    rating: { value: 4, max: 5 },
  },
];

const sampleV2Response: FeaturableAPIResponseV2 = {
  success: true,
  widget: {
    gbpLocationSummary: {
      reviewsCount: 2,
      rating: 4.5,
      writeAReviewUri: 'https://g.page/r/example/review',
    },
    reviews: sampleV2Reviews,
  },
};

const v2Result = transformV2ResponseToV1(sampleV2Response);
const sampleV2Converted = v2Result.success ? v2Result.reviews : [];

const meta: Meta<typeof SvelteGoogleReviews> = {
  title: 'Components/SvelteGoogleReviews',
  component: SvelteGoogleReviews,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
**SvelteGoogleReviews** fetches and displays Google reviews. Choose a \`layout\` to control how reviews are rendered:

| Layout | Description |
|--------|-------------|
| \`carousel\` | Built-in swipeable carousel with navigation buttons |
| \`badge\` | Compact summary badge showing average rating and review count |
| \`custom\` | **Bring your own UI** — reviews are passed as a slot prop so you can render them however you like |

### Using the \`custom\` layout

Set \`layout="custom"\` and use Svelte's \`let:reviews\` directive to receive the processed reviews array inside your own markup:

\`\`\`svelte
<SvelteGoogleReviews reviews={myReviews} layout="custom" let:reviews>
  <!-- reviews is GoogleReview[] — render anything you want -->
  {#each reviews as review}
    <div class="my-card">
      <p>{review.comment}</p>
      <span>{review.reviewer.displayName}</span>
    </div>
  {/each}
</SvelteGoogleReviews>
\`\`\`

The \`reviews\` slot prop contains the **processed** data: filtered (respecting \`hideEmptyReviews\`), translated (respecting \`disableTranslation\`), and mapped — ready to render.
        `,
      },
    },
  },
  argTypes: {
    layout: { control: 'radio', options: ['carousel', 'badge', 'custom'] },
    theme: { control: 'radio', options: ['light', 'dark'] },
  },
};
export default meta;

type Story = StoryObj<typeof meta>;

export const CarouselLayout: Story = {
  args: {
    reviews: sampleReviews,
    layout: 'carousel',
    isLoading: false,
  },
};

export const BadgeLayout: Story = {
  args: {
    reviews: sampleReviews,
    layout: 'badge',
    isLoading: false,
    averageRatingOverride: 4.7,
    totalReviewCountOverride: sampleReviews.length,
    profileUrl: 'https://g.page/r/example',
  },
};

/**
 * Demonstrates the component receiving reviews that were transformed from the
 * Featurable V2 API format using `transformV2ResponseToV1`. This mirrors what
 * happens when `widgetVersion="v2"` is used with a live `featurableId`.
 */
export const V2DataTransformed: Story = {
  args: {
    reviews: sampleV2Converted,
    layout: 'carousel',
    isLoading: false,
  },
};

/**
 * `layout="custom"` lets you render reviews using any markup you choose.
 *
 * The component exposes a `reviews` slot prop (type `GoogleReview[]`) via
 * Svelte's `let:reviews` directive. The data has already been filtered and
 * processed according to props like `hideEmptyReviews` and `disableTranslation`.
 *
 * This story renders a responsive card grid as a concrete example of what
 * you can build. See `CustomSlotExample.svelte` in the stories folder for
 * the full source.
 */
export const CustomSlotLayout: Story = {
  render: (args) => ({
    Component: CustomSlotExample,
    props: args,
  }),
  args: {
    reviews: sampleReviews,
    isLoading: false,
    hideEmptyReviews: false,
    disableTranslation: false,
  },
  parameters: {
    controls: {
      include: ['isLoading', 'hideEmptyReviews', 'disableTranslation'],
    },
    docs: {
      description: {
        story: `
Uses \`layout="custom"\` with a responsive card grid to show how the \`let:reviews\` slot prop works.
The \`CustomSlotExample.svelte\` wrapper demonstrates the minimum required pattern:

\`\`\`svelte
<SvelteGoogleReviews {reviews} layout="custom" let:reviews={processedReviews}>
  {#each processedReviews as review (review.reviewId)}
    <!-- your custom markup here -->
  {/each}
</SvelteGoogleReviews>
\`\`\`

Only the controls above are shown — carousel and badge props have no effect in \`custom\` layout.

> **Note:** Toggling \`disableTranslation\` has no visible effect in this example because the sample reviews don't contain Google's translation markers (\`(Original)\` / \`(Translated by Google)\`). It will work correctly with real reviews fetched from the API.
        `,
      },
    },
  },
};
