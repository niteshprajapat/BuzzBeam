import Notification from "../models/notification.model.js";


// getAllNotifications
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


// markSeenNotifiication
export const readNotifiicationById = async (req, res) => {
    try {
        const userId = req.user._id;
        const notificationId = req.params.id;

        const notiification = await Notification.findByIdAndUpdate(
            { _id: notificationId, to: userId },
            {
                $set: {
                    isRead: true,
                }
            },
            { new: true }
        );


        return res.status(200).json({
            success: true,
            message: "Notification Seen!",
            notiification,
        });



    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: true,
            message: "Internal Server Error",
        })
    }
}

// readAllNotifications
export const readAllNotifications = async (req, res) => {
    try {
        const userId = req.user._id;

        // const notifications = await Notification.find({ to: userId })  // No Use of this Line

        await Notification.updateMany(
            { to: userId, isRead: false },     // only update unread notifications
            { $set: { isRead: true } },         // mark as read
        )

        return res.status(200).json({
            success: true,
            message: "Read All Notifications!",
        });



    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: true,
            message: "Internal Server Error",
        })
    }
}

// deleteNotificationById
export const deleteNotificationById = async (req, res) => {
    try {
        const userId = req.user._id;
        const notificationId = req.params.id;


        const notification = await Notification.findOne({ _id: notificationId, to: userId });

        if (!notification) {
            return res.status(404).json({
                success: false,
                message: "Notification not found or not authorized",
            });
        }

        // const notifications = await Notification.findByIdAndDelete(notificationId);

        await Notification.findByIdAndDelete(notificationId);

        return res.status(200).json({
            success: true,
            message: "Notification Deleted!",
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: true,
            message: "Internal Server Error",
        })
    }
}

// deleteAllNotifications
export const deleteAllNotifications = async (req, res) => {
    try {
        const userId = req.user._id;

        await Notification.deleteMany({ to: userId });

        return res.status(200).json({
            success: true,
            message: "All Notifications Deleted!",
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: true,
            message: "Internal Server Error",
        })
    }
}