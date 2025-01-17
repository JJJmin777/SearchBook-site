import { initializeReviewStates } from "./reviewtoggle.js";

document.addEventListener('DOMContentLoaded', () => {
    const reviewSection = document.getElementById('review-section');
    const loadMoreButton = document.getElementById('load-more-btn');
    const bookId = loadMoreButton.dataset.bookId; // 프로필의 bookId

    loadMoreButton.addEventListener('click', async () => {
        // 버튼 클릭 시 DOM에서 마지막 리뷰를 가져오기
        try {

            const lastReview = reviewSection.querySelector('.review-card:last-child'); // 마지막 리뷰 카드
            const lastReviewId = lastReview ? lastReview.dataset.id : null; // 마지막 리뷰의 IDv

            const response = await fetch(`/api/reviews?lastReviewId=${lastReviewId}&bookId=${bookId}`);
            if (!response.ok) {
                throw new Error('Failed to fetch reviews.');
            }

            const data = await response.json();
            console.log(data)

            // 새 리뷰 추가
            data.reviews.forEach((review) => {
                const reviewCard = document.createElement('div');
                reviewCard.className = 'review-card';
                reviewCard.dataset.id = review._id; // 리뷰 ID 저장
                reviewCard.innerHTML = `
                    <div class="card mb-3 card-body">
                        <div class="card-body">
                            <h5 class="card-title">
                                <img src="${review.author.profilePicture || '/images/default-profile.png'}" alt="Profile Picture" class="profile-picture">
                                <a href="/profile/${review.author._id}">${ review.author.username }</a>
                            </h5>
                            <p class="card-text">
                                Rated: ${ review.rating }/5 ⭐
                            </p>
                            <div class="review-body">
                                ${ review.body }
                            </div>
                            <button class="toggle-button">Read More</button>

                            <h6 class="card-subtitle mb-2 text-muted">Reviewed on: ${new Date(review.createdAt).toLocaleDateString()}
                            </h6>
                    </div>
                `;
                reviewSection.appendChild(reviewCard);
            });

            // **여기서 새로 로드된 리뷰에 대해 초기화**
            initializeReviewStates();

            // 마지막으로 로드된 리뷰 상태를 다시 갱신
            if (data.reviews.length === 0 || data.reviews.length < 5) {
                loadMoreButton.style.display = 'none'; // 더 이상 로드할 리뷰가 없으면 버튼 숨기기
            }
        } catch (error) {
            console.error('Error loading reviews:', error);
        }
    });
});