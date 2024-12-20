import mongoose from 'mongoose';

const Schema = mongoose.Schema;

export const commentSchema = new Schema({
    review: {
        type: Schema.Types.ObjectId,
        ref: 'Review'
    },
    body: {
        type: String,
        required: true
    }, // 댓글 내용
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }, // 작성자
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Comment = mongoose.model("Comment", commentSchema);
export default Comment