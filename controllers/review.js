import Book from '../models/search.js'
import Review from "../models/review.js";
import User from '../models/user.js';

// 리뷰 만들기
export const createReview = async (req, res) => {
    const book = await Book.findById(req.params.bookId); // 주소에 있는 책의 - :bookId
    const review = new Review(req.body.review); // 값을 입력하면 post로 전달받는 req.body - (두 개)
    review.author = req.user._id; // 현재 user의 _id
    review.book = req.params.bookId // review에 책 위치 설정
    book.reviews.push(review);
    await review.save(); // 이 작업이 없으면 book.reviews가 참조하는 ObjectId에 대한 실제 데이터가 존재하지 않음
    await book.save(); // book 데이터를 업데이트하여 reviews 배열에 새로운 리뷰의 ObjectId를 포함

    // user에 자기가 쓴 review 저장
    const user = await User.findById(req.user._id);
    user.reviews.push(review);
    await user.save();

    req.flash('success', 'Created new review')
    res.redirect(`/books/${book._id}`);
}

// 리뷰 지우기
export const deleteReview = async (req, res) => {
    const { bookId, reviewId } = req.params;
    await Book.findByIdAndUpdate(bookId, { $pull: { reviews: reviewId}}) // book에서 reviews 배열에서 reviewId 제거
    const userId = req.user._id;
    await User.findByIdAndUpdate(userId, { $pull: { reviews: reviewId}}) // user에서 reviews 배열에서 reviewId 제거
    await Review.findByIdAndDelete(reviewId);  // 리뷰 자체도 삭제

    req.flash('success', 'Successfully deleted review');
    res.redirect(`/books/${bookId}`);
}