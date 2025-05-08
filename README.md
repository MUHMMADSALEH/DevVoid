# DevVoid - AI-Powered Journal Chat App

DevVoid is a modern web application that combines journaling with AI-powered chat capabilities. The project consists of a React-based frontend and a Node.js backend.

## Tech Stack

### Frontend
- React 18
- TypeScript
- Vite
- Tailwind CSS
- React Router
- Zustand (State Management)
- Axios
- Framer Motion

### Backend
- Node.js
- Express.js
- MongoDB
- Google Generative AI
- JWT Authentication
- Winston Logger

## Prerequisites

- Node.js (v18.x or higher)
- npm (comes with Node.js)
- MongoDB (local or Atlas)
- Gemini API Key

## Project Structure

```
DevVoid/
├── frontend/          # React frontend application
├── backend/           # Node.js backend server
└── README.md
```

## Setup Instructions

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the backend directory with the following variables:
   ```
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   GEMINI_API_KEY=your_gemini_api_key
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

The backend server will start on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the frontend directory:
   ```
   VITE_API_URL=http://localhost:5000/api
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

The frontend application will start on `http://localhost:5173`

## Available Scripts

### Backend
- `npm run dev` - Start development server with nodemon
- `npm start` - Start production server
- `npm run build` - Install dependencies

### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Environment Variables

### Backend (.env)
- `PORT` - Server port (default: 5000)
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret for JWT token generation
- `GEMINI_API_KEY` - Gemini API key for AI-powered features

### Frontend (.env)
- `VITE_API_URL` - Backend API URL

## API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication
All endpoints except authentication endpoints require a valid JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

### Authentication Endpoints

#### Register User
```http
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}
```

**Response**
```json
{
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

#### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response**
```json
{
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

#### Verify Token
```http
GET /auth/verify
Authorization: Bearer <your_jwt_token>
```

**Response**
```json
{
  "valid": true,
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

### Chat Endpoints

#### Get Chat History
```http
GET /chat/history
Authorization: Bearer <your_jwt_token>
```

**Response**
```json
{
  "chats": [
    {
      "id": "chat_id",
      "title": "Chat Title",
      "lastMessage": "Last message content",
      "createdAt": "2024-03-14T12:00:00Z",
      "updatedAt": "2024-03-14T12:00:00Z"
    }
  ]
}
```

#### Create New Chat
```http
POST /chat/create
Authorization: Bearer <your_jwt_token>
```

**Response**
```json
{
  "id": "new_chat_id",
  "title": "New Chat",
  "messages": [],
  "createdAt": "2024-03-14T12:00:00Z",
  "updatedAt": "2024-03-14T12:00:00Z"
}
```

#### Get All Chats
```http
GET /chat
Authorization: Bearer <your_jwt_token>
```

**Response**
```json
{
  "chats": [
    {
      "id": "chat_id",
      "title": "Chat Title",
      "lastMessage": "Last message content",
      "createdAt": "2024-03-14T12:00:00Z",
      "updatedAt": "2024-03-14T12:00:00Z"
    }
  ]
}
```

#### Send Message
```http
POST /chat/message
Authorization: Bearer <your_jwt_token>
Content-Type: application/json

{
  "chatId": "chat_id",
  "content": "Your message here"
}
```

**Response**
```json
{
  "id": "message_id",
  "content": "Your message here",
  "role": "user",
  "timestamp": "2024-03-14T12:00:00Z"
}
```

#### Get Specific Chat
```http
GET /chat/:chatId
Authorization: Bearer <your_jwt_token>
```

**Response**
```json
{
  "id": "chat_id",
  "title": "Chat Title",
  "messages": [
    {
      "id": "message_id",
      "content": "Message content",
      "role": "user|assistant",
      "timestamp": "2024-03-14T12:00:00Z"
    }
  ],
  "createdAt": "2024-03-14T12:00:00Z",
  "updatedAt": "2024-03-14T12:00:00Z"
}
```

#### Update Chat
```http
PATCH /chat/:chatId
Authorization: Bearer <your_jwt_token>
Content-Type: application/json

{
  "title": "New Chat Title"
}
```

**Response**
```json
{
  "id": "chat_id",
  "title": "New Chat Title",
  "updatedAt": "2024-03-14T12:00:00Z"
}
```

#### Delete Chat
```http
DELETE /chat/:chatId
Authorization: Bearer <your_jwt_token>
```

**Response**
```json
{
  "message": "Chat deleted successfully"
}
```

### AI-Powered Features

#### Get Chat Summary
```http
POST /chat/:chatId/summary
Authorization: Bearer <your_jwt_token>
```

**Response**
```json
{
  "summary": "A concise summary of the chat conversation..."
}
```

#### Get Motivation
```http
POST /chat/:chatId/motivation
Authorization: Bearer <your_jwt_token>
```

**Response**
```json
{
  "motivation": "AI-generated motivational message based on chat content..."
}
```

#### Get Improvements
```http
POST /chat/:chatId/improvements
Authorization: Bearer <your_jwt_token>
```

**Response**
```json
{
  "improvements": [
    "Suggestion 1",
    "Suggestion 2",
    "Suggestion 3"
  ]
}
```

### Error Responses

All endpoints may return the following error responses:

```json
{
  "error": "Error message",
  "status": 400
}
```

Common status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `404` - Not Found
- `500` - Internal Server Error

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License. 