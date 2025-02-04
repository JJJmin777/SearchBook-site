document.addEventListener("DOMContentLoaded", function () {
    const reviewButton = document.getElementById("review-btn");
    const userButton = document.getElementById("user-btn");
    
    if (reviewButton) {
        reviewButton.addEventListener("click", function () {
            window.location.href = "/admin/dashboard?type=reviews";
        });
    }

    if (userButton) {
        userButton.addEventListener("click", function () {
            window.location.href = "/admin/dashboard?type=users";
        });
    }
});