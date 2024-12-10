import User from "../models/user";

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
    const redirectUrl = res.locals.returnTo; // || '/' 이거 나중에 붙여보던가??
    // delete req.session.returnTo
    res.redirect(redirectUrl);
}

export const logout = (req, res) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Goodbye!');
        res.redirect('/')
    });
}