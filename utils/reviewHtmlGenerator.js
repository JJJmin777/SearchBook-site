

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

export function generateBookDetailsReviewHTML(review, currentUser) {
   return `
        <div class="card mb-3 review-card" data-id=${review._id}>
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
                    <button class="btn btn-sm btn-outline-secondary ms-2 toggle-comments-btn" data-review-id="${ review._id }">
                    💬 Comments (<span id="comment-count-${ review._id }">
                        ${ review.comments.length }
                    </span>)
                    </button>
                </div>

                <div id="comments-${review._id}" class="mt-3 d-none">
                    ${review.comments.map(comment => `
                        <div class="mb-2">
                            <strong>${comment.author.username}:</strong>
                            ${comment.body}
                         <h6 class="card-subtitle mb-2 text-muted fs-6">
                                Comment on: ${new Date(comment.createdAt).toLocaleDateString()}
                            </h6>
                            ${currentUser && comment.author._id.toString() === currentUser._id.toString() ? `
                                <form action="/books/${review.book._id}/reviews/${review._id}/comments/${comment._id}?_method=DELETE"
                                    method="POST" class="d-inline">
                                    <button class="btn btn-sm btn-danger delete-comment-btn"
                                        data-book-id="${review.book._id}" data-comment-id="${comment._id}"
                                        data-review-id="${review._id}">
                                        Delete
                                    </button>
                                </form>
                            ` : ''}
                        </div>
                    `).join('')}

                    ${currentUser ? `
                        <form class="comment-form" data-book-id="${review.book._id}"
                            data-review-id="${review._id}">
                            <div class="input-group">
                                <input type="text" name="body" class="form-control comment-input"
                                    placeholder="Add a comment" required>
                                <button class="btn btn-primary" type="submit">Submit</button>
                            </div>
                        </form>
                    ` : `
                        <div class="alert alert-warning">You must be logged in to add a comment.</div>
                    `}
                </div>

                <!-- 액션 버튼 (Edit/Delete) -->
                ${generateReviewActionsHTML(review, currentUser)}

            </div>
        </div>           
    `;
};

export function generateReviewActionsHTML(review, currentUser) {
    if (currentUser || review.author._id == currentUser._id) {
        return `<div class="action-buttons mt-3">
            <a href="/books/${review.book._id}/reviews/${review._id}/edit?returnurl=/books/${review.book._id}"
                class="btn btn-sm btn-outline-warning me-2">Edit</a>

            <button type="button" class="btn btn-sm btn-outline-danger" data-bs-toggle="modal"
                data-bs-target="#deleteModal-${review._id}">
                Delete
            </button>

            ${generateConfirmDeleteModal(review._id, 'review', `/books/${review.book._id}/reviews/${review._id}?_method=DELETE`)}
        </div>`; 
    };
};

export function generateConfirmDeleteModal(itemId, itemName, deleteUrl) {
    return`
        <div class="modal fade" id="deleteModal-${itemId}" tabindex="-1" aria-labelledby="deleteModalLabel-${itemId}" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="deleteModalLabel-${itemId}">Confirm Delete</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        Are you sure you want to delete this ${itemName}?
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                        <form action="${deleteUrl}" method="POST">
                            <button type="submit" class="btn btn-danger">Delete</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    `
};