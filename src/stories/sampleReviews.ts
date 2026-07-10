import type { GoogleReview } from '../lib/types/review';

export const sampleReviews: GoogleReview[] = [
  {
    reviewId: '1',
    reviewer: {
      profilePhotoUrl: 'https://i.pravatar.cc/50?img=1',
      displayName: 'Jane Smith',
      isAnonymous: false,
    },
    starRating: 5,
    comment:
      'Excellent service! Highly recommend to anyone looking for quality work. The team was professional and responsive throughout the entire process.',
    createTime: '2024-01-15T10:00:00Z',
    updateTime: null,
  },
  {
    reviewId: '2',
    reviewer: {
      profilePhotoUrl: 'https://i.pravatar.cc/50?img=2',
      displayName: 'John Doe',
      isAnonymous: false,
    },
    starRating: 4,
    comment:
      'Great experience overall. Minor hiccups along the way but nothing that affected the final result. Would use again.',
    createTime: '2024-02-20T14:30:00Z',
    updateTime: null,
  },
  {
    reviewId: '3',
    reviewer: {
      profilePhotoUrl: 'https://i.pravatar.cc/50?img=3',
      displayName: 'Alice Johnson',
      isAnonymous: false,
    },
    starRating: 5,
    comment:
      'Absolutely fantastic! From start to finish the communication was clear and the delivery was on time. Very happy with the results and will definitely refer friends.',
    createTime: '2024-03-05T09:15:00Z',
    updateTime: null,
  },
  {
    reviewId: '4',
    reviewer: { profilePhotoUrl: '', displayName: 'Bob Martinez', isAnonymous: false },
    starRating: 3,
    comment:
      'Decent quality but took longer than expected. The end product was acceptable but I was hoping for a bit more attention to detail given the price point.',
    createTime: '2024-04-10T16:00:00Z',
    updateTime: null,
  },
  {
    reviewId: '5',
    reviewer: { profilePhotoUrl: '', displayName: 'Anonymous', isAnonymous: true },
    starRating: 5,
    comment:
      'Outstanding! Could not be more pleased with the service. The staff was friendly and knowledgeable. I have already recommended this business to several colleagues.',
    createTime: '2024-05-22T11:45:00Z',
    updateTime: null,
  },
  {
    reviewId: '6',
    reviewer: {
      profilePhotoUrl: 'https://i.pravatar.cc/50?img=6',
      displayName: 'Carol White',
      isAnonymous: false,
    },
    starRating: 4,
    comment: 'Really solid service. Would come back.',
    createTime: '2024-06-01T08:00:00Z',
    updateTime: null,
  },
];

export const longCommentReview: GoogleReview = {
  reviewId: '99',
  reviewer: { profilePhotoUrl: '', displayName: 'Verbose Reviewer', isAnonymous: false },
  starRating: 5,
  comment:
    'This is an exceptionally long review that goes well beyond the default 200 character limit. I want to make sure the read more button appears correctly so I am writing a very detailed account of my experience. The service was impeccable from the very first contact through to the final delivery. Every step of the process was handled with the utmost professionalism and care.',
  createTime: '2024-06-15T12:00:00Z',
  updateTime: null,
};
