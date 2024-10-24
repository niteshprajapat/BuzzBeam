import Story from "../models/story.model.js";
import User from "../models/user.model.js";

import multer from 'multer'
import fs from 'fs'
import { v2 as cloudinary } from 'cloudinary'
import { storage } from '../middlewares/multer.js'

// const upload = multer({ dest: 'uploads/' });
const upload = multer({ storage });


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


// uploadStory
export const uploadStory = async (req, res) => {
    try {
        const { storySource, storyType } = req.body;
        const userId = req.user._id;

        if (!storySource || !storyType) {
            return res.status(404).json({
                success: false,
                message: "All fields are Required!",
            });
        }

        if (!['image', 'video']?.includes(storyType)) {
            return res.status(400).json({
                success: false,
                message: "Invalid Storytype, Must be 'image' or 'video'. ",
            })
        }

        const story = await Story.create({
            user: userId,
            storySource,
            storyType,
            expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
        });

        return res.status(201).json({
            success: true,
            message: "Story Uploaded Successfully!",
            story,
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error!",
        });
    }
}

// getAllFollowingsStory
export const getAllFollowingsStory = async (req, res) => {
    try {
        const userId = req.user._id;

        const user = await User.findById(userId).populate({
            path: "following",
            select: "-password",
        });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User Not Found!",
            });
        }

        const followedUserIds = user?.following?.map((followingUser) => followingUser?._id)


        const stories = await Story.find({
            user: { $in: followedUserIds },
            isActive: true,
            expiresAt: { $gt: new Date() }
        }).populate({
            path: "user",
            select: "-password"
        });


        return res.status(200).json({
            success: true,
            message: "Fetched All following user's Stories!",
            stories,
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error!",
        });
    }
}

// deleteStoryById
export const deleteStoryById = async (req, res) => {
    try {
        const userId = req.user._id;
        const storyId = req.params.id;


        const story = await Story.findById(storyId).populate({
            path: "user",
            select: "-password"
        });

        if (userId?.toString() !== story?.user?._id?.toString()) {
            return res.status(400).json({
                success: false,
                message: "You are not authorized to delete this story. You can only delete your own Story!",
            });
        }


        await Story.findByIdAndDelete(storyId);

        return res.status(200).json({
            success: true,
            message: "Story Deleted Successfully!",
        });



    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error!",
        });
    }
}

// viewStory
export const viewStory = async (req, res) => {
    try {
        const userId = req.user._id;
        const storyId = req.params.id;


        const story = await Story.findById(storyId).populate({
            path: "user",
            select: "-password"
        });


        if (!story) {
            return res.status(404).json({
                success: false,
                message: "Story not found",
            });
        }


        if (!story?.viewers?.includes(userId)) {
            // view story

            await Story.findByIdAndUpdate(
                storyId,
                {
                    $push: { viewers: userId },
                },
                { new: true },
            );

            return res.status(200).json({
                success: true,
                message: "Story Viewed by LoggedIn User!",
            });
        }


        return res.status(200).json({
            success: true,
            message: "Story Already Viewed by LoggedIn User!",
        });


    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error!",
        });
    }
}

// storyViewedBy
export const storyViewedBy = async (req, res) => {
    try {
        const userId = req.user._id;
        const storyId = req.params.id;

        if (!storyId) {
            return res.status(404).json({
                success: false,
                message: "Story not found",
            });
        }

        const storyViewedBy = await Story.findById(storyId).populate({
            path: "viewers",
            select: "-password",
        });




        if (storyViewedBy?.viewers?.length) {
            return res.status(200).json({
                success: true,
                message: "No views",
                storyViewedBy: storyViewedBy.viewers,
            });
        }

        return res.status(200).json({
            success: true,
            message: "No views",
            storyViewedBy: storyViewedBy.viewers,
        });


    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error!",
        });
    }
}
