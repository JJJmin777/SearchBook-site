import express from 'express';
import User from '../models/user.js'
import passport from 'passport';
import users from '../controllers/users.js'
import catchAsync from '../utils/catchAsync.js';
import { storeReturnTo } from '../middleware.js';


const router = express.Router();

// Resiter 
router.route('/register')
    .get(users.renderRegister)
    //catchAsync - 비동기 에러를 안전하게 처리하기 위해 사용, 비동기 함수에서 발생한 에러가 Express 에러 핸들러로 전달되지 않을수도 있음
    .post(catchAsync(users.register));

// Login
router.route('/login')
    .get(user.renderLogin)
    .post(storeReturnTo, passport.authenticate('local', {failureFlash: true, failureRedirect: '/login'}), users.login)

// Logout
router.get('/logout', users.logout)



function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) return next();
    res.redirect('/login');
}

export default router