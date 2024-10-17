import { Bell, CreativeCommons, Heart, Home, LogInIcon, LogOut, LogOutIcon, LucideLogOut, LucidePlusSquare, MessageCircle, Plus, PlusCircle, PlusSquare, PlusSquareIcon, Search, Video, VideoIcon } from 'lucide-react'
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Avatar, AvatarFallback, AvatarImage } from '../avatar'
import { useDispatch, useSelector } from 'react-redux'
import { Button } from '../button'
import { toast } from 'sonner'
import axios from 'axios'
import { setToken, setUser } from '@/redux/slices/userSlice'
import CreatePost from '@/components/CreatePost/CreatePost'
// import { logout } from '@/utils/logout'
// import { getCookie } from '@/utils/getCookie'





const Sidebar = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user, token } = useSelector((store) => store.auth);


    const [open, setOpen] = useState(false);

    // const token = getCookie("jwt");





    const handleLogout = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.get('https://buzzbeam.onrender.com/api/v1/users/logout', {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: "Bearer " + token,
                },
                withCredentials: true,
            });

            const data = await response.data;

            if (data.success) {
                dispatch(setUser(null));
                dispatch(setToken(null));

                toast.success(data?.message);
                navigate('/login')
            }



        } catch (error) {
            console.log(error);
            toast.error(error?.response?.data?.message);
        }
    }








    return (
        <>

            <CreatePost open={open} setOpen={setOpen} />


            <div className='h-screen w-[20%] bg-black/95 text-white'>
                <div className='p-4 flex flex-col justify-between h-full'>

                    <div className='flex flex-col gap-6'>
                        <div className='mb-10'>
                            <h1 className='text-[30px] text-center font-bold  bg-gradient-to-tr from-pink-500 via-red-500 to-yellow-500 text-transparent bg-clip-text'>BuzzBeam</h1>
                        </div>

                        <Link to={'/feed'}>
                            <div className='flex items-center gap-5'>
                                <Home />
                                <span>Home</span>
                            </div>
                        </Link>

                        <Link to={'/search'}>
                            <div className='flex items-center gap-5'>
                                <Search />
                                <span>Search</span>
                            </div>
                        </Link>

                        <Link to={'/reels'}>
                            <div className='flex items-center gap-5'>
                                <Video />
                                <span>Reels</span>
                            </div>
                        </Link>

                        <Link to={'/messages'}>
                            <div className='flex items-center gap-5'>
                                <MessageCircle />
                                <span>Messages</span>
                            </div>
                        </Link>

                        <Link to={'/notifications'}>
                            <div className='flex items-center gap-5'>
                                <Heart />
                                <span>Notifications</span>
                            </div>
                        </Link>

                        <div
                            onClick={() => setOpen(!open)}
                            className='flex items-center gap-5'>
                            <PlusSquareIcon />
                            <span>Create</span>
                        </div>

                        <div
                            onClick={() => navigate(`/profile/${user?._id}`)}
                            className='cursor-pointer'
                        >
                            <div className='flex items-center gap-5'>
                                <Avatar>
                                    <AvatarImage src={user?.avatar} alt="avatar" />
                                    <AvatarFallback>NA</AvatarFallback>
                                </Avatar>
                                <span>Profile</span>
                            </div>
                        </div>


                    </div>

                    <button
                        onClick={handleLogout}
                        className='flex items-center gap-5 p-4'>
                        Logout
                        <LogOut />
                    </button>
                </div>




            </div>
        </>



    )
}

export default Sidebar