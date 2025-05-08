import { useState } from 'react';
import { Button } from '../atoms/Button';

interface ChatInputProps {
  onSend: (content: string) => Promise<void>;
  isLoading: boolean;
}

export const ChatInput = ({ onSend, isLoading }: ChatInputProps) => {
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || isLoading) return;

    try {
      await onSend(message.trim());
      setMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 px-2">
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder={isLoading ? "AI is thinking..." : "Type your message..."}
        className={`flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#FFD600] focus:border-transparent transition-all duration-200 ${
          isLoading ? 'opacity-50 cursor-not-allowed' : ''
        }`}
        disabled={isLoading}
      />
      <Button
        type="submit"
        variant="primary"
        disabled={!message.trim() || isLoading}
        isLoading={isLoading}
        className="whitespace-nowrap"
      >
        Send
      </Button>
    </form>
  );
}; 