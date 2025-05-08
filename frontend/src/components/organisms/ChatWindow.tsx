import { useEffect, useRef } from 'react';
import { ChatInput } from '../molecules/ChatInput';
import { ChatMessage } from '../molecules/ChatMessage';
import { Button } from '../atoms/Button';
import { Chat } from '../../types/chat';

interface ChatWindowProps {
  chat: Chat;
  onSendMessage: (content: string) => Promise<void>;
  loading: boolean;
  onSummarizeDay: () => Promise<void>;
  onGetMotivation: () => Promise<void>;
  onGetImprovements: () => Promise<void>;
}

export const ChatWindow = ({
  chat,
  onSendMessage,
  loading,
  onSummarizeDay,
  onGetMotivation,
  onGetImprovements,
}: ChatWindowProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chat.messages]);

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {chat.messages.map((message, index) => {
          // Ensure we have a valid date
          const messageDate = new Date(message.timestamp);
          if (isNaN(messageDate.getTime())) {
            console.warn('Invalid date for message:', message);
            return null;
          }

          const isLastMessage = index === chat.messages.length - 1;
          const showLoading = loading && isLastMessage && message.sender === 'ai';

          return (
            <ChatMessage
              key={message._id}
              content={message.content}
              type={message.sender === 'ai' ? 'assistant' : 'user'}
              timestamp={messageDate}
              mood={message.mood}
              isLoading={showLoading}
            />
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-gray-200 bg-white">
        <div className="flex gap-2 mb-4">
          <Button
            variant="secondary"
            onClick={onSummarizeDay}
            className="flex-1"
            disabled={loading}
            isLoading={loading}
          >
            Summarize Day
          </Button>
          <Button
            variant="secondary"
            onClick={onGetMotivation}
            className="flex-1"
            disabled={loading}
            isLoading={loading}
          >
            Get Motivation
          </Button>
          <Button
            variant="secondary"
            onClick={onGetImprovements}
            className="flex-1"
            disabled={loading}
            isLoading={loading}
          >
            Weekly Improvements
          </Button>
        </div>

        <ChatInput onSend={onSendMessage} isLoading={loading} />
      </div>
    </div>
  );
}; 