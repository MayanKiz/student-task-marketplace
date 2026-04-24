# 🏗️ Student Task Marketplace - System Architecture

## Complete System Design & Flow

### Database Schema (MongoDB Collections)

#### 1. **Users Collection**
```javascript
{
  _id: ObjectId,
  username: String,
  email: String,              // @college.edu only
  profileImage: String,       // Cloudinary URL
  emailVerified: Boolean,
  role: String,               // 'buyer', 'seller', 'both'
  branch: String,             // 'CSE', 'ECE', 'ME', etc.
  semester: Number,
  bio: String,
  ratings: {
    average: Number,
    count: Number
  },
  wallet: {
    balance: Number,
    totalEarnings: Number,
    totalSpent: Number
  },
  otp: String,
  otpExpiry: Date,
  createdAt: Date,
  updatedAt: Date,
  lastLogin: Date
}
```

#### 2. **Tasks Collection**
```javascript
{
  _id: ObjectId,
  title: String,
  description: String,
  category: String,           // 'assignment', 'notes', 'project', 'ppt'
  budget: Number,
  deadline: Date,
  status: String,             // 'open', 'in_progress', 'completed'
  postedBy: ObjectId,         // Reference to User
  assignedTo: ObjectId,
  attachments: [{
    filename: String,
    fileUrl: String
  }],
  bids: [{
    bidBy: ObjectId,
    bidAmount: Number,
    bidMessage: String,
    status: String,           // 'pending', 'accepted', 'rejected'
    createdAt: Date
  }],
  tags: [String],
  branch: String,
  semester: Number,
  views: Number,
  createdAt: Date,
  updatedAt: Date
}
```

#### 3. **Notes Collection**
```javascript
{
  _id: ObjectId,
  title: String,
  description: String,
  uploadedBy: ObjectId,
  subject: String,
  branch: String,
  semester: Number,
  file: {
    fileUrl: String,          // Cloudinary URL
    fileName: String,
    fileType: String,         // 'pdf', 'image', 'doc'
  },
  price: Number,
  isPaid: Boolean,
  downloads: Number,
  views: Number,
  ratings: {
    average: Number,
    count: Number
  },
  tags: [String],
  isPublished: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

#### 4. **Chats Collection**
```javascript
{
  _id: ObjectId,
  conversationId: String,
  participants: [ObjectId],   // Two users
  messages: [{
    senderId: ObjectId,
    text: String,
    attachments: [{
      fileName: String,
      fileUrl: String
    }],
    isRead: Boolean,
    timestamp: Date
  }],
  lastMessage: String,
  lastMessageTime: Date,
  createdAt: Date,
  updatedAt: Date
}
```

#### 5. **Orders Collection**
```javascript
{
  _id: ObjectId,
  orderId: String,
  buyerId: ObjectId,
  sellerId: ObjectId,
  itemId: ObjectId,
  itemType: String,           // 'task', 'note'
  amount: Number,
  status: String,             // 'pending', 'completed', 'refunded'
  paymentStatus: String,
  paymentId: String,
  createdAt: Date,
  completedAt: Date
}
```

---

## Real-Time Updates Flow

### Step 1: User Action (Frontend)
```
User uploads a Note in Next.js Frontend
        ↓
POST /api/notes (with file)
        ↓
```

### Step 2: Backend Processing
```
Backend receives file upload
        ↓
Upload to Cloudinary (get URL)
        ↓
Save to MongoDB Notes collection
        ↓
MongoDB Change Stream triggers
        ↓
```

### Step 3: Real-Time Broadcast via Socket.io
```
Socket.io server emits event: "NEW_NOTE"
        ↓
All connected clients receive update
        ↓
React components re-render instantly
        ↓
User sees new note in UI without refresh
```

---

## API Routes Structure

### Authentication Routes
- `POST /api/auth/send-otp` - Send OTP to email
- `POST /api/auth/verify-otp` - Verify OTP & login
- `POST /api/auth/logout` - Logout user

### Task Routes
- `GET /api/tasks` - Fetch all tasks (with filters)
- `POST /api/tasks` - Create new task
- `GET /api/tasks/:id` - Get task details
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task
- `POST /api/tasks/:id/bid` - Place bid on task

### Notes Routes
- `GET /api/notes` - Fetch all notes (with filters)
- `POST /api/notes` - Upload new notes
- `GET /api/notes/:id` - Get note details
- `PUT /api/notes/:id` - Update note
- `DELETE /api/notes/:id` - Delete note
- `GET /api/notes/:id/download` - Download note

### Chat Routes
- `GET /api/chat/conversations` - Get all chats
- `POST /api/chat/start` - Start new conversation
- `GET /api/chat/:conversationId` - Get chat messages
- `POST /api/chat/:conversationId/message` - Send message
- `POST /api/chat/:conversationId/file` - Send file in chat

### Orders Routes
- `GET /api/orders` - Get user orders
- `POST /api/orders` - Create order
- `GET /api/orders/:id` - Order details
- `PUT /api/orders/:id/status` - Update order status

---

## Socket.io Events

### Client → Server Events
```javascript
// Tasks
socket.emit('CREATE_TASK', taskData)
socket.emit('UPDATE_TASK', {taskId, updates})
socket.emit('DELETE_TASK', taskId)
socket.emit('BID_ON_TASK', {taskId, bidAmount, bidMessage})

// Notes
socket.emit('UPLOAD_NOTE', noteData)
socket.emit('UPDATE_NOTE', {noteId, updates})
socket.emit('DELETE_NOTE', noteId)

// Chat
socket.emit('SEND_MESSAGE', {conversationId, text, files})
socket.emit('READ_MESSAGE', messageId)
socket.emit('START_TYPING', {conversationId})
socket.emit('STOP_TYPING', {conversationId})

// Notifications
socket.emit('MARK_READ', notificationId)
```

### Server → Client Events (Real-time Updates)
```javascript
// Tasks - Broadcast to all users
socket.on('TASK_CREATED', taskData)
socket.on('TASK_UPDATED', {taskId, updates})
socket.on('TASK_DELETED', taskId)
socket.on('NEW_BID', {taskId, bidData})

// Notes - Broadcast to all users
socket.on('NOTE_UPLOADED', noteData)
socket.on('NOTE_UPDATED', {noteId, updates})
socket.on('NOTE_DELETED', noteId)

// Chat - Private messages
socket.on('NEW_MESSAGE', messageData)
socket.on('MESSAGE_READ', messageId)
socket.on('USER_TYPING', {userId, conversationId})
socket.on('USER_STOP_TYPING', {userId, conversationId})

// Notifications
socket.on('NEW_NOTIFICATION', notificationData)
```

---

## Deployment & Scaling

### Frontend Deployment
- **Vercel** (recommended for Next.js)
- Environment: `NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_SOCKET_URL`

### Backend Deployment
- **Render** or **Railway** or **AWS EC2**
- Environment: `MONGODB_URI`, `CLOUDINARY_API_KEY`, `JWT_SECRET`, `EMAIL_PASSWORD`

### Database
- **MongoDB Atlas** (Cloud)
- Enable Change Streams (requires Replica Set)

### Storage
- **Cloudinary** for file uploads

---

## Security Considerations

1. **Authentication**: OTP-based, college email only
2. **Authorization**: Verify user ownership before CRUD operations
3. **Rate Limiting**: Prevent API abuse
4. **CORS**: Whitelist only frontend URL
5. **File Validation**: Only allow specific file types
6. **SQL Injection Prevention**: Use parameterized queries (Mongoose)
7. **XSS Protection**: Sanitize user inputs
8. **HTTPS**: Use in production
9. **Socket.io Auth**: Verify JWT on connection
