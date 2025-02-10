import { initializeReviewStates } from "./reviewtoggle.js";
import { sortReviews } from "./sortreview.js";

// 현재 활성화된 정렬 버튼 찾기 함수
function getActiveSort() {
    // 현재 활성화된 정렬 버튼 찾기
    const activeButton = document.querySelector(".review-sort-btn.active");
    const sortBy = activeButton ? activeButton.dataset.sort : "likes"; // 기본값: 좋아요순

    // 현재 페이지(혹은 DOM)에서 bookId를 가지고 있는 요소 찾기
    const bookElement = document.querySelector("[data-book-id]");
    const bookId = bookElement ? bookElement.dataset.bookId : undefined;

    return { sortBy, bookId };
}

// 리뷰 업데이트 함수 (검색어 & 정렬 기준 기반으로 요청)
async function updatedReviews() {
    const reviewSection = document.getElementById("review-section");
    const loadMoreButton = document.getElementById("load-more-btn");
    const searchQueryDisplay = document.getElementById("search-query-display");
    const searchInput = document.getElementById("review-search");

    if (!searchInput  || !searchQueryDisplay  || !reviewSection) return;

    const query = searchInput.value.trim();
    const { sortBy, bookId } = getActiveSort(); // 현재 활성화된 정렬 버튼 기준

    if (!query) {
        alert("Please enter a search term."); // 검색어가 없을 경우 알림
        return;
    }

    try {
        const response = await fetch(`/books/${bookId}/reviews/search?query=${encodeURIComponent(query)}&sortBy=${sortBy}`);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        // 기존 리뷰 목록 삭제 후 새로운 검색 결과 삽입
        reviewSection.innerHTML = ""; 

        if (data.reviews.length > 0) {
            reviewSection.innerHTML = data.reviews.join("");  // 서버에서 받은 HTML을 바로 삽입
            // ✅ 검색어 표시 (검색 바 아래에 표시)
            searchQueryDisplay.innerHTML = `
                <div class="alert alert-info d-flex justify-content-between align-items-center">
                    <span>Showing results for: <strong>${query}</strong> (Sorted by: ${sortBy})</span>
                    <button id="clear-search-btn" class="btn btn-sm btn-outline-danger">X</button>
                </div>
            `;
            attachClearSearchEvent(); // X 버튼 이벤트 추가

            if (loadMoreButton) loadMoreButton.style.display = "none"; //Load More 버튼 숨김
        } else {
            reviewSection.innerHTML = "<p>No matching reviews found.</p>"; // 검색 결과 없음 메시지 표시
            if (loadMoreButton) loadMoreButton.style.display = "none"; //Load More 버튼 숨김
        }

        // 새 HTML에 대해 toggle 초기화
        initializeReviewStates();

    } catch (error) {
        console.error("Error fetching search results:", error);
        alert("An error occurred while fetching reviews.");
    }
}

// 검색어 X 버튼 클릭 시 기존 리뷰 목록 복원
function attachClearSearchEvent() {
    const clearSearchButton = document.getElementById("clear-search-btn");
    const searchQueryDisplay = document.getElementById("search-query-display");
    const searchInput = document.getElementById("review-search"); 

    const { sortBy, bookId } = getActiveSort();
    
    if (clearSearchButton) {
        clearSearchButton.addEventListener("click", async (event) => {
            searchQueryDisplay.innerHTML = ""; // 검색어 표시 제거
            searchInput.value = ""; // 입력창 초기화

            sortReviews(event, sortBy, bookId) // 기존 리뷰 목록으로 복원
        });
    }
}

// `DOMContentLoaded` 안에서 함수들 사용
document.addEventListener("DOMContentLoaded", () => {
    
    const searchButton = document.getElementById("review-search-btn");
    const reviewSortButtons = document.querySelectorAll(".review-sort-btn");

    if (searchButton) {
        searchButton.addEventListener("click", updatedReviews);
    }
    
    if (reviewSortButtons) {
        reviewSortButtons.forEach(button => {
            button.addEventListener("click", (event) => {
                reviewSortButtons.forEach(btn => btn.classList.remove("active"));
                button.classList.add("active");

                const sortBy = button.dataset.sort;
                const bookId = button.dataset.bookId;

                if (!bookId) {
                    console.error("Book ID is missing");
                    return;
                }

                document.getElementById("search-query-display").innerHTML = ""; // 검색어 제거
                document.getElementById("review-search").value = ""; // 입력창 초기화
                
                sortReviews(event, sortBy, bookId)
            });
        });
    }

     // 검색어 삭제 버튼 이벤트 추가
    attachClearSearchEvent();
});