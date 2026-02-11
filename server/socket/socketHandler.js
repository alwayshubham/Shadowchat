const User = require('../models/User');
const Chat = require('../models/Chat');
const Message = require('../models/Message');

const setupSocket = (io) => {
    io.on('connection', (socket) => {
        console.log('A user connected:', socket.id);

        // User joins and goes online
        socket.on('join', async (userId) => {
            try {
                const user = await User.findByIdAndUpdate(userId, {
                    isOnline: true,
                    socketId: socket.id
                }, { new: true });

                if (user) {
                    socket.userId = userId;
                    console.log(`${user.anonymousName} is online`);

                    // Notify others that this user is online
                    io.emit('userStatus', { userId: user._id, isOnline: true });
                }
            } catch (err) {
                console.error('Error in join:', err);
            }
        });

        // Handle private message
        socket.on('privateMessage', async ({ recipientId, text }) => {
            try {
                const senderId = socket.userId;
                if (!senderId) return;

                // Check if both users are online (as per requirements)
                const recipient = await User.findById(recipientId);
                if (!recipient || !recipient.isOnline) {
                    socket.emit('error', { message: 'User is offline. You can only chat when both are online.' });
                    return;
                }

                // Find or create chat
                let chat = await Chat.findOne({
                    participants: { $all: [senderId, recipientId] }
                });

                if (!chat) {
                    chat = await Chat.create({ participants: [senderId, recipientId] });
                }

                // Create message
                const message = await Message.create({
                    chatId: chat._id,
                    senderId,
                    text
                });

                // Update last message in chat
                chat.lastMessage = message._id;
                await chat.save();

                // Emit to both if recipient is online
                const messageData = {
                    _id: message._id,
                    chatId: chat._id,
                    senderId,
                    text,
                    createdAt: message.createdAt
                };

                socket.emit('message', messageData);
                if (recipient.socketId) {
                    io.to(recipient.socketId).emit('message', messageData);
                }
            } catch (err) {
                console.error('Error in privateMessage:', err);
            }
        });

        // Typing indicator
        socket.on('typing', ({ recipientId, isTyping }) => {
            User.findById(recipientId).then(recipient => {
                if (recipient && recipient.socketId) {
                    io.to(recipient.socketId).emit('displayTyping', { senderId: socket.userId, isTyping });
                }
            });
        });

        // Handle disconnection
        socket.on('disconnect', async () => {
            console.log('User disconnected:', socket.id);
            if (socket.userId) {
                try {
                    const user = await User.findByIdAndUpdate(socket.userId, {
                        isOnline: false,
                        socketId: null
                    });
                    if (user) {
                        io.emit('userStatus', { userId: user._id, isOnline: false });
                    }
                } catch (err) {
                    console.error('Error in disconnect:', err);
                }
            }
        });
    });
};

module.exports = setupSocket;
