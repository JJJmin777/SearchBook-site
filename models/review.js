import mongoose from 'mongoose';
import { deflate } from 'zlib';

const Schema = mongoose.Schema;

export const reviewSchema = new Schema({
    book: {
        type: Schema.Types.ObjectId,
        ref: 'Book'
    },
    body: String,
    rating: Number, // 별점 (1~5)
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    likes: {
        type: Number,
        default: 0 // 초기값 0
    },
    comments: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Comment' // 댓글 참조
        }
    ],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Review = mongoose.model("Review", reviewSchema);
export default Review 
