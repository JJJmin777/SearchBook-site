import Book from '../models/search.js'
import Review from "../models/review.js";

export const createReview = async (req, res) => {
    const book = await Book.findById(req.params.id); // 주소에 있는 책의 - :id
    const review = new Review(req.body.review); // 값을 입력하면 post로 전달받는 req.body - (두 개)
    review.author = req.user._id; // 현재 user의 _id
    book.reviews.push(review);
    await review.save(); // 이 작업이 없으면 book.reviews가 참조하는 ObjectId에 대한 실제 데이터가 존재하지 않음
    await book.save(); // book 데이터를 업데이트하여 reviews 배열에 새로운 리뷰의 ObjectId를 포함
    req.flash('success', 'Created new review')
    res.redirect(`/books/${book._id}`);
}

export const deleteReview = async (req, res) => {
    const { id, reviewId } = req.params;
    await Book.findByIdAndUpdate(id, { $pull: { reviews: reviewId}}) // reviews 배열에서 reviewId 제거
    await Review.findByIdAndDelete(reviewId);  // 리뷰 자체도 삭제
    req.flash('success', 'Successfully deleted review');
    res.redirect(`/books/${id}`);
}