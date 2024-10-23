import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
    from: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    to: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    type: {
        type: String,
        enum: ["follow", "like", "comment"],
    },
    isRead: {
        type: Boolean,
        default: false,
    }


}, { timestamps: true });


const Notification = mongoose.model("Notification", notificationSchema);
export default Notification;