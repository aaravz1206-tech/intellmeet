# IntellMeet - Enterprise Video Conferencing SaaS

IntellMeet is a full-stack, enterprise-grade video conferencing application built with the MERN stack (MongoDB, Express, React, Node.js). It features native WebRTC mesh networking for real-time video/audio, a collaborative synchronized whiteboard, and AI-powered meeting summaries.

## 🚀 Architecture Overview

### Frontend (React / Vite / TailwindCSS / Zustand)
- **UI Framework:** React with Vite for lightning-fast HMR and optimized production builds.
- **Styling:** Premium Dark-Mode styling utilizing TailwindCSS, Framer Motion for micro-animations, and Lucide React for iconography.
- **State Management:** Zustand is used for predictable global state management of the meeting room logic (streams, muting, whiteboard toggles).
- **Video Grid:** A responsive `VideoGrid` component handles dynamic RTCPeerConnection rendering.

### Backend (Node.js / Express / Socket.io)
- **API Server:** Express.js powers the RESTful endpoints.
- **Real-Time Engine:** Socket.io handles WebRTC signaling (SDP offers, answers, ICE candidates) and room state events (drawing, chat).
- **Authentication:** JWT (JSON Web Tokens) and bcrypt ensure secure user access and room permissions.

### Databases (MongoDB & Redis)
- **MongoDB:** Stores user profiles, meeting history, and AI transcript summaries (using Mongoose).
- **Redis:** Acts as an ultra-fast in-memory store to track real-time participant counts and active socket rooms.

## 📦 Prerequisites

Ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v18+)
- [Docker](https://www.docker.com/) & Docker Compose
- Git

## 🛠 Local Development Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/intellmeet.git
   cd intellmeet
   ```

2. **Install all dependencies:**
   ```bash
   npm run install:all
   ```

3. **Configure Environment Variables:**
   - In `intellmeet-backend/.env`:
     ```env
     PORT=5000
     MONGO_URI=mongodb://localhost:27017/intellmeet
     JWT_SECRET=your_jwt_secret
     REDIS_HOST=localhost
     REDIS_PORT=6379
     GROQ_API_KEY=your_ai_key
     ```
   - In `frontend/.env`:
     ```env
     VITE_SERVER_URL=http://localhost:5000
     ```

4. **Run the Application:**
   ```bash
   npm run dev
   ```
   *This starts both the frontend (localhost:5173) and backend (localhost:5000) concurrently.*

## 🐳 Docker Production Deployment

To run the entire MERN stack using Docker Compose:

1. Ensure Docker Desktop is running.
2. In the root directory, run:
   ```bash
   docker-compose up --build -d
   ```
3. The services will be exposed as follows:
   - Frontend: `http://localhost:5173`
   - Backend API: `http://localhost:5000`
   - MongoDB: `localhost:27017`
   - Redis: `localhost:6379`

## 🤝 Team Member Guidelines

- **Frontend Developers:** Follow the Zustand store pattern in `src/store/useMeetingStore.ts`. Ensure all components are fully typed using TypeScript interfaces.
- **Backend Developers:** All new Socket events must be documented and scoped within `socketService.js`. Use the centralized `errorMiddleware` for exception handling.
- **DevOps:** Modify `render.yaml` and `vercel.json` for CI/CD pipeline adjustments.
