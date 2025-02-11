import Review from "../models/review.js"; 
import User from "../models/user.js";
import Book from "../models/book.js"
import Comment from "../models/comment.js";
import getBookAverageRating from '../utils/getBookAverageRating.js';

// 관리자 대시보드 페이지 렌더링
export const getAdminDashboard = async (req, res) => {

    const PAGE_SIZE = 10; // 한 페이지에 표시할 데이터 개수

    try {
        if (!req.user || !req.user.isAdmin) {
            req.flash("error", "Access denied.");
            return res.redirect("/");
        }

        let { search, type, sort, page } = req.query; // 검색어 & 검색 타입
        page = parseInt(page) || 1;
        let reviews = [];
        let users = [];
        let totalreviews = 0;
        let totalUsers = 0;

        if (type === "reviews" || !type) {
            const reviewQuery = search
                ? { body: { $regex: search, $options: "i" } }
                : {};

            totalreviews = await Review.countDocuments(reviewQuery);
            reviews = await Review.find(reviewQuery)
                .populate("author", "username email")
                .populate("book", "title")
                .sort(sort === "oldest" ? { createdAt: 1 } : { createdAt: -1 })
                .skip((page - 1) * PAGE_SIZE)
                .limit(PAGE_SIZE);
        }

        if (type === "users" || !type) {
            const userQuery = search
                ? {
                    $or: [
                        { username: { $regex: search, $options: "i" } },
                        { email: { $regex: search, $options: "i" } },
                    ],
                }
                : {};

            totalUsers = await User.countDocuments(userQuery);
            users = await User.find(userQuery, "username email isAdmin")
                .sort(sort === "a-z" ? { username: 1 } : { username: -1 })
                .skip((page - 1) * PAGE_SIZE)
                .limit(PAGE_SIZE);
        }

        // `search`와 `type` 변수를 EJS에 전달
        res.render("admin/dashboard", { 
            reviews, 
            users, 
            search, 
            type,
            sort,
            page,
            totalreviews,
            totalUsers,
            totalPages: type === "users" ? Math.ceil(totalUsers / PAGE_SIZE) : Math.ceil(totalreviews / PAGE_SIZE),
        });
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

        const reviewId = req.params.reviewId;

        // 1. 리뷰 문서 찾기 (작성자와 책 정보를 얻기 위함)
        const review = await Review.findById(reviewId);
        if (!review) {
            req.flash("error", "Review not found.");
            return res.redirect("/admin/dashboard");
        }

        // 2. 댓글(Comment) 컬렉션에서 해당 리뷰 관련 댓글들 삭제
        await Comment.deleteMany({ review: reviewId });

        // 3. Book에서 리뷰 _id 제거
        await Book.findByIdAndUpdate(review.book, { $pull: { reviews: reviewId } });

        // 4. User에서 리뷰 _id 제거 (리뷰 작성자 기준)
        await User.findByIdAndUpdate(review.author, { $pull: { reviews: reviewId } });

        // 5. 리뷰 자체 삭제
        await Review.findByIdAndDelete(reviewId);

        // 책의 평균 평점, 리뷰 개수 재계산
        await getBookAverageRating(review.book, true);

        req.flash("error", "Review deleted successfully.");
        res.redirect("/admin/dashboard");
    } catch(error) {
        console.error("❌ Error deleting review:", error);
        req.flash("error", "Failed to delete review.");
        res.redirect("/admin/dashboard");
    }
};