import React, { useEffect, useState } from 'react';

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from '../ui/input';
import { useSelector } from 'react-redux';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { toast } from 'sonner';
import axios from 'axios';

const UpdateProfile = ({ open, setOpen }) => {
    const { user, token } = useSelector((store) => store.auth);


    const [userName, setUserName] = useState("");
    const [name, setName] = useState("");
    const [bio, setBio] = useState("");
    const [socialLinks, setSocialLinks] = useState("");
    const [isPrivate, setIsPrivate] = useState(null);
    const [avatar, setAvatar] = useState(null);

    useEffect(() => {
        setUserName(user?.userName || "");
        setName(user?.name || "");
        setBio(user?.bio || "");
        setSocialLinks(user?.socialLinks || "");
        setIsPrivate(user?.isPrivate || null);
    }, []);

    const handleUploadFile = async (e) => {
        try {
            if (e.target.files && e.target.files[0]) {
                const imageFile = e.target.files[0];

                const formData = new FormData();
                formData.append("media", imageFile);

                if (!imageFile) {
                    return;
                }


                const response = await axios.post('http://127.0.0.1:5000/api/v1/users/uploadFile', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                    withCredentials: true,
                });

                const data = await response.data;
                console.log("imgDatra", data);

                if (data.success) {
                    toast.success(data?.message);
                    setAvatar(data?.url);
                }


            }

        } catch (error) {
            console.log(error);
            toast.error(error?.response?.data?.message);
        }

    }

    const handleUpdateProfile = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.put(`http://127.0.0.1:5000/api/v1/users/updateProfile`, {
                name,
                userName,
                bio,
                socialLinks,
                isPrivate,
                avatar,
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + token,
                },
                withCredentials: true,
            });

            const data = await response?.data;

            if (data?.success) {
                console.log("updateData", data);
            }
        } catch (error) {
            console.log(error);
            toast.error(error?.response?.data?.message);
        }
    }

    return (
        <Dialog open={open} onOpenChange={() => setOpen(false)}>
            <DialogContent>
                <DialogHeader>Update Profile</DialogHeader>

                <form
                    onSubmit={handleUpdateProfile}
                    className='flex flex-col gap-3'>

                    <div>
                        <Label>User Name</Label>
                        <Input
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)}
                            type="text"
                        />
                    </div>
                    <div>
                        <Label>Full Name</Label>
                        <Input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            type="text"
                        />
                    </div>
                    <div>
                        <Label>Bio</Label>
                        <Input
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            type="text"
                        />
                    </div>
                    <div>
                        <Label>Social Link</Label>
                        <Input
                            value={socialLinks}
                            onChange={(e) => setSocialLinks(e.target.value)}
                            type="text"
                        />
                    </div>
                    <div className='flex flex-col gap-3'>
                        <Label className="text-[15px] font-semibold">Do you want to make your profile Private?</Label>



                        <select
                            onChange={(e) => setIsPrivate(e.target.value)}
                        >
                            <option>Select profile status</option>
                            <option value={true}>Private</option>
                            <option value={false}>Public</option>
                        </select>

                    </div>


                    <div>
                        <Label className="text-[15px] font-semibold">Choose Profile Picture</Label>
                        <Input
                            type="file"
                            accept="image/*"
                            onChange={handleUploadFile}
                        />
                    </div>

                    <div>
                        <Button type="submit" className="w-full">Save</Button>
                    </div>

                </form>
            </DialogContent>
        </Dialog>
    )
}

export default UpdateProfile