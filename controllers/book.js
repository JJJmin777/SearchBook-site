import { searchBook } from "../utils/naverApi.js";
import Book from '../models/search.js'
import mongoose from "mongoose";

// 검색 결과
export const handleSearchResults = async (req, res) => {
    // console.log(req.body)
    const query = req.body["bookTitle"]; // 폼에서 검색어 가져오기
    if (!query) {
        return res.render('home', { error: '검색어를 입력해주세요.' });
    }

    const books = await searchBook(query); // API 호출
    
    res.render('search/results', { books, query }); // 결과 페이지 렌더링
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
            console.log(book)
            await book.save();
        }
        res.redirect(`/books/${book._id}`);
    } catch(err) {
        console.log(err);
        res.status(500).send('Error saving the book');
    }

     // // 리뷰 추가
            // const newReview = {
            //     comment: review,
            //     rating: Number(rating),
            // };
            // book.reviews.push(newReview);
            // await book.save();
};

// 책 상세 페이지
export const getBookDetails = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id).populate({
            path: 'reviews',
            populate: {path:'author'}
        });
        // console.log(book)
        res.render('search/bookdetails', { book }); // EJS 템플릿 렌더링
    } catch (error) {
        console.error(error);
        res.status(404).send('Book not found');
    }
};