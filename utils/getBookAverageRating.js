import mongoose from 'mongoose';
import Review from '../models/review.js';
import Book from '../models/book.js';

/**
 * 책의 평균 별점과 리뷰 개수를 다시 계산하고, 필요하면 캐시를 업데이트합니다.
 * @param {String} bookId - 별점을 계산할 책의 ID
 * @param {Boolean} updateBookCache - `Book` 문서 캐시를 업데이트할지 여부
 * @returns {Object} - { averageRating, reviewCount }
 */
const getBookAverageRating = async (bookId, updateBookCache = true) => {
    try {
        // 1. 리뷰 데이터에서 평균 별점과 리뷰 개수 계산

        // 'new'를 사용하여 ObjectId 생성
        const objectId = new mongoose.Types.ObjectId(bookId);

        const result = await Review.aggregate([
            { $match: { book: objectId } },
            {
                $group: {
                    _id: '$book', // book ID로 그룹화
                    averageRating: { $avg: '$rating' }, // 평균 별점
                    reviewCount: { $sum: 1 }, // 리뷰 개수
                },
            },
        ]);

        const { averageRating = 0, reviewCount = 0 } = result[0] || {};

        // 평균 별점을 소수 둘째 자리에서 반올림
        const roundedAverageRating = Math.round(averageRating * 100) / 100;

        // 2. Book 문서의 캐시 데이터 업데이트 (옵션)
        if (updateBookCache) {
            await Book.findByIdAndUpdate(bookId, {
                averageRating: roundedAverageRating,
                reviewCount,
            });
        }

        return { averageRating: roundedAverageRating, reviewCount };
    } catch (error) {
        console.error('평균 별점 계산 중 오류:', error);
        throw error; // 오류를 호출한 쪽으로 전달
    }
};

export default getBookAverageRating;