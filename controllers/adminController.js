import Review from "../models/review.js"; 
import User from "../models/user.js";

// 관리자 대시보드 페이지 렌더링
export const getAdminDashboard = async (req, res) => {
    try {
        if (!req.user || !req.user.isAdmin) {
            req.flash("error", "Access denied.");
            return res.redirect("/");
        }

        let { search, type } = req.query; // 검색어 & 검색 타입
        let reviews = [];
        let users = [];

        if (type === "reviews" || !type) {
            reviews = search
                ? await Review.find({ body: { $regex: search, $options: "i" } }).populate("author", "username email")
                : await Review.find().populate("author", "username email");
        }

        if (type === "users" || !type) {
            users = search 
                ? await User.find({
                    $or: [
                        { username: { $regex: search, $options: "i" } },
                        { email: { $regex: search, $option: "i" } },
                    ],
                })
            : await User.find({}, "username email isAdmin");
        }

        // `search`와 `type` 변수를 EJS에 전달
        res.render("admin/dashboard", { reviews, users, search, type });
    } catch(error) {
        console.error("❌ Error fetching admin dashboard data:", error);
        res.status(500).send("Server Error");
    }
};

// 리뷰 삭제 (관리자만 가능)
export const deleteReviewByAdmin = async (req, res) => {
    try {
        if (!req.user || !req.user.isAdmin) {
            req.flash("error", "Access denied.");
            return res.redirect("/admin/dashboard");
        }

        await Review.findByIdAndDelete(req.params.reviewId);
        req.flash("error", "Review deleted successfully.");
        res.redirect("/admin/dashboard");
    } catch(error) {
        console.error("❌ Error deleting review:", error);
        req.flash("error", "Failed to delete review.");
        res.redirect("/admin/dashboard");
    }
};