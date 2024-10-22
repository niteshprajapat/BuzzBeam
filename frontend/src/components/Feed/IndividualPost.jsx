import React, { useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';
import { Bookmark, FileHeart, Heart, HeartOffIcon, LucideHeart, MessageCircle, MessageCircleCode, Save } from 'lucide-react';
import { Input } from '../ui/input';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { useSelector } from 'react-redux';
import { Badge } from '../ui/badge';
import axios from 'axios';
import { HeartFilledIcon } from '@radix-ui/react-icons';
import { toast } from 'sonner';
import { BACKEND_URL } from '@/route';
import DummyProfile from '/dummyProfile.png';



const IndividualPost = ({ post }) => {

    const { user, token } = useSelector((store) => store?.auth)

    const [visibleComment, setVisibleComment] = useState(false);
    const [commentText, setCommentText] = useState("");

    console.log("post", post);

    const handleFollowUnfollow = async (userId) => {
        try {
            const response = await axios.get(`${BACKEND_URL}/api/v1/users/followUnfollow/${userId}`, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + token,
                },
                withCredentials: true,
            });

            const data = await response?.data;
            console.log("followUnfollowData", data);

            toast.success(data?.message);

        } catch (error) {
            console.log(error);
            toast.error(error?.response?.data?.message);
        }
    }

    const likePost = async () => {
        try {
            const response = await axios.get(`${BACKEND_URL}/api/v1/posts/likeUnlikePost/${post?._id}`, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + token,
                },
                withCredentials: true,
            });

            const data = await response.data;
            console.log("LIKE", data);

            if (data?.success) {
                toast.success(data?.message);
            }

        } catch (error) {
            console.log(error);
            toast.error(error?.response?.data?.message);
        }
    }


    const handleAddComment = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(`${BACKEND_URL}/api/v1/comments/createComment/${post?._id}`, {
                commentText
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + token,
                },
                withCredentials: true,
            });

            const data = await response.data;
            console.log("Comment", data);

            if (data?.success) {
                toast.success(data?.message);
            }

        } catch (error) {
            console.log(error);
            toast.error(error?.response?.data?.message);
        }
    }

    const handleSavePost = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.get(`${BACKEND_URL}/api/v1/posts/savePost/${post?._id}`, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + token,
                },
                withCredentials: true,
            });

            const data = await response.data;
            console.log("SAVEPOST", data);

            if (data?.success) {
                toast.success(data?.message);
            }

        } catch (error) {
            console.log(error);
            toast.error(error?.response?.data?.message);
        }
    }


    const handleLikeUnlikeComment = async (commentId) => {

        try {
            const response = await axios.get(`${BACKEND_URL}/api/v1/comments/likeUnlikeComment/${commentId}`, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + token,
                },
                withCredentials: true,
            });

            const data = await response.data;
            console.log("CoommentLIKE", data);

            if (data?.success) {
                toast.success(data?.message);
            }

        } catch (error) {
            console.log(error);
            toast.error(error?.response?.data?.message);
        }
    }

    return (
        <div>

            <div className='h-[400px] w-[300px] flex flex-col'>
                <div>

                    <div className='flex justify-between items-center'>
                        <div className='flex items-center gap-3'>
                            <Link to={`/profile/${post?.user?._id}`}>
                                <Avatar>
                                    <AvatarImage src={post?.user?.avatar} alt="avatar" />
                                    <AvatarFallback>
                                        <img src={DummyProfile} alt="avatar" />
                                    </AvatarFallback>
                                </Avatar>
                            </Link>
                            <span> {formatDistanceToNow(post?.createdAt)} ago </span>
                            <span>
                                {
                                    post?.user?._id?.toString() === user?._id?.toString() ? (<Badge variant={"outline"}>Author</Badge>) :

                                        user?.following?.includes(post?.user?._id) ? (
                                            <Button onClick={() => handleFollowUnfollow(post?.user?._id)} variant="secondary">Following</Button>
                                        ) : (
                                            <Button onClick={() => handleFollowUnfollow(post?.user?._id)}>Follow</Button>
                                        )
                                }

                            </span>
                        </div>
                        <Button variant="secondary">...</Button>
                    </div>
                    <span>{post?.postLocation}</span>
                </div>


                <div className='w-[300px] h-[300px]'>

                    {
                        post?.postSource?.includes(".mp4") ? (
                            <video src={post?.postSource}
                                className="object-cover w-full h-full"
                                controls
                            />
                        ) : (
                            <img src={post?.postSource} alt="postimg" />
                        )
                    }
                </div>



                <div>
                    <div className='flex justify-between items-center'>
                        <div className='flex items-center gap-3'>

                            <button onClick={likePost}>
                                {
                                    post?.likes?.includes(user?._id) ? <Heart /> : <Heart />
                                }
                            </button>






                            <div onClick={() => setVisibleComment(!visibleComment)}>
                                <MessageCircle />

                            </div>

                        </div>
                        <div onClick={handleSavePost}>
                            <Bookmark />
                        </div>

                    </div>

                    <div>
                        <span>{post?.likes?.length} likes</span>

                        <div className='flex flex-col gap-1'>
                            <div>
                                <h1>{post?.user?.userName}</h1>  <span>{post?.postCaption}</span>
                            </div>
                            <span>View All {post?.comments?.length} commments</span>

                            {
                                post?.comments && post?.comments?.map((comment) => (
                                    <div className='flex justify-between items-center' key={comment?._id}>
                                        <span>{comment?.commentText}</span>

                                        <Button
                                            onClick={() => handleLikeUnlikeComment(comment?._id)}
                                            variant="secondary">
                                            <Heart />
                                        </Button>

                                    </div>
                                ))
                            }
                        </div>

                        {
                            visibleComment && (
                                <form
                                    onSubmit={handleAddComment}
                                >
                                    <Input
                                        value={commentText}
                                        onChange={(e) => setCommentText(e.target.value)}
                                        type="text"
                                        placeholder="Add a comment"

                                    />

                                    <Button>Post</Button>
                                </form>
                            )
                        }



                    </div>
                </div>
            </div>

        </div >
    )
}

export default IndividualPost