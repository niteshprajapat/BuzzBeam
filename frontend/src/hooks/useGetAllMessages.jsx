import React, { useEffect } from 'react'
import { setFollowing } from '@/redux/slices/userSlice';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { setMessages } from '@/redux/slices/messageSlice';

const useGetAllMessages = () => {
    const dispatch = useDispatch();
    const { token, selectedUser } = useSelector((store) => store?.auth);

    const fetchAllMessages = async () => {
        try {
            const response = await axios.get(`https://buzzbeam.onrender.com/api/v1/messages/getMessages/${selectedUser?._id}`, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + token
                },
                withCredentials: true,
            });

            const data = await response.data;

            console.log("getAllMessages", data);

            if (data?.success) {
                dispatch(setMessages(data?.messages));
            }
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        fetchAllMessages();
    }, []);
}



export default useGetAllMessages;