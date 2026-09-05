import Message from "../models/Message.js";
import User from "../models/User.js";

export const getAllContacts = async (req, res) => {
    try {
        const loggedInUserId = req.user._id;
        const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password");

        res.status(200).json(filteredUsers);
    } catch (error) {
        console.error("Error in getAllContacts:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const getMessageById = async (req, res) => {
    try {
        const myId = req.user._id;
        const { id } = req.params;
        const message = await Message.find({
            $or: [
                { sender: myId, receiver: id },
                { sender: id, receiver: myId }
            ]
        });

        if (!message) {
            return res.status(404).json({ message: "Message not found" });
        }

        res.status(200).json(message);

    } catch (error) {
        console.error("Error in getMessageById:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const sendMessage = async (req, res) => {
    try {
        const { text, image } = req.body;
        const { id: receiverId } = req.params;
        const senderId = req.user._id;

        let imageUrl;
        if (image) {
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url;
        }

        const newMessage = new Message({
            sender: senderId,
            receiver: receiverId,
            text,
            image: imageUrl
        });

        await newMessage.save();

        //todo:send message in real time using socket.io

        res.status(201).json(newMessage);
    } catch (error) {
        console.error("Error in sendMessage:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const getChatPartners = async (req, res) => {
    try {
        const loggedInUserId = req.user._id;

        // Find distinct user IDs that the logged-in user has chatted with
        const messages = await Message.find({
            $or: [
                { sender: loggedInUserId },
                { receiver: loggedInUserId }
            ]
        });
        const chatPartnerIds = [
            ...new Set(
                messages.map(msg =>
                    msg.sender.toString() === loggedInUserId.toString() ? msg.receiver.toString() : msg.sender.toString()
                )
            ),
        ];

        const chatPartners = await User.find({ _id: { $in: chatPartnerIds } }).select("-password");
        res.status(200).json(chatPartners);
    } catch (error) {
        console.error("Error in getChatPartners:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};