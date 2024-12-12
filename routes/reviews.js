import express from 'express';
import { createReview, deleteReview } from '../controllers/review.js';
import { isLoggedIn, isReviewAuthor } from '../middleware.js';
import catchAsync from '../utils/catchAsync.js';

const router = express.Router({mergeParams: true});

router.post('/', isLoggedIn, catchAsync(createReview));

router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(deleteReview))

export default router