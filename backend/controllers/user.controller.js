import User from '../models/user.model.js';
import bcrypt from 'bcrypt'
import multer from 'multer'
import jwt from 'jsonwebtoken'
import fs from 'fs'
import { v2 as cloudinary } from 'cloudinary'
import { getDataUri } from '../utils/getDataUri.js';
import { storage } from '../middlewares/multer.js'

// const upload = multer({ dest: 'uploads/' });
const upload = multer({ storage });


// register
export const register = async (req, res) => {
    try {
        const { name, userName, email, password, bio, gender, isPrivate, socialLinks, avatar } = req.body;


        // avatar
        // const file = req.file;
        // const fileUrl = getDataUri(file);
        // console.log("fileUrl", fileUrl);



        if (!name || !userName || !email || !password || !gender || !isPrivate) {
            return res.status(404).json({
                success: false,
                message: "All fields are Required!",
            });
        }


        // Check if password is provided
        if (typeof password !== 'string' || password.trim() === '') {
            return res.status(400).json({
                success: false,
                message: "Password is required and must be a valid string!",
            });
        }


        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User already Exists!",
            });
        }


        // const cloudinaryResponse = await cloudinary.uploader.upload(fileUrl.content);
        // const cloudinaryResponse = await cloudinary.uploader.upload(fileUrl);

        const hashedPassword = await bcrypt.hash(password, 10);


        const user = await User.create({
            name,
            userName,
            email,
            password: hashedPassword,
            gender,
            bio,
            isPrivate,
            socialLinks,
            avatar,
        })

        return res.status(201).json({
            success: true,
            message: "User Registered Successfully!",
            user,
        });


    } catch (error) {
        console.log(error);

        return res.status(500).json({
            success: false,
            message: "Something went wrong!",
        });
    }
}

// login
export const login = async (req, res) => {
    try {
        const { userName, email, password } = req.body;

        if (!(userName || email) || !password) {
            return res.status(404).json({
                success: false,
                message: "All fields are Required!",
            });
        }

        const user = await User.findOne({
            $or: [{ userName }, { email }],
        });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User Not Found!",
            });
        }


        const comparePassword = await bcrypt.compare(password, user.password);
        if (!comparePassword) {
            return res.status(400).json({
                success: false,
                message: "Invalid Credentials",
            });
        }


        // token
        const token = jwt.sign({ _id: user?._id }, process.env.JWT_SECRET);


        user.password = null;

        return res.status(200).cookie("jwt", token, {
            httpOnly: false,
            maxAge: 1 * 24 * 60 * 60 * 1000,
        }).json({
            success: true,
            message: "User LoggedIn Successfully!",
            user,
        });

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            success: false,
            message: "Something went wrong!",
        });
    }
}


// logout
export const logout = async (req, res) => {
    try {


        return res.status(200).cookie("jwt", "", {
            httpOnly: true,
            maxAge: 0,
        }).json({
            success: true,
            message: "User LoggedOut Successfully!",
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong!",
        });
    }
}


// getProfileById
export const getProfileById = async (req, res) => {
    try {
        const userId = req.params.id;
        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "Please provide userId",
            });
        }


        const user = await User.findById(userId).select("-password");

        return res.status(200).json({
            success: true,
            message: "Fetched User Profile",
            user,
        })


    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong!",
        });
    }
}


// updateProfileById
export const updateProfile = async (req, res) => {
    try {
        const { name, userName, bio, gender, socialLinks, isPrivate, avatar } = req.body;

        const userId = req.user._id;

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "User Not Found!",
            });
        }


        const user = await User.findByIdAndUpdate(
            userId,
            {
                $set: {
                    name,
                    userName,
                    bio,
                    gender,
                    socialLinks,
                    isPrivate,
                    avatar,
                },
            },
            { new: true },
        );


        await user.save();


        return res.status(200).json({
            success: true,
            message: "Account Details Updated Successfully!",
            user,
        })




    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong!",
        });
    }
}

// deleteAccount
export const deleteAccount = async (req, res) => {
    try {
        const userId = req.user._id;

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "User Not Found!",
            });
        }


        const user = await User.findByIdAndDelete(userId);
        await user.save();

        return res.status(200).json({
            success: true,
            message: "Account Deleted Successfully!",
            user,
        })


    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong!",
        });
    }
}




// Upload Media Function
export const uploadMedia = async (req, res) => {
    try {
        // Handle file upload with Multer
        upload.single('media')(req, res, async (err) => {
            if (err) {
                if (err instanceof multer.MulterError) {
                    if (err.code === 'LIMIT_FILE_SIZE') {
                        return res.status(400).json({ message: 'File size exceeds the limit' });
                    }
                    return res.status(500).json({ message: 'Multer error: ' + err.message });
                } else {
                    return res.status(500).json({ message: 'Internal server error: ' + err.message });
                }
            }

            // If file is not uploaded, return error
            if (!req.file) {
                return res.status(400).json({ message: 'No file uploaded' });
            }

            const inputPath = req.file.path;
            const fileType = req.file.mimetype.split('/')[0]; // Extract the type (image or video)
            console.log("File saved to:", inputPath);

            // Determine resource type for Cloudinary
            const resourceType = fileType === 'image' ? 'image' : 'video';

            // Upload the file to Cloudinary
            try {
                const result = await cloudinary.uploader.upload(inputPath, { resource_type: resourceType });
                console.log('Upload to Cloudinary successful:', result);

                // Delete the file from the local 'uploads' directory after uploading to Cloudinary
                fs.unlink(inputPath, (unlinkError) => {
                    if (unlinkError) {
                        console.error('Error deleting local file:', unlinkError);
                    } else {
                        console.log('Local file deleted successfully');
                    }
                });

                return res.status(200).json({
                    success: true,
                    message: `${resourceType.charAt(0).toUpperCase() + resourceType.slice(1)} uploaded successfully`,
                    url: result.secure_url, // Cloudinary URL
                });

            } catch (uploadError) {
                console.error('Error uploading to Cloudinary:', uploadError);
                return res.status(500).json({ message: 'Error uploading to Cloudinary' });
            }
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Error handling media upload' });
    }
};


// Search insta account by username, email, or name
export const searchAccount = async (req, res) => {
    try {
        const { query } = req.query;

        if (!query) {
            return res.status(404).json({
                success: false,
                message: "Please provide query to search!",
            });
        }

        const users = await User.find({
            $or: [
                { userName: { $regex: query, $options: 'i' } },
                { email: { $regex: query, $options: 'i' } },
                { name: { $regex: query, $options: 'i' } },
            ]
        }).select("-password");


        if (!users.length) {
            return res.status(404).json({
                success: false,
                message: "Account Not Found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Fetched Accounts",
            users,
        });


    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong!",
        });
    }

}


// Follow-Unfollow
// followUnfollow
export const followUnfollow = async (req, res) => {
    try {
        const loggedInUserId = req.user._id;
        const userId = req.params.id;

        if (userId === loggedInUserId) {
            return res.status(400).json({
                success: false,
                message: "You Can't follow yourself!",
            })
        }


        const loggedInUser = await User.findById(loggedInUserId);
        const user = await User.findById(userId);




        if (loggedInUser.following.includes(userId)) {
            // unfollow
            await User.findByIdAndUpdate(loggedInUserId, { $pull: { following: userId } });
            await User.findByIdAndUpdate(userId, { $pull: { followers: loggedInUserId } });

            await loggedInUser.save();
            await user.save();

            return res.status(200).json({
                success: true,
                message: `You unfollowed ${user?.name}`,
            })

        } else {
            // follow
            await User.findByIdAndUpdate(loggedInUserId, { $push: { following: userId } });
            await User.findByIdAndUpdate(userId, { $push: { followers: loggedInUserId } });

            await loggedInUser.save();
            await user.save();

            return res.status(200).json({
                success: true,
                message: `You followed ${user?.name}`,
            })
        }


    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong!",
        });
    }
}


// followingList
export const followingList = async (req, res) => {
    try {
        const userId = req.params.id;

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "Please provide User ID",
            });
        }


        const user = await User.findById(userId).populate({
            path: "following",
            select: "-password"
        });

        const followingList = user.following;
        console.log("followingList", followingList);


        await user.save();


        return res.status(200).json({
            success: true,
            message: "User Following List",
            followingList,
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong!",
        });
    }
}


// followersList
export const followersList = async (req, res) => {
    try {
        const userId = req.params.id;

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "Please provide User ID",
            });
        }


        const user = await User.findById(userId).populate({
            path: "followers",
            select: "-password"
        });

        const followersList = user.followers;


        await user.save();


        return res.status(200).json({
            success: true,
            message: "User followersList List",
            followersList,
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong!",
        });
    }
}


// suggestedUsers
export const suggestedUsers = async (req, res) => {
    try {
        const userId = req.user._id;

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "Please provide userId",
            });
        }

        const users = await User.find({ _id: { $ne: userId } }).select("-password");

        return res.status(200).json({
            success: true,
            message: "Suggested Users List",
            users,
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong!",
        });
    }
}