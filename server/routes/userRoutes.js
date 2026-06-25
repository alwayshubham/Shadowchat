const express = require('express');
const router = express.Router();
const User = require('../models/User');


// Get all online users (except current user)
router.get('/', async (req, res) => {
    try {
        const { exclude, lat, lng, radius = 5 } = req.query;
        
        let query = { _id: { $ne: exclude }, isOnline: true };
        
        // If lat and lng are provided, use geospatial filter (radius in km)
        if (lat && lng) {
            query.$or = [
                {
                    location: {
                        $geoWithin: {
                            $centerSphere: [
                                [parseFloat(lng), parseFloat(lat)], 
                                parseFloat(radius) / 6378.1 // Earth radius in km
                            ]
                        }
                    }
                },
                // Allow chat bot to bypass location filter
                { email: { $regex: /bot/i } },
                { anonymousName: { $regex: /bot/i } }
            ];
        }
        
        // Only fetch users who are currently online and within radius
        const users = await User.find(query);
        const usersWithoutLocation = users.map(u => {
            const { location, ...rest } = u.toObject();
            return rest;
        });
        res.json(usersWithoutLocation);
    } catch (err) {
        console.error('User list error:', err);
        res.status(500).json({ error: err.message });
    }
});
// Update user status
router.post('/status', async (req, res) => {
    try {
        const { userId, isOnline } = req.body;
        const user = await User.findByIdAndUpdate(userId, { isOnline }, { new: true });
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update user location
router.post('/location', async (req, res) => {
    try {
        const { userId, lat, lng } = req.body;
        const user = await User.findByIdAndUpdate(
            userId,
            { 
                location: {
                    type: 'Point',
                    coordinates: [parseFloat(lng), parseFloat(lat)]
                } 
            },
            { new: true }
        );
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

const adjectives = ['Shadow', 'Fluffy', 'Swift', 'Silent', 'Golden', 'Mystic', 'Brave', 'Crimson', 'Azure', 'Emerald'];
const nouns = ['Fox', 'Panda', 'Eagle', 'Wolf', 'Lion', 'Owl', 'Tiger', 'Falcon', 'Lynx', 'Raven'];

function generateAnonymousName() {
    const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
    const noun = nouns[Math.floor(Math.random() * nouns.length)];
    const num = Math.floor(Math.random() * 100);
    return `${adj}${noun}_${num}`;
}

function generateAvatar(name) {
    return `https://api.dicebear.com/7.x/pixel-art/svg?seed=${name}`;
}

// Register a new user  
router.post('/register', async (req, res) => {
    try {
        const { email } = req.body;
        let user = await User.findOne({ email });

        if (user) {
            return res.status(400).json({ error: 'User already exists' });
        }

        const anonymousName = generateAnonymousName();
        const avatar = generateAvatar(anonymousName);
        user = await User.create({
            email,
            anonymousName,
            avatar,
            isOnline: false
        });

        res.status(201).json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Login check (only allow existing users)
router.post('/login', async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ error: 'User not found. Please sign up first.' });
        }

        res.json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
