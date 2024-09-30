import Sidebar from '@/components/ui/Sidebar/Sidebar'
import React from 'react'
import { useSelector } from 'react-redux'

const Reels = () => {
    const { posts } = useSelector((store) => store.post);

    console.log("reepost", posts);

    const reels = posts?.filter((post) => post?.postSource?.includes(".mp4"));
    console.log("reels", reels);

    return (
        <div className='flex h-screen '>
            <Sidebar />

            <div className='flex flex-col w-full  h-full overflow-y-auto py-10'>

                <div className='max-w-4xl mx-auto '>
                    {
                        reels && reels?.map((reel) => (
                            <div className='h-[330px] w-[300px]'>
                                <video
                                    src={reel?.postSource}
                                    className='rounded-md
                                    '
                                    controls
                                />
                            </div>
                        ))
                    }


                </div>



            </div>




        </div>
    )
}

export default Reels