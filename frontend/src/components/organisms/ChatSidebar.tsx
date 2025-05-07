import { useEffect } from 'react';
import { format } from 'date-fns';
import { Button } from '../atoms/Button';
import { useChatStore } from '../../store/chat.store';
import { chatApi } from '../../services/api';
import { useAuthStore } from '../../store/auth.store';
import { useNavigate } from 'react-router-dom';

export const ChatSidebar = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const { chats, currentChat, setChats, setCurrentChat, setLoading, setError } =
    useChatStore();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const fetchChats = async () => {
      try {
        setLoading(true);
        const response = await chatApi.getChatHistory();
        setChats(response.data.data.chats);
      } catch (error) {
        setError('Failed to fetch chat history');
      } finally {
        setLoading(false);
      }
    };

    fetchChats();
  }, [isAuthenticated, navigate]);

  const handleNewChat = async () => {
    try {
      setLoading(true);
      const response = await chatApi.createChat();
      const newChat = response.data.data.chat;
      setChats([newChat, ...chats]);
      setCurrentChat(newChat);
    } catch (error) {
      setError('Failed to create new chat');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-64 border-r h-full flex flex-col">
      <div className="p-4 border-b">
        <Button onClick={handleNewChat} className="w-full">
          New Chat
        </Button>
      </div>
      <div className="flex-1 overflow-y-auto">
        {chats.map((chat) => (
          <button
            key={chat._id}
            onClick={() => setCurrentChat(chat)}
            className={`
              w-full p-4 text-left border-b hover:bg-gray-50
              ${currentChat?._id === chat._id ? 'bg-gray-50' : ''}
            `}
          >
            <div className="text-sm font-medium text-gray-900">
              {format(new Date(chat.createdAt), 'MMM d, yyyy')}
            </div>
            <div className="text-xs text-gray-500 truncate">
              {chat.messages[0]?.content || 'No messages yet'}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}; 