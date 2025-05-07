export interface Chat {
  _id: string;
  title: string;
  messages: Message[];
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  _id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: string;
  mood?: 'happy' | 'sad' | 'neutral' | 'stressed' | 'excited';
} 