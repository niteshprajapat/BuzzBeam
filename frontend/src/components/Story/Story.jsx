import useGetAllStories from '@/hooks/useGetAllStories'
import React, { useRef, useState } from 'react'
import { useSelector } from 'react-redux';
import { Button } from '../ui/button';
import axios from 'axios';
import { BACKEND_URL } from '@/route';
import UploadStoryModal from './UploadStoryModal';
import ViewYourStoryModal from './ViewYourStoryModal';
import ViewOtherUsersStoryModal from './viewOtherUsersStoryModal';

const Story = () => {
    const { stories, yourStory } = useSelector((store) => store?.story);



    useGetAllStories();

    console.log("stories", stories);



    const [openModal, setOpenModal] = useState(false);
    const [yourStoryopenModal, setYourStoryOpenModal] = useState(false);
    const [otherStoryOpenModal, setOtherStoryOpenModal] = useState(false);
    const [selectedStory, setSelectedStory] = useState({});





    return (
        <>
            <UploadStoryModal openModal={openModal} setOpenModal={setOpenModal} />
            <ViewYourStoryModal yourStoryopenModal={yourStoryopenModal} setYourStoryOpenModal={setYourStoryOpenModal} />
            <ViewOtherUsersStoryModal selectedStory={selectedStory} otherStoryOpenModal={otherStoryOpenModal} setOtherStoryOpenModal={setOtherStoryOpenModal} />


            <div className='p-5 flex flex-col '>


                {
                    yourStory?.storySource ? (
                        <button onClick={() => setYourStoryOpenModal(!yourStoryopenModal)} >View Your Story</button>
                    ) : (
                        <button onClick={() => setOpenModal(!openModal)} >Add Story</button>
                    )
                }




                <div className='flex flex-col gap-3'>


                    {/* Need to fix this  */}
                    {
                        stories && stories?.map((story) => (
                            <div className=' rounded-full bg-gray-100 opacity-100' key={story?._id}>
                                <div onClick={() => {
                                    setOtherStoryOpenModal(!otherStoryOpenModal)
                                    setSelectedStory(story)
                                }}
                                    className='cursor-pointer' >
                                    {
                                        story?.storyType === "image" ? (
                                            <img
                                                src={story.storySource}
                                                alt="story"
                                                className='w-[70px] h-[70px] rounded-full object-fill'
                                            />
                                        )
                                            : (
                                                <video
                                                    src={story?.storySource}

                                                    className='w-[70px] h-[70px] rounded-full object-fill'
                                                />
                                            )
                                    }

                                    <span>{story.user?.userName}</span>
                                </div>
                            </div>
                        ))
                    }

                </div>


            </div>
        </>
    )
}

export default Story