import { loadMoreReviews } from "./loadMoreReviews.js";
import { initializeReviewStates } from "./reviewtoggle.js";

export function initializeLoadMoreButton(loadMoreButton, pageType) {
    if (!loadMoreButton) {
        console.error("Load More button not found!")
        return;
    }

    loadMoreButton.style.display = 'block'; // 버튼을 다시 보이도록 설정
    loadMoreButton.dataset.pageType = pageType; // 현재 페이지 타입(bookdetails/profile) 설정
    loadMoreButton.dataset.page = 1; // 페이지 번호를 1로 초기화
}

document.addEventListener("DOMContentLoaded", () => {
    const reviewSection = document.getElementById('review-section');
    const loadMoreButton = document.getElementById('load-more-btn');

    if (loadMoreButton) {

        loadMoreButton.addEventListener('click', async () => {
            // 버튼 클릭 시 DOM에서 마지막 리뷰를 가져오기
            try {
                const lastReview = reviewSection.querySelector('.review-card:last-child'); // 마지막 리뷰 카드
                const lastReviewId = lastReview ? lastReview.dataset.id : null;
                const bookId = loadMoreButton.dataset.bookId || null; // 프로필의 bookId
                const userId = loadMoreButton.dataset.userId || null; // 프로필의 userId
                const sortByElement = document.querySelector("[data-sort].active");
                const sortBy = sortByElement ? sortByElement.dataset.sort : "newest";
                const pageType = loadMoreButton.dataset.pageType; // 페이지 타입 (bookdetails/profile)
                const reviewNextPage = parseInt(loadMoreButton.dataset.page);

                if(!pageType) {
                    console.error("pageType is missing");
                    return;
                }

                // 리뷰 추가 로드
                const newReviewsLoaded = await loadMoreReviews(bookId, userId, lastReviewId, sortBy, pageType, reviewNextPage);

                // **여기서 새로 로드된 리뷰에 대해 초기화**
                initializeReviewStates();

                // 마지막으로 로드된 리뷰 상태를 다시 갱신
                if (newReviewsLoaded.length === 0 || newReviewsLoaded.length < 5) {
                    loadMoreButton.style.display = 'none'; // 더 이상 로드할 리뷰가 없으면 버튼 숨기기
                }
            } catch(error) {
                console.error('Error loading reviews:', error);
            }
        });
    };
});