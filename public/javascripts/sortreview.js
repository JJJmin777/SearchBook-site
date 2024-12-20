function sortReviews(sortBy) {
    fetch(`/books/<%= book._id %>/reviews?sort=${sortBy}`)
        .then(response => response.json())
        .then(data => {
            const reviewSection = document.getElementById('review-section');
            reviewSection.innerHTML = data.html; // 서버에서 받은 HTML로 교체
        });
}
