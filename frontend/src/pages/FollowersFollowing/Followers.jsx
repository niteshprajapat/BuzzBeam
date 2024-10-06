import useGetAllFollowers from '@/hooks/useGetAllFollowers'
import React from 'react'
import { useParams } from 'react-router-dom'


import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { useSelector } from 'react-redux'

const Followers = ({ openFollowers, setOpenFollowers }) => {
    useGetAllFollowers();


    const { followers } = useSelector((store) => store?.auth);

    return (
        <Dialog open={openFollowers} onOpenChange={() => setOpenFollowers(false)} >
            <DialogContent>
                <DialogHeader>Followers</DialogHeader>

                <div className='flex flex-col gap-4 mt-10'>
                    {
                        followers && followers?.map((follower) => (
                            <div key={follower?._id} className='flex justify-between items-center p-2 w-full'>
                                <div className='w-[60%] flex items-center gap-3'>
                                    <img src={follower?.avatar} alt={follower?.userName} className='rounded-full size-12' />

                                    <div className='flex flex-col gap-[2px]'>
                                        <p>{follower?.userName}</p>
                                        <span>{follower?.name}</span>
                                    </div>
                                </div>
                                <div></div>
                            </div>
                        ))
                    }
                </div>


            </DialogContent>



        </Dialog>
    )
}

export default Followers