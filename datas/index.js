import mongoose from 'mongoose';
import Search from '../models/search.js'



mongoose.set('strictQuery', true); // 스키마에 정의되지 않은 필드를 포함한 쿼리는 무시한다.
mongoose.connect('mongodb://127.0.0.1:27017/book'); // 여기에서 옴 https://mongoosejs.com/

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});