import { setPosts } from '@/redux/slices/postSlice';
import { setSuggestedUsers, setUserProfile } from '@/redux/slices/userSlice';
import { BACKEND_URL } from '@/route';
import axios from 'axios';
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';


const useGetUserProfile = (id) => {
    const dispatch = useDispatch();
    const { token } = useSelector((store) => store?.auth);

    const fetchUserProfile = async () => {
        try {
            const response = await axios.get(`${BACKEND_URL}/api/v1/users/profile/${id}`, {
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