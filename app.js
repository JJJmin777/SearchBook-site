if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

import express from 'express';
import path from 'path';
import expressLayouts from 'express-ejs-layouts';
import bodyParser from 'body-parser';
import { fileURLToPath } from 'url';

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 라우터 가져오기
import bookRouter from './routes/bookRouter.js';

// EJS 설정
app.set('view engine', 'ejs');// EJS 템플릿 엔진 설정
app.set('views', path.join(__dirname, 'views')); // 템플릿 경로 설정

app.use(express.static(path.join(__dirname, 'public'))); // 정적 파일 경로
app.use(bodyParser.urlencoded({ extended: true })); // 폼 데이터 처리 (POST 요청 데이터를 처리하기 위해 필요)

// express-ejs-layouts 사용
app.use(expressLayouts);

// 레이아웃 파일 경로 설정
app.set('layout', 'layouts/boilerplate'); // 기본 레이아웃 지정

// app.use(express.json()); 
// app.use(express.urlencoded({ extended: false }));

// 라우터 등록
app.use('/', bookRouter); // 기본 경로에 라우터 연결

const port = 3000;
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
