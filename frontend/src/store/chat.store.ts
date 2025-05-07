import { create } from 'zustand';

export interface Message {
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  mood?: string;
}

export interface Chat {
  _id: string;
  userId: string;
  messages: Message[];
  summary?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface ChatState {
  chats: Chat[];
  currentChat: Chat | null;
  loading: boolean;
  error: string | null;
  setChats: (chats: Chat[]) => void;
  setCurrentChat: (chat: Chat | null) => void;
  addMessage: (chatId: string, message: Message) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useChatStore = create<ChatState>((set) => ({
  chats: [],
  currentChat: null,
  loading: false,
  error: null,
  setChats: (chats) => set({ chats }),
  setCurrentChat: (chat) => set({ currentChat: chat }),
  addMessage: (chatId, message) =>
    set((state) => ({
      chats: state.chats.map((chat) =>
        chat._id === chatId
          ? { ...chat, messages: [...chat.messages, message] }
          : chat
      ),
      currentChat:
        state.currentChat?._id === chatId
          ? {
              ...state.currentChat,
              messages: [...state.currentChat.messages, message],
            }
          : state.currentChat,
    })),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
})); 