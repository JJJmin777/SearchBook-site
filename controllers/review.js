import Book from '../models/search.js'
import Review from "../models/review.js";
import User from '../models/user.js';
import Comment from '../models/comment.js';
import ejs from 'ejs'; //getsortreviews 함수필

// 리뷰 만들기
export const createReview = async (req, res) => {
    const book = await Book.findById(req.params.bookId); // 주소에 있는 책의 - :bookId
    const review = new Review(req.body.review); // 값을 입력하면 post로 전달받는 req.body - (두 개)

    review.author = req.user._id; // 현재 user의 _id
    review.book = req.params.bookId; // review에 책 위치 설정
    book.reviews.push(review);

    await review.save(); // 이 작업이 없으면 book.reviews가 참조하는 ObjectId에 대한 실제 데이터가 존재하지 않음
    await book.save(); // book 데이터를 업데이트하여 reviews 배열에 새로운 리뷰의 ObjectId를 포함

    // user에 자기가 쓴 review 저장
    const user = await User.findById(req.user._id);
    user.reviews.push(review);
    await user.save();

    req.flash('success', 'Created new review');
    res.redirect(`/books/${book._id}`);
}

// 리뷰 지우기
export const deleteReview = async (req, res) => {
    const { bookId, reviewId } = req.params;

    await Comment.deleteMany({ review: reviewId }); // 리뷰에 연결된 모든 댓글 삭제

    await Book.findByIdAndUpdate(bookId, { $pull: { reviews: reviewId } }); // book에서 reviews 배열에서 reviewId 제거

    const userId = req.user._id;
    await User.findByIdAndUpdate(userId, { $pull: { reviews: reviewId } }); // user에서 reviews 배열에서 reviewId 제거

    await Review.findByIdAndDelete(reviewId);  // 리뷰 자체도 삭제

    req.flash('success', 'Successfully deleted review');
    res.redirect(`/books/${bookId}`);
}

// 리뷰의 좋아요 기능 
export const toggleLike = async (req, res) => {
    try {
        const { reviewId } = req.params;
        const userId = req.user._id;

        // 리뷰 찾기
        const review = await Review.findById(reviewId);

        if (!review) {
            return res.status(404).json({ error: 'Review not found. '});
        }

        // 이미 좋아요를 누른 사용자인지 확인
        const alreadyLiked = review.likes.includes(userId);

        if (alreadyLiked) {
            // 좋아요 취소
            review.likes.pull(userId); // 배열에서 사용자 ID 제거
        } else {
            // 좋아요 추가
            review.likes.push(userId);
        }

        await review.save();

        res.json({ 
            success: true, 
            likesCount: review.likes.length,
            liked: !alreadyLiked // 좋아요 상태 반환
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to toggle like' });
    }
};

// 리뷰의 코멘트 추가 기능
export const addComment = async (req, res) => {
    try {

        const { reviewId } = req.params;
        const { body } = req.body;

        if (!body || body.trim() === '') {
            return res.status(400).json({ error: 'Comment body cannot be empty.' });
        }

        const comment = new Comment({
            review: reviewId,
            body,
            author: req.user._id
        });

        await comment.save();

        // 리뷰에 댓글 참조 추가
        const review = await Review.findById(reviewId);
        review.comments.push(comment);
        await review.save();

        await comment.populate('author'); // 작성자 데이터 포함
        res.json({ success: true, comment });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to add a comment' });
    }
};

// 리뷰의 코멘트 삭제
export const deleteComment = async (req, res) => {
    try {
        const { reviewId, commentId } = req.params;

        await Comment.findByIdAndDelete(commentId);  // 코멘트트 자체도 삭제

        await Review.findByIdAndUpdate(reviewId, { $pull: { comments: commentId } }); // review에서 comments 배열에서 commentId 제거

        res.json({ success: true, message: 'Comment deleted successfully.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to delete comment.' });
    }
    
}

// 리뷰 정렬 기능
export const getSortedReviews = async (req, res) => {
    try {
        const { bookId } = req.params; // 책 ID
        const { sort } = req.query; // 정렬 기준

        const reviews = await Review.find({ book: bookId })
            .populate('author')
            .populate({
                path: 'comments',
                populate: { path: 'author' } // 댓글 작성자까지 조회
            });

        if (sort === 'likes') {
            reviews.sort((a, b) => b.likes - a.likes); // 좋아요 순
        } else if (sort === 'newest') {
            reviews.sort((a, b) => b.createdAt - a.createdAt); // 최신순
        }

        const html = await ejs.renderFile('partials/reviews.ejs', { reviews });
        res.json({ success: true, html });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to load reviews' });
    }
};