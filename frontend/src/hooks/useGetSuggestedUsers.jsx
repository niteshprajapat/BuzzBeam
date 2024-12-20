import { setPosts } from '@/redux/slices/postSlice';
import { setSuggestedUsers } from '@/redux/slices/userSlice';
import { BACKEND_URL } from '@/route';
import axios from 'axios';
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';


const useGetSuggestedUsers = () => {
    const dispatch = useDispatch();
    const { token } = useSelector((store) => store?.auth);

    const fetchAllSuggestedUsers = async () => {
        try {
            const response = await axios.get(`${BACKEND_URL}/api/v1/users/suggestedUsers`, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + token
                },
                withCredentials: true,
            });

            const data = await response.data;

            console.log("data", data);

            if (data?.success) {
                dispatch(setSuggestedUsers(data?.users));
            }
        } catch (error) {
            console.log(error);

        }
    }

    useEffect(() => {
        fetchAllSuggestedUsers();
    }, []);



}



export default useGetSuggestedUsers