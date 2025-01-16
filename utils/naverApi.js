import fetch from 'node-fetch'; // API 호출용
import dotenv from 'dotenv';
dotenv.config();

// 네이버 API 설정
const clientId = process.env.CLIENTID;
const clientSecret = process.env.CLIENTSECRET;

// 책 검색 API 호출 함수
export async function searchBook(query) {

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
