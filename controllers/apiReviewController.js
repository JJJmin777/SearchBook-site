import Review from '../models/review.js';

export const fetchReviews = async (req, res) => {
    try {
        const { page = 1, limit = 10, bookId, userId } = req.query;

        // 필터 조건 설정
        const query = {};
        if (bookId) query.book = bookId;
        if (userId) query.author = userId;

        // 리뷰 데이터 쿼리
        const reviews = await Review.find(query)
            .populate('book', 'title image author')
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

        console.log(reviews);
        res.status(200).json({ reviews });
    } catch (error) {
        console.error('Error fetching reviews:', error);
        res.status(500).json({ error: 'Failed to fetch reviews.' });
    }
};
