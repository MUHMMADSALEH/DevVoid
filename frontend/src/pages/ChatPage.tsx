import { useState, useEffect } from 'react';
import { ChatSidebar } from '../components/organisms/ChatSidebar';
import { ChatWindow } from '../components/organisms/ChatWindow';
import { chatApi } from '../services/api';
import { Chat } from '../types/chat';

export const ChatPage = () => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [currentChat, setCurrentChat] = useState<Chat | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchChatHistory();
  }, []);

  const generateChatTitle = (messages: Chat['messages']) => {
    if (!messages.length) return 'New Chat';
    
    // Get the first user message
    const firstUserMessage = messages.find(m => m.sender === 'user')?.content;
    if (!firstUserMessage) return 'New Chat';

    // Clean and truncate the message
    const cleanMessage = firstUserMessage
      .replace(/[^\w\s]/g, '') // Remove special characters
      .trim()
      .split(/\s+/) // Split into words
      .slice(0, 5) // Take first 5 words
      .join(' ');

    return cleanMessage.length > 30 
      ? cleanMessage.substring(0, 30) + '...'
      : cleanMessage;
  };

  const fetchChatHistory = async () => {
    try {
      const response = await chatApi.getChatHistory();
      const chatHistory = response.data.data.chats;
      // Generate titles for chats that don't have one
      const chatsWithTitles = chatHistory.map((chat: Chat) => ({
        ...chat,
        title: chat.title || generateChatTitle(chat.messages)
      }));
      setChats(chatsWithTitles);
      if (chatsWithTitles.length > 0) {
        setCurrentChat(chatsWithTitles[0]);
      }
    } catch (error) {
      console.error('Error fetching chat history:', error);
    }
  };

  const handleCreateChat = async () => {
    try {
      const response = await chatApi.createChat();
      const newChat = response.data.data.chat;
      setChats([newChat, ...chats]);
      setCurrentChat(newChat);
    } catch (error) {
      console.error('Error creating chat:', error);
    }
  };

  const handleSendMessage = async (message: string) => {
    if (!currentChat) return;
    try {
      setLoading(true);
      const response = await chatApi.sendMessage(currentChat._id, message);
      const updatedChat = response.data.data.chat;
      
      // Generate title if this is the first message
      if (updatedChat.messages.length === 1) {
        updatedChat.title = generateChatTitle(updatedChat.messages);
      }

      setChats(chats.map(chat => 
        chat._id === updatedChat._id ? updatedChat : chat
      ));
      setCurrentChat(updatedChat);
    } catch (error: any) {
      console.error('Error sending message:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSummarizeDay = async () => {
    if (!currentChat) return;
    try {
      setLoading(true);
      const response = await chatApi.summarizeDay(currentChat._id);
      const summary = response.data.data.summary;
      // Handle the summary (e.g., display it in the chat)
      console.log('Daily summary:', summary);
    } catch (error: any) {
      console.error('Error generating summary:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGetMotivation = async () => {
    if (!currentChat) return;
    try {
      setLoading(true);
      const response = await chatApi.getMotivation(currentChat._id);
      const summary = response.data.data.summary;
      // Handle the motivation (e.g., display it in the chat)
      console.log('Motivation:', summary);
    } catch (error: any) {
      console.error('Error getting motivation:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGetImprovements = async () => {
    if (!currentChat) return;
    try {
      setLoading(true);
      const response = await chatApi.getImprovements(currentChat._id);
      const summary = response.data.data.summary;
      // Handle the improvements (e.g., display it in the chat)
      console.log('Improvements:', summary);
    } catch (error: any) {
      console.error('Error getting improvements:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-[#F8F7F2]">
      <ChatSidebar
        chats={chats}
        currentChat={currentChat}
        onSelectChat={setCurrentChat}
        onCreateChat={handleCreateChat}
      />
      <div className="flex-1 flex flex-col">
        {currentChat ? (
          <ChatWindow
            chat={currentChat}
            onSendMessage={handleSendMessage}
            loading={loading}
            onSummarizeDay={handleSummarizeDay}
            onGetMotivation={handleGetMotivation}
            onGetImprovements={handleGetImprovements}
          />
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-gray-500">Select a chat or create a new one</p>
          </div>
        )}
      </div>
    </div>
  );
}; 