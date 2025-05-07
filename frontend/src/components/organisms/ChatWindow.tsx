import { useEffect, useRef } from 'react';
import { MessageBubble } from '../molecules/MessageBubble';
import { ChatInput } from '../molecules/ChatInput';
import { useChatStore } from '../../store/chat.store';
import { chatApi } from '../../services/api';

export const ChatWindow = () => {
  const { currentChat, loading, setLoading, setError, addMessage } = useChatStore();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [currentChat?.messages]);

  const handleSendMessage = async (content: string) => {
    if (!currentChat) return;

    try {
      setLoading(true);
      const response = await chatApi.sendMessage({
        chatId: currentChat._id,
        content,
      });

      const { chat, mood } = response.data.data;
      addMessage(currentChat._id, {
        content,
        sender: 'user',
        timestamp: new Date(),
        mood,
      });

      if (chat.messages[chat.messages.length - 1]) {
        addMessage(currentChat._id, chat.messages[chat.messages.length - 1]);
      }
    } catch (error) {
      setError('Failed to send message');
    } finally {
      setLoading(false);
    }
  };

  if (!currentChat) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500">Select a chat or start a new one</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {currentChat.messages.map((message, index) => (
          <MessageBubble key={index} message={message} />
        ))}
        <div ref={messagesEndRef} />
      </div>
      <ChatInput onSend={handleSendMessage} isLoading={loading} />
    </div>
  );
}; 