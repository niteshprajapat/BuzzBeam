import React, { useEffect } from 'react'
import { setAllUsers, setFollowers } from '@/redux/slices/userSlice';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';

const useGetAllUsers = () => {
    const dispatch = useDispatch();
    const { token, user } = useSelector((store) => store?.auth);

    const fetchAllUsers = async () => {
        try {
            const response = await axios.get(`https://buzzbeam.onrender.com/api/v1/users/getAllUsers`, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + token
                },
                withCredentials: true,
            });

            const data = await response.data;

            console.log("getAllUsers", data);

            if (data?.success) {
                dispatch(setAllUsers(data?.users));
            }
        } catch (error) {
            console.log(error);

        }
    }

    useEffect(() => {
        fetchAllUsers();
    }, []);



}

export default useGetAllUsers;
