import mongoose from "mongoose";

const storySchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    storySource: {
        type: String,
        required: true,
    },
    storyType: {
        type: String,
        enum: ["image", "video"],
        required: true,
    },
    viewers: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        }
    ],

    expiresAt: {
        type: Date,
        required: true,
    },
    isActive: {
        type: Boolean,
        default: true,
    }


}, { timestamps: true });


const Story = mongoose.model("Story", storySchema);
export default Story;