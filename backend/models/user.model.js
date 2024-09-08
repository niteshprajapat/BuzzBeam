import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    bio: {
        type: String,
        default: "",
    },
    gender: {
        type: String,
        enum: ["male", "female", "trans"],
    },
    socialLinks: {
        type: String,
        default: "",
    },
    isPrivate: {
        type: Boolean,
        default: true,
    },
    avatar: {
        id: {
            type: String
        },
        url: {
            type: String
        },
    },
    posts: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Post",
        },
    ],
    followers: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
    ],
    following: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
    ],
    savedPosts: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Post",
        },
    ],
    postLiked: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Post",
        },
    ],



}, { timestamps: true });


const User = mongoose.model("User", userSchema);
export default User;