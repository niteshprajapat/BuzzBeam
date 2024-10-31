import React, { useRef, useState } from 'react'
import { Dialog, DialogContent } from '../ui/dialog'
import { Button } from '../ui/button';
import axios from 'axios';
import { BACKEND_URL } from '@/route';
import { toast } from 'sonner';
import { useDispatch, useSelector } from 'react-redux';
import { setYourStory } from '@/redux/slices/storySlice';
import { DeleteIcon, Trash2, View } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';


const ViewOtherUsersStoryModal = ({ selectedStory, otherStoryOpenModal, setOtherStoryOpenModal }) => {
    const dispatch = useDispatch();
    const { user, token } = useSelector((store) => store.auth);


    const handleViewStoryById = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.get(`${BACKEND_URL}/api/v1/story/viewStory/${selectedStory?._id}`, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + token,
                },
                withCredentials: true,
            });

            const data = await response.data;
            console.log("VIEWSTORYBYID", data);

            if (data?.success) {
                toast.success(data?.message);
                dispatch(setYourStory({}));
                setOtherStoryOpenModal(false);
            }

        } catch (error) {
            console.log(error);
            toast.error(error?.response?.data?.message);

        }
    }


    console.log("selectedStory", selectedStory);


    return (
        <Dialog open={otherStoryOpenModal} onOpenChange={() => {
            setOtherStoryOpenModal(false);
        }}>
            <DialogContent>

                <div className='flex items-center gap-2'>

                    <img src={selectedStory?.user?.avatar} alt="" />

                    <div className='flex flex-col gap-[2px]'>
                        <p>{selectedStory?.user?.userName}</p>
                        {/* <span>{formatDistanceToNow(selectedStory?.createdAt)} ago</span> */}
                    </div>
                </div>

                <div>
                    {
                        selectedStory?.storyType === "image" ? (
                            <img
                                src={selectedStory?.storySource}
                                alt="story"
                            />
                        )
                            : (
                                <video
                                    src={selectedStory?.storySource}
                                    controls
                                    className='h-[300px] w-full'
                                />
                            )
                    }
                </div>


                <div>
                    <View onClick={handleViewStoryById} />
                </div>

            </DialogContent>
        </Dialog>
    )
}



export default ViewOtherUsersStoryModal