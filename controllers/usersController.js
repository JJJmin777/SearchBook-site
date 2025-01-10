import User from "../models/user.js";
import Review from "../models/review.js";
import Book from "../models/book.js"
import sendEmail from "../utils/sendEmail.js";  // 이메일 전송 유틸리티
import crypto from 'crypto';

// 등록 페이지
export const renderRegister = (req, res) => {
    res.render('users/register', {
        siteKey: process.env.SITE_KEY // .env 파일의 SITE_KEY
        });
}

// 아이디 등록
export const register = async (req, res, next) => {
    const { username, password, email } = req.body;

    try {
        // 새 사용자 생성
        const user = new User({
            username,
            email,
            isVerified: false, // 이메일 인증 여부
            emailToken: crypto.randomBytes(32).toString('hex'), // 랜덤 토큰 생성
            emailTokenExpire: Date.now() + 3600000 // 토큰 만료 시간 (1시간)
        });

        //비밀번호 해싱 및 저장
        const registerUser = await User.register(user, password);

        // 인증 이메일 링크 생성
        const verificationLink = `http://localhost:3000/verify-email?token=${user.emailToken}`;
        const subject = 'Verify Your Email';

        // HTML 이메일 본문 생성
        const html = `
            <p>Hello ${username},</p>
            <p>Please verify your email by clicking the link below:</p>
            <a href="${verificationLink}" 
                style="
                    display: inline-block;
                    padding: 10px 20px;
                    font-size: 16px;
                    color: #ffffff;
                    background-color: #007bff;
                    text-decoration: none;
                    border-radius: 5px;
                ">
                Verify Email
            </a>
            <p>If you did not sign up, please ignore this email.</p>
        `;

        req.flash('success', 'A verification email has been sent to your inbox.');
        res.redirect('/');

        // 이메일 전송
        await sendEmail(email, subject, html);

    } catch (error) {
        req.flash('error', error.message);
        res.redirect('/register');
    }
};

// 이메일 인증 처리
export const verifyEmail = async (req, res) => {
    const { token } = req.query;
    try {
        // 유효한 토큰으로 사용자 찾기
        const user = await User.findOne({
            emailToken: token,
            emailTokenExpire: { $gt: Date.now() } // 토큰이 만료되지 않았는지 확인
        });

        if (!user) {
            req.flash('error', 'Token is invalid or has expired.');
            return res.redirect('/register');
        }

        // 사용자 활성화
        user.isVerified = true;
        user.emailToken = undefined; // 토큰 제거
        user.emailTokenExpire = undefined;
        await user.save();

        req.flash('success', 'Your email has been verified. You can now log in.');
        res.redirect('/login');

    } catch (error) {
        req.flash('error', 'Error verifying email. Please try again.');
        res.redirect('/register');
    }
}

// 로그인 페이지
export const renderLogin = async (req, res) => {
    res.render('users/login', {
        siteKey: process.env.SITE_KEY, // .env 파일의 SITE_KEY
        currentUrl: req.query.returnurl || '/' // 쿼리에서 currentUrl 경로 전달
    });
}

// 로그인 
export const login = async (req, res) => {
    
    try {
        const { email } = req.body;

        // 아이디로 사용자 찾기
        const user = await User.findOne({ email });

        // 이메일 isVerified 확인
        if (!user.isVerified) {
            req.flash('error', '이메일 인증이 필요합니다.');
            return res.redirect('/login');
        }

        req.flash('success', 'Welcome Back!');

        // 쿼리 문자열에서 리다이렉트 경로 가져오기
        const redirectUrl = req.query.returnurl || '/';
        res.redirect(redirectUrl); // 저장된 경로 또는 기본 경로로 이동

    } catch (error) {
        req.flash('error', 'Error verifying email. Please try again.!!!!!');
        res.redirect('/login');
    }
}

// 로그아웃 
export const logout = (req, res, next) => {
    req.logOut(function (error) {
        if (error) {
            return next(error);
        }
        req.flash('success', 'Goodbye!');
        res.redirect('/')
    });
}

//  비밀번호 재설정 요청 처리 page렌더링
export const renderForgotPassword = (req, res) => {
    res.render('users/forgot-password', {
        siteKey: process.env.SITE_KEY // .env 파일의 SITE_KEY
    });
}

// 비밀번호 재설정 요청 처리
export const forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            res.flash('eorr', '등록된 이메일이 없습니다.');
            return res.redirect('/forgot-password');
        }
        
        // 비밀번호 재설정 토큰 생성
        const token = crypto.randomBytes(32).toString('hex');
        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000; // 1시간 후 만료
        await user.save();

        // 비밀번호 재설정 이메일 전송
        const resetLink = `http://localhost:3000/reset-password?token=${token}`;
        const subject = 'Password Reset Reques';

        // HTML 이메일 본문 생성
        const html = `
            <p>Hello,</p>
            <p>You can reset your password by clicking the link below:</p>
            <a href="${resetLink}" 
                style="
                    display: inline-block;
                    padding: 10px 20px;
                    font-size: 16px;
                    color: #ffffff;
                    background-color: #007bff;
                    text-decoration: none;
                    border-radius: 5px;
                ">
                Reset Password
            </a>
            <p>If you did not request this, please ignore this email.</p>
        `;

        req.flash('success', 'Password reset email has been sent.');
        res.redirect('/login');

        // 이메일 전송
        await sendEmail(email, subject, html);
    } catch(error) {
        req.flash('error', error.message);
        res.redirect('/forgot-password')
    }
}

// 비밀번호 재설정페이지 렌딩
export const renderResetPassword = async (req, res) => {
    const { token } = req.query; // URL에서 토큰 가져오기
    if (!token) {
        req.flash('error', 'Invalid or missing token.');
        return res.redirect('/forgot-password'); // 유효하지 않은 경우 리다이렉트
    }

    res.render('users/reset-password', {
        token
    });
}

// 비밀번호 재설정
export const resetPassword = async (req, res) => {
    const { token } = req.query;
    const { password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
        req.flash('error', 'Passwords do not match.');
        return res.redirect(`/reset-password?token=${token}`);
    }

    try {
        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            req.flash('error', 'Invalid or expired reset token.');
            return res.redirect('/forgot-password');
        }

        // 비밀번호 저장 및 토큰 제거
        await user.setPassword(password);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        req.flash('success', 'Your password has been reset successfully.');
        res.redirect('/login');
    } catch (error) {
        req.flash('error', error.message);
        res.redirect('/forgot-password');
    }
};

// 사용자가 쓴 책 리뷰 불러오기
export const showMyBooks = async (req, res) => {
    try {
        const userId = req.user._id //로그인 된 사용자 

        const user = await User.findById(userId).populate({
            path: 'reviews',
            populate: { path: 'book', select: 'title image author' } // 리뷰에 연결된 책 제목 불러오기
        });
        res.render('bookreviews/mybooks', { reviews: user.reviews });
    } catch (error) {
        console.error(error);
        res.status(500).send('Failed to load reviews');
    }
}

// 사용자가 쓴 책 리뷰 검색
export const searchMyBooks = async (req, res) => {
    try {
        const userId = req.user._id; // 로그인 된 사용자
        const query = req.query.query; // 검색 쿼리

        // 리뷰 검색 및 책 데이터 포함
        let reviews = await Review.find({ author: userId })
            .populate({
                path: 'book',
                select: 'title image author' // 필요한 책 데이터
            });

        // 검색어가 있는 경우 자바스크립트에서 필터링
        if (query) {
            const regex = new RegExp(query, 'i'); // 대소문자 구분 없는 정규식
            reviews = reviews.filter(review =>
                regex.test(review.book.title) || regex.test(review.book.author)
            );
        }
 
        res.render('bookreviews/mybooks', { reviews, });
    } catch (error) {
        console.error(error);
        res.status(500).send('Failed to load reviews');
    }
};