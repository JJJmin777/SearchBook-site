import express from "express";
import { getAdminDashboard, deleteReviewByAdmin, deleteReportByAdmin, deleteUserByAdmin } from "../controllers/adminController.js";
import { isAdmin, isLoggedIn } from "../middleware.js";

const router = express.Router();

// 관리자 대시보드 페이지 (관리자만 접근 가능)
router.get("/dashboard", isLoggedIn, isAdmin, getAdminDashboard);

// 관리자 리뷰 삭제 기능
router.delete("/reviews/:reviewId", isLoggedIn, isAdmin, deleteReviewByAdmin);

// 관리자 리포트 삭제 기능
router.delete("/reports/:reportId", isLoggedIn, isAdmin, deleteReportByAdmin)

// 관리자 유저 삭제 기능
router.delete("/users/:userId", isLoggedIn, isAdmin, deleteUserByAdmin);

export default router;