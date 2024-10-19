import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import Sidebar from '@/components/ui/Sidebar/Sidebar'
import { useSelector } from 'react-redux';
import useGetUserProfile from '@/hooks/useGetUserProfile';
import { Bookmark, Image, Save, SaveIcon, Video } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import axios from 'axios';
import UpdateProfile from '@/components/Profile/UpdateProfile';
import Followers from '../FollowersFollowing/Followers';
import Following from '../FollowersFollowing/Following';
import { BACKEND_URL } from '@/route';

const Profile = () => {
    const { id } = useParams();
    const { user, userProfile, token } = useSelector((store) => store.auth);

    const [feed, setFeed] = useState("posts");

    const [open, setOpen] = useState(false);
    const [openFollowers, setOpenFollowers] = useState(false);
    const [openFollowing, setOpenFollowing] = useState(false);

    useGetUserProfile(id);


    console.log("userProfile", userProfile);

    const reels = userProfile?.posts?.filter((post) => post?.postSource?.includes(".mp4"));
    const posts = userProfile?.posts?.filter((post) => !post?.postSource?.includes(".mp4"));


    const canViewProfile = () => {
        if (!userProfile?.isPrivate || userProfile?._id?.toString() === user?._id?.toString() || user?.following?.includes(userProfile?._id)) {
            return true;
        } else {
            return false;
        }
    }



    const handleFollowUnfollow = async (userId) => {
        try {
            const response = await axios.get(`${BACKEND_URL}/api/v1/users/followUnfollow/${userId}`, {
                headers: {
                    'Content-Type': "application/json",
                    Authorization: 'Bearer ' + token,
                },
                withCredentials: true,
            });

            const data = await response.data;

            if (data?.success) {
                console.log("data", data);
                toast.success(data?.message);
            }

        } catch (error) {
            console.log(error);
            toast.error(error?.response?.data?.message);
        }
    }


    return (
        <>

            <UpdateProfile open={open} setOpen={setOpen} />
            <Followers openFollowers={openFollowers} setOpenFollowers={setOpenFollowers} />
            <Following openFollowing={openFollowing} setOpenFollowing={setOpenFollowing} />


            <div className='flex h-screen '>
                <Sidebar />

                <div className='flex flex-col w-full  h-full overflow-y-auto py-10'>
                    <div className='w-[800px] mx-auto'>


                        <div className='flex justify-between items-center w-[700px]'>
                            <div className='w-[25%]'>

                                <div className='w-[160px] h-[160px] rounded-full'>
                                    <img src={userProfile?.avatar} alt="avatar" className='rounded-full' />
                                </div>
                            </div>

                            <div className='flex flex-col justify-between gap-4 w-[60%]'>
                                <div className='flex items-center gap-5'>
                                    <p>{userProfile?.userName}</p>
                                    {
                                        userProfile?._id.toString() === user?._id.toString() ? (
                                            <Button onClick={() => setOpen(true)} variant="secondary">Edit profile</Button>
                                        ) : (
                                            <div className='flex items-center gap-3'>


                                                {
                                                    user?.following?.includes(userProfile?._id?.toString())
                                                        ? <Button variant="secondary" onClick={() => handleFollowUnfollow(userProfile?._id)}>Unfollow</Button>
                                                        : <Button onClick={() => handleFollowUnfollow(userProfile?._id)}>Follow</Button>
                                                }


                                            </div>
                                        )
                                    }

                                </div>
                                <div className='flex items-center gap-6'>
                                    <span>{userProfile?.posts?.length} posts</span>
                                    <span onClick={() => setOpenFollowers(true)} >{userProfile?.followers?.length} followers</span>
                                    <span onClick={() => setOpenFollowing(true)} >{userProfile?.following?.length} following</span>
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

                        {
                            canViewProfile() ? (
                                <div className='flex flex-col gap-10 my-10'>
                                    <div className='flex justify-center items-center gap-7 '>
                                        <span onClick={() => setFeed("posts")} className={`${feed === 'posts' ? 'font-bold' : 'font-normal'} cursor-pointer flex items-center gap-2`}> <Image size={18} />   Posts</span>
                                        <span onClick={() => setFeed("reels")} className={`${feed === 'reels' ? 'font-bold' : 'font-normal'} cursor-pointer flex items-center gap-2`}> <Video size={18} />   Reels</span>
                                        <span onClick={() => setFeed("saved")} className={`${feed === 'saved' ? 'font-bold' : 'font-normal'} cursor-pointer flex items-center gap-2`}> <Bookmark size={18} />   Saved</span>
                                    </div>

                                    <div className='overflow-y-auto h-full'>
                                        {
                                            feed === 'posts' ? (
                                                <div className='grid grid-cols-3'>
                                                    {
                                                        posts?.map((post) => (
                                                            <div key={post?._id}>
                                                                <img src={post?.postSource} alt="post" className='w-[320px] h-[300px]' />
                                                            </div>
                                                        ))
                                                    }
                                                </div>

                                            ) : feed === "reels" ? (
                                                <div>
                                                    {
                                                        reels?.map((reel) => (
                                                            <div key={reel?._id} className=''>
                                                                <div className='grid grid-cols-3 h-full '>
                                                                    <video src={reel?.postSource}
                                                                        className="object-cover w-full h-full"
                                                                        controls
                                                                    />
                                                                </div>
                                                            </div>
                                                        ))
                                                    }
                                                </div>
                                            ) : <div>
                                                {
                                                    userProfile?.savedPosts?.map((saved) => (



                                                        <div key={saved?._id} className='grid grid-cols-3 h-full '>
                                                            {
                                                                saved?.postSource.includes('.mp4') ? (
                                                                    <div>
                                                                        <video src={saved?.postSource}
                                                                            className="object-cover w-full h-full"
                                                                            controls
                                                                        />
                                                                    </div>
                                                                ) : (
                                                                    <div>
                                                                        <img src={saved?.postSource} alt="post" />
                                                                    </div>
                                                                )
                                                            }
                                                        </div>
                                                    ))
                                                }
                                            </div>
                                        }


                                    </div>

                                </div>
                            ) : (
                                <div>Follow this user to see posts</div>
                            )
                        }





                    </div>
                </div>




            </div>

        </>
    )
}

export default Profile