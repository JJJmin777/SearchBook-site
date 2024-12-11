import passport from "passport";

// 사용자가 요청했던 경로 저장
export const storeReturnTo = (req, res, next) => {
    // 세션에 returnTo가 없고, 현재 요청이 로그인 또는 회원가입 경로가 아닐 때만 저장
    console.log(`${req.originalUrl}hah`)
    if (!req.session.returnTo && req.originalUrl !== '/login' && req.originalUrl !== '/register') {
        req.session.returnTo = req.originalUrl; // 요청한 URL 저장
    }
    // console.log('Updated session in storeReturnTo:', req.session); // 디버깅용 로그 추가
    next();
};

export const isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash('error', 'You must be logged in to access this page.');
    res.redirect('/login');
}