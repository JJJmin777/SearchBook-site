import mongoose from 'mongoose';
import dotenv from 'dotenv';
import app from './app.js';
import createAdminUser from './utils/adminSeeder.js';

dotenv.config();

const isProduction = process.env.NODE_ENV === "production";

const dbUrl = isProduction
    ? process.env.DB_URL // 배포 환경에서는 환경 변수에서 가져오기
    : 'mongodb://127.0.0.1:27017/search-book'; // 로컬 환경에서 사용

mongoose.set('strictQuery', true);
mongoose.connect(dbUrl)
    .then(() => {
        console.log('✅ Database connected');
        createAdminUser(); // 관리자 계정 생성 실행
    })
    .catch(err => console.error('❌ MongoDB Connection Error:', err));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});