import Review from '../models/review.js';

export const fetchReviews = async (req, res) => {
    try {
        const { limit = 5, bookId, userId, lastReviewId } = req.query;

        // 필터 조건 설정
        const query = {};
        if (bookId) query.book = bookId;
        if (userId) query.author = userId;

        // 이미 로드된 리뷰 이후 데이터를 가져오기 위해 `lastReviewId`를 사용
        if (lastReviewId) {
            const lastReview = await Review.findById(lastReviewId);
            if (lastReview) {
                query.createdAt = { $lt: lastReview.createdAt }; // 마지막 리뷰의 생성 시간보다 이전 리뷰만 가져오기
                console.log(query)
            }
        }

        // 리뷰 데이터 쿼리
        const reviews = await Review.find(query)
            .populate('book', 'title image author')
            .sort({ createdAt: -1 }) // 최신순 정렬
            .limit(parseInt(limit));

        res.status(200).json({ reviews });
    } catch (error) {
        console.error('Error fetching reviews:', error);
        res.status(500).json({ error: 'Failed to fetch reviews.' });
    }
};
