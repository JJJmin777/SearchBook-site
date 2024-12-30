// 리뷰 길이가 길때 접었다가 폈다 
document.addEventListener('DOMContentLoaded', () => {
    const toggleButtons = document.querySelectorAll('.toggle-button');

    toggleButtons.forEach(button => {
        const reviewBody = button.previousElementSibling;

        // 리뷰 길이에 따라 toggle 버튼 표시/숨김
        if (reviewBody.scrollHeight <= 80) {
            button.style.display = 'none'; // 리뷰가 짧으면 버튼 숨기기
        } else {
            button.style.display = 'inline'; // 리뷰가 길면 버튼 표시
            reviewBody.style.maxHeight = '4.5rem'; // 기본 축소 상태
        }

        button.addEventListener('click', () => {
            if (reviewBody.classList.contains('expanded')) {
                reviewBody.classList.remove('expanded');
                reviewBody.style.maxHeight = '4.5rem';
                button.textContent = 'Read More';
            } else {
                reviewBody.classList.add('expanded');
                reviewBody.style.maxHeight = `${reviewBody.scrollHeight}px`; // 최대 높이 설정
                button.textContent = 'Read Less';
            }
        });
    });
});