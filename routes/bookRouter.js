import express from 'express';
import { handleSearchResults, saveBook, getBookDetails, searchReviews } from '../controllers/bookController.js'

const router = express.Router();

// 검색 결과 처리
router.get('/results', handleSearchResults)

// 책 상세 페이지 책 정보 저장 및 조회
router.post('/save', saveBook)

// 책 상세 페이지
router.get('/:id', getBookDetails)

// 책의 리뷰 검색 API
router.get('/:id/reviews/search', searchReviews);

export default router;