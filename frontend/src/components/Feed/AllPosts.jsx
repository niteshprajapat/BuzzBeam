import useGetAllPosts from '@/hooks/useGetAllPosts'
import React from 'react'
import { useSelector } from 'react-redux';
import IndividualPost from './IndividualPost';

const AllPosts = () => {
    const { posts } = useSelector((store) => store?.post);

    console.log("p[ostDATA", posts);


    useGetAllPosts();


    return (
        <div className='flex flex-col gap-14'>
            {
                posts && posts?.map((post) => (
                    <IndividualPost post={post} />
                ))
            }

        </div>
    )
}

export default AllPosts