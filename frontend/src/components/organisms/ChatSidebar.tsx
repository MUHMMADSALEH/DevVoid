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
}

interface ChatSidebarProps {
  chats: Chat[];
  currentChat: Chat | null;
  onSelectChat: (chat: Chat) => void;
  onCreateChat: () => Promise<void>;
}

export const ChatSidebar = ({
  chats,
  currentChat,
  onSelectChat,
  onCreateChat,
}: ChatSidebarProps) => {
  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-xl font-bold text-[#3B2F1E] mb-4">Chats</h2>
        <Button
          variant="primary"
          onClick={onCreateChat}
          className="w-full"
        >
          New Chat
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {chats.map((chat) => (
          <button
            key={chat._id}
            onClick={() => onSelectChat(chat)}
            className={`w-full text-left p-3 rounded-lg transition-colors ${
              currentChat?._id === chat._id
                ? 'bg-[#FFD600] text-[#3B2F1E]'
                : 'hover:bg-gray-100 text-gray-700'
            }`}
          >
            <div className="text-sm font-medium truncate">
              {chat.title || 'New Chat'}
            </div>
            <div className="text-xs text-gray-500 truncate">
              {chat.messages[0]?.content || 'No messages yet'}
            </div>
            <div className="text-xs text-gray-400 mt-1">
              {new Date(chat.createdAt).toLocaleDateString()}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}; 