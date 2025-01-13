import express from 'express';
import { fetchReviews } from '../controllers/apiReviewController.js';

const router = express.Router();

// 리뷰 데이터 제공 API
router.get('/api/reviews', fetchReviews);

export default router;
