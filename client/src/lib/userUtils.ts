import axios from 'axios';

const adjectives = ['Shadow', 'Fluffy', 'Swift', 'Silent', 'Golden', 'Mystic', 'Brave', 'Crimson', 'Azure', 'Emerald'];
const nouns = ['Fox', 'Panda', 'Eagle', 'Wolf', 'Lion', 'Owl', 'Tiger', 'Falcon', 'Lynx', 'Raven'];

export function generateAnonymousName(): string {
    const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
    const noun = nouns[Math.floor(Math.random() * nouns.length)];
    const num = Math.floor(Math.random() * 100);
    return `${adj}${noun}_${num}`;
}

export function generateAvatar(name: string): string {
    return `https://api.dicebear.com/7.x/pixel-art/svg?seed=${name}`;
}

export async function syncUserWithBackend(email: string, name: string, image: string) {
    try {
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';
        // We'll send a request to the backend to create/update the user
        // Since we don't have a specific "sync" route, we can add one or use an existing one
        // For simplicity, let's assume the backend has a /api/users/sync route
        const response = await axios.post(`${backendUrl}/api/users/sync`, {
            email,
            name,
            image
        });
        return response.data;
    } catch (err) {
        console.error('Error syncing user:', err);
        return null;
    }
}
