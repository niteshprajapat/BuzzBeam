
import React from 'react'
import Sidebar from '@/components/ui/Sidebar/Sidebar'
import AllPosts from '@/components/Feed/AllPosts'
import SuggestedUsers from '@/components/Feed/SuggestedUsers'
import Story from '@/components/Story/Story'


const Feed = () => {
    return (
        <div className='flex h-screen '>
            <Sidebar />





            <div className='flex justify-between items-center w-full py-10 '>

                <Story />

                <div className='h-full overflow-y-auto max-w-4xl mx-auto pt-10 '>


                    <AllPosts />
                </div>

                <div className='h-full'>
                    <SuggestedUsers />
                </div>
            </div>

        </div>
    )
}

export default Feed