export async function loadMoreReviews(bookId, userId, lastReviewId, sortBy, pageType, reviewNextPage) {
    try {
        // 조건적으로 쿼리스트링을 구성
        const queryParams = new URLSearchParams();

        if (bookId) queryParams.append("bookId", bookId);
        if (userId) queryParams.append("userId", userId);
        if (lastReviewId) queryParams.append("lastReviewId", lastReviewId);
        if (sortBy) queryParams.append("sortBy", sortBy);
        if (pageType) queryParams.append("pageType", pageType);
        if (reviewNextPage) queryParams.append("reviewNextPage", reviewNextPage);

        console.log(queryParams.toString())
        const response = await fetch(`/api/reviews?${queryParams.toString()}`);
        if (!response.ok) throw new Error(`Failed to load more reviews: ${response.statusText}`);

        const { reviews, hasmore } = await response.json();
        const reviewSection = document.getElementById("review-section");
        if (!reviewSection) throw new Error("Review section element not found.");

        // 새 리뷰를 기존 리뷰 목록에 추가
        reviews.forEach((reviewHTML) => {
            reviewSection.insertAdjacentHTML("beforeend", reviewHTML);
        });

        return reviews; // 새로 로드된 리뷰 반환
    } catch (err) {
        console.error("Error in loadMoreReviews:", err);
        return [];
    }
}