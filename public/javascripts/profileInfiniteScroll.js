import { initializeReviewStates } from "./reviewtoggle.js";

document.addEventListener('DOMContentLoaded', () => {
    const reviewSection = document.getElementById('review-section');
    const loadMoreButton = document.getElementById('load-more-btn');
    const userId = loadMoreButton.dataset.userId; // 프로필의 userId
    
    loadMoreButton.addEventListener('click', async () => {
        // 버튼 클릭 시 DOM에서 마지막 리뷰를 가져오기
        try {

            const lastReview = reviewSection.querySelector('.review-card:last-child'); // 마지막 리뷰 카드
            const lastReviewId = lastReview ? lastReview.dataset.id : null; // 마지막 리뷰의 IDv

            const response = await fetch(`/api/reviews?lastReviewId=${lastReviewId}&userId=${userId}`);
            if (!response.ok) {
                throw new Error('Failed to fetch reviews.');
            }

            const data = await response.json();

            // 새 리뷰 추가
            data.reviews.forEach((review) => {
                const reviewCard = document.createElement('div');
                reviewCard.className = 'review-card';
                reviewCard.dataset.id = review._id; // 리뷰 ID 저장
                reviewCard.innerHTML = `
                    <img src="${review.book.image}" alt="Book Image" class="book-image">
                    <div class="review-content">
                        <a href="/books/${review.book._id}"><h3>${review.book.title}</h3></a>
                        <p class="author">${review.book.author}</p>
                        <p><strong>Rating:</strong> ${review.rating}/5 ⭐</p>
                        <p class="review-body">${review.body}</p>
                        <button class="toggle-button">Read More</button>
                        <p class="review-date">Reviewed on: ${new Date(review.createdAt).toLocaleDateString()}</p>
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