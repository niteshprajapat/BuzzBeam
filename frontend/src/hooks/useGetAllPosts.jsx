import { setPosts } from '@/redux/slices/postSlice';
import axios from 'axios';
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';

const useGetAllPosts = () => {
    const dispatch = useDispatch();
    const { token } = useSelector((store) => store?.auth);

    const fetchAllPosts = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:5000/api/v1/posts/getAllPosts', {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + token
                },
                withCredentials: true,
            });

            const data = await response.data;

            console.log("data", data);

            if (data?.success) {
                dispatch(setPosts(data?.posts));
            }
        } catch (error) {
            console.log(error);

        }
    }

    useEffect(() => {
        fetchAllPosts();
    }, []);



}

export default useGetAllPosts