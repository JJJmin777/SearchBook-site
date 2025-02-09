import { getActiveResourcesInfo } from "process";
import { initializeReviewStates } from "./reviewtoggle.js";

export function initializeBookReviewSearch() {
    const searchInput = document.getElementById("review-search"); // 검색 입력창
    const searchQueryDisplay = document.getElementById("search-query-display"); // 검색어 표시 영역
    const reviewSortButtons = document.querySelectorAll(".review-sort-btn"); // 리뷰 정렬 버튼들

    if (!searchInput || !searchQueryDisplay || !reviewSortButtons) return;

    // 리뷰 정렬 버튼 클릭 시 검색어 표시 제거 & 입력창 초기화
    reviewSortButtons.forEach(button => {
        button.addEventListener("click", () => {
            searchQueryDisplay.innerHTML = ""; // 검색어 표시 제거
            searchInput.value = ""; // 입력창 초기화
        });
    });
}

// 현재 활성화된 정렬 버튼 찾기 함수
function getActiveSort() {
    const activeButton = document.querySelector(".review-sort-btn.active");
    return activeButton ? activeButton.dataset.sort : "likes"; // 기본값: 좋아요순
}

// 리뷰 업데이트 함수 (검색어 & 정렬 기준 기반으로 요청)
async function updatedReviews() {
    const reviewSection = document.getElementById("review-section");
    const loadMoreButton = document.getElementById("load-more-btn");
    const searchQueryDisplay = document.getElementById("search-query-display");
    const searchInput = document.getElementById("review-search");
    const bookElement = document.querySelector("[data-book-id]");
    const bookId = bookElement ? bookElement.dataset.bookId : undefined;

    if (!searchInput  || !searchQueryDisplay  || !reviewSection || !bookId) return;

    const query = searchInput.value.trim();
    const sortBy = getActiveSort(); // 현재 활성화된 정렬 버튼 기준

    if (!query) {
        alert("Please enter a search term."); // 검색어가 없을 경우 알림
        return;
    }

    try {
        const response = await fetch(`/books/${bookId}/reviews/search?query=${query}`);

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
    }
}

// 검색어 X 버튼 클릭 시 기존 리뷰 목록 복원
function attachClearSearchEvent() {
    const clearSearchButton = document.getElementById("clear-search-btn");
    
    if (clearSearchButton) {
        clearSearchButton.addEventListener("click", async () => {
            searchQueryDisplay.innerHTML = ""; // 검색어 표시 제거
            searchInput.value = ""; // 입력창 초기화
            await resetReviews(); // 기존 리뷰 목록으로 복원
        });
    }
}

// 기존 리뷰 목록 복원 함수
async function resetReviews() {
    const reviewSection = document.getElementById("review-section");
    const bookElement = document.querySelector("[data-book-id]");
    const bookId = bookElement ? bookElement.dataset.bookId : undefined;

    const sortBy = getActiveSort(); // 현재 활성화된 정렬 버튼 기준
    
    if (!reviewSection || !bookId) return;

    try {
        const response = await fetch(`/api/reviews?bookId=${bookId}&sortBy=${sortBy}`)
    }
}

document.addEventListener("DOMContentLoaded", () => {
    
    const searchButton = document.getElementById("review-search-btn");
    
    
    

    
});