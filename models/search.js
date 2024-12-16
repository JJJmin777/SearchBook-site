import mongoose from 'mongoose';
import reviewSchema from './review.js';
//빠르게 Schema 사용
const Schema = mongoose.Schema;

// const ImageSchema = new Schema({
//     url:String
// })

// ImageSchema.virtual('thumbnail').get(function () {
//     return this.url.replace('/upload', '/upload/w_200');//가로 200
// });

// Mongoose에서 virtual 필드를 JSON으로 변환
//(가상 필드는 데이터베이스에 저장되지 않으므로, 클라이언트에서 직접 사용할 데이터(예: 썸네일 URL)를 제공하는 데 유용.)
// const opts = { toJSON: { virtuals: true } }; 

const bookSchema = new Schema({
    title: { type: String, required: true },
    author: String,
    publisher: String,
    price: {
        type: Number,
        get: (value) => {
            // 가격을 가져올 때 쉼표를 추가
            return value.toLocaleString(); 
        }
    },
    image: { 
        type: String,
        default: 'https://via.placeholder.com/150' //기본 이미지지
     },
    link: String,
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ] // 리뷰 배열
});

const Book = mongoose.model('Book', bookSchema);
export default Book;