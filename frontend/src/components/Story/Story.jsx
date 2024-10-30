import useGetAllStories from '@/hooks/useGetAllStories'
import React, { useRef, useState } from 'react'
import { useSelector } from 'react-redux';
import { Button } from '../ui/button';
import axios from 'axios';
import { BACKEND_URL } from '@/route';

const Story = () => {
    const { stories } = useSelector((store) => store?.story);

    useGetAllStories();

    console.log("stories", stories);

    const [file, setFile] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const imageRef = useRef();
    const [filePreview, setFilePreview] = useState(null);



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
                        setImageUrl(data?.url);
                    }

                } catch (error) {
                    console.log(error);
                }
            }

        } catch (error) {
            console.log(error);
        }
    }

    // const handleUploadPost = async (e) => {
    //     if (e.target.files && e.target.files[0]) {
    //         const file = e.target.files[0];
    //         if (file) {
    //             setFile(file);

    //             const dataUri = await readFileAsDataUrl(file);
    //             setFilePreview(dataUri);
    //         }


    //         try {
    //             const response = await axios.post(`${BACKEND_URL}/api/v1/story/uploadFile`, {
    //                 media: file
    //             }, {
    //                 headers: {
    //                     'Content-Type': 'multipart/form-data',
    //                 },
    //                 withCredentials: true,
    //             });

    //             console.log("responseresponse:", response);

    //             const data = await response.data;

    //             if (data?.success) {
    //                 console.log("pictureda,", data);
    //                 setImageUrl(data?.url);
    //             }


    //         } catch (error) {
    //             console.log(error);
    //         }
    //     }
    // }



    return (
        <div className='p-5 flex flex-col '>

            <div>
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
            </div>

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
    )
}

export default Story