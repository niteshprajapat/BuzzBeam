import React, { useEffect } from 'react'
import { setAllUsers, setFollowers } from '@/redux/slices/userSlice';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { BACKEND_URL } from '@/route';
import { setNotifications } from '@/redux/slices/notificaationSlice';

const useGetNotifications = () => {
    const dispatch = useDispatch();
    const { token, user } = useSelector((store) => store?.auth);

    const fetchAllNotifications = async () => {
        try {
            const response = await axios.get(`${BACKEND_URL}/api/v1/notifications/getAllNotifications`, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + token
                },
                withCredentials: true,
            });

            const data = await response.data;

            console.log("setNotifications", data);

            if (data?.success) {
                dispatch(setNotifications(data?.notifications));
            }
        } catch (error) {
            console.log(error);

        }
    }

    useEffect(() => {
        fetchAllNotifications();
    }, []);
}



export default useGetNotifications