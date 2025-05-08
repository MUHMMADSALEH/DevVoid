import { format } from 'date-fns';
import { motion } from 'framer-motion';

interface ChatMessageProps {
  content: string;
  type: 'user' | 'assistant';
  timestamp: Date;
  mood?: 'happy' | 'sad' | 'neutral' | 'stressed' | 'excited';
  isLoading?: boolean;
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

export const ChatMessage = ({ content, type, timestamp, mood, isLoading }: ChatMessageProps) => {
  const isUser = type === 'user';
  const moodEmoji = mood ? moodEmojis[mood] : null;
  const moodLabel = mood ? moodLabels[mood] : null;

  // Ensure we have a valid date
  const messageDate = timestamp instanceof Date && !isNaN(timestamp.getTime())
    ? timestamp
    : new Date(timestamp);

  return (
    <motion.div 
      className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      <motion.div
        className={`max-w-[70%] rounded-lg p-3 ${
          isUser
            ? 'bg-[#FFD600] text-[#3B2F1E]'
            : 'bg-white text-gray-800 border border-gray-200'
        }`}
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.2 }}
      >
        <div className="flex items-start gap-2">
          {!isUser && moodEmoji && (
            <motion.div 
              className="flex flex-col items-center"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <span className="text-xl" role="img" aria-label={`Mood: ${mood}`}>
                {moodEmoji}
              </span>
              <span className="text-xs text-gray-500 mt-1">{moodLabel}</span>
            </motion.div>
          )}
          <div className="flex-1">
            {isLoading ? (
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            ) : (
              <motion.div 
                className="whitespace-pre-wrap"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                {content}
              </motion.div>
            )}
            <motion.div 
              className="flex items-center justify-between mt-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div
                className={`text-xs ${
                  isUser ? 'text-[#3B2F1E]/70' : 'text-gray-500'
                }`}
              >
                {format(messageDate, 'h:mm a')}
              </div>
              {isUser && moodEmoji && (
                <motion.div 
                  className="flex items-center gap-1"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <span className="text-xs text-gray-500">{moodLabel}</span>
                  <span className="text-xl" role="img" aria-label={`Mood: ${mood}`}>
                    {moodEmoji}
                  </span>
                </motion.div>
              )}
            </motion.div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}; 