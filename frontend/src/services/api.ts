import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    
    if (error.response?.status === 401) {
      // Clear auth data
      localStorage.removeItem('token');
      localStorage.removeItem('auth-storage');
      // Force a page reload to reset the app state
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

interface LoginData {
  user: {
    email: string;
    password: string;
  };
}

interface RegisterData {
  user: {
    email: string;
    password: string;
    name: string;
  };
}

export const authApi = {
  register: (data: RegisterData) => api.post('/auth/register', data),
  login: (data: LoginData) => api.post('/auth/login', data),
};

export const chatApi = {
  getChatHistory: () => api.get('/chat/history'),
  createChat: () => api.post('/chat/create'),
  sendMessage: (chatId: string, content: string) =>
    api.post('/chat/message', { 
      chatId,
      content,
      type: 'user'
    }),
  getSummary: (chatId: string) => api.post(`/chat/${chatId}/summary`),
  getInsights: (chatId: string) => api.get(`/chat/${chatId}/insights`),
  getMotivation: (chatId: string) => api.post(`/chat/${chatId}/summary`, { type: 'motivation' }),
  getImprovements: (chatId: string) => api.post(`/chat/${chatId}/summary`, { type: 'improvements' }),
  summarizeDay: (chatId: string) =>
    api.post(`/chat/${chatId}/summary`, { type: 'daily' }),
};

export default api; 