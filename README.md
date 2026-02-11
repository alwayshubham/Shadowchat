# ShadowChat - Real-time Anonymous Chat Application

A complete full-stack real-time chat application where users can talk anonymously using Google OAuth.

## Features
- **Google Login**: Secure authentication with Gmail.
- **Anonymous Profiles**: Automatic generation of fun names (e.g., ShadowFox_92) and avatars.
- **Real-time Presence**: See who's online/offline instantly.
- **1v1 Chat**: Private messaging powered by Socket.IO.
- **Restriction**: Users can only chat if both are online.
- **Typing Indicators**: Real-time feedback when the other person is typing.
- **Timestamps**: Every message shows when it was sent.

## Tech Stack
- **Frontend**: Next.js, Tailwind CSS, NextAuth.js, Socket.IO Client.
- **Backend**: Node.js, Express, Socket.IO Server, Mongoose.
- **Database**: MongoDB.

## Getting Started

### Prerequisites
- Node.js installed.
- MongoDB instance (Local or Atlas).
- Google OAuth Credentials (Client ID and Secret).

### Installation

1. **Clone the project**
   ```bash
   git clone <repository-url>
   cd promptchat
   ```

2. **Setup Backend**
   ```bash
   cd server
   npm install
   ```
   Create a `.env` file in the `server` directory:
   ```env
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   CLIENT_URL=http://localhost:3000
   ```
   Run the backend:
   ```bash
   npm run dev
   ```

3. **Setup Frontend**
   ```bash
   cd ../client
   npm install
   ```
   Create a `.env.local` file in the `client` directory:
   ```env
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=any_random_string
   NEXT_PUBLIC_BACKEND_URL=http://localhost:5000
   ```
   Run the frontend:
   ```bash
   npm run dev
   ```

4. **Access the App**
   Open [http://localhost:3000](http://localhost:3000) in your browser.

## Logic Overview
- **Anonymous Profiles**: During Google sign-in, the backend generates a random adjective-noun combination and a DiceBear avatar. The real name and email are stored but never shown.
- **Real-time Status**: When a user connects to the socket, they are marked as online in MongoDB. On disconnect, they are marked offline.
- **Messaging Restriction**: The `socketHandler.js` checks the `isOnline` status of the recipient before allowing a message to be saved or emitted.
