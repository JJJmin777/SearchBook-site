import express from 'express';
import fetch from 'node-fetch'; // API 호출용
import Book from '../models/search.js'; // 책 모델
import multer from 'multer';
import { cloudinary, storage } from '../cloudinary/index.js';

// 업로드된 파일을 서버 디스크에 저장
const upload = multer({ storage });

const router = express.Router();

// 네이버 API 설정
const clientId = 'r82p_IhMGiHs3wOV4HAs';
const clientSecret = 'n6zGByrEtf';

// 책 검색 API 호출 함수
async function searchBook(query) {

    const url = `https://openapi.naver.com/v1/search/book.json?query=${encodeURIComponent(query)}`;

    const options = {
        method: 'GET',
        headers: {
            'X-Naver-Client-Id': clientId,
            'X-Naver-Client-Secret': clientSecret
        }
    };

    try {
        const response = await fetch(url, options);
        const data = await response.json();
        // console.log(data.items);
        return data.items;
    } catch (error) {
        console.error('Error:', error);
        return [];
    }
}

// 라우터 정의
// 1. 홈 페이지
router.get('/', (req, res) => {
    res.render('search/home'); // 검색 폼
});

// 2. 검색 결과 처리
router.post('/results', async (req, res) => {
    // console.log(req.body)
    const query = req.body["bookTitle"]; // 폼에서 검색어 가져오기
    if (!query) {
        return res.render('home', { error: '검색어를 입력해주세요.' });
    }

    const books = await searchBook(query); // API 호출
    res.render('search/results', { books, query }); // 결과 페이지 렌더링
});

// 3. 책 상세 페이지 책 정보 저장 및 조회
router.post('/save', async (req, res) => {
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
            await book.save();
        }
        res.redirect(`/books/${book._id}`);
    } catch(err) {
        console.log(err);
        res.status(500).send('Error saving the book');
    }
});
            // // 리뷰 추가
            // const newReview = {
            //     comment: review,
            //     rating: Number(rating),
            // };
            // book.reviews.push(newReview);
            // await book.save();



// 4. 책 상세 페이지
router.get('/books/:id', async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        console.log(book)
        res.render('search/bookdetails', { book }); // EJS 템플릿 렌더링
    } catch (error) {
        console.error(error);
        res.status(404).send('Book not found');
    }
});


export default router;