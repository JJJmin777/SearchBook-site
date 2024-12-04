import express from 'express';
import fetch from 'node-fetch'; // API 호출용
import router from express.Router();
import Book from '../models/book.js'; // 책 모델

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
        console.log(data.items[0]["isbn"]);
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

// 3. 책 정보 저장 및 조회
router.post('/save', async (req, res) => {
    const { title, author, publisher, price, image, link } = req.body;

    try {
        // 책이 이미 저장되어 있는지 확인
        let book = await Book.findOne({ title });
        if (!book) {
            // 저장되지 않은 경우 새로 저장
            book = new Book({ title, author, publisher, price, image, link });
            await book.save();
        }
        res.redirect(`/books/${book._id}`); // 책 상세 페이지로 이동
    } catch (error) {
        console.error(error);
        res.status(500).send('Error saving book');
    }
});

// 4. 책 상세 페이지
router.get('/books/:id', async (req, res) => {
    try {
        const book = await Book.findById(req.params.id).populate('reviews');
        res.render('bookDetail', { book }); // EJS 템플릿 렌더링
    } catch (error) {
        console.error(error);
        res.status(404).send('Book not found');
    }
});


export default   router  ;