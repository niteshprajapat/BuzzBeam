import Post from "../models/post.model.js";
import User from '../models/user.model.js';
import Comment from "../models/comment.model.js";
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


// createPost
export const createPost = async (req, res) => {
    try {
        const { postCaption, postSource, postLocation } = req.body;
        const userId = req.user._id;

        if (!postSource) {
            return res.status(400).json({
                success: false,
                message: "Post is required",
            });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User Not Found!",
            });
        }

        const post = await Post.create({
            user: userId,
            postCaption,
            postSource,
            postLocation,
        });


        if (user) {
            user.posts.push(post?._id);
            await user.save();
        }


        await post.populate({
            path: "user",
            select: "-password"
        });


        return res.status(201).json({
            success: true,
            message: "Post Created Successfully!",
            post,
        })



    } catch (error) {
        console.log(error);
        return res.status(500).json({
            succes: false,
            message: "Something went wrong!",
        });
    }
}


// getAllPosts
export const getAllPosts = async (req, res) => {
    try {

        const posts = await Post.find({}).sort({ createdAt: -1 }).populate({
            path: "user",
            select: "-password"
        }).populate({
            path: "likes"
        }).populate({
            path: "comments"
            // select: ""
        });

        return res.status(200).json({
            success: true,
            message: "Fetched All Posts Successfully!",
            posts,
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            succes: false,
            message: "Something went wrong!",
        });
    }
}


// getPostById
export const getPostById = async (req, res) => {
    try {
        const postId = req.params.id;

        const post = await Post.findById(postId).populate({
            path: "user",
            select: "-password"
        });

        return res.status(200).json({
            success: true,
            message: "Fetched Post By Id Successfully!",
            post,
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            succes: false,
            message: "Something went wrong!",
        });
    }
}

// updatePostById
export const updatePostById = async (req, res) => {
    try {
        const postId = req.params.id;
        const { postCaption, postLocation } = req.body;



        const post = await Post.findByIdAndUpdate(
            postId,
            {
                $set: {
                    postCaption,
                    postLocation,
                }
            },
            { new: true },
        )

        await post.save();

        return res.status(200).json({
            success: true,
            message: "Post Updated Successfully!",
            post,
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            succes: false,
            message: "Something went wrong!",
        });
    }
}


// getLoggedInUserPost
export const getLoggedInUserPost = async (req, res) => {
    try {
        const userId = req.user._id;

        const posts = await Post.find({ user: userId });


        return res.status(200).json({
            success: true,
            message: "Fetched All LoggedIn User's Posts Successfully!",
            posts,
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            succes: false,
            message: "Something went wrong!",
        });
    }
}


// likeUnlikePost
export const likeUnlikePost = async (req, res) => {
    try {
        const postId = req.params.id;
        const userId = req.user._id;

        const post = await Post.findById(postId);

        if (post.likes.includes(userId)) {
            // unlike
            await Post.findByIdAndUpdate(postId, { $pull: { likes: userId } });
            await User.findByIdAndUpdate(userId, { $pull: { postLiked: postId } });

            return res.status(200).json({
                success: true,
                message: "Post Unliked Successfully!",
            });

        } else {
            // like

            await Post.findByIdAndUpdate(postId, { $push: { likes: userId } });
            await User.findByIdAndUpdate(userId, { $push: { postLiked: postId } });

            return res.status(200).json({
                success: true,
                message: "Post Liked Successfully!",
            });
        }


    } catch (error) {
        console.log(error);
        return res.status(500).json({
            succes: false,
            message: "Something went wrong!",
        });
    }
}

// deletePost
export const deletePost = async (req, res) => {
    try {

        const postId = req.params.id;
        const userId = req.user._id;


        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({
                succes: false,
                message: "Post Not Found!",
            })
        }

        // check only owner of post can delete that post
        if (userId.toString() !== post?.user.toString()) {
            return res.status(400).json({
                succes: false,
                message: "You can't delete this Post! You can delete your own posts!",
            });
        }

        await Post.findByIdAndDelete(postId);

        // remove post from user
        let user = await User.findById(userId);
        user.posts = user.posts.filter((post) => post?._id.toString() !== postId.toString());

        await user.save();

        // Delete Associated Comment on Post
        await Comment.deleteMany({ post: postId });


        return res.status(200).json({
            succes: false,
            message: "Post Deleted Successfully!",
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            succes: false,
            message: "Something went wrong!",
        });
    }
}


// savePost
export const savePost = async (req, res) => {
    try {

        const postId = req.params.id;
        const userId = req.user._id;

        const post = await Post.findById(postId);
        const user = await User.findById(userId);


        // Inside post, postSavedBy includes userId or not? || In user, savedPosts includes postId or not


        if (post.postSavedBy.includes(userId)) {
            // Unsave Post - Remove post from Saved array, and userId  too

            await Post.findByIdAndUpdate(postId, { $pull: { postSavedBy: userId } });
            await User.findByIdAndUpdate(userId, { $pull: { savedPosts: postId } });

            return res.status(200).json({
                succes: true,
                message: "Post Unsaved Successfully!"
            });


        } else {
            // Save Post - Add post to Saved array, and userId  too

            await Post.findByIdAndUpdate(postId, { $push: { postSavedBy: userId } });
            await User.findByIdAndUpdate(userId, { $push: { savedPosts: postId } });

            return res.status(200).json({
                succes: true,
                message: "Post Saved Successfully!"
            });
        }



    } catch (error) {
        console.log(error);
        return res.status(500).json({
            succes: false,
            message: "Something went wrong!",
        });
    }
}

