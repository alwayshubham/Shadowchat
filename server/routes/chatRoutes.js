const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const Chat = require('../models/Chat');

// Get messages for a chat
router.get('/:chatId/messages', async (req, res) => {
    try {
        const messages = await Message.find({ chatId: req.params.chatId }).sort({ createdAt: 1 });
        res.json(messages);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get or create chat between two users
router.get('/between/:user1/:user2', async (req, res) => {
    try {
        const { user1, user2 } = req.params;
        let chat = await Chat.findOne({
            participants: { $all: [user1, user2] }
        });

        if (!chat) {
            chat = await Chat.create({ participants: [user1, user2] });
        }
        res.json(chat);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
