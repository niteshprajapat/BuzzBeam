import Comment from "../models/comment.model.js";
import Notification from "../models/notification.model.js";
import Post from "../models/post.model.js";



// createComment
export const createComment = async (req, res) => {
    try {
        const postId = req.params.id;
        const userId = req.user._id;
        const { commentText } = req.body;

        if (!commentText) {
            return res.status(400).json({
                success: false,
                message: "Please provide Comment Content!",
            });
        }


        const comment = await Comment.create({
            commentText,
            post: postId,
            user: userId,
        });


        const post = await Post.findById(postId).populate({
            path: "user",
            select: "-password",
        });


        if (post) {
            post.comments.push(comment._id);
            await post.save();
        }



        const notification = new Notification({
            from: userId,
            to: post?.user?._id,
            type: "comment",
        });

        await notification.save();

        return res.status(201).json({
            success: true,
            message: "Comment Added Successfully",
            comment,
        })


    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong",
        })
    }
}


// updateComment
export const updateComment = async (req, res) => {
    try {
        const commentId = req.params.id;
        const userId = req.user._id;
        const { commentText } = req.body;


        const comment = await Comment.findByIdAndUpdate(
            commentId,
            {
                $set: {
                    commentText
                },
            },
            { new: true },
        );

        return res.status(200).json({
            success: true,
            message: "Comment Updated Successfully",
            comment,
        })


    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong",
        })
    }
}


// deleteComment
export const deleteComment = async (req, res) => {
    try {
        const commentId = req.params.id;
        const userId = req.user._id;

        const comment = await Comment.findById(commentId).populate({
            path: "post"
        });

        console.log("comment", comment);

        if (comment.user.toString() !== userId.toString()) {
            return res.status(400).json({
                success: false,
                message: "You can't delete this comment! You can only delete your own comments.",
            });
        }


        await Comment.findByIdAndDelete(commentId);


        return res.status(200).json({
            success: true,
            message: "Comment Deleted Successfully",
        })


    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong",
        })
    }
}

// getAllCommentByPostId
export const getAllCommentByPostId = async (req, res) => {
    try {
        const postId = req.params.id;

        const comments = await Comment.find({ post: postId }).populate({
            path: "user",
            select: "-password"
        });


        if (!comments) {
            return res.status(400).json({
                success: false,
                message: "No Comment Found!",
            })

        }


        return res.status(200).json({
            success: true,
            message: "Fetched All Comments of particualr Post By Id",
            comments,
        })



    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong",
        })
    }
}


// likeUnlikeComment
export const likeUnlikeComment = async (req, res) => {
    try {

        const commentId = req.params.id;
        const userId = req.user._id;

        if (!commentId) {
            return res.status(400).json({
                success: false,
                message: "Please provide commentId",
            });
        }

        const comment = await Comment.findById(commentId);
        if (!comment) {
            return res.status(400).json({
                success: false,
                message: "Comment Not Found!",
            });
        }


        if (comment.commentLikedBy.includes(userId)) {
            // unlike

            await Comment.findByIdAndUpdate(commentId, { $pull: { commentLikedBy: userId } });

            return res.status(200).json({
                success: true,
                message: "Comment Unliked Successfully!",
            });

        } else {
            // like

            await Comment.findByIdAndUpdate(commentId, { $push: { commentLikedBy: userId } });
            return res.status(200).json({
                success: true,
                message: "Comment Liked Successfully!",
            });
        }



    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong",
        })
    }
}