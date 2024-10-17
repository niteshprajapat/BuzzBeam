import React, { useRef, useState } from 'react';

import { Dialog, DialogContent, DialogHeader } from '../ui/dialog';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import { setPosts } from '@/redux/slices/postSlice';




const CreatePost = ({ open, setOpen }) => {
    const dispatch = useDispatch();
    const { token } = useSelector((store) => store.auth);

    const [caption, setCaption] = useState("");
    const [postLocation, setPostLocation] = useState("");
    const [file, setFile] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const imageRef = useRef();
    const [filePreview, setFilePreview] = useState(null);


    // console.log("file => ", file)
    // console.log("filePreview => ", filePreview)
    // console.log("imageUrl => ", imageUrl)

    const { posts } = useSelector((store) => store.post)



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
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            if (file) {
                setFile(file);

                const dataUri = await readFileAsDataUrl(file);
                setFilePreview(dataUri);
            }


            try {
                const response = await axios.post('https://buzzbeam.onrender.com/api/v1/users/uploadFile', {
                    media: file
                }, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                    withCredentials: true,
                });


                const data = await response.data;

                if (data?.success) {
                    console.log("pictureda,", data);
                    setImageUrl(data?.url);
                }


            } catch (error) {
                console.log(error);
            }
        }
    }



    const handleCreatePost = async (e) => {
        try {
            const response = await axios.post('https://buzzbeam.onrender.com/api/v1/posts/createPost', {
                postCaption: caption,
                postSource: imageUrl,
                postLocation: postLocation ? postLocation : "",
            }, {
                headers: {
                    'Content-Type': "application/json",
                    Authorization: "Bearer " + token
                },
                withCredentials: true,
            });

            const data = await response.data;

            if (data?.success) {
                console.log("uploadpost", data);
                dispatch(setPosts([...posts, data?.post]));
                toast.success(data?.message);

                setOpen(false)
                setCaption("");
                setPostLocation("")
                setFile(null)
                setImageUrl(null)
                setFilePreview(null)
            }
        } catch (error) {
            console.log(error)
            toast.error(error?.response?.data?.message);
        }
    }


    return (
        <form>
            <Dialog open={open} onOpenChange={() => {
                setOpen(false)
                setCaption("");
                setPostLocation("")
                setFile(null)
                setImageUrl(null)
                setFilePreview(null)
            }}>
                <DialogContent>
                    <DialogHeader>
                        <h1 className='font-bold text-[15px] text-center'>Create new post</h1>
                    </DialogHeader>

                    {
                        filePreview && <img src={filePreview} alt="preview" />
                    }


                    {
                        !filePreview && (
                            <div className='h-[300px]  flex justify-center items-center wf'>
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
                                >Select from Computer</Button>
                            </div>
                        )
                    }


                    {/* <div className='w-full flex justify-center items-center
                    '>
                        <Button onClick={handleUploadPost} className="">Click to Confirm</Button>
                    </div> */}


                    <div>
                        <Input
                            value={caption}
                            onChange={(e) => setCaption(e.target.value)}
                            type="text"
                            placeholder="Enter Caption for Post"
                        />
                    </div>

                    <div>
                        <Input
                            value={postLocation}
                            onChange={(e) => setPostLocation(e.target.value)}
                            type="text"
                            placeholder="Post Location (Optional**)"
                        />
                    </div>

                    {
                        filePreview && (

                            <Button onClick={handleCreatePost}>Post</Button>
                        )
                    }

                </DialogContent>
            </Dialog>
        </form>
    )
}

export default CreatePost