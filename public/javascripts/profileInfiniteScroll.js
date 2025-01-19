import { initializeReviewStates } from "./reviewtoggle.js";
import { toggleComments } from "./reviewComment.js";

document.addEventListener('DOMContentLoaded', () => {
    const reviewSection = document.getElementById('review-section');
    const loadMoreButton = document.getElementById('load-more-btn');
    const userId = loadMoreButton.dataset.userId || ''; // 프로필의 userId
    const bookId = loadMoreButton.dataset.bookId || ''; // 프로필의 bookId
    const sortBy = loadMoreButton.dataset.sort;
    console.log(bookId)
    loadMoreButton.addEventListener('click', async () => {
        // 버튼 클릭 시 DOM에서 마지막 리뷰를 가져오기
        try {

            const lastReview = reviewSection.querySelector('.review-card:last-child'); // 마지막 리뷰 카드
            const lastReviewId = lastReview ? lastReview.dataset.id : null; // 마지막 리뷰의 IDv

            const response = await fetch(
                `/api/reviews?lastReviewId=${lastReviewId}&userId=${userId}&bookId=${bookId}&sortBy=${sortBy}`
            );
            if (!response.ok) {
                throw new Error('Failed to fetch reviews.');
            }

            const data = await response.json();

            const { reviews, currentUser } = data;

            // 새 리뷰 추가
            reviews.forEach((review) => {
                // 리뷰 카드 생성 및 currentUser 활용
                if (!userId == ''){
                    const reviewCard = createProfileReviewcard(review);
                    reviewSection.appendChild(reviewCard);
                } else {
                    console.log(bookId)
                    const reviewCard = createBookReviewcard(review,currentUser);
                    reviewSection.appendChild(reviewCard);
                }
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

export function createProfileReviewcard(review) {
    const card = document.createElement('div');
                card.className = 'review-card';
                card.dataset.id = review._id; // 리뷰 ID 저장
                card.innerHTML = `
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
    return card;
};

export function createBookReviewcard(review,currentUser){
    const card = document.createElement('div');
                card.className = 'review-card';
                card.dataset.id = review._id; // 리뷰 ID 저장
                card.innerHTML = `
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

                            <div class="d-flex align-items-center">
                <button class="btn btn-sm btn-outline-primary like-button" data-book-id="${ review.book._id }"
                    data-review-id="${ review._id }"
                    data-liked="${ currentUser ? (review.likes || []).includes(currentUser._id) : false }"
                    ${currentUser ? '' : 'disabled' }>
                    <span class="like-icon">
                        ${ currentUser && review.likes.includes(currentUser._id) ? '❤️' : '🤍' }
                    </span>
                    <span class="like-count">
                        ${ review.likes.length }
                    </span>
                </button>
                <button class="btn btn-sm btn-outline-secondary ms-2" onclick="${ toggleComments(review._id) }">
                    💬 Comments (<span id="comment-count-${ review._id }">
                        ${ review.comments.length }
                    </span>)
                </button>
            </div>
                        </div>
                    </div>
                
                `;
    return card;
};