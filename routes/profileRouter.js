import express from 'express';
import { isLoggedIn } from '../middleware.js';
import { getEditProfile, getProfile } from '../controllers/profileController.js';

const router = express.Router();

// 프로필 보기
router.route('/')
    .get(getProfile)

// 프로필 수정 폼, 수정 처리
router.route('/edit')
    .get(getEditProfile)

export default router;