import { format } from 'date-fns';
import { twMerge } from 'tailwind-merge';
import { Message } from '../../store/chat.store';

interface MessageBubbleProps {
  message: Message;
  className?: string;
}

export const MessageBubble = ({ message, className }: MessageBubbleProps) => {
  const isUser = message.sender === 'user';

  return (
    <div
      className={twMerge(
        'flex flex-col max-w-[80%]',
        isUser ? 'ml-auto' : 'mr-auto',
        className
      )}
    >
      <div
        className={twMerge(
          'rounded-lg px-4 py-2',
          isUser
            ? 'bg-primary-600 text-white'
            : 'bg-gray-100 text-gray-900'
        )}
      >
        <p className="text-sm">{message.content}</p>
      </div>
      <div className="flex items-center gap-2 mt-1">
        <span className="text-xs text-gray-500">
          {format(new Date(message.timestamp), 'h:mm a')}
        </span>
        {message.mood && (
          <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100">
            {message.mood}
          </span>
        )}
      </div>
    </div>
  );
}; 