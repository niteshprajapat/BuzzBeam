import useGetSuggestedUsers from '@/hooks/useGetSuggestedUsers'
import { Avatar } from '@radix-ui/react-avatar';
import React from 'react'
import { useSelector } from 'react-redux';
import { AvatarFallback, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';
import { toast } from 'sonner';
import axios from 'axios';

const SuggestedUsers = () => {
    const { token } = useSelector((store) => store.auth);
    const { user, suggestedUsers } = useSelector((store) => store?.auth);

    console.log("suggestedUsers", suggestedUsers);

    useGetSuggestedUsers();



    const handleFollow = async (userId) => {
        try {
            const response = await axios.get(`http://127.0.0.1:5000/api/v1/users/followUnfollow/${userId}`, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + token,
                },
                withCredentials: true,
            });

            const data = await response?.data;
            console.log("followUnfollowData", data);

            toast.message(data?.message);

        } catch (error) {
            console.log(error);
            toast.error(error?.response?.data?.message);
        }
    }


    return (
        <div>
            <div>
                <div className='flex items-center gap-3'>
                    <img src={user?.avatar} alt="avatar" className='h-[40px] w-[40px] rounded-full' />

                    <div>
                        <p>{user?.userName}</p>
                        <span>{user?.bio}</span>
                    </div>
                </div>
            </div>
            <div className='mt-10 flex flex-col gap-4'>
                {
                    suggestedUsers && suggestedUsers?.map((suggestedUser) => (
                        <div key={suggestedUser?._id} className='' >
                            <div className='flex justify-between items-center'>
                                <div className='flex items-center gap-3'>
                                    <img src={suggestedUser?.avatar} alt="avatar" className='h-[40px] w-[40px] rounded-full' />
                                    <div className='flex flex-col gap-[2px]'>
                                        <p>{suggestedUser?.userName}</p>
                                        <span>{suggestedUser?.bio}</span>
                                    </div>
                                </div>

                                <Button onClick={() => handleFollow(suggestedUser?._id)} >Follow</Button>  {/* Static Data for now */}
                            </div>
                        </div>
                    ))
                }
            </div>
        </div>
    )
}

export default SuggestedUsers