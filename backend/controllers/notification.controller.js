import Notification from "../models/notification.model.js";


export const getAllNotifications = async (req, res) => {
    try {
        const userId = req.user._id;

        const notifications = await Notification.find({ to: userId });
        if (!notifications.length) {
            return res.status(200).json({
                success: true,
                message: "No Notifications",
                notifications: [],
            });
        }


        return res.status(200).json({
            success: true,
            message: "Fetch All Notifications of LoggedIn User",
            notifications,
        });



    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: true,
            message: "Internal Server Error",
        })
    }
}