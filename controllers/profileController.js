import User from '../models/user.js';
import { cloudinary } from '../utils/cloudinary.js';

// 프로필 보기 
export const getUserProfile = async(req, res) => {
    try{
        const { userId } = req.params;

        const user = await User.findById(userId).populate({
            path: 'reviews',
            populate: [
                { path: 'book', select: 'title image author' }, // 리뷰에 연결된 책 제목 불러오기
            ],
        });

        if (!user) {
            req.flash('error', 'User not found.');
            return res.redirect('/');
        }

        res.render('profile/show', { user, reviews: user.reviews, currentUser: req.user });
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
        req.flash('error', 'Could not load edit form. Please try again.??');
        res.redirect('/profile');
    }
};

// 프로필 수정 처리
export const postEditProfile = async (req, res) => {
    try{
        const user = await User.findById(req.user._id);

        // 기존 프로필 사진 삭제 요청 처리
        if (req.body.deleteProfilePicture === 'true' && user.profilePictureId) {
            await cloudinary.uploader.destroy(user.profilePictureId);
            user.profilePicture = null;
            user.profilePictureId = null;
        }

        // 새로운 프로필 사진 업로드 처리
        if (req.file) {

            // 이전 파일이 있는 경우 삭제
            if (user.profilePictureId) {
                await cloudinary.uploader.destroy(user.profilePictureId);
            }

            // Cloudinary에 새 파일 업로드
            const result = await cloudinary.uploader.upload(req.file.path, {
                folder: 'search-book-user-profiles',
            });

            // 새로운 파일 정보 저장
            user.profilePicture = result.secure_url // Cloudinary에서 반환된 URL
            user.profilePictureId = result.public_id // // Cloudinary에서 반환된 public_id
        }

        // 사용자 정보 업데이트
        user.username = req.body.username || user.username;
        user.bio = req.body.bio || user.bio;

        await user.save();
        
        req.flash('success', 'Profile updated successfully!');
        res.redirect(`/profile/${req.user._id}`);
    } catch(error) {
        console.error('Error updating profile:', error);
        req.flash('error', 'Could not update profile. Please try again.');
        res.redirect(`/profile/${req.user._id}`);
    }
};

