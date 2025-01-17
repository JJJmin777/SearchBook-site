import Review from '../models/review.js';


export const fetchReviews = async (req, res) => {
    try {
        const { limit = 5, bookId, userId, lastReviewId, sortBy = 'likes' } = req.query;

        // 필터 조건 설정
        const query = {};
        if (bookId) query.book = bookId;
        if (userId) query.author = userId;

        // 이미 로드된 리뷰 이후 데이터를 가져오기 위해 `lastReviewId`를 사용
        if (lastReviewId) {
            const lastReview = await Review.findById(lastReviewId);
            if (lastReview) {
                // 좋아요순 또는 최신순에 따라 조건 변경
                if (sortBy === 'likes') {
                    query.likesCount = { $lt: lastReview.likes.length };
                } else {
                    query.createdAt = { $lt: lastReview.createdAt }; // 마지막 리뷰의 생성 시간보다 이전 리뷰만 가져오기
                }
            }
        }

        // 정렬 기준
        const sortCondition = sortBy === 'likes' ? { likesCount: -1 } : { createdAt: -1 };

        // 리뷰 데이터 쿼리
        const reviews = await Review.find(query)
            .populate('book', 'title image author')
            .populate('author', 'username profilePicture') // 작성자 정보 가져오기
            .populate({
                path: 'comments', // 리뷰의 댓글
                populate: {
                    path: 'author', // 댓글 작성자
                    select: 'username profilePicture', // 필요한 필드만 가져오기
                },
                select: 'body author createdAt', // 댓글의 본문 및 작성자, 작성 시간
                })
            .sort(sortCondition) // 정렬 적용
            .limit(parseInt(limit));
            // .lean();  데이터를 단순 객체 형태로 변환

        // 각 리뷰에 대해 HTML 렌더링 (조건에 따라)
        // const currentUserId = req.user ? req.user._id.toString() : null;

        // for (const review of reviews) {
        //     // 버튼 및 모달 HTML 생성
        //     const actionButtonsHTML = currentUserId && review.author._id.toString() === currentUserId 
        //         ? `
        //             <a href="/books/${review.book._id}/reviews/${review._id}/edit?returnurl=${currentlUrl}" 
        //                 class="btn btn-outline-warning">Edit</a>
        //             <button type="button" class="btn btn-outline-danger" 
        //                     data-bs-toggle="modal" 
        //                     data-bs-target="#deleteModal-${review._id}">Delete</button>
        //         `
        //         : '';

        //     // 모달 HTML 생성
        //     const modalHTML = await ejs.renderFile(
        //         path.join(__dirname, '../views/partials/confirmDeleteModal.ejs'), 
        //         {
        //             itemId: review._id,
        //             itemname: 'review',
        //             deleteUrl: `books/${review.book._id}/reviews/${review._id}?_method=DELETE`,
        //         }
        //     );

        //     // 리뷰 데이터에 HTML 추가
        //     review.actionButtonsHTML = actionButtonsHTML;
        //     review.modalHTML = modalHTML
        // }
        
        res.status(200).json({ reviews });
    } catch (error) {
        console.error('Error fetching reviews:', error);
        req.flash('error', '리뷰를 가져오는 데 실패했습니다.');
    }
};
