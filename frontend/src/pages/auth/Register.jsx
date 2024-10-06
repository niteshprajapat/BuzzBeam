import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import axios from 'axios'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from "sonner"

const Register = () => {
    const navigate = useNavigate();

    const [name, setName] = useState("")
    const [userName, setUserName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [gender, setGender] = useState("")
    const [isPrivate, setIsPrivate] = useState(false)
    const [avatar, setAvatar] = useState("")


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

    const handleRegister = async (e) => {
        e.preventDefault();


        try {
            const response = await axios.post('http://127.0.0.1:5000/api/v1/users/register', {
                name,
                userName,
                email,
                password,
                gender,
                isPrivate: Boolean(isPrivate),
                avatar,
            }, {
                headers: {
                    'Content-Type': 'application/json',
                },
                withCredentials: true
            });

            const data = await response.data;
            console.log("data", data);

            if (data.success) {
                toast.success(data?.message);
                navigate('/login');
            }

        } catch (error) {
            console.log(error);
            toast.error(error?.response?.data?.message);
        }
    }




    return (
        <div className=''>
            <div className='max-w-7xl mx-auto py-10 px-5'>
                <h1 className="text-3xl text-center font-bold  bg-gradient-to-tr from-pink-500 via-red-500 to-yellow-500 text-transparent bg-clip-text">BuzzBeam</h1>

                <form
                    onSubmit={handleRegister}
                    className='max-w-[530px] mx-auto flex flex-col gap-4'>
                    <div className='w-full flex flex-col gap-3'>
                        <Label className="text-[15px] font-semibold">FullName</Label>
                        <Input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            type="text"
                            placeholder="Enter fullname"
                        />
                    </div>
                    <div className='w-full'>
                        <Label className="text-[15px] font-semibold">Username</Label>
                        <Input
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)}
                            type="text"
                            placeholder="Enter username"
                        />
                    </div>

                    <div className='w-full'>
                        <Label className="text-[15px] font-semibold">Email</Label>
                        <Input
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            type="email"
                            placeholder="Enter email"
                        />
                    </div>
                    <div className='w-full'>
                        <Label className="text-[15px] font-semibold">Password</Label>
                        <Input
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            type="password"
                            placeholder="Enter password"
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
                        <Label className="text-[15px] font-semibold">Gender</Label>
                        <Select
                            value={gender}
                            onValueChange={(value) => setGender(value)}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select gender" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectItem value={"male"}>Male</SelectItem>
                                    <SelectItem value={"female"}>Female</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <Label className="text-[15px] font-semibold">Choose Profile Picture</Label>
                        <Input
                            type="file"
                            accept="image/*"
                            onChange={handleUploadFile}
                        />
                    </div>

                    <Button type="submit">Register</Button>

                </form>
            </div>
        </div>
    )
}

export default Register