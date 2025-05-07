# AI Journal - Your Personal AI Writing Assistant

A full-stack application that helps users maintain their daily journal with AI-powered insights, summaries, and writing assistance.

## Tech Stack

### Frontend
- React 18
- TypeScript
- Vite
- Tailwind CSS
- Zustand (State Management)
- React Router
- React Hook Form
- Axios

### Backend
- Node.js
- Express.js
- TypeScript
- MongoDB
- Mongoose
- JWT Authentication
- Google Gemini AI API

## Prerequisites

- Node.js (v18 or higher)
- MongoDB (v6 or higher)
- npm or yarn
- Google Gemini API Key

## Environment Setup

### Backend Environment Variables
Create a `.env` file in the `backend` directory:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ai-journal
JWT_SECRET=your_jwt_secret_key
GEMINI_API_KEY=your_gemini_api_key
NODE_ENV=development
```

### Frontend Environment Variables
Create a `.env` file in the `frontend` directory:

```env
VITE_API_URL=http://localhost:5000/api
```

## Installation

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Build the TypeScript code:
   ```bash
   npm run build
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

## Project Structure

```
├── backend/
│   ├── src/
│   │   ├── controllers/    # Request handlers
│   │   ├── middleware/     # Custom middleware
│   │   ├── models/        # Database models
│   │   ├── routes/        # API routes
│   │   ├── services/      # Business logic
│   │   ├── utils/         # Utility functions
│   │   └── index.ts       # Entry point
│   ├── .env              # Environment variables
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── pages/        # Page components
│   │   ├── services/     # API services
│   │   ├── store/        # State management
│   │   ├── utils/        # Utility functions
│   │   └── App.tsx       # Root component
│   ├── .env             # Environment variables
│   └── package.json
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user

### Chat
- `POST /api/chat/create` - Create a new chat
- `POST /api/chat/message` - Send a message
- `GET /api/chat/history` - Get chat history
- `POST /api/chat/:chatId/summary` - Get chat summary
- `GET /api/chat/:chatId/insights` - Get chat insights

## Development

### Backend Development
- Run tests: `npm test`
- Build for production: `npm run build`
- Start production server: `npm start`

### Frontend Development
- Run tests: `npm test`
- Build for production: `npm run build`
- Preview production build: `npm run preview`

## Production Deployment

### Backend Deployment
1. Set up a MongoDB Atlas cluster
2. Configure environment variables in your hosting platform
3. Build the TypeScript code
4. Deploy to your preferred hosting platform (e.g., Heroku, AWS, DigitalOcean)

### Frontend Deployment
1. Update the `VITE_API_URL` in `.env.production`
2. Build the project: `npm run build`
3. Deploy the `dist` folder to your preferred hosting platform

## Security Considerations

1. Always use environment variables for sensitive data
2. Keep dependencies updated
3. Implement rate limiting in production
4. Use HTTPS in production
5. Implement proper CORS policies
6. Regular security audits

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 