import Review from '../models/review.js';
import { generateBookDetailsReviewHTML, generateProfileReviewHTML, generateReviewActionsHTML, generateConfirmDeleteModal } from '../utils/reviewHtmlGenerator.js';


export const fetchReviews = async (req, res) => {
    try {
        const { limit = 1, bookId, userId, lastReviewId, sortBy, pageType } = req.query;
        const currentUser = req.user || null;
        const reviewPage = parseInt(req.query.reviewPage || "1", 10); // 현재 페이지

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
                    query.$or = [
                        { likesCount: { $lt: lastReview.likes.length } }, // 더 적은 좋아요 개수의 리뷰
                        {
                            likesCount: lastReview.likes.length, // 같은 좋아요 개수이면서 
                            createdAt: { $lt: lastReview.createdAt } // 마지막 리뷰보다 더 오래된 리뷰만 가져오기
                        } 
                    ];
                } else {
                    query.createdAt = { $lt: lastReview.createdAt }; // 마지막 리뷰의 생성 시간보다 이전 리뷰만 가져오기
                }
            }
        }

        // 정렬 기준 설정
        const sortCondition = sortBy === 'likes' ? { likesCount: -1, createdAt: -1 } : { createdAt: -1 };

        const totalReviews = await Review.countDocuments(query);

        // 리뷰 데이터 쿼리기준 조회
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
            .skip((reviewPage - 1) * limit) // 페이지에 따른 스킵 적용
            .limit(limit);
            // .lean();  데이터를 단순 객체 형태로 변환
        console.log(`~~${currentUser} api에서`)
        // HTML 생성 (페이지 타입에 따라 함수 선택)
        const reviewHTMLs = reviews.map((review) => 
            pageType === "bookdetails"
                ? generateBookDetailsReviewHTML(review, currentUser) // bookdetails용 HTML 생성
                : generateProfileReviewHTML(review) // profile용 HTML 생성
        );
        
        // 다음 페이지가 있는지 확인
        const hasMore = reviewPage * limit < totalReviews;

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
        
        res.status(200).json({ reviews: reviewHTMLs, currentUser, currentPage: reviewPage, hasMore }); // 현재 사용자 정보 전달
    } catch (error) {
        console.error('Error fetching reviews:', error);
        req.flash('error', '리뷰를 가져오는 데 실패했습니다.');
    }
};
