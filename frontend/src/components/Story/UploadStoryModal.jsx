import React, { useRef, useState } from 'react'
import { Dialog, DialogContent } from '../ui/dialog'
import { Button } from '../ui/button';
import axios from 'axios';
import { BACKEND_URL } from '@/route';
import { toast } from 'sonner';
import { useDispatch, useSelector } from 'react-redux';
import { setYourStory } from '@/redux/slices/storySlice';

const UploadStoryModal = ({ openModal, setOpenModal }) => {
    const dispatch = useDispatch();
    const { user, token } = useSelector((store) => store.auth);
    const { yourStory } = useSelector((store) => store.story);

    const imageRef = useRef();
    const [filePreview, setFilePreview] = useState(null);

    const [storySource, setStorySource] = useState("");
    const [storyType, setStoryType] = useState("");


    const readFileAsDataUrl = async (file) => {
        const fileUrlData = new Promise((resolve, reject) => {
            const reader = new FileReader();

            reader.onload = () => resolve(reader.result);
            reader.onerror = () => reject(new Error("Error reading file"));

            reader.readAsDataURL(file);
        });

        return fileUrlData;
    }

    const handleUploadPost = async (e) => {
        try {

            if (e.target.files && e.target.files[0]) {
                const file = e.target.files[0];

                if (file) {
                    const dataUri = await readFileAsDataUrl(file);
                    setFilePreview(dataUri);
                }

                try {
                    const response = await axios.post(`${BACKEND_URL}/api/v1/story/uploadFile`, {
                        media: file
                    }, {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        },
                        withCredentials: true,
                    });

                    const data = await response.data;

                    if (data?.success) {
                        // setImageUrl(data?.url);
                        setStorySource(data?.url);
                    }

                } catch (error) {
                    console.log(error);
                }
            }

        } catch (error) {
            console.log(error);
        }
    }



    const handleUploadStory = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(`${BACKEND_URL}/api/v1/story/uploadStory`, {
                storySource,
                storyType,
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + token,
                },
                withCredentials: true,
            });

            const data = await response.data;
            console.log("UPLOADSTORY", data);

            if (data?.success) {
                toast.success(data?.message);
                dispatch(setYourStory(data?.story));
                setOpenModal(false);
            }

        } catch (error) {
            console.log(error);
            toast.error(error?.response?.data?.message);

        }
    }


    return (
        <Dialog open={openModal} onOpenChange={() => {
            setOpenModal(false);
            setFilePreview(null);
            setStoryType("");
            setStorySource("");
        }}>
            <DialogContent>

                <div>

                    <select onChange={(e) => setStoryType(e.target.value)}>
                        <option >Choose Type</option>
                        <option value="image">Image</option>
                        <option value="video">Video</option>
                    </select>

                    {
                        filePreview && (
                            storyType === "image"
                                ? <img src={filePreview} alt="preview" />
                                : <video src={filePreview} controls className='h-[300px] w-full' />
                        )
                    }

                    {
                        <p>{storyType}</p>
                    }

                    {
                        !filePreview && (
                            <div className='h-[300px]  flex justify-center items-center w-fit'>
                                <input
                                    onChange={handleUploadPost}
                                    ref={imageRef}
                                    type="file"
                                    className='hidden'
                                />

                                <Button
                                    onClick={() => imageRef.current.click()}
                                    type="button"
                                    variant=""
                                    className="text-white bg-blue-500"
                                >Choose Story from Computer</Button>
                            </div>
                        )
                    }

                    {
                        filePreview && <Button onClick={handleUploadStory}>Upload Story</Button>
                    }




                </div>

            </DialogContent>
        </Dialog>
    )
}

export default UploadStoryModal