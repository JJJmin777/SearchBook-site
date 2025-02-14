import Report from "../models/report.js"
import Review from "../models/review.js"
import Book from "../models/book.js"

// 신고 페이지 렌더링
export const showReportPage = async (req, res) => {
    try {
        const { bookId, reviewId } = req.params;
        const review = await Review.findById(reviewId).populate("author", "username");
        const book = await Book.findById(bookId);

        if (!review || !book) {
            req.flash("error", "Review or Book not found.");
            return res.redirect("back"); // return res.redirect(req.get("Referer") || `/books/${bookId}`);
        }

        res.render("bookreviews/report", { book, review, currentUser: req.user });
    } catch(error) {
        console.error("Error loading report page:", error);
        req.flash("error", "Failed to load report page.");
        res.redirect("back");
    }
};

// 신고 제출 처리
export const submitReport = async (req, res) => {
    try {
        const { bookId, reviewId } = req.params;
        const { reason } = req.body;
        const currentUser = req.user;

        if (!reason || reason.trim().length === 0) {
            req.flash("error", "You must provide a reason for the report.");
            return res.redirect("back");
        }

        const report = new Report({
            review: reviewId,
            book: bookId,
            reportedBy: currentUser._id,
            reason,
        });

        await report.save();
        req.flash("success", "Report submitted successfully.");
        res.redirect(`/books/${bookId}`);
    } catch(error) {
        console.error("Error submitting report:", error);
        req.flash("error", "Failed to submit report.");
        res.redirect("back");
    }
};
