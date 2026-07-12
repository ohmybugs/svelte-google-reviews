export type ReviewCardCSSProps = {
  /** CSS class added to the review card root element. */
  reviewCardClassName?: string;
  /** Inline styles applied to the review card root element. */
  reviewCardStyle?: string;

  /** CSS class added to the review card in light theme. */
  reviewCardLightClassName?: string;
  /** Inline styles applied to the review card in light theme. */
  reviewCardLightStyle?: string;

  /** CSS class added to the review card in dark theme. */
  reviewCardDarkClassName?: string;
  /** Inline styles applied to the review card in dark theme. */
  reviewCardDarkStyle?: string;

  /** CSS class added to the review body section when `reviewVariant="card"`. */
  reviewBodyCardClassName?: string;
  /** Inline styles applied to the review body section when `reviewVariant="card"`. */
  reviewBodyCardStyle?: string;

  /** CSS class added to the review body section when `reviewVariant="testimonial"`. */
  reviewBodyTestimonialClassName?: string;
  /** Inline styles applied to the review body section when `reviewVariant="testimonial"`. */
  reviewBodyTestimonialStyle?: string;

  /** CSS class added to the review text element. */
  reviewTextClassName?: string;
  /** Inline styles applied to the review text element. */
  reviewTextStyle?: string;

  /** CSS class added to the review text in light theme. */
  reviewTextLightClassName?: string;
  /** Inline styles applied to the review text in light theme. */
  reviewTextLightStyle?: string;

  /** CSS class added to the review text in dark theme. */
  reviewTextDarkClassName?: string;
  /** Inline styles applied to the review text in dark theme. */
  reviewTextDarkStyle?: string;

  /** CSS class added to the "Read more" / "Read less" toggle button. */
  reviewReadMoreClassName?: string;
  /** Inline styles applied to the "Read more" / "Read less" toggle button. */
  reviewReadMoreStyle?: string;

  /** CSS class added to the read-more button in light theme. */
  reviewReadMoreLightClassName?: string;
  /** Inline styles applied to the read-more button in light theme. */
  reviewReadMoreLightStyle?: string;

  /** CSS class added to the read-more button in dark theme. */
  reviewReadMoreDarkClassName?: string;
  /** Inline styles applied to the read-more button in dark theme. */
  reviewReadMoreDarkStyle?: string;

  /** CSS class added to the card footer row (reviewer info + logo). */
  reviewFooterClassName?: string;
  /** Inline styles applied to the card footer row. */
  reviewFooterStyle?: string;

  /** CSS class added to the reviewer info container. */
  reviewerClassName?: string;
  /** Inline styles applied to the reviewer info container. */
  reviewerStyle?: string;

  /** CSS class added to the reviewer profile section (avatar + name/date column). */
  reviewerProfileClassName?: string;
  /** Inline styles applied to the reviewer profile section. */
  reviewerProfileStyle?: string;

  /** CSS class added to the reviewer profile `<img>` element. */
  reviewerProfileImageClassName?: string;
  /** Inline styles applied to the reviewer profile `<img>` element. */
  reviewerProfileImageStyle?: string;

  /** CSS class added to the fallback avatar shown when no profile photo is available or the image fails to load. */
  reviewerProfileFallbackClassName?: string;
  /** Inline styles applied to the fallback avatar element. */
  reviewerProfileFallbackStyle?: string;

  /** CSS class added to the reviewer name text. */
  reviewerNameClassName?: string;
  /** Inline styles applied to the reviewer name text. */
  reviewerNameStyle?: string;

  /** CSS class added to the reviewer name text in light theme. */
  reviewerNameLightClassName?: string;
  /** Inline styles applied to the reviewer name text in light theme. */
  reviewerNameLightStyle?: string;

  /** CSS class added to the reviewer name text in dark theme. */
  reviewerNameDarkClassName?: string;
  /** Inline styles applied to the reviewer name text in dark theme. */
  reviewerNameDarkStyle?: string;

  /** CSS class added to the review date text. */
  reviewerDateClassName?: string;
  /** Inline styles applied to the review date text. */
  reviewerDateStyle?: string;

  /** CSS class added to the review date text in light theme. */
  reviewerDateLightClassName?: string;
  /** Inline styles applied to the review date text in light theme. */
  reviewerDateLightStyle?: string;

  /** CSS class added to the review date text in dark theme. */
  reviewerDateDarkClassName?: string;
  /** Inline styles applied to the review date text in dark theme. */
  reviewerDateDarkStyle?: string;
};

export type BadgeCSSProps = {
  /** CSS class added to the badge root element. */
  badgeClassName?: string;
  /** Inline styles applied to the badge root element. */
  badgeStyle?: string;

  /** CSS class added to the badge container. */
  badgeContainerClassName?: string;
  /** Inline styles applied to the badge container. */
  badgeContainerStyle?: string;

  /** CSS class added to the badge container in light theme. */
  badgeContainerLightClassName?: string;
  /** Inline styles applied to the badge container in light theme. */
  badgeContainerLightStyle?: string;

  /** CSS class added to the badge container in dark theme. */
  badgeContainerDarkClassName?: string;
  /** Inline styles applied to the badge container in dark theme. */
  badgeContainerDarkStyle?: string;

  /** CSS class added to the Google icon inside the badge. */
  badgeGoogleIconClassName?: string;
  /** Inline styles applied to the Google icon inside the badge. */
  badgeGoogleIconStyle?: string;

  /** CSS class added to the inner content container (label + rating + stars). */
  badgeInnerContainerClassName?: string;
  /** Inline styles applied to the inner content container. */
  badgeInnerContainerStyle?: string;

  /** CSS class added to the badge heading label. */
  badgeLabelClassName?: string;
  /** Inline styles applied to the badge heading label. */
  badgeLabelStyle?: string;

  /** CSS class added to the badge heading label in light theme. */
  badgeLabelLightClassName?: string;
  /** Inline styles applied to the badge heading label in light theme. */
  badgeLabelLightStyle?: string;

  /** CSS class added to the badge heading label in dark theme. */
  badgeLabelDarkClassName?: string;
  /** Inline styles applied to the badge heading label in dark theme. */
  badgeLabelDarkStyle?: string;

  /** CSS class added to the rating number container. */
  badgeRatingContainerClassName?: string;
  /** Inline styles applied to the rating number container. */
  badgeRatingContainerStyle?: string;

  /** CSS class added to the rating number text element. */
  badgeRatingClassName?: string;
  /** Inline styles applied to the rating number text element. */
  badgeRatingStyle?: string;

  /** CSS class added to the rating number text in light theme. */
  badgeRatingLightClassName?: string;
  /** Inline styles applied to the rating number text in light theme. */
  badgeRatingLightStyle?: string;

  /** CSS class added to the rating number text in dark theme. */
  badgeRatingDarkClassName?: string;
  /** Inline styles applied to the rating number text in dark theme. */
  badgeRatingDarkStyle?: string;

  /** CSS class added to the star rating row. */
  badgeStarsClassName?: string;
  /** Inline styles applied to the star rating row. */
  badgeStarsStyle?: string;

  /** CSS class added to the star icons container. */
  badgeStarsContainerClassName?: string;
  /** Inline styles applied to the star icons container. */
  badgeStarsContainerStyle?: string;

  /** CSS class added to filled (active) star icons. */
  badgeStarsFilledClassName?: string;
  /** Inline styles applied to filled (active) star icons. */
  badgeStarsFilledStyle?: string;

  /** CSS class added to empty (inactive) star icons. */
  badgeStarsEmptyClassName?: string;
  /** Inline styles applied to empty (inactive) star icons. */
  badgeStarsEmptyStyle?: string;

  /** CSS class added to the container wrapping the review-count link. */
  badgeLinkContainerClassName?: string;
  /** Inline styles applied to the container wrapping the review-count link. */
  badgeLinkContainerStyle?: string;

  /** CSS class added to the "Read our N reviews" link. */
  badgeLinkClassName?: string;
  /** Inline styles applied to the "Read our N reviews" link. */
  badgeLinkStyle?: string;

  /** CSS class added to the review-count link in light theme. */
  badgeLinkLightClassName?: string;
  /** Inline styles applied to the review-count link in light theme. */
  badgeLinkLightStyle?: string;

  /** CSS class added to the review-count link in dark theme. */
  badgeLinkDarkClassName?: string;
  /** Inline styles applied to the review-count link in dark theme. */
  badgeLinkDarkStyle?: string;

  /** CSS class added to the inline link variant (rendered without a wrapping block). */
  badgeLinkInlineClassName?: string;
  /** Inline styles applied to the inline link variant. */
  badgeLinkInlineStyle?: string;
};

export type CarouselCSSProps = {
  /** CSS class added to the carousel root element. */
  carouselClassName?: string;
  /** Inline styles applied to the carousel root element. */
  carouselStyle?: string;

  /** CSS class added to both navigation buttons. */
  carouselBtnClassName?: string;
  /** Inline styles applied to both navigation buttons. */
  carouselBtnStyle?: string;

  /** CSS class added to the left (previous) navigation button. */
  carouselBtnLeftClassName?: string;
  /** Inline styles applied to the left (previous) navigation button. */
  carouselBtnLeftStyle?: string;

  /** CSS class added to the right (next) navigation button. */
  carouselBtnRightClassName?: string;
  /** Inline styles applied to the right (next) navigation button. */
  carouselBtnRightStyle?: string;

  /** CSS class added to navigation buttons in light theme. */
  carouselBtnLightClassName?: string;
  /** Inline styles applied to navigation buttons in light theme. */
  carouselBtnLightStyle?: string;

  /** CSS class added to navigation buttons in dark theme. */
  carouselBtnDarkClassName?: string;
  /** Inline styles applied to navigation buttons in dark theme. */
  carouselBtnDarkStyle?: string;

  /** CSS class added to the arrow icon inside navigation buttons. */
  carouselBtnIconClassName?: string;
  /** Inline styles applied to the arrow icon inside navigation buttons. */
  carouselBtnIconStyle?: string;

  /** CSS class added to the card slide wrapper element. */
  carouselCardClassName?: string;
  /** Inline styles applied to the card slide wrapper element. */
  carouselCardStyle?: string;
};

export type ErrorStateCSSProps = {
  /** CSS class added to the error state wrapper element. */
  errorClassName?: string;
  /** Inline styles applied to the error state wrapper element. */
  errorStyle?: string;
};

export type LoadingStateCSSProps = {
  /** CSS class added to the loading state outer wrapper. */
  loaderClassName?: string;
  /** Inline styles applied to the loading state outer wrapper. */
  loaderStyle?: string;

  /** CSS class added to the spinner SVG element. */
  loaderSpinnerClassName?: string;
  /** Inline styles applied to the spinner SVG element. */
  loaderSpinnerStyle?: string;

  /** CSS class added to the loading label `<p>` element. */
  loaderLabelClassName?: string;
  /** Inline styles applied to the loading label `<p>` element. */
  loaderLabelStyle?: string;
};
