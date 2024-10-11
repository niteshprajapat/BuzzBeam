import React, { useEffect } from 'react'
import { setFollowing } from '@/redux/slices/userSlice';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';

const useGetAllFollowing = () => {
    const dispatch = useDispatch();
    const { token, user } = useSelector((store) => store?.auth);

    const fetchAllFollowing = async () => {
        try {
            const response = await axios.get(`http://127.0.0.1:5000/api/v1/users/followingList/${user?._id}`, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + token
                },
                withCredentials: true,
            });

            const data = await response.data;

            console.log("following", data);

            if (data?.success) {
                dispatch(setFollowing(data?.followingList));
            }
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        fetchAllFollowing();
    }, []);



}


export default useGetAllFollowing