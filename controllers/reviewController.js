import Book from '../models/book.js'
import Review from "../models/review.js";
import User from '../models/user.js';
import Comment from '../models/comment.js';
import ejs from 'ejs'; //getsortreviews 함수필
import getBookAverageRating from '../utils/getBookAverageRating.js';

// 리뷰 만들기
export const createReview = async (req, res) => {
    try {
        const { body, rating } = req.body.review;

    // 유효성 검사: 리뷰 본문과 별점이 있는지 확인
    if (!body || body.trim() === '') {
        req.flash('error', 'Review text is required.');
        return res.redirect(`/books/${req.params.bookId}`);
    }
    
    // 별점이 없으면 기본값 0.5점
    const validatedRating = rating || 0.5; 

    // 주소에 있는 책의 bookId로 책 데이터 가져오기
    const book = await Book.findById(req.params.bookId); 
    if (!book) {
        req.flash('error', 'Book not found.');
        return res.redirect('/books');
    } 

    // 새로운 리뷰 생성
    const review = new Review({
        body,
        rating: validatedRating,
        author: req.user._id, // 현재 user의 _id
        book: req.params.bookId, // review에 책 위치 설정
    }); 

    // 리뷰를 책과 사용자에 연결
    book.reviews.push(review._id);
    const user = await User.findById(req.user._id);
    if (user) {
        user.reviews.push(review._id);
    }

    // 저장 작업 병렬 처리 
    // 이 작업이 없으면 book.reviews가 참조하는 ObjectId에 대한 실제 데이터가 존재하지 않음
    // user에 자기가 쓴 review 저장
    // book 데이터를 업데이트하여 reviews 배열에 새로운 리뷰의 ObjectId를 포함
    await Promise.all([review.save(), book.save(), user.save()]);

    // 평균 별점과 리뷰 개수 재계산 후 Book 캐시 업데이트
    await getBookAverageRating(book._id, true);

    req.flash('success', 'Created new review');
    res.redirect(`/books/${book._id}`);
    } catch (error) {
        // console.err('Error creating review:', err)
        req.flash('error', 'Failed to create review.');
        res.redirect(`/books/${req.params.bookId}`);
    }  
};

// 리뷰 수정 페이지 렌더링
export const renderEditReviewPage = async (req, res) => {
    try {
        const { reviewId } = req.params;
        const review = await Review.findById(reviewId).populate('book');

        if (!review) {
            req.flash('error', 'Review not found!');
            return res.redirect('/mybooks');
        }

        res.render('bookreviews/edit', { 
            review,
            currentUrl: req.query.returnurl || `books/${review.book._id}` // 쿼리에서 currentUrl 경로 전달
        });
    } catch (err) {
        console.error(err);
        req.flash('error', 'Failed to load edit page.');
        res.redirect('/mybooks');
    }
};

//리뷰 수정(update reivew)
export const updateReview = async (req, res) => {

    try {
        const { reviewId, bookId } = req.params;
        const { rating, body } = req.body.review;
        // 쿼리 문자열에서 리다이렉트 경로 가져오기
        const redirectUrl = req.query.returnurl || `/books/${bookId}`;
        
        const review = await Review.findByIdAndUpdate(
            reviewId,
            { rating, body },
            { new: true, runValidators: true }
        );

        if (!review) {
            req.flash('error', 'Review not found!');
            return res.redirect(redirectUrl);
        }

        // 평균 별점과 리뷰 개수 재계산 후 Book 캐시 업데이트
        await getBookAverageRating(bookId, true);

        req.flash('success', 'Review updated successfully!');
        res.redirect(redirectUrl);

    } catch (err) {
        console.error(err);
        req.flash('error', 'Failed to update review.');
        res.redirect('/');
    }
}

// 리뷰 지우기
export const deleteReview = async (req, res) => {
    const { bookId, reviewId } = req.params;

    await Comment.deleteMany({ review: reviewId }); // 리뷰에 연결된 모든 댓글 삭제

    await Book.findByIdAndUpdate(bookId, { $pull: { reviews: reviewId } }); // book에서 reviews 배열에서 reviewId 제거

    const userId = req.user._id;
    await User.findByIdAndUpdate(userId, { $pull: { reviews: reviewId } }); // user에서 reviews 배열에서 reviewId 제거

    await Review.findByIdAndDelete(reviewId);  // 리뷰 자체도 삭제

    // 평균 별점과 리뷰 개수 재계산 후 Book 캐시 업데이트
    await getBookAverageRating(bookId, true);

    req.flash('success', 'Successfully deleted review');

    // 요청의 출처 또는 쿼리 문자열에 따라 리다이렉트 경로 설정
    const redirectUrl = req.get('Referer') || `/books/${bookId}`;
    res.redirect(redirectUrl);
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
            review.likesCount = review.likes.length; // 좋아요 개수 업데이트
        } else {
            // 좋아요 추가
            review.likes.push(userId);
            review.likesCount = review.likes.length; // 좋아요 개수 업데이트
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

        // 정렬 조건 설정
        let sortCondition;
        if ( sort == "likes"){
            sortCondition = { likesCount: -1, createdAt: -1 }; // 좋아요 많은순 + 최신순
        } else if ( sort == "newest") {
            sortCondition = { createdAt: -1 } // 최신순
        } else { 
            sortCondition = {}; // 기본 정렬
        }

        const reviews = await Review.find({ book: bookId }) // 해당 책의 리뷰만 가져옴
            .populate('author') // 리뷰 작성자
            .populate({
                path: 'comments',
                populate: { path: 'author' } // 댓글 작성자(author)까지 조회
            })
            .sort(sortCondition) // 정렬
            .limit(2); 

        const html = await ejs.renderFile('./views/partials/reviews.ejs', {
            sortedReviews: reviews,
            currentUser: req.user || null,
        });

        res.json({ success: true, html });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to load reviews' });
    }
};