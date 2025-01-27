

export function generateProfileReviewHTML(review) {
    return `
        <div class="review-card" data-id="${review._id}">
            <img src="${review.book.image}" alt="Book Image" class="book-image">
            <div class="review-content">
                <a href="/books/${review.book._id}"><h3>${review.book.title}</h3></a>
                <p class="author">${review.book.author}</p>
                <p><strong>Rating:</strong> ${review.rating}/5 ⭐</p>
             <p class="review-body">${review.body}</p>
                <button class="toggle-button">Read More</button>
                <p class="review-date">Reviewed on: ${new Date(review.createdAt).toLocaleDateString()}</p>
            </div>
        </div>
    `;
}

export function generateBookDetailsReviewHTML(review) {
   return `
                    <div class="card mb-3 card-body">
                        <div class="card-body">
                            <h5 class="card-title">
                                <img src="${review.author.profilePicture || '/images/default-profile.png'}" alt="Profile Picture" class="profile-picture">
                                <a href="/profile/${review.author._id}">${review.author.username}</a>
                            </h5>
                            <p class="card-text">
                                Rated: ${review.rating}/5 ⭐
                            </p>
                            <div class="review-body">
                                ${review.body}
                            </div>
                            <button class="toggle-button">Read More</button>

                            <h6 class="card-subtitle mb-2 text-muted">Reviewed on: ${new Date(review.createdAt).toLocaleDateString()}
                            </h6>

                            <div class="d-flex align-items-center">
                <button class="btn btn-sm btn-outline-primary like-button" data-book-id="${review.book._id}"
                    data-review-id="${review._id}"
                    data-liked="${currentUser ? (review.likes || []).includes(currentUser._id) : false}"
                    ${currentUser ? '' : 'disabled'}>
                    <span class="like-icon">
                        ${currentUser && review.likes.includes(currentUser._id) ? '❤️' : '🤍'}
                    </span>
                    <span class="like-count">
                        ${review.likes.length}
                    </span>
                </button>
                <button class="btn btn-sm btn-outline-secondary ms-2" onclick="${toggleComments(review._id)}">
                    💬 Comments (<span id="comment-count-${review._id}">
                        ${review.comments.length}
                    </span>)
                </button>
            </div>
                        </div>
                    </div>
                
                `;
};