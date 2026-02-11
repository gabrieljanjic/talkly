# 💬 Real-Time Chat Application

A modern, real-time chat application built with React, Node.js, and Socket.IO, featuring secure authentication, live messaging, and online presence tracking.

---

## Live Demo

🔗 [Talkly Live](https://talkly-bay.vercel.app/)

> ⚠️**Note:** Backend may take 30–50 seconds to wake up on the first request (free Render tier limitation).

> **Quick Test Account:** If you don’t want to create your own account, you can log in directly using:
>
> - **Username:** `nikola.demo`
> - **Password:** `Nikolademo1-`

> - **Username:** `filip.demo`
> - **Password:** `Filipdemo1-`

### 🔐 Authentication & Security

- **User Registration** with encrypted password storage using bcrypt
- **JWT-based Authentication** with secure HTTP-only cookies
- **Protected Routes** - middleware prevents unauthorized access to private chats
- **Session Management** - automatic token verification and user state persistence

### 💬 Real-Time Messaging

- **Instant Message Delivery** powered by Socket.IO
- **Live Typing Indicators** (optional feature)
- **Message History** - persistent chat storage in MongoDB
- **Emoji Support** - rich emoji picker using `emoji-picker-react`

### 👥 User Features

- **User Search** - find and connect with other users
- **Online/Offline Status** - real-time presence tracking
- **Last Seen** - displays when users were last active
- **Private 1-on-1 Chats** - secure direct messaging

### 🎨 UI/UX

- **Responsive Design** - built with TailwindCSS
- **Clean Interface** - modern and intuitive user experience
- **Real-time Updates** - live status changes without refresh

---

## 🛠️ Tech Stack

### Frontend

- **React 18.x** - UI library
- **TypeScript** - type safety
- **TailwindCSS** - styling
- **Socket.IO Client** - real-time communication
- **Axios** - HTTP requests
- **React Router** - navigation
- **emoji-picker-react** - emoji selection

### Backend

- **Node.js** - runtime environment
- **Express.js** - web framework
- **Socket.IO** - WebSocket server
- **MongoDB** - database
- **Mongoose** - ODM for MongoDB
- **bcrypt** - password hashing
- **JWT (jsonwebtoken)** - authentication tokens
- **cookie-parser** - cookie handling

## Local Development

```bash
# Clone the repo
git clone https://github.com/gabrieljanjic/talkly.git

# Install dependencies
npm install

# Run development server
npm run dev
```

_For environment variables and local setup, feel free to reach out._

### Socket.IO Events

**Client → Server:**

- `join_room` - Join a chat room
- `leave_room` - Leave a chat room
- `send_message` - Send a message

**Server → Client:**

- `user_online` - User came online
- `user_offline` - User went offline
- `receive_message` - New message received

---

## 🔒 Security Features

### Password Security

- Passwords are hashed using **bcrypt** with salt rounds
- Plain text passwords are never stored in the database

### Authentication

- **JWT tokens** stored in HTTP-only cookies
- Token expiration: 24 hours (configurable)
- Automatic token verification on protected routes

### Authorization Middleware

- Validates JWT tokens before accessing protected routes
- Prevents users from accessing other users' private chats
- Room access control based on user membership

### Backend Socket.IO Logic

**Connection Handling:**

- Authenticates users via JWT from cookies
- Tracks online users in a `Set`
- Broadcasts `user_online` / `user_offline` events

**Message Handling:**

- Joins users to private rooms
- Emits messages only to room participants
- Stores messages in MongoDB

---

## 🎯 How It Works

### User Registration Flow

1. User submits registration form
2. Backend hashes password with bcrypt
3. User document created in MongoDB
4. JWT token generated and sent as HTTP-only cookie
5. User automatically logged in

### Real-Time Messaging Flow

1. User A connects → Socket.IO authenticates via JWT
2. Backend adds User A to `onlineUsers` Set
3. Backend broadcasts `user_online` event to all clients
4. User B sees User A as "Online"
5. User B sends message → Server emits to User A's room
6. User A receives message instantly
7. Message saved to MongoDB

### Online Status Tracking

- **Login:** User added to `onlineUsers`, `user_online` event broadcast
- **Logout:** User removed from `onlineUsers`, `user_offline` event broadcast
- **Refresh:** User disconnects briefly, then reconnects (fetches current online users via HTTP)

**Happy Chatting! 💬**
