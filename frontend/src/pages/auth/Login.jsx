import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { setUser, setToken } from '@/redux/slices/userSlice'
import axios from 'axios'
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { toast } from "sonner"
// import Cookies from 'universal-cookie';






const Login = () => {
    // const cookies = new Cookies();

    const { user, token } = useSelector((store) => store.auth);

    console.log("USERDATA", user);
    console.log("tTOKENDATA", token);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [userCredentials, setUserCredentials] = useState("")
    const [password, setPassword] = useState("")




    const handleLogin = async (e) => {
        e.preventDefault();


        try {
            const response = await axios.post('http://127.0.0.1:5000/api/v1/users/login', {
                user: userCredentials,
                password,
            }, {
                headers: {
                    'Content-Type': 'application/json',
                },
                withCredentials: true
            });

            const data = await response.data;
            console.log("datalogin", data);

            if (data.success) {
                // cookies.set('jwt', data.token, { httpOnly: false, maxAge: 1000 * 60 * 60 * 24 });

                toast.success(data?.message);
                dispatch(setUser(data?.user));
                dispatch(setToken(data?.token));


                navigate('/feed');
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
                    onSubmit={handleLogin}
                    className='max-w-[530px] mx-auto flex flex-col gap-4'>

                    <div className='w-full'>
                        <Label className="text-[15px] font-semibold">Username / Email</Label>
                        <Input
                            value={userCredentials}
                            onChange={(e) => setUserCredentials(e.target.value)}
                            type="text"
                            placeholder="Enter username or email"
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



                    <Button type="submit">Login</Button>

                </form>
            </div>
        </div>
    )
}


export default Login;