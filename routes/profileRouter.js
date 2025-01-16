import express from 'express';
import { isLoggedIn, isUserAuthorized } from '../middleware.js';
import { getEditProfile, getUserProfile, postEditProfile, searchUserBooks } from '../controllers/profileController.js';
import { upload } from '../utils/cloudinary.js' // Cloudinary multer 설정 불러오기

const router = express.Router();

// 프로필 보기
router.route('/:userId')
    .get(getUserProfile)

// 유저가 쓴 책 리뷰 검색
router.route('/:userId/search')
    .get(searchUserBooks)

// 프로필 수정 폼, 수정 처리
router.route('/:userId/edit')
    .get(isLoggedIn,isUserAuthorized, getEditProfile)
    .post(isLoggedIn, isUserAuthorized, upload.single('profilePicture'), postEditProfile)

export default router;