import mongoose from 'mongoose';

const Schema = mongoose.Schema;

export const reviewSchema = new Schema({
    body: String,
    rating: Number, // 별점 (1~5)
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});

const Review = mongoose.model("Review", reviewSchema);
export default Review 
