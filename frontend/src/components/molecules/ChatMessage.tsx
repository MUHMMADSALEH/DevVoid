import { format } from 'date-fns';

interface ChatMessageProps {
  content: string;
  type: 'user' | 'assistant';
  timestamp: Date;
  mood?: 'happy' | 'sad' | 'neutral' | 'stressed' | 'excited';
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

export const ChatMessage = ({ content, type, timestamp, mood }: ChatMessageProps) => {
  const isUser = type === 'user';
  const moodEmoji = mood ? moodEmojis[mood] : null;
  const moodLabel = mood ? moodLabels[mood] : null;

  // Ensure we have a valid date
  const messageDate = timestamp instanceof Date && !isNaN(timestamp.getTime())
    ? timestamp
    : new Date(timestamp);

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[70%] rounded-lg p-3 ${
          isUser
            ? 'bg-[#FFD600] text-[#3B2F1E]'
            : 'bg-white text-gray-800 border border-gray-200'
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
                {format(messageDate, 'h:mm a')}
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