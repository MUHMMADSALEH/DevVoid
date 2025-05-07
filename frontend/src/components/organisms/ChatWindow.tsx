import { ChatInput } from '../molecules/ChatInput';
import { ChatMessage } from '../molecules/ChatMessage';
import { Button } from '../atoms/Button';

interface Chat {
  _id: string;
  title: string;
  messages: Message[];
  createdAt: string;
  updatedAt: string;
}

interface Message {
  _id: string;
  content: string;
  type: 'user' | 'assistant';
  createdAt: string;
  mood?: 'happy' | 'sad' | 'neutral' | 'stressed' | 'excited';
}

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
  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {chat.messages.map((message) => (
          <ChatMessage
            key={message._id}
            content={message.content}
            type={message.type}
            timestamp={new Date(message.createdAt)}
            mood={message.mood}
          />
        ))}
      </div>

      <div className="p-4 border-t border-gray-200 bg-white">
        <div className="flex gap-2 mb-4">
          <Button
            variant="secondary"
            onClick={onSummarizeDay}
            className="flex-1"
            disabled={loading}
          >
            Summarize Day
          </Button>
          <Button
            variant="secondary"
            onClick={onGetMotivation}
            className="flex-1"
            disabled={loading}
          >
            Get Motivation
          </Button>
          <Button
            variant="secondary"
            onClick={onGetImprovements}
            className="flex-1"
            disabled={loading}
          >
            Weekly Improvements
          </Button>
        </div>

        <ChatInput onSend={onSendMessage} isLoading={loading} />
      </div>
    </div>
  );
}; 