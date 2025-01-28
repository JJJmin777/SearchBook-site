import mongoose from 'mongoose';
import { deflate } from 'zlib';

const Schema = mongoose.Schema;

export const reviewSchema = new Schema({
    book: {
        type: Schema.Types.ObjectId,
        ref: 'Book'
    },
    body: String,
    rating: {
        type: Number, // 별점 (1~5)
        // default: 0.5
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    likes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User' // 좋아요를 누른 사용자 ID
        }
    ],
    likesCount: {
        type:Number,
        default: 0
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
