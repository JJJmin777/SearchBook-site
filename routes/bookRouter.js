import express from 'express';
import fetch from 'node-fetch'; // API 호출용
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

// 3. 리뷰
router.get(`/:`)

export default   router  ;