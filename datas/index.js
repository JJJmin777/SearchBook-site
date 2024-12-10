import mongoose from 'mongoose';
import Book from '../models/search.js'

const uri = 'mongodb://127.0.0.1:27017/search-book'; // 여기에서 옴 https://mongoosejs.com/

mongoose.set('strictQuery', true); // 스키마에 정의되지 않은 필드를 포함한 쿼리는 무시한다.

mongoose.connect(uri,{
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('MongoDB connected!'))
    .catch(err => console.error('MongoDB connection error:', err));