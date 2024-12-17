// import passport from "passport";
import Review from './models/review.js'

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

export const isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash('error', 'You must be logged in to access this page.');
    res.redirect('/login');
}

export const isReviewAuthor = async (req, res, next) => {
    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if (!review.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that!')
    }
    next();
}