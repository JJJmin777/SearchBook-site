import Review from "../models/review.js";

export const getHomePage = async (req, res) => {
    try {
        // DB에서 최신순으로 리뷰 5개 가져오기
         const recentReviews = await Review.find({})
            .sort({ createdAt: -1 })
            .limit(5)
            .populate("book", "title image") // 책 정보 중 필요한 필드만
            .populate("author", "username") // 작성자 정보 중 필요한 필드만

        res.render("search/home", { recentReviews });
    } catch (error) {
        console.error("Error loading home page:", error);
        res.redirect("/")
    }
};