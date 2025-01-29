// 댓글 토글 함수
document.addEventListener("DOMContentLoaded", () => {
    document.body.addEventListener("click", (event) => {
        if (event.target.classList.contains("toggle-comments-btn")) {
            const reviewId = event.target.dataset.reviewId;
            const commentSection = document.getElementById(`comments-${reviewId}`);
            if (commentSection) {
                commentSection.classList.toggle('d-none');
            }
            console.log(commentSection.style.display)
        };
    });
});

// 댓글 처리용 상위 컨테이너 선택
const reviewSection = document.getElementById('review-section');

// 좋아요 버튼 클릭 처리
reviewSection.addEventListener('click', async (event) => {

    // 클릭된 요소가 좋아요 버튼인지 확인
    if (event.target.closest('.like-button')) {
        const button = event.target.closest('.like-button');
        const bookId = button.dataset.bookId;
        const reviewId = button.dataset.reviewId;
        const liked = button.dataset.liked === 'true'; // 현재 좋아요 상태
        const likeIcon = button.querySelector('.like-icon'); // 하트 아이콘
        const likeCount = button.querySelector('.like-count'); // 좋아요 수

        try {
            const response = await fetch(`/books/${bookId}/reviews/${reviewId}/like`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (response.status === 401) {
                // 로그인 필요 경고
                alert('You must be logged in to like this review.');
                return;
            }

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
            alert('Failed to toggle like~~');
        }
    };
});

// 댓글 추가 처리
reviewSection.addEventListener('submit', async (event) => { // 댓글 관련 이벤트 위임
    if (event.target.classList.contains('comment-form')) {
        event.preventDefault(); // 폼 기본 동작 방지

        const form = event.target;
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
    };
});

// 코멘트(댓글) 삭제
reviewSection.addEventListener('click', async (event) => {
    if (event.target.classList.contains('delete-comment-btn')) {
        event.preventDefault();

        const button = event.target;
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
    };
});


