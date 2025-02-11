import { initializeReviewStates } from "./reviewtoggle.js";
import { initializeLoadMoreButton } from "./reviewInfiniteButton.js"

export async function sortReviews(event, sortBy, bookId) {

    try {
        const loadMoreButton = document.getElementById('load-more-btn');

        const pageType = loadMoreButton?.dataset.pageType || "bookdetails"; // 기본값 "bookdetails"

        const response = await fetch(`/books/${bookId}/reviews?sort=${sortBy}`);

        if (!response.ok) {
            throw new Error(`Failed to fetch sorted reviews: ${response.statusText}`);
        }

        const data = await response.json();

        const reviewSection = document.getElementById('review-section');
        if (!reviewSection) {
            throw new Error("Review section element not found.");
        }

        // 서버에서 반환된 HTML로 교체
        reviewSection.innerHTML = data.html;

        // 새 HTML에 대해 toggle 초기화
        initializeReviewStates();

        // Load More 버튼 초기화
        if (loadMoreButton) {
            initializeLoadMoreButton(loadMoreButton, pageType);
        }
        
        // console.log('Reviews sorted successfully');
    } catch (err) {
        console.error('Error in sortReviews:', err);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const buttons = document.querySelectorAll("[data-sort]");
    buttons.forEach((button) => {
        button.addEventListener("click", (event) => {
            // 기존 활성화된 버튼에서 .active 제거
            document.querySelector("[data-sort].active")?.classList.remove("active");

            button.classList.add("active");

            const sortBy = button.dataset.sort;
            const bookId = button.dataset.bookId;

            if (!bookId) {
                console.error("Book ID is missing");
                return;
            }

            sortReviews(event, sortBy, bookId);
        });
    });
});