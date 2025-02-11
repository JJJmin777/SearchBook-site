import express from "express";
import { getHomePage } from "../controllers/homeController.js";

const router = express.Router();

// 홈페이지
router.get("/", getHomePage);

export default router