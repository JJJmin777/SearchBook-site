import mongoose from 'mongoose';
import dotenv from 'dotenv';
import app from './app.js';
import createAdminUser from './utils/adminSeeder.js';

dotenv.config();

const dbUrl = process.env.DB_URL; //   'mongodb://127.0.0.1:27017/search-book'

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