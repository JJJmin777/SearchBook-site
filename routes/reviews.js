import express from 'express';
import { createReview, deleteReview, toggleLike, addComment, getSortedReviews, deleteComment } from '../controllers/review.js';
import { isLoggedIn, isReviewAuthor } from '../middleware.js';
import catchAsync from '../utils/catchAsync.js';

const router = express.Router({mergeParams: true});

//리뷰 만들기기
router.route('/')
    .get(getSortedReviews)
    .post(isLoggedIn, catchAsync(createReview));

//리뷰 지우기
router.route('/:reviewId')
    .delete(isLoggedIn, isReviewAuthor, deleteReview);

// 리뷰의 좋아요
router.post('/:reviewId/like', isLoggedIn, toggleLike); 

// 리뷰에 코멘트 추가
router.post('/:reviewId/comments', isLoggedIn, addComment);

// 코멘트 삭제
router.delete('/:reviewId/comments/:commentId', isLoggedIn, deleteComment);


export default router