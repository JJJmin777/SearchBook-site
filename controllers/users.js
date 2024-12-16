import User from "../models/user.js";
import Book from "../models/search.js";



// 사용자가 쓴 책 리뷰 불러오기
export const showMyBooks = async (req, res) => {
    try {
        const userId = req.user._id //로그인 된 사용자 
    const user = await User.findById(userId).populate({
        path: 'reviews',
        populate: {path: 'book', select: 'title image' } // 리뷰에 연결된 책 제목 불러오기
    });
    res.render('bookreviews/mybooks', { reviews: user.reviews });
    } catch (err) {
        console.error(err);
        res.status(500).send('Failed to load reviews');
    }
    
}

// 등록 페이지
export const renderRegister = (req, res) => {
    res.render('users/register');
}

// 아이디 등록
export const register = async(req, res, next) => {
    try {
        const { username, password, email } = req.body;
        const user = new User({ username, email });
        const registerUser = await User.register(user, password); //비밀번호 해싱 및 저장
        req.login(registerUser, err => {
            if(err) return next(err);
            req.flash('success', 'User registered successfully!');
            res.redirect('/');
        })
    } catch (err) {
        req.flash('error',err.message);
        res.redirect('/register');
    }
}

// 로그인 페이지
export const renderLogin = async (req, res) => {
    res.render('users/login');
}

// 로그인 
export const login = (req, res) => {
    req.flash('success', 'Welcome Back');
    // console.log('Session in login:', req.session);
    const redirectUrl = req.session.returnTo || '/'; // 저장된 경로 가져오기
    delete req.session.returnTo; // 세션에서 경로 제거
    req.session.save(err => {
        if (err) console.error('Error saving session:', err);
    }); // 세션 저장
    res.redirect(redirectUrl); //저장된 경로로 
}

// 로그아웃 
export const logout = (req, res, next) => {
    req.logOut(function (err) {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Goodbye!');
        res.redirect('/')
    });
}