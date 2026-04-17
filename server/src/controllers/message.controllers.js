import Message from "../models/message.model.js";
import User from "../models/user.model.js";

export const getMessages = async (req, res) => {
    try {
        const { friendId } = req.params;
        const myId = req.user._id;

        const messages = await Message.find({
            $or: [
                { sender: myId, receiver: friendId },
                { sender: friendId, receiver: myId },
            ]
        }).sort({ createdAt: 1 });

        return res.status(200).json({ success: true, messages });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

export const sendMessage = async (req, res) => {
    try {
        const { friendId } = req.params;
        const { content } = req.body;
        const myId = req.user._id;

        const message = await Message.create({
            sender: myId,
            receiver: friendId,
            receiverModel: "User",
            content,
        });
        console.log('Message created');
        const pushToRecentChats = async (userId, otherId, msgId) => {
            const user = await User.findById(userId);
            const chat = user.recentChats.find(c => c.reciever.toString() === otherId.toString());
            if (chat) {
                chat.messages.push(msgId);
            } else {
                user.recentChats.push({ reciever: otherId, receiverModel: "User", messages: [msgId] });
            }
            await user.save();
        };
        
        
        await pushToRecentChats(myId, friendId, message._id);
        await pushToRecentChats(friendId, myId, message._id);
        console.log('Message pushed to both the users recent chats array');

        return res.status(201).json({ success: true, message });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};