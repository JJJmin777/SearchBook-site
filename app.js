import dotenv from 'dotenv';
dotenv.config();

// if (process.env.NODE_ENV !== "production") {
//     dotenv.config();
// }
// if (process.env.NODE_ENV !== "production") {
//     require('dotenv').config();
// }

import express from 'express';
import path from 'path';
import expressLayouts from 'express-ejs-layouts';
import bodyParser from 'body-parser';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import passport from 'passport';
// strategy - 인증 로직을 구현하기 위한 클래스이며, Passport.js가 다양한 인증 방식을 플러그인으로 확장 가능하게 하는
import { Strategy as LocalStrategy } from 'passport-local';
import User from './models/user.js'
// import MongoStore = from 'connect-mongo'
import session from 'express-session';
import flash from 'connect-flash';
import methodOverride from 'method-override';

// 라우터 가져오기
import bookRouters from './routes/bookRouter.js';
import userRouters from './routes/usersRouter.js';
import reviewRouters from './routes/reviewsRouter.js';
import profileRouters from './routes/profileRouter.js';

const dbUrl ='mongodb://127.0.0.1:27017/search-book'; // process.env.DB_URL || 나중에 사용하기

mongoose.set('strictQuery', true);
mongoose.connect(dbUrl)

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// EJS 설정
app.set('view engine', 'ejs');// EJS 템플릿 엔진 설정
app.set('views', path.join(__dirname, 'views')); // 템플릿 경로 설정

app.use(express.static(path.join(__dirname, 'public'))); // 정적 파일 경로
app.use(bodyParser.urlencoded({ extended: true })); // 폼 데이터 처리 (POST 요청 데이터를 처리하기 위해 필요)

app.use((req, res, next) => {
    res.locals.currentUrl = req.originalUrl || '/'; // 현재 URL을 템플릿 변수에 저장
    next();
});

// express-ejs-layouts 사용
app.use(expressLayouts);

passport.use(
    new LocalStrategy(
        { usernameField: 'email' }, // 'email'을 usernameField로 설정
        User.authenticate()
    )
); // 인증 전략 사용
passport.serializeUser(User.serializeUser()); // 세션에 사용자 정보 저장
passport.deserializeUser(User.deserializeUser()); // 세션에서 사용자 정보 복원

// 세션 미들웨어 설정
app.use(session({
    secret: 'yourSecretKey', // 세션 암호화를 위한 키
    resave: false,          // 매 요청마다 세션 저장 방지
    saveUninitialized: false, // 초기화되지 않은 세션 저장 방지
    cookie: {
        secure: false // HTTPS 환경에서는 true로 설정
    }
}));

// Passport 초기화
app.use(passport.initialize());
app.use(passport.session()); //이 세션에서 데이터를 읽고 호출, 복원

// Flash 메시지 미들웨어 설정
app.use(flash())
app.use((req, res, next) => {
    // console.log(req.session)
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

// 레이아웃 파일 경로 설정
app.set('layout', 'layouts/boilerplate'); // 기본 레이아웃 지정

app.use(methodOverride('_method'));

app.use(express.json()); // JSON 요청 본문 처리
app.use(express.urlencoded({ extended: true })); // 폼 데이터 파싱

// 정적 파일 경로 설정 (업로드된 이미지 제공)
app.use('/uploads', express.static('uploads'));

// 라우터 등록
app.use('/', userRouters);
app.use('/books', bookRouters); // 만약 movie나 drama등이 리뷰로 추가 될 수 있어서 books로 묶음
app.use('/books/:bookId/reviews', reviewRouters);
app.use('/profile', profileRouters);


// 홈 페이지
app.get('/', (req, res) => {
    res.render('search/home'); // 검색 폼
});

const port = 3000;
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
