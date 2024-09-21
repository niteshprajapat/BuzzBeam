import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import Sidebar from '@/components/ui/Sidebar/Sidebar'
import { useSelector } from 'react-redux';
import useGetUserProfile from '@/hooks/useGetUserProfile';

const Profile = () => {
    const { id } = useParams();
    const { user, userProfile } = useSelector((store) => store.auth);

    const [feed, setFeed] = useState("posts");

    useGetUserProfile(id);


    console.log("userProfile", userProfile);

    const reels = userProfile?.posts?.filter((post) => post?.postSource?.includes(".mp4"));
    const posts = userProfile?.posts?.filter((post) => !post?.postSource?.includes(".mp4"));
    console.log("reels", reels);
    console.log("posts", posts);

    return (
        <div className='flex h-screen '>
            <Sidebar />

            <div className='flex flex-col w-full  h-full overflow-y-auto'>
                <div className='w-[800px] mx-auto'>


                    <div className='flex justify-between items-center'>
                        <div className='w-[160px] h-[160px] rounded-full'>
                            <img src={userProfile?.avatar} alt="avatar" className='rounded-full' />
                        </div>
                        <div className='flex flex-col justify-between '>
                            <div>
                                <p>{userProfile?.userName}</p>
                                {
                                    <span>Edit profile</span>
                                }
                            </div>
                            <div className='flex items-center gap-6'>
                                <span>{userProfile?.posts?.length} posts</span>
                                <span>{userProfile?.followers?.length} followers</span>
                                <span>{userProfile?.following?.length} following</span>
                            </div>
                            <div className='flex flex-col gap-1'>
                                <span>{userProfile?.name}</span>
                                <span>{userProfile?.bio}</span>
                                <span>{userProfile?.socialLinks}</span>
                            </div>
                            <div></div>
                        </div>


                    </div>

                    {/* Posts */}
                    <div className='flex flex-col gap-10'>
                        <div className='flex justify-center items-center gap-7 '>
                            <span onClick={() => setFeed("posts")}>Posts</span>
                            <span onClick={() => setFeed("reels")}>Reels</span>
                            <span>Saved</span>
                        </div>

                        <div className='overflow-y-auto h-full'>
                            {
                                feed === 'posts' ? (
                                    <div className='grid grid-cols-3'>
                                        {
                                            posts?.map((post) => (
                                                <div key={post?._id}>
                                                    <img src={post?.postSource} alt="post" />
                                                </div>
                                            ))
                                        }
                                    </div>

                                ) : (
                                    <div>
                                        {
                                            reels?.map((reel) => (
                                                <div key={reel?._id} className='w-full max-w-[500px] mx-auto'>
                                                    <div className='h-[600px]'>
                                                        <video src={reel?.postSource}
                                                            className="object-cover w-full h-full"
                                                            controls
                                                        />
                                                    </div>
                                                </div>
                                            ))
                                        }
                                    </div>
                                )
                            }
                        </div>

                    </div>
                </div>
            </div>




        </div>
    )
}

export default Profile