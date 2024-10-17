import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import Sidebar from '@/components/ui/Sidebar/Sidebar'
import axios from 'axios';
import React, { useRef, useState } from 'react'
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const Search = () => {
    const [searchAccount, setSearchAccount] = useState("");
    const { token } = useSelector((store) => store.auth);

    const [accounts, setAccounts] = useState([]);
    const debounceTimer = useRef(null);

    // const handleSearch = async (e) => {
    //     try {
    //         const response = await axios.get(`https://buzzbeam.onrender.com/api/v1/users/search?query=${searchAccount}`, {
    //             headers: {
    //                 'Content-Type': 'application/json',
    //                 Authorization: 'Bearer ' + token,
    //             },
    //             withCredentials: true,
    //         });

    //         const data = await response.data;
    //         console.log("usersearchda", data);

    //         if (data.success) {
    //             setAccounts(data?.users);
    //         }

    //     } catch (error) {
    //         console.log(error);
    //     }
    // }
    const handleSearch = async (value) => {
        try {
            const response = await axios.get(`https://buzzbeam.onrender.com/api/v1/users/search?query=${value}`, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + token,
                },
                withCredentials: true,
            });

            const data = await response.data;
            console.log("usersearchda", data);

            if (data.success) {
                setAccounts(data?.users);
            }

        } catch (error) {
            console.log(error);
        }
    }


    const debounceSearch = (value) => {
        if (debounceTimer.current) {
            clearTimeout(debounceTimer.current);
        }
        debounceTimer.current = setTimeout(() => {
            if (value.length > 0) {
                handleSearch(value);
            }
        }, 500);
    };

    return (
        <div className='flex h-screen'>

            <Sidebar />

            <div className='flex flex-col w-full  h-full overflow-y-auto p-10 '>
                <div className='max-w-8xl mx-auto w-full flex items-center gap-10'>
                    <input
                        value={searchAccount}
                        onChange={(e) => setSearchAccount(e.target.value)}
                        onKeyUp={(e) => debounceSearch(e.target.value)}
                        type="text"
                        placeholder='Search Account...'
                        className='border border-black rounded-md w-[80%] py-[6px] px-2'
                    />

                    <Button>Search </Button>
                </div>

                <div className='flex flex-col gap-3 my-10'>
                    {
                        searchAccount?.length !== 0 && accounts?.length !== 0 ? (
                            accounts && accounts?.map((account) => (
                                <Link to={`/profile/${account?._id}`} key={account?._id}>
                                    <div key={account?._id} className='flex items-center gap-4 cursor-pointer bg-gray-100 hover:bg-gray-200 p-2 rounded-md'>
                                        <Avatar>
                                            <AvatarImage src={account?.avatar} alt="avatar" />
                                            <AvatarFallback>CN</AvatarFallback>
                                        </Avatar>

                                        <div className='flex flex-col gap-1'>
                                            <p className='text-black font-semibold'>{account?.userName}</p>
                                            <span className='text-[14px] text-gray-500'>{account?.name}</span>
                                        </div>
                                    </div>
                                </Link>
                            ))
                        ) : (
                            <div className='flex flex-col justify-center items-center min-h-[500px] w-full'>
                                <span className='text-2xl font-bold'>No related account found!</span>
                            </div>
                        )
                    }
                </div>
            </div>

        </div>
    )
}

export default Search