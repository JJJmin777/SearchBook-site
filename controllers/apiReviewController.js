import Review from '../models/review.js';
import { generateBookDetailsReviewHTML, generateProfileReviewHTML, generateReviewActionsHTML, generateConfirmDeleteModal } from '../utils/reviewHtmlGenerator.js';


export const fetchReviews = async (req, res) => {
    try {
        const { limit = 3, bookId, userId, lastReviewId, sortBy, pageType } = req.query;
        const currentUser = req.user || null;
        const reviewPage = parseInt(req.query.currentPage || "1", 10); // 현재 페이지

        // 검색 요청이면 limit을 적용하지 않고 전체 가져오기
        const isSearchRequest = query && query.trim().length > 0;
        const reviewLimit = isSearchRequest ? 0 : parseInt(limit) + 1; // 검색이면 제한 없음, 아니면 Load More용 limit

        // 필터 조건 설정
        let searchFilter = {};
        if (bookId) searchFilter.book = bookId;
        if (userId) searchFilter.author = userId;
        if (query) {
            searchFilter.body = { $regex: new RegExp(query, "i") }; // 대소문자 구분 없이 검색
        }

        // 이미 로드된 리뷰 이후 데이터를 가져오기 위해 `lastReviewId`를 사용
        if (lastReviewId) {
            const lastReview = await Review.findById(lastReviewId);
            console.log(lastReview.likesCount)
            if (lastReview) {
                const lastLikesCount = lastReview.likesCount;
                // 좋아요순 또는 최신순에 따라 조건 변경
                if (sortBy === 'likes') {
                    searchFilter.$or = [
                        { likesCount: { $lt: lastLikesCount } }, // 더 적은 좋아요 개수의 리뷰
                        {
                            likesCount: lastLikesCount, // 같은 좋아요 개수이면서 
                            createdAt: { $lt: new Date(lastReview.createdAt) } // 마지막 리뷰보다 더 오래된 리뷰만 가져오기
                        } 
                    ];
                } else {
                    searchFilter.createdAt = { $lt: new Date(lastReview.createdAt) }; // 마지막 리뷰의 생성 시간보다 이전 리뷰만 가져오기
                }
            }
        }

        // 정렬 기준 설정
        const sortCondition = sortBy === 'likes' ? { likesCount: -1, createdAt: -1 } : { createdAt: -1 };

        const totalReviews = isSearchRequest ? null : await Review.countDocuments({ book: bookId });

        // 리뷰 데이터 쿼리기준 조회
        const reviews = await Review.find(searchFilter)
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
            // .skip((reviewPage - 1 ) * limit) // 페이지에 따른 스킵 적용
            .limit(reviewLimit); // 다음 리뷰가 있는지 확인하기 위해 +1 개수만큼 가져옴
            // .lean();  데이터를 단순 객체 형태로 변환
                      
        // 다음 페이지 존재 여부 확인 (limit 개수보다 많으면 true)
        const hasMore = reviews.length > limit;

        // limit 개수까지만 응답에 포함 (초과분 제거)
        const reviewsToSend = hasMore ? reviews.slice(0, limit) : reviews;

        // HTML 생성 (페이지 타입에 따라 함수 선택)
        const reviewHTMLs = reviewsToSend.map((review) => 
            pageType === "bookdetails"
                ? generateBookDetailsReviewHTML(review, currentUser) // bookdetails용 HTML 생성
                : generateProfileReviewHTML(review, currentUser) // profile용 HTML 생성
        );
        
        res.status(200).json({ reviews: reviewHTMLs, currentUser, currentPage: reviewPage, hasMore }); // 현재 사용자 정보 전달
    } catch (error) {
        console.error('Error fetching reviews:', error);
        req.flash('error', '리뷰를 가져오는 데 실패했습니다.');
    }
};
