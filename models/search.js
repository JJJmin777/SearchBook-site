import mongoose from 'mongoose';
import Review  from './review.js'

const Schema = mongoose.Schema;

const searchSchema = new Schema({
    title: { type: String, required: true },
    author: String,
    publisher: String,
    price: Number,
    // image: [ImageSchema],
    link: String,
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ] // 리뷰 배열
});

const Search = mongoose.model('Book', searchSchema);
export default Search;