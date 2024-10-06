import useGetAllFollowing from '@/hooks/useGetAllFollowing'
import React from 'react'


import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { useSelector } from 'react-redux'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import axios from 'axios'

const Following = ({ openFollowing, setOpenFollowing }) => {
    useGetAllFollowing();

    const { following } = useSelector((store) => store?.auth);
    const { token } = useSelector((store) => store.auth);

    const handleFollowUnfollow = async (userId) => {
        try {
            const response = await axios.get(`http://127.0.0.1:5000/api/v1/users/followUnfollow/${userId}`, {
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
        <Dialog open={openFollowing} onOpenChange={() => setOpenFollowing(false)} >
            <DialogContent>
                <DialogHeader>Following</DialogHeader>

                <div className='flex flex-col gap-4 mt-10'>
                    {
                        following && following?.map((following) => (
                            <div key={following?._id} className='flex justify-between items-center p-2 w-full'>
                                <div className='w-[60%] flex items-center gap-3'>
                                    <img src={following?.avatar} alt={following?.userName} className='rounded-full size-12' />

                                    <div className='flex flex-col gap-[2px]'>
                                        <p>{following?.userName}</p>
                                        <span>{following?.name}</span>
                                    </div>
                                </div>
                                <Button onClick={() => handleFollowUnfollow(following?._id)}>Following</Button>
                            </div>
                        ))
                    }
                </div>


            </DialogContent>



        </Dialog>
    )
}

export default Following
