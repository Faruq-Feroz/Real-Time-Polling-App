# 🗳️ **Real-Time Polling App**

## 🚀 Live Demo
[![Live Demo](/screenshots/Home.png)](https://real-time-polling-app-xi.vercel.app/)



---

📊 **_A dynamic web application that enables users to create polls and view results in real-time, powered by React, Node.js, Express, MongoDB, and Socket.IO._**

## 📌 Table of Contents
- [✨ Features](#features)
- [🛠️ Tech Stack](#tech-stack)
- [📦 Backend Setup](#backend-setup)
- [💻 Frontend Setup](#frontend-setup)
- [🔗 API Endpoints](#api-endpoints)
- [📡 WebSocket Events](#websocket-events)
- [📁 Project Structure](#project-structure)
- [🔍 MongoDB Schema](#mongodb-schema)
- [🚀 Deployment](#deployment)
- [❓ Troubleshooting](#troubleshooting)
- [👥 Contributing](#contributing)
- [📜 License](#license)

---

## ✨ Features
✅ **Real-time Updates** - See poll results update instantly using Socket.IO  
✅ **Polling System** - Create polls with multiple choice options  
✅ **Real-time Vote Tracking** - Votes update for all connected users instantly  
✅ **MongoDB Integration** - Persistent storage of polls and votes  
✅ **User-Friendly Interface** - Interactive UI built with React  
✅ **Toast Notifications** - Real-time feedback with React-Toastify  
✅ **Poll Management** - Close polls when voting should be completed  

---

## 🛠️ Tech Stack
### 🔙 Backend
- 🟢 **Node.js**
- ⚡ **Express.js**
- 🍃 **MongoDB + Mongoose**
- 🔄 **Socket.IO**
- 🔐 **dotenv** (Environment Variables)

### 🖥️ Frontend
- ⚛️ **React.js**
- 🔗 **Axios**
- 📡 **Socket.IO Client**
- 🔔 **React-Toastify**
- 🎨 **CSS Modules**

---

## 📦 Backend Setup

### 🔧 Prerequisites
Ensure you have **Node.js** and **MongoDB** installed.

### 📥 Installation
```bash
cd backend
npm install
```

### 📝 Environment Variables
Create a `.env` file in the backend folder and add:
```env
MONGO_URI=mongodb://localhost:27017/polling-app
PORT=4000
```

### ▶️ Running the Server
```bash
nodemon server
```
📍 The backend should now be running at `http://localhost:4000`.

---

## 💻 Frontend Setup

### 🔧 Prerequisites
Ensure **Node.js** is installed.

### 📥 Installation
```bash
cd frontend
npm install
```

### ▶️ Running the Frontend
```bash
npm start
```
📍 The frontend should now be running at `http://localhost:3000` (or `http://localhost:5173` if using Vite).

---

## 🔗 API Endpoints
### 📊 Polls
| 🛠️ Method | 🔗 Endpoint | 📌 Description | 📦 Request Body Example |
|----------|------------|--------------|------------------------|
| GET | `/api/polls` | Get all polls | - |
| POST | `/api/polls` | Create a new poll | `{ "question": "Your poll question", "options": ["Option 1", "Option 2", "Option 3"] }` |
| POST | `/api/polls/vote` | Cast a vote | `{ "pollId": "poll_id_here", "option": "selected_option" }` |
| POST | `/api/polls/close/:id` | Close a poll | - |

---

## 📡 WebSocket Events
| 🔄 Event | 📦 Payload | 📌 Description |
|---------|-----------|---------------|
| `connect` | - | Client connected to server |
| `pollData` | Updated poll object | Server sends updated poll data |
| `vote_cast` | Poll with updated votes | Emitted when a vote is cast |
| `new_poll` | New poll object | Emitted when a new poll is created |

---

## 📁 Project Structure
```
📂 real-time-polling-app
 ├── 📂 frontend
 │   ├── 📂 public
 │   ├── 📂 src
 │   │   ├── 📂 components
 │   │   │   ├── 📂 CreatePoll
 │   │   │   ├── 📂 PollList
 │   │   │   └── 📂 PollDetails
 │   │   ├── App.js
 │   │   ├── App.module.css
 │   │   └── index.js
 │   └── package.json
 │
 ├── 📂 backend
 │   ├── 📂 models
 │   ├── 📂 routes
 │   ├── server.js
 │   └── package.json
 │
 └── README.md
```

---

## 🔍 MongoDB Schema

### 📊 Poll Schema
```javascript
const pollSchema = new mongoose.Schema({
  question: { type: String, required: true },
  options: [
    { option: String, votes: { type: Number, default: 0 } }
  ],
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});
```

---

## 🚀 Deployment

### 🖥️ Frontend
The React frontend can be deployed to services like:
- 🟣 **Vercel**
- 🔵 **Netlify**
- 🟠 **AWS Amplify**

```bash
cd frontend
npm run build
```

### 🔙 Backend
The Node.js backend can be deployed to services like:
- 🟪 **Render**
- 🟦 **Heroku**
- 🟩 **Digital Ocean**

---

## ❓ Troubleshooting

🔹 **CORS issues**: Ensure your backend server allows requests from the frontend  
🔹 **Socket.IO Connection**: Verify both frontend and backend are running with correct port numbers  
🔹 **MongoDB Connection**: Check your connection string and database server status  

---

## 👥 Contributing
1. 🍴 Fork the repository
2. 🌿 Create your feature branch: `git checkout -b feature/amazing-feature`
3. 💾 Commit your changes: `git commit -m 'Add some amazing feature'`
4. 📤 Push to the branch: `git push origin feature/amazing-feature`
5. 🔁 Open a Pull Request

---

## 📜 License
📄 This project is licensed under the **MIT License**.

---

## 🙏 Acknowledgments
- 📡 Socket.IO documentation
- ⚛️ React documentation
- 🍃 MongoDB documentation
