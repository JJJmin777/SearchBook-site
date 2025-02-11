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
                const currentPage = parseInt(loadMoreButton.dataset.page);

                if(!pageType) {
                    console.error("pageType is missing");
                    return;
                }

                // 리뷰 추가 로드
                const { reviews, hasMore } = await loadMoreReviews(bookId, userId, lastReviewId, sortBy, pageType, currentPage);
                // console.log(reviews, hasMore)

                // **여기서 새로 로드된 리뷰에 대해 초기화**
                initializeReviewStates();

                // 버튼 업데이트
                if (hasMore) {
                    loadMoreButton.dataset.page = currentPage + 1;
                } else {
                    loadMoreButton.style.display = 'none'; // 더 이상 데이터가 없으면 숨김
                }

            } catch(error) {
                console.error('Error loading reviews:', error);
            }
        });
    };
});