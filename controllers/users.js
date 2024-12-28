import User from "../models/user.js";
import Review from "../models/review.js";
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

        // 이메일 전송
        await sendEmail(email, subject, html);


        req.flash('success', 'A verification email has been sent to your inbox.');
        res.redirect('/');

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
        siteKey: process.env.SITE_KEY // .env 파일의 SITE_KEY
    });
}

// 로그인 
export const login = async (req, res) => {
    
    try {
        const { username } = req.body;

        // 이메일로 사용자 찾기
        const user = await User.findOne({ username });

        // isVerified 확인
        if (!user.isVerified) {
            req.flash('error', '이메일 인증이 필요합니다.');
            return res.redirect('/login');
        }
        req.flash('success', 'Welcome Back');
        const redirectUrl = req.session.returnTo || '/'; // 저장된 경로 가져오기
        delete req.session.returnTo; // 세션에서 경로 제거
        res.redirect(redirectUrl); //저장된 경로로

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

// 사용자가 쓴 책 리뷰 불러오기
export const showMyBooks = async (req, res) => {
    try {
        const userId = req.user._id //로그인 된 사용자 

        const user = await User.findById(userId).populate({
            path: 'reviews',
            populate: { path: 'book', select: 'title image' } // 리뷰에 연결된 책 제목 불러오기
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

        // 검색 조건
        const searchCriteria = { 
            author: userId, 
            $or: [
                { 'book.title': { $regex: query, $options: 'i' } },
                { 'book.author': { $regex: query, $options: 'i' } }
            ]
        };

        console.log(searchCriteria)
        
        const reviews = await Review.find(searchCriteria)
            .populate({
                path: 'book',
                select: 'title image'
            });

        console.log(reviews)

        res.render('bookreviews/mybooks', { reviews });
    } catch (error) {
        console.error(error);
        res.status(500).send('Failed to load reviews');
    }
};