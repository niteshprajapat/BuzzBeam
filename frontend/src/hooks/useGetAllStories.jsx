import React, { useEffect } from 'react'
import { setFollowers } from '@/redux/slices/userSlice';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { BACKEND_URL } from '@/route';
import { setStories } from '@/redux/slices/storySlice';

const useGetAllStories = () => {
    const dispatch = useDispatch();
    const { token, user } = useSelector((store) => store?.auth);

    const fetchAllFollowers = async () => {
        try {
            const response = await axios.get(`${BACKEND_URL}/api/v1/story/getAllFollowingsStory`, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + token
                },
                withCredentials: true,
            });

            const data = await response.data;

            console.log("STORY", data);

            if (data?.success) {
                dispatch(setStories(data?.stories));
            }
        } catch (error) {
            console.log(error);

        }
    }

    useEffect(() => {
        fetchAllFollowers();
    }, []);



}


export default useGetAllStories