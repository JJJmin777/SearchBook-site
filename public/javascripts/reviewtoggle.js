export function initializeReviewStates() {
    console.log("Initializing review states");

    const reviewSection = document.getElementById('review-section');

    reviewSection.querySelectorAll('.review-body').forEach((reviewBody) => {

        const button = reviewBody.nextElementSibling; // 버튼은 바로 다음 요소
        
        if (!button || !button.classList.contains('toggle-button')) return;

        // 리뷰 길이에 따라 버튼 표시/숨김 설정
        if (reviewBody.scrollHeight <= 80) {
            button.style.display = 'none'; // 리뷰가 짧으면 버튼 숨기기
        } else {
            button.style.display = 'inline'; // 리뷰가 길면 버튼 표시
            reviewBody.style.maxHeight = '4.5rem'; // 기본 축소 상태
        }
    });
}

export function setupReviewToggle() {
    const reviewSection = document.getElementById('review-section');

    // 초기 리뷰 상태 설정
    initializeReviewStates();

    // 이벤트 위임으로 클릭 이벤트 처리
    reviewSection.addEventListener('click', (event) => {
        const button = event.target.closest('.toggle-button');
        if (!button) return; // 클릭된 요소가 toggle-button이 아니면 무시

        const reviewBody = button.previousElementSibling; // 버튼의 이전 요소 (리뷰 본문)

        if (reviewBody.classList.contains('expanded')) {
            reviewBody.classList.remove('expanded');
            reviewBody.style.maxHeight = '4.5rem';
            button.textContent = 'Read More';
        } else {
            reviewBody.classList.add('expanded');
            reviewBody.style.maxHeight = `${reviewBody.scrollHeight}px`;
            button.textContent = 'Read Less';
        }
    });
};

document.addEventListener('DOMContentLoaded', setupReviewToggle);