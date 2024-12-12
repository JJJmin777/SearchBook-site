import User from "../models/user.js";

export const renderRegister = (req, res) => {
    res.render('users/register');
}

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

export const renderLogin = async (req, res) => {
    res.render('users/login');
}

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

export const logout = (req, res, next) => {
    req.logOut(function (err) {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Goodbye!');
        res.redirect('/')
    });
}