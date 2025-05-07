import { format } from 'date-fns';

interface ChatMessageProps {
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  mood?: string;
}

const moodEmojis: Record<string, string> = {
  happy: '😊',
  sad: '😢',
  neutral: '😐',
  stressed: '😰',
  excited: '🎉',
};

const moodLabels: Record<string, string> = {
  happy: 'Feeling Happy',
  sad: 'Feeling Sad',
  neutral: 'Feeling Neutral',
  stressed: 'Feeling Stressed',
  excited: 'Feeling Excited',
};

export const ChatMessage = ({ content, sender, timestamp, mood }: ChatMessageProps) => {
  const isUser = sender === 'user';
  const moodEmoji = mood ? moodEmojis[mood] : null;
  const moodLabel = mood ? moodLabels[mood] : null;

  return (
    <div
      className={`flex ${
        isUser ? 'justify-end' : 'justify-start'
      }`}
    >
      <div
        className={`max-w-[80%] rounded-lg p-4 ${
          isUser
            ? 'bg-[#FFD600] text-[#3B2F1E]'
            : 'bg-gray-100 text-gray-800'
        }`}
      >
        <div className="flex items-start gap-2">
          {!isUser && moodEmoji && (
            <div className="flex flex-col items-center">
              <span className="text-xl" role="img" aria-label={`Mood: ${mood}`}>
                {moodEmoji}
              </span>
              <span className="text-xs text-gray-500 mt-1">{moodLabel}</span>
            </div>
          )}
          <div className="flex-1">
            <div className="whitespace-pre-wrap">{content}</div>
            <div className="flex items-center justify-between mt-1">
              <div
                className={`text-xs ${
                  isUser ? 'text-[#3B2F1E]/70' : 'text-gray-500'
                }`}
              >
                {format(new Date(timestamp), 'h:mm a')}
              </div>
              {isUser && moodEmoji && (
                <div className="flex items-center gap-1">
                  <span className="text-xs text-gray-500">{moodLabel}</span>
                  <span className="text-xl" role="img" aria-label={`Mood: ${mood}`}>
                    {moodEmoji}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 