# 🎓 Student Task Marketplace

A dynamic, full-stack web application for students to buy and sell academic work (assignments, notes, projects, PPTs) with real-time updates, secure authentication, and a modern UI.

## ✨ Features

- ✅ **Dynamic Real-time Updates** - Instant sync with Socket.io & MongoDB Change Streams
- ✅ **College Email Authentication** - OTP-based login (only @college.edu domains)
- ✅ **Task Marketplace** - Post, bid, and manage academic tasks
- ✅ **Notes Section** - Upload and share study materials with filtering
- ✅ **Real-time Chat** - WhatsApp-like messaging with file sharing
- ✅ **Dashboard** - Track tasks, earnings, and orders
- ✅ **Dark Mode Support** - Modern, responsive UI
- ✅ **Payment Integration** - Secure order processing

## 🏗️ Tech Stack

### Frontend
- **Next.js 14+** (React with App Router)
- **TypeScript** - Type-safe code
- **Tailwind CSS** - Utility-first styling
- **Socket.io Client** - Real-time communication
- **Zustand** - State management
- **Axios** - HTTP client

### Backend
- **Node.js + Express** - REST API & WebSocket server
- **MongoDB** - NoSQL database with Change Streams
- **Socket.io** - Real-time events
- **JWT + OTP** - Secure authentication
- **Cloudinary** - File storage
- **Nodemailer** - Email service

## 📁 Project Structure

```
student-task-marketplace/
├── frontend/              # Next.js Frontend
├── backend/               # Node.js Express Backend
├── docs/                  # Documentation
├── .gitignore
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- MongoDB Atlas account
- Cloudinary account
- Gmail/Email for OTP service

### Installation

#### 1. Clone & Setup Frontend
```bash
cd frontend
npm install
cp .env.example .env.local
```

#### 2. Setup Backend
```bash
cd ../backend
npm install
cp .env.example .env
```

#### 3. Configure Environment Variables
See `backend/.env.example` and `frontend/.env.example`

#### 4. Run Development Servers

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

Visit `http://localhost:3000`

## 📚 API Documentation

See [API_DOCS.md](./docs/API_DOCS.md) for complete API reference.

## 🔌 Real-time Updates Flow

```
User uploads notes
    ↓
POST /api/notes (Backend)
    ↓
Save to MongoDB
    ↓
MongoDB Change Stream triggers
    ↓
Socket.io emits 'noteCreated' event
    ↓
All connected clients receive update
    ↓
Frontend updates UI instantly
```

## 🔐 Security Features

- College email domain validation
- OTP-based authentication
- JWT tokens for API routes
- MongoDB injection prevention
- CORS protection
- Rate limiting on API endpoints
- File upload validation
- XSS & CSRF protection

## 📖 Documentation

- [System Architecture](./docs/ARCHITECTURE.md)
- [Database Schema](./docs/DATABASE.md)
- [API Routes](./docs/API_DOCS.md)
- [Frontend Components](./docs/COMPONENTS.md)
- [Real-time Events](./docs/SOCKET_EVENTS.md)

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## 📝 License

MIT License - Feel free to use for educational purposes

## 👨‍💻 Author

Built with ❤️ for students, by developers

---

**Ready to launch?** Follow the Getting Started guide above! 🚀
