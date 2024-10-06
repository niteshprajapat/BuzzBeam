import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    commentText: {
        type: String,
        required: true,
    },
    commentLikedBy: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
    ],


}, { timestamps: true });


const Comment = mongoose.model("Comment", commentSchema);
export default Comment;