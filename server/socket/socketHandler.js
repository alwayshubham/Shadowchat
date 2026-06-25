const User = require('../models/User');
const Chat = require('../models/Chat');
const Message = require('../models/Message');

const setupSocket = (io) => {
    io.on('connection', (socket) => {
        console.log('A user connected:', socket.id);

        // User joins and goes online
        // User joins and goes online
        socket.on('join', async (userId, lat, lng) => {
            try {
                // Location logic commented out; allow join without location
                // // Validate lat/lng
                // if (
                //     typeof lat !== 'number' ||
                //     typeof lng !== 'number' ||
                //     isNaN(lat) ||
                //     isNaN(lng) ||
                //     lat < -90 || lat > 90 ||
                //     lng < -180 || lng > 180
                // ) {
                //     console.error(`Invalid coordinates for user ${userId}:`, lat, lng);
                //     socket.emit('error', {
                //         message: 'Invalid location data.'
                //     });
                //     return;
                // }

                // // Update user with valid location
                // const user = await User.findByIdAndUpdate(
                //     userId,
                //     {
                //         isOnline: true,
                //         socketId: socket.id,
                //         location: {
                //             type: 'Point',
                //             coordinates: [Number(lng), Number(lat)]
                //         }
                //     },
                //     { new: true }
                // );

                // Update user as online and set socketId (no location)
                const user = await User.findByIdAndUpdate(
                    userId,
                    {
                        isOnline: true,
                        socketId: socket.id
                    },
                    { new: true }
                );

                if (!user) {
                    console.error(`User not found: ${userId}`);
                    return;
                }

                socket.userId = userId;

                console.log(
                    `${user.anonymousName} is online.`
                );

                // Notify others that this user is online
                io.emit('userStatus', {
                    userId: user._id,
                    isOnline: true
                });

            } catch (err) {
                console.error('Join event error:', err);
                socket.emit('error', {
                    message: 'Server error on join.'
                });
            }
        });

        // Handle private message
        socket.on('privateMessage', async ({ recipientId, text }) => {
            try {
                const senderId = socket.userId;
                if (!senderId) return;

                const recipient = await User.findById(recipientId);

                // Find or create chat
                let chat = await Chat.findOne({
                    participants: { $all: [senderId, recipientId] }
                });
                if (!chat) {
                    chat = await Chat.create({ participants: [senderId, recipientId] });
                }

                // Create sender's message
                const message = await Message.create({
                    chatId: chat._id,
                    senderId,
                    text
                });
                chat.lastMessage = message._id;
                await chat.save();

                const messageData = {
                    _id: message._id,
                    chatId: chat._id,
                    senderId,
                    text,
                    createdAt: message.createdAt
                };

                socket.emit('message', messageData);
                if (recipient && recipient.isOnline && recipient.socketId) {
                    io.to(recipient.socketId).emit('message', messageData);
                }

                // Only trigger AI bot reply if recipient is the AI bot
                if (recipient && recipient.email === 'ai-bot@shadowchat.local') {
                    setTimeout(async () => {
                        // Find AI bot user (should always exist)
                        let aiBot = recipient;
                        // Generate a crazy reply
                        const crazyReplies = [
                            "Banana phone! 🥳 What's up?",
                            "Did you know cats invented the internet? 😹",
                            "I'm a potato. Beep boop! 🥔",
                            "If you type backwards, I reply upside down! 🙃",
                            "Rainbows taste like chicken! 🌈🍗",
                            "I just danced with a unicorn! 🦄💃",
                            "42 is the answer to everything!",
                            "I speak fluent emoji! 😜🤖",
                            "Why did the chicken join the chat? To get to the other side! 🐔",
                            "Beep beep! I'm a crazy bot car! 🚗"
                        ];
                        const aiText = crazyReplies[Math.floor(Math.random() * crazyReplies.length)];
                        const aiMessage = await Message.create({
                            chatId: chat._id,
                            senderId: aiBot._id,
                            text: aiText
                        });
                        chat.lastMessage = aiMessage._id;
                        await chat.save();
                        const aiMessageData = {
                            _id: aiMessage._id,
                            chatId: chat._id,
                            senderId: aiBot._id,
                            text: aiText,
                            createdAt: aiMessage.createdAt
                        };
                        socket.emit('message', aiMessageData);
                    }, 1200); // 1.2s delay for realism
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
