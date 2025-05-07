import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { format, isToday, isYesterday, isThisWeek, isThisMonth } from 'date-fns';
import { Button } from '../components/atoms/Button';
import { ChatInput } from '../components/molecules/ChatInput';
import { ChatMessage } from '../components/molecules/ChatMessage';
import { useAuthStore } from '../store/auth.store';
import { chatApi } from '../services/api';

interface Message {
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  mood?: string;
  type?: string;
}

interface Chat {
  _id: string;
  messages: Message[];
  summary?: string;
  createdAt: Date;
  updatedAt: Date;
}

const formatDate = (date: Date): string => {
  if (isToday(date)) return 'Today';
  if (isYesterday(date)) return 'Yesterday';
  if (isThisWeek(date)) return format(date, 'EEEE'); // Day name
  if (isThisMonth(date)) return format(date, 'MMMM d'); // Month and day
  return format(date, 'MMMM d, yyyy'); // Full date
};

export const ChatPage = () => {
  const navigate = useNavigate();
  const { logout } = useAuthStore();
  const [chats, setChats] = useState<Chat[]>([]);
  const [currentChat, setCurrentChat] = useState<Chat | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchChatHistory();
  }, []);

  const fetchChatHistory = async () => {
    try {
      const response = await chatApi.chat.getChatHistory();
      setChats(response.data.data.chats);
    } catch (error) {
      console.error('Error fetching chat history:', error);
      setError('Failed to load chat history');
    }
  };

  const handleCreateChat = async () => {
    try {
      const response = await chatApi.chat.createChat();
      const newChat = response.data.data.chat;
      setChats(prev => [newChat, ...prev]);
      setCurrentChat(newChat);
    } catch (error) {
      console.error('Error creating chat:', error);
      setError('Failed to create new chat');
    }
  };

  const handleSendMessage = async (message: string) => {
    if (!currentChat) return;
    try {
      setIsLoading(true);
      const response = await chatApi.chat.sendMessage(currentChat._id, message);
      const updatedChat = response.data.data.chat;
      
      // Update current chat
      setCurrentChat(updatedChat);
      
      // Update chat in the list
      setChats(chats.map(chat => 
        chat._id === updatedChat._id ? updatedChat : chat
      ));
    } catch (error: any) {
      console.error('Error sending message:', error);
      setError('Failed to send message. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSummarizeDay = async () => {
    if (!currentChat) return;

    try {
      setIsLoading(true);
      const response = await chatApi.summarizeDay(currentChat._id);
      const summary = response.data.data.summary;
      
      // Add summary as an AI message
      const summaryMessage: Message = {
        content: `Daily Summary:\n${summary}`,
        sender: 'ai',
        timestamp: new Date(),
        type: 'summary'
      };
      
      setCurrentChat({
        ...currentChat,
        messages: [...currentChat.messages, summaryMessage],
      });
    } catch (error: any) {
      console.error('Error generating summary:', error);
      setError('Failed to generate daily summary');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGetMotivation = async () => {
    if (!currentChat) return;
    try {
      setIsLoading(true);
      const response = await chatApi.chat.getMotivation(currentChat._id);
      const summary = response.data.data.summary;
      
      // Add motivation as an AI message
      const motivationMessage: Message = {
        content: `Motivation for you:\n${summary}`,
        sender: 'ai',
        timestamp: new Date(),
        type: 'motivation'
      };
      
      setCurrentChat({
        ...currentChat,
        messages: [...currentChat.messages, motivationMessage],
      });
    } catch (error: any) {
      console.error('Error getting motivation:', error);
      setError('Failed to get motivation. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGetImprovements = async () => {
    if (!currentChat) return;
    try {
      setIsLoading(true);
      const response = await chatApi.chat.getImprovements(currentChat._id);
      const summary = response.data.data.summary;
      
      // Add improvements as an AI message
      const improvementsMessage: Message = {
        content: `Weekly Improvements:\n${summary}`,
        sender: 'ai',
        timestamp: new Date(),
        type: 'improvements'
      };
      
      setCurrentChat({
        ...currentChat,
        messages: [...currentChat.messages, improvementsMessage],
      });
    } catch (error: any) {
      console.error('Error getting improvements:', error);
      setError('Failed to get improvements. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Group chats by date
  const groupedChats = chats.reduce((groups: { [key: string]: Chat[] }, chat) => {
    const date = formatDate(new Date(chat.createdAt));
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(chat);
    return groups;
  }, {});

  return (
    <div className="min-h-screen bg-[#F8F7F2]">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-[#3B2F1E]">AI Journal</h1>
          <Button
            variant="secondary"
            onClick={handleLogout}
            className="text-[#3B2F1E] hover:bg-gray-100"
          >
            Logout
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Chat History Sidebar */}
          <div className="md:col-span-1 bg-white rounded-lg shadow-sm p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-[#3B2F1E]">Chat History</h2>
              <Button
                variant="primary"
                onClick={handleCreateChat}
                className="text-sm"
              >
                New Chat
              </Button>
            </div>
            <div className="space-y-4">
              {Object.entries(groupedChats).map(([date, dateChats]) => (
                <div key={date} className="space-y-2">
                  <h3 className="text-sm font-medium text-gray-500 sticky top-0 bg-white py-2">
                    {date}
                  </h3>
                  {dateChats.map((chat) => (
                    <button
                      key={chat._id}
                      onClick={() => setCurrentChat(chat)}
                      className={`w-full text-left p-3 rounded-lg transition-colors ${
                        currentChat?._id === chat._id
                          ? 'bg-[#FFD600] text-[#3B2F1E]'
                          : 'hover:bg-gray-100 text-gray-700'
                      }`}
                    >
                      <div className="text-sm font-medium">
                        {format(new Date(chat.createdAt), 'h:mm a')}
                      </div>
                      <div className="text-xs text-gray-500 truncate">
                        {chat.messages[0]?.content || 'New chat'}
                      </div>
                      {chat.messages[0]?.mood && (
                        <div className="text-xs mt-1">
                          Mood: {chat.messages[0].mood}
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Chat Window */}
          <div className="md:col-span-2 bg-white rounded-lg shadow-sm p-4 flex flex-col h-[calc(100vh-12rem)]">
            <div className="flex-1 overflow-y-auto mb-4 space-y-4">
              {currentChat?.messages.map((message, index) => (
                <ChatMessage
                  key={index}
                  content={message.content}
                  sender={message.sender}
                  timestamp={message.timestamp}
                  mood={message.mood}
                />
              ))}
            </div>

            {/* Quick Actions */}
            <div className="flex gap-2 mb-4">
              <Button
                variant="secondary"
                onClick={handleSummarizeDay}
                className="flex-1"
                disabled={isLoading}
              >
                Summarize Day
              </Button>
              <Button
                variant="secondary"
                onClick={handleGetMotivation}
                className="flex-1"
                disabled={isLoading}
              >
                Get Motivation
              </Button>
              <Button
                variant="secondary"
                onClick={handleGetImprovements}
                className="flex-1"
                disabled={isLoading}
              >
                Weekly Improvements
              </Button>
            </div>

            <ChatInput
              onSendMessage={handleSendMessage}
              isLoading={isLoading}
            />
          </div>
        </div>
      </main>
    </div>
  );
}; 