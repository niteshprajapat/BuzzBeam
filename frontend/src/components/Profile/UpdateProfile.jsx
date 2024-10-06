import React from 'react';

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from '../ui/input';

const UpdateProfile = ({ open, setOpen }) => {
    const { user, token } = useSelector((store) => store.auth);



    return (
        <Dialog open={open} onOpenChange={() => setOpen(false)}>
            <DialogContent>
                <DialogHeader>Update Profile</DialogHeader>

                <div>
                    <Input

                    />
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default UpdateProfile