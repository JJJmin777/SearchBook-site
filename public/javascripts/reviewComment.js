// 좋아요 버튼 클릭 처리
document.querySelectorAll('.like-button').forEach(button => {
    button.addEventListener('click', async () => {
        
        const bookId = button.dataset.bookId; 
        const reviewId = button.dataset.reviewId;
        const liked = button.dataset.liked === 'true'; // 현재 좋아요 상태
        const likeIcon = button.querySelector('.like-icon'); // 하트 아이콘
        const likeCount = button.querySelector('.like-count'); // 좋아요 수

        try {
            const response = await fetch(`/books/${bookId}/reviews/${reviewId}/like`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }
            });

            if (!response.ok) {
                throw new Error('Failed to toggle like');
            }

            const data = await response.json();

            // 좋아요 상태 및 UI 업데이트
            button.dataset.liked = data.liked; // 새로운 좋아요 상태
            likeIcon.textContent = data.liked ? '❤️' : '🤍'; // 하트 업데이트
            likeCount.textContent = data.likesCount; // 좋아요 수 업데이트
        } catch (err) {
            console.error(err);
            alert('Failed to toggle like');
        }
    });
});


// 댓글 토글 함수
function toggleComments(reviewId) {
    const commentsDiv = document.getElementById(`comments-${reviewId}`);
    if (commentsDiv) {
        commentsDiv.classList.toggle('d-none'); // 댓글 영역 보이기/숨기기
    }
}

// 댓글 추가 처리
document.querySelectorAll('.comment-form').forEach(form => {
    form.addEventListener('submit', async (event) => {
        event.preventDefault(); // 폼 기본 동작 방지

        const bookId = form.dataset.bookId; // 북 ID
        const reviewId = form.dataset.reviewId; // 리뷰 ID
        const input = form.querySelector('.comment-input'); // 입력 필드
        const commentsDiv = document.getElementById(`comments-${reviewId}`); // 댓글 영역

        try {
            const response = await fetch(`/books/${bookId}/reviews/${reviewId}/comments`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ body: input.value }), // 댓글 데이터
            });

            if (!response.ok) {
                throw new Error('Failed to add comment');
            }

            const data = await response.json();

            // 새 댓글 추가
            const newComment = document.createElement('div');
            newComment.classList.add('mb-2');
            newComment.innerHTML = `<strong>${data.comment.author.username}:</strong> ${data.comment.body}`;
            commentsDiv.insertBefore(newComment, form);

            input.value = ''; // 입력 필드 초기화
        } catch (err) {
            console.error(err);
            alert('Failed to add comment');
        }
    });
});

// 코멘트(댓글) 삭제
document.querySelectorAll('.delete-comment-btn').forEach(button => {
    button.addEventListener('click', async (e) => {
        e.preventDefault();

        const bookId = button.dataset.bookId; // 북 ID
        const commentId = button.dataset.commentId; // 코멘트 ID
        const reviewId = button.dataset.reviewId; // 리뷰 ID

        try {
            const response = await fetch(`/books/${bookId}/reviews/${reviewId}/comments/${commentId}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
            });

            if (!response.ok) {
                throw new Error('Failed to delete comment');
            }

            // 댓글 DOM 요소 삭제
            button.closest('.mb-2').remove();
        } catch (err) {
            console.error(err);
            alert('Failed to delete comment');
        }
    });
});
