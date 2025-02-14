import mongoose from "mongoose";

const Schema = mongoose.Schema;

export const reportSchema = new Schema({
    review: { 
        type: Schema.Types.ObjectId,
        ref: "Review",
        required: true
    },
    reportedBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    book: {
        type: Schema.Types.ObjectId,
        ref: 'Book',
        required: true
    },
    reason: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
});

const Report = mongoose.model("Report", reportSchema);
export default Report;