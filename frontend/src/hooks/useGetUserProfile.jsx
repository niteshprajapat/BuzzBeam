import { setPosts } from '@/redux/slices/postSlice';
import { setSuggestedUsers, setUserProfile } from '@/redux/slices/userSlice';
import axios from 'axios';
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';


const useGetUserProfile = (id) => {
    const dispatch = useDispatch();
    const { token } = useSelector((store) => store?.auth);

    const fetchUserProfile = async () => {
        try {
            const response = await axios.get(`http://127.0.0.1:5000/api/v1/users/profile/${id}`, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + token
                },
                withCredentials: true,
            });

            const data = await response.data;


            if (data?.success) {
                dispatch(setUserProfile(data?.user));
            }
        } catch (error) {
            console.log(error);

        }
    }

    useEffect(() => {
        fetchUserProfile();
    }, []);
}

export default useGetUserProfile