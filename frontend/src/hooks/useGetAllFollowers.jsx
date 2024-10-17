import React, { useEffect } from 'react'
import { setFollowers } from '@/redux/slices/userSlice';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';

const useGetAllFollowers = () => {
    const dispatch = useDispatch();
    const { token, user } = useSelector((store) => store?.auth);

    const fetchAllFollowers = async () => {
        try {
            const response = await axios.get(`https://buzzbeam.onrender.com/api/v1/users/followersList/${user?._id}`, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + token
                },
                withCredentials: true,
            });

            const data = await response.data;

            console.log("followers", data);

            if (data?.success) {
                dispatch(setFollowers(data?.followersList));
            }
        } catch (error) {
            console.log(error);

        }
    }

    useEffect(() => {
        fetchAllFollowers();
    }, []);



}

export default useGetAllFollowers;