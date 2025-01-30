import User from '../models/user.js';
import Review from '../models/review.js';
import { cloudinary } from '../utils/cloudinary.js';

// 프로필 보기 
export const getUserProfile = async(req, res) => {
    try{
        const { userId } = req.params;
        const query = req.query.query || null; // 검색 쿼리
        const page = parseInt(req.query.page || "1"); // 현재 리뷰 페이지

        // 초기 리뷰 15개만 로드 

        const user = await User.findById(userId);

        if (!user) {
            req.flash('error', 'User not found.');
            return res.redirect('/');
        }

        // 최신순으로 15개 리뷰 로드 
        const reviews = await Review.find({ author: userId })
            .populate({ path: 'book', select: 'title image author' }) // 리뷰에 연결된 책 제목이랑~ 불러오기
            .sort({ createdAt: -1 }) // 최신순
            .limit(15);
        
        const userTotalReviews = user.reviews.length; // 총 리뷰 갯수

        res.render('profile/show', { user, reviews, currentUser: req.user, userId, userTotalReviews, query, currentPage: page});
    } catch(error) {
        console.error('Error fetching profile:', error);
        req.flash('error', 'Could not load profile. Please try again.');
        res.redirect('/');
    }
};

// 유저가 쓴 책 리뷰 검색
export const searchUserBooks = async (req, res) => {
    try {
        const { userId } = req.params; // 로그인 된 사용자
        const query = req.query.query; // 검색 쿼리

        const user = await User.findById(userId);

        if (!user) {
            req.flash('error', 'User not found.');
            return res.redirect('/');
        }

        // 리뷰 검색 및 책 데이터 포함
        let reviews = await Review.find({ author: userId })
            .populate({
                path: 'book',
                select: 'title image author' // 필요한 책 데이터
            });

        // 검색어가 있는 경우 자바스크립트에서 필터링
        if (query) {
            const regex = new RegExp(query, 'i'); // 대소문자 구분 없는 정규식
            reviews = reviews.filter(review =>
                regex.test(review.book.title) || regex.test(review.book.author)
            );
        }

        const userTotalReviews = reviews.length; // 검색된 리뷰 갯수
 
        res.render('profile/show', { user, reviews, currentUser: req.user, userId, query: req.query.query, userTotalReviews });
    } catch (error) {
        console.error(error);
        req.flash('Failed to load reviews');
    }
};

// 프로필 수정 폼
export const getEditProfile = async (req, res) => {
    try{
        const user = await User.findById(req.user._id);
        res.render('profile/edit', { user });
        sa
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

            // 새로운 파일 정보 저장
            user.profilePicture = req.file.path; // Cloudinary에서 반환된 URL
            user.profilePictureId = req.file.filename; // // Cloudinary에서 반환된 public_id
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

