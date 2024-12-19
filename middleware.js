// import passport from "passport";
import Review from './models/review.js'
import verifyRecaptcha from "./utils/verifyRecaptcha.js"; // recaptcha 유틸리티

// 사용자가 요청했던 경로 저장
// export const storeReturnTo = (req, res, next) => {
//     console.log(req.query.returnTo);
//     if (!req.user && req.originalUrl !== '/login') {
//         const returnTo = req.query.returnTo || req.originalUrl; // 쿼리 매개변수 또는 현재 URL
//         // 사용자가 인증되지 않았고, 요청이 로그인 페이지가 아니면
//         req.session.returnTo = returnTo; // 원래 URL을 세션에 저장
//         console.log('Storing returnTo in session:', req.session.returnTo);
//     }
//     next(); // 다음 미들웨어로 이동
// };

// 로그인 확인인
export const isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash('error', 'You must be logged in to access this page.');
    res.redirect('/login');
}

// 자기가 쓴 리뷰인지 확인인
export const isReviewAuthor = async (req, res, next) => {
    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if (!review.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that!')
    }
    next();
}

// reCAPTCHA 검증
export const recaptchaMiddleware = (redirectRoute) => {
    return async (req, res, next) => {
        const recaptchaToken = req.body['g-recaptcha-response']; // 클라이언트에서 받은 reCAPTCHA 응답 토큰

        if (!recaptchaToken) {
            req.flash('error', 'reCAPTCHA token is missing.');
            return res.redirect(redirectRoute); // 동적 리디렉션
        }

        const isValid = await verifyRecaptcha(recaptchaToken);
        if (!isValid) {
            req.flash('error', 'reCAPTCHA verification failed. Please try again.');
            return res.redirect(redirectRoute); // 동적 리디렉션
        }

        next(); // 검증 성공 시 다음 미들웨어/컨트롤러로 진행
    };
};