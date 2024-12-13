import express from 'express';
// import User from '../models/user.js'
import passport from 'passport';
import { showMyBooks, renderRegister, register, renderLogin, login, logout } from '../controllers/users.js'
import catchAsync from '../utils/catchAsync.js';
import { storeReturnTo } from '../middleware.js';

const router = express.Router();

// 내가 쓴 책 리뷰들
router.get('/mybooks', showMyBooks)

// Resiter 
router.route('/register')
    .get(renderRegister)
    //catchAsync - 비동기 에러를 안전하게 처리하기 위해 사용, 비동기 함수에서 발생한 에러가 Express 에러 핸들러로 전달되지 않을수도 있음
    .post(catchAsync(register));

// Login
router.route('/login')
    .get(renderLogin)
    .post(
        storeReturnTo, 
        passport.authenticate('local', {failureFlash: 'Invalid username or password.', failureRedirect: '/login'}), 
        login
    );

// Logout
router.get('/logout', logout)


export default router