// 리뷰 HTML 생성 함수
const renderReviews = (reviews) => {
    return reviews.map(review => `
        <div class="card mb-3">
            <div class="card-body">
                <h5 class="card-title">${review.author.username}</h5>
                <p>Rated: ${review.rating}/5 ⭐</p>
                <p>${review.body}</p>
                <div>❤️ ${review.likes} likes</div>
            </div>
        </div>
    `).join('');
};

export default renderReviews