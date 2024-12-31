import express from 'express';
import { createReview, deleteReview, toggleLike, addComment, getSortedReviews, deleteComment, renderEditReviewPage, updateReview } from '../controllers/review.js';
import { isLoggedIn, isReviewAuthor } from '../middleware.js';
import catchAsync from '../utils/catchAsync.js';

const router = express.Router({mergeParams: true});

//리뷰 정렬과 만들기
router.route('/')
    .get(getSortedReviews)
    .post(isLoggedIn, catchAsync(createReview));

//리뷰 수정페이지
router.route('/:reviewId/edit')
    .get(isLoggedIn, isReviewAuthor, renderEditReviewPage)

//리뷰 수정, 지우기
router.route('/:reviewId')
    .put(isLoggedIn, isReviewAuthor, updateReview)
    .delete(isLoggedIn, isReviewAuthor, deleteReview);

// 리뷰의 좋아요
router.post('/:reviewId/like', toggleLike);

// 리뷰에 코멘트 추가
router.post('/:reviewId/comments', addComment);

// 코멘트 삭제
router.delete('/:reviewId/comments/:commentId', isLoggedIn, deleteComment);


export default router