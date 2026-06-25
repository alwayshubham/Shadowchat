const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const User = require('./models/User');
const setupSocket = require('./socket/socketHandler');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: process.env.CLIENT_URL || "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});

app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
    .then(async () => {
        console.log('Connected to MongoDB');
        // Ensure AI bot user exists
        const aiBotEmail = 'ai-bot@shadowchat.local';
        const aiBotName = 'CrazyBot';
        const aiBotAvatar = 'https://api.dicebear.com/7.x/bottts/svg?seed=CrazyBot';
        const existingBot = await User.findOne({ email: aiBotEmail });
        if (!existingBot) {
            await User.create({
                email: aiBotEmail,
                anonymousName: aiBotName,
                avatar: aiBotAvatar,
                isOnline: true
            });
            console.log('AI bot user created.');
        } else {
            // Optionally, ensure bot is online
            if (!existingBot.isOnline) {
                existingBot.isOnline = true;
                await existingBot.save();
            }
        }
    })
    .catch(err => console.error('MongoDB connection error:', err));

// Basic route
app.get('/', (req, res) => {
    res.send('Chat Server is running');
});

// Setup Socket.IO
setupSocket(io);

// Routes
const userRoutes = require('./routes/userRoutes');
const chatRoutes = require('./routes/chatRoutes');

app.use('/api/users', userRoutes);
app.use('/api/chats', chatRoutes);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
