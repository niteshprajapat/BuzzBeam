import { Avatar, AvatarImage } from '@/components/ui/avatar';
import Sidebar from '@/components/ui/Sidebar/Sidebar'
import useGetAllUsers from '@/hooks/useGetAllUsers';
import { setSelectedUser } from '@/redux/slices/userSlice';
import { AvatarFallback } from '@radix-ui/react-avatar';
import { MessageCircle, MessageCircleCodeIcon } from 'lucide-react';
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'

const Message = () => {
    const dispatch = useDispatch();
    const { allUsers, selectedUser } = useSelector((store) => store.auth);

    console.log("selecteduser", selectedUser);

    useGetAllUsers();

    console.log("userDATA", allUsers);


    return (
        <div className='flex h-screen '>
            <Sidebar />


            <div className='flex   w-full '>
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
                            <div className='flex flex-col'>
                                <div className='bg-red-300'>
                                    <div className='rounded-full size-10'>
                                        <Avatar className="rounded-full size-10">
                                            <AvatarImage src={selectedUser?.avatar} alt={selectedUser?.userName} className="rounded-full size-10" />
                                            <AvatarFallback>CN</AvatarFallback>
                                        </Avatar>
                                    </div>
                                </div>
                                <div></div>
                                <div></div>

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