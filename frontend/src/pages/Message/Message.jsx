import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Sidebar from '@/components/ui/Sidebar/Sidebar'
import useGetAllMessages from '@/hooks/useGetAllMessages';
import useGetAllUsers from '@/hooks/useGetAllUsers';
import { setSelectedUser } from '@/redux/slices/userSlice';
import { BACKEND_URL } from '@/route';
import { AvatarFallback } from '@radix-ui/react-avatar';
import axios from 'axios';
import { MessageCircle, MessageCircleCodeIcon, Send } from 'lucide-react';
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'sonner';

const Message = () => {
    const dispatch = useDispatch();
    const { allUsers, selectedUser, token, user } = useSelector((store) => store.auth);
    const { messages } = useSelector((store) => store.message);

    const [message, setMessage] = useState("");

    console.log("messages", messages);

    useGetAllUsers();
    useGetAllMessages();


    console.log("userDATA", allUsers);


    const handleSendMessage = async (e) => {
        e.preventDefault();


        try {
            const response = await axios.post(`${BACKEND_URL}/api/v1/messages/sendMessage/${selectedUser?._id}`, {
                message,
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + token,
                },
                withCredentials: true,
            });

            const data = await response?.data;

            console.log("sendMessage", data);

            if (data?.success) {
                toast.success("Message sent!");
                setMessage("");
            }
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className='flex h-screen '>
            <Sidebar />


            <div className='flex   w-full gap-1'>
                <div className='flex flex-col gap-3 h-screen overflow-y-auto w-[30%]'>
                    {
                        allUsers && allUsers?.map((chatUser) => (
                            <div
                                onClick={() => dispatch(setSelectedUser(chatUser))}
                                key={chatUser?._id}
                                className='flex items-center gap-2'
                            >
                                <Avatar>
                                    <AvatarImage src={chatUser?.avatar} alt={chatUser?.name} />
                                    <AvatarFallback>CN</AvatarFallback>
                                </Avatar>

                                <div className='flex flex-col gap-[2px]'>
                                    <p>{chatUser?.userName}</p>
                                    <p>{chatUser?.name}</p>
                                </div>
                            </div>
                        ))
                    }
                </div>

                <div className='flex items-start w-full'>
                    {
                        selectedUser ? (
                            <div className='flex flex-col w-full'>
                                <div className='bg-red-300'>
                                    <div className='rounded-full size-10 flex items-center gap-3 h-[50px]'>
                                        <Avatar className="rounded-full size-10">
                                            <AvatarImage src={selectedUser?.avatar} alt={selectedUser?.userName} className="rounded-full size-10" />
                                            <AvatarFallback>CN</AvatarFallback>
                                        </Avatar>

                                        <p>{selectedUser?.userName}</p>
                                    </div>
                                </div>
                                <div className='min-h-[600px]'>
                                    {
                                        messages && messages?.messages?.map((oldMessage) => (
                                            <div className={`flex ${user?._id?.toString() === oldMessage?.sender ? 'justify-end' : 'justify-start'} gap-1`}>{oldMessage?.message}</div>
                                        ))
                                    }


                                </div>
                                <form
                                    onSubmit={handleSendMessage}
                                    className='flex justify-between items-center gap-3'>
                                    <Input
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        type="text"
                                        placeholder="Message..."
                                    />

                                    <Button type="submit">
                                        <Send size={20} />
                                    </Button>
                                </form>

                            </div>
                        ) : (
                            <div className='flex flex-col justify-center items-center gap-3 w-full'>
                                <MessageCircleCodeIcon />
                                <h1>Your messages</h1>
                                <span>Send a message to start a chat</span>
                            </div>

                        )
                    }
                </div>


            </div>

        </div>
    )
}

export default Message