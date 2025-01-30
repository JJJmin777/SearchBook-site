import express from 'express';
import passport from 'passport';
import { showMyBooks, renderRegister, register, renderLogin, login, logout, verifyEmail, searchMyBooks, forgotPassword, resetPassword, renderForgotPassword, renderResetPassword, renderChangePassword } from '../controllers/usersController.js'
import catchAsync from '../utils/catchAsync.js';
import { isLoggedIn, recaptchaMiddleware  } from '../middleware.js';

const router = express.Router();
    
// Resiter 
router.route('/register')
    .get(renderRegister)
    //catchAsync - 비동기 에러를 안전하게 처리하기 위해 사용, 비동기 함수에서 발생한 에러가 Express 에러 핸들러로 전달되지 않을수도 있음
    .post(
        recaptchaMiddleware('/register'),
        catchAsync(register)
    );

// Verify-Email
router.route('/verify-email')
    .get(verifyEmail)

// Login
router.route('/login')
    .get(renderLogin)
    .post(
        recaptchaMiddleware('/login'),
        passport.authenticate('local', { failureFlash: 'Invalid username or password.', failureRedirect: '/login' }), 
        login
    );

// 비밀번호 변경
router.route('/change-password')
    .get(renderChangePassword)
    .post()

// 비밀번호 재설정 요청 처리
router.route('/forgot-password')
    .get(renderForgotPassword)
    .post(
        recaptchaMiddleware('/forgot-password'),
        forgotPassword
    );
    

// 비밀번호 재설정
router.route('/reset-password')
    .get(renderResetPassword)
    .post(resetPassword);

// Logout
router.get('/logout', logout)

// 내가 쓴 책 리뷰들
router.route('/mybooks')
    .get(isLoggedIn, showMyBooks)

// 내가 쓴 책 리뷰 검색
router.route('/mybooks/search')
    .get(isLoggedIn, searchMyBooks)

export default router