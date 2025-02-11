import { searchBook } from "../utils/naverApi.js";
import Book from '../models/book.js';
import Review from "../models/review.js";
import { generateBookDetailsReviewHTML } from "../utils/reviewHtmlGenerator.js"

// 검색 결과
export const handleSearchResults = async (req, res) => {
    try {
        const query = req.query.bookTitle; // 폼에서 검색어 가져오기

        if (!query) {
            return res.redirect('/')
        }

        const books = await searchBook(query); // API 호출

        res.render('search/results', { books, query }); // 결과 페이지 렌더링
    } catch (error) {
        console.error(error)
    }

};

// 책 저장
export const saveBook = async (req, res) => {
    try {
        const { title, author, publisher, price, link } = req.body;
        const imagePath = req.file ? req.file.path : req.body.image; // Cloudinary URL 또는 기존 URL

        // MongoDB에서 동일한 책 확인
        let book = await Book.findOne({ title });

        if (!book) {
            // 책이 없으면 새로 저장
            book = new Book({
                title,
                author,
                publisher,
                price,
                image: imagePath,
                link,
            });
            // console.log(book)
            await book.save();
        }
        res.redirect(`/books/${book._id}`);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error saving the book');
    }
};

// 책 상세 페이지
export const getBookDetails = async (req, res) => {
    try {
        const bookId = req.params.bookId;
        const limit = 2; // 기본으로 불러올 리뷰 개수

        // 책 데이터와 기본 정렬된 리뷰를 가져옵니다 .
        const book = await Book.findById(bookId); // 책 정보만 가져오기

        // 좋아요 순으로 정렬된 리뷰에서 limi + 1개 가져오기 (추가 리뷰 확인용)
        const reviews = await Review.find({ book: bookId })
            .populate('author', 'username profilePicture') // 작성자 정보 포함
            .populate({
                path: 'comments',
                populate: { path: 'author', select: 'username profilePicture' } // 댓글 작성자 정보 포함
            })
            .sort({ likesCount: -1, createdAt: -1 }) // 좋아요 순 정렬
            .limit(limit + 1); // limit + 1개 가져오기

        // 다음 리뷰가 있는지 확인
        const hasMore = reviews.length > limit;

        // limit 개수만큼만 반환 (초과 데이터 제거)
        const reviewToSend = hasMore ? reviews.slice(0, limit) : reviews;

        res.render('search/bookdetails', {
            book,
            sortedReviews: reviewToSend, // 처음부터 limit개만 전달
            hasMore, // 추가 리뷰가 있는지 여부 전달
            currentUser: req.user || null, // 현재 사용자 정보 전달 
        }); // EJS 템플릿 렌더링
    } catch (error) {
        req.flash('error', 'Book not found');
        res.redirect('/')
    }
};

// 책 리뷰중 검색 로직
export const searchReviews = async (req, res) => {
    try {
        const bookId = req.params.bookId;
        const { query, sortBy } = req.query;
        const currentUser = req.user || null;

        // 검색 요청 필터링
        if (!query || query.trim().length === 0){
            return res.status(400).json({ error: "검색어를 입력하세요." });
        }

        const searchFilter = {
            book: bookId,
            body: { $regex: new RegExp(query, "i") }, // 검색 필터 적용 (대소문자 구분 없이 검색)
        }

        // 정렬 기준 적용
        const sortCondition = sortBy === 'likes' ? { likesCount: -1, createdAt: -1 } : { createdAt: -1 };

        const reviews = await Review.find(searchFilter)
            .populate('book', 'title image author')
            .populate('author', 'username profilePicture') // 작성자 정보 가져오기
            .populate({
                path: 'comments', // 리뷰의 댓글
                populate: {
                    path: 'author', // 댓글 작성자
                    select: 'username profilePicture', // 필요한 필드만 가져오기
                },
                select: 'body author createdAt', // 댓글의 본문 및 작성자, 작성 시간
                })
            .sort(sortCondition) // 정렬 적용

        if (reviews.length === 0) {
            return res.status(200).json({ reviews: [] }); // 검색 결과가 없으면 빈 배열 반환
        }

        // 검색된 리뷰를 HTML로 변환
        const reviewHTMLs = reviews.map(review =>
            generateBookDetailsReviewHTML(review, currentUser)
        );

        res.status(200).json({ reviews: reviewHTMLs });
    } catch(error) {
        console.error("Error searching reviews:", error);
        res.status(500).json({ error: "Failed to search reviews" });
    }
};