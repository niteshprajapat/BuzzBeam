import React, { useEffect, useRef, useState } from 'react'
import { Dialog, DialogContent } from '../ui/dialog'
import { Button } from '../ui/button';
import axios from 'axios';
import { BACKEND_URL } from '@/route';
import { toast } from 'sonner';
import { useDispatch, useSelector } from 'react-redux';
import { setYourStory } from '@/redux/slices/storySlice';
import { DeleteIcon, Trash2 } from 'lucide-react';

const ViewYourStoryModal = ({ yourStoryopenModal, setYourStoryOpenModal }) => {
    const dispatch = useDispatch();
    const { user, token } = useSelector((store) => store.auth);
    const { yourStory } = useSelector((store) => store.story);

    console.log("yourStory", yourStory);

    const handleDeleteStory = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.delete(`${BACKEND_URL}/api/v1/story/deleteStoryById/${yourStory?._id}`, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + token,
                },
                withCredentials: true,
            });

            const data = await response.data;
            console.log("DELETESTORY", data);

            if (data?.success) {
                toast.success(data?.message);
                dispatch(setYourStory({}));
                setOpenModal(false);
            }

        } catch (error) {
            console.log(error);
            toast.error(error?.response?.data?.message);

        }
    }

    // const handleStoryViewedBy = async () => {
    //     try {
    //         const response = await axios.get(`${BACKEND_URL}/api/v1/story/storyViewedBy/${yourStory?._id}`, {
    //             headers: {
    //                 'Content-Type': 'application/json',
    //                 Authorization: 'Bearer ' + token,
    //             },
    //             withCredentials: true,
    //         });

    //         const data = await response.data;
    //         console.log("STORYVIIEWEDBY", data);

    //         if (data?.success) {
    //             toast.success(data?.message);
    //         }

    //     } catch (error) {
    //         console.log(error);
    //         toast.error(error?.response?.data?.message);

    //     }
    // }


    // useEffect(() => {
    //     handleStoryViewedBy();
    // }, [yourStory]);



    return (
        <Dialog open={yourStoryopenModal} onOpenChange={() => {
            setYourStoryOpenModal(false);
        }}>
            <DialogContent>

                <div>
                    {
                        yourStory?.storyType === "image" ? (
                            <img
                                src={yourStory.storySource}
                                alt="story"
                            />
                        )
                            : (
                                <video
                                    src={yourStory?.storySource}
                                    controls
                                    className='h-[300px] w-full'
                                />
                            )
                    }
                </div>


                <div className='flex justify-between items-center w-full'>
                    <div className='flex'>
                        <span>{yourStory?.viewers?.length} views </span>
                    </div>
                    <Trash2 onClick={handleDeleteStory} />
                </div>

            </DialogContent>
        </Dialog>
    )
}


export default ViewYourStoryModal