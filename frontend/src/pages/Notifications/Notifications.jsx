import Sidebar from '@/components/ui/Sidebar/Sidebar'
import useGetNotifications from '@/hooks/useGetNotifications'
import React from 'react'
import { useSelector } from 'react-redux'
import { formatDistanceToNow } from 'date-fns';
import { Delete, DeleteIcon, Drumstick, EyeIcon, LucideDelete, Trash, Trash2 } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';
import { BACKEND_URL } from '@/route';


const Notifications = () => {
    const { notifications } = useSelector((store) => store?.notification)
    const { user, token } = useSelector((store) => store?.auth)


    console.log("NOTIFICATIONS", notifications);
    useGetNotifications();


    const handleReadNotificationById = async (notificationId) => {
        try {
            const response = await axios.get(`${BACKEND_URL}/api/v1/notifications/readNotification/${notificationId}`, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + token,
                },
                withCredentials: true,
            });

            const data = await response?.data;
            console.log("notiid", data);

            toast.message(data?.message);

        } catch (error) {
            console.log(error);
            toast.error(error?.response?.data?.message);
        }
    }

    const handleDeleteNotificationById = async (notificationId) => {
        try {
            const response = await axios.delete(`${BACKEND_URL}/api/v1/notifications/deleteNotification/${notificationId}`, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + token,
                },
                withCredentials: true,
            });

            const data = await response?.data;
            console.log("deleteNotification", data);

            toast.message(data?.message);

        } catch (error) {
            console.log(error);
            toast.error(error?.response?.data?.message);
        }
    }

    return (
        <div className='flex h-screen'>

            <Sidebar />

            <div className='flex flex-col w-full  h-full overflow-y-auto p-10 '>

                <div className='flex flex-col gap-2'>
                    {
                        notifications && notifications?.map((notification) => (
                            <div
                                key={notification._id}
                                className={`${notification?.isRead ? "bg-gray-200 border-white" : "bg-gray-100 border-black"}   rounded-md border  p-4 relative`}
                            >
                                <div className='flex items-center gap-4'>

                                    <img
                                        src={notification?.from?.avatar}
                                        alt="avatar"
                                        className='size-12 rounded-full'
                                    />

                                    <div className='flex flex-col gap-[2px]'>
                                        <p>{notification?.from?.userName}   {
                                            notification?.type === "like"
                                                ? "liked your post"
                                                : notification?.type === "follow"
                                                    ? "followed you"
                                                    : "commented on your post"

                                        }
                                        </p>
                                        <span> {formatDistanceToNow(notification?.createdAt)} ago </span>
                                    </div>

                                </div>


                                <div className='absolute top-3 right-5 flex flex-col gap-1'>


                                    {
                                        !notification?.isRead && (
                                            <div
                                                onClick={() => handleReadNotificationById(notification?._id)}
                                                className=' cursor-pointer'>
                                                <EyeIcon />
                                            </div>
                                        )
                                    }

                                    <div
                                        onClick={() => handleDeleteNotificationById(notification?._id)}
                                        className=' cursor-pointer'>
                                        <Trash2 />
                                    </div>
                                </div>

                            </div>
                        ))
                    }
                </div>


            </div>

        </div>
    )
}

export default Notifications