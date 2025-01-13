// public/javascripts/reviewLoader.js
document.addEventListener('DOMContentLoaded', () => {
    const reviewSection = document.getElementById('review-section');
    const loadMoreButton = document.getElementById('load-more');

    loadMoreButton.addEventListener('click', async () => {
        const page = parseInt(loadMoreButton.dataset.page, 10);
        const bookId = loadMoreButton.dataset.bookId; // bookId가 필요한 경우 사용
        const url = `/api/reviews?page=${page}&limit=5${bookId ? `&bookId=${bookId}` : ''}`;

        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error('Failed to fetch reviews');

            const data = await response.json();

            data.reviews.forEach((review) => {
                const reviewCard = document.createElement('div');
                reviewCard.className = 'review-card';
                reviewCard.innerHTML = `
                    <img src="${review.book.image}" alt="Book Image" class="book-image">
                    <div class="review-content">
                        <h3>${review.book.title}</h3>
                        <p class="author">${review.book.author}</p>
                        <p><strong>Rating:</strong> ${review.rating}/5 ⭐</p>
                        <p class="review-body"><strong>Review:</strong> ${review.body}</p>
                        <p class="review-date">Reviewed on: ${new Date(review.createdAt).toLocaleDateString()}</p>
                    </div>
                `;
                reviewSection.appendChild(reviewCard);
            });

            // 다음 페이지로 업데이트
            loadMoreButton.dataset.page = page + 1;

            // 데이터가 부족하면 버튼 숨기기
            if (data.reviews.length < 5) {
                loadMoreButton.style.display = 'none';
            }
        } catch (error) {
            console.error('Error loading reviews:', error);
        }
    });
});
