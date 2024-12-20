import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";




// sendMessage
export const sendMessage = async (req, res) => {
    try {
        const { message } = req.body;
        const receiverId = req.params.id;
        const senderId = req.user._id;

        if (!message) {
            return res.status(400).json({
                success: false,
                message: "All fields are Required!",
            })
        }

        if (!receiverId) {
            return res.status(400).json({
                success: false,
                message: "Please provide receiverId!",
            });
        }


        // Create Conversation if not create, else use that conversatiop array
        let conversation = await Conversation.findOne({
            participants: { $all: [senderId, receiverId] },
        });

        if (!conversation) {
            conversation = await Conversation.create({
                participants: [senderId, receiverId],
            });
        }


        const newMessage = await Message.create({
            message,
            sender: senderId,
            receiver: receiverId,
        });

        if (newMessage) {
            conversation.messages.push(newMessage);
        }

        await conversation.save();
        await newMessage.save();

        // Socket Implementation


        return res.status(201).json({
            success: true,
            message: "Message Sent Successfully!",
            newMessage,
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong!",
        });
    }
}


// getMessages
export const getMessages = async (req, res) => {
    try {
        const receiverId = req.params.id;
        const senderId = req.user._id;

        if (!receiverId) {
            return res.status(400).json({
                success: false,
                message: "Please provide receiverId!",
            });
        }


        // Find the conversation
        const conversation = await Conversation.findOne({
            participants: { $all: [senderId, receiverId] },
        }).populate({
            path: "messages",
        });


        if (!conversation) {
            return res.status(200).json({
                success: true,
                message: "No Conversation!",
                messages: [],
            });
        }

        return res.status(200).json({
            success: true,
            message: "Messages Fetched Successfully",
            messages: conversation
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong!",
        });
    }
}