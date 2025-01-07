import User from '../models/user.js';

// 프로필 보기 
export const getProfile = async(req, res) => {
    try{
        const user = await User.findById(req.user._id);
        res.render('profile/show', { user });
    } catch(error) {
        console.error('Error fetching profile:', error);
        req.flash('error', 'Could not load profile. Please try again.');
        res.redirect('/');
    }
};

// 프로필 수정 폼
export const getEditProfile = async (req, res) => {
    try{
        const user = await User.findById(req.user._id);
        res.render('profile/edit', { user });
    } catch(error) {
        console.error('Error fetching profile for editing:', error);
        req.flash('error', 'Could not load edit form. Please try again.');
        res.redirect('/profile');
    }
};


