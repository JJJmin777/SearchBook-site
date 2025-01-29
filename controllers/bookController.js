import { searchBook } from "../utils/naverApi.js";
import Book from '../models/book.js'
import Review from "../models/review.js";

// 검색 결과
export const handleSearchResults = async (req, res) => {
    try {
        const query = req.query.bookTitle; // 폼에서 검색어 가져오기

        if (!query) {
            console.log("안뜨")
            return res.redirect('/')
        }

        const books = await searchBook(query); // API 호출

        res.render('search/results', { books, query }); // 결과 페이지 렌더링
    } catch (error) {
        console.log(error)
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
        console.log(error);
        res.status(500).send('Error saving the book');
    }
};

// 책 상세 페이지
export const getBookDetails = async (req, res) => {
    try {
        const bookId = req.params.id

        // 책 데이터와 기본 정렬된 리뷰를 가져옵니다 .
        const book = await Book.findById(bookId); // 책 정보만 가져오기

        // 좋아요 순으로 정렬된 리뷰에서 10개만 가져오기
        const reviews = await Review.find({ book: bookId })
            .populate('author', 'username profilePicture') // 작성자 정보 포함
            .populate({
                path: 'comments',
                populate: { path: 'author', select: 'username profilePicture' } // 댓글 작성자 정보 포함
            })
            .sort({ likesCount: -1, createdAt: -1 }) // 좋아요 순 정렬
            .limit(2); // 최대 10개 가져오기

        // 리뷰를 하트순으로 정렬
        let sortedReviews = reviews

        res.render('search/bookdetails', {
            book,
            sortedReviews, //기본 정렬된 리뷰 전달
            currentUser: req.user || null, // 현재 사용자 정보 전달 
        }); // EJS 템플릿 렌더링
    } catch (error) {
        req.flash('error', 'Book not found');
        res.redirect('/')
    }
};