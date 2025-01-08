import User from '../models/user.js';

// 프로필 보기 
export const getProfile = async(req, res) => {
    try{
        const userId = req.user._id //로그인 된 사용자 

        const user = await User.findById(userId).populate({
            path: 'reviews',
            populate: { path: 'book', select: 'title image author' } // 리뷰에 연결된 책 제목 불러오기
        });
        res.render('profile/show', { user, reviews: user.reviews });
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

// 프로필 수정 처리
export const postEditProfile = async (req, res) => {
    try{
        const user = await User.findById(req.user._id);

        // 업데이트 가능할 필드
        console.log(req.body)
        user.username = req.body.username || user.username;
        user.bio = req.body.bio || user.bio;

        // Cloudinary에 업로드된 프로필 이미지 URL 저장
        if (req.file) {
            user.profilePicture = req.file.path; // Cloudinary에서 반환된 URL
        }

        await user.save();
        
        req.flash('success', 'Profile updated successfully!');
        res.redirect('/profile');
    } catch(error) {
        console.error('Error updating profile:', error);
        req.flash('error', 'Could not update profile. Please try again.');
        res.redirect('/profile/edit');
    }
};

