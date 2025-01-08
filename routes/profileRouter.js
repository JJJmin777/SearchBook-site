import express from 'express';
import { isLoggedIn } from '../middleware.js';
import { getEditProfile, getProfile, postEditProfile } from '../controllers/profileController.js';
import { upload } from '../utils/cloudinary.js' // Cloudinary 설정 불러오기

const router = express.Router();

// 프로필 보기
router.route('/')
    .get(getProfile)

// 프로필 수정 폼, 수정 처리
router.route('/edit')
    .get(isLoggedIn, getEditProfile)
    .post(isLoggedIn, upload.single('profilePicture'), postEditProfile)

export default router;