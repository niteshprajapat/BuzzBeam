import useGetAllStories from '@/hooks/useGetAllStories'
import React, { useRef, useState } from 'react'
import { useSelector } from 'react-redux';
import { Button } from '../ui/button';
import axios from 'axios';
import { BACKEND_URL } from '@/route';
import UploadStoryModal from './UploadStoryModal';
import ViewYourStoryModal from './ViewYourStoryModal';

const Story = () => {
    const { stories, yourStory } = useSelector((store) => store?.story);



    useGetAllStories();

    console.log("stories", stories);



    const [openModal, setOpenModal] = useState(false);
    const [yourStoryopenModal, setYourStoryOpenModal] = useState(false);





    return (
        <>
            <UploadStoryModal openModal={openModal} setOpenModal={setOpenModal} />
            <ViewYourStoryModal yourStoryopenModal={yourStoryopenModal} setYourStoryOpenModal={setYourStoryOpenModal} />


            <div className='p-5 flex flex-col '>


                {
                    yourStory?.storySource ? (
                        <button onClick={() => setYourStoryOpenModal(!yourStoryopenModal)} >View Your Story</button>
                    ) : (
                        <button onClick={() => setOpenModal(!openModal)} >Add Story</button>
                    )
                }




                {/* Need to fix this  */}
                {
                    stories && stories?.map((story) => (
                        <div className='size-16 rounded-full bg-gray-100 opacity-100' key={story?._id}>
                            <div>
                                {
                                    story?.storyType === "image" ? (
                                        <img
                                            src={story.storySource}
                                            alt="story"
                                        />
                                    )
                                        : (
                                            <video
                                                src={story?.storySource}
                                                controls
                                            />
                                        )
                                }
                            </div>
                        </div>
                    ))
                }


            </div>
        </>
    )
}

export default Story