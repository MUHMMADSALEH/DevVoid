import mongoose, { Document, Schema } from 'mongoose';

export interface IMessage {
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  mood?: string;
}

export interface IChat extends Document {
  userId: mongoose.Types.ObjectId;
  messages: IMessage[];
  summary?: string;
  createdAt: Date;
  updatedAt: Date;
}

const messageSchema = new Schema<IMessage>({
  content: {
    type: String,
    required: true,
  },
  sender: {
    type: String,
    enum: ['user', 'ai'],
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  mood: {
    type: String,
    enum: ['happy', 'sad', 'neutral', 'stressed', 'excited'],
    required: false,
  },
});

const chatSchema = new Schema<IChat>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    messages: [messageSchema],
    summary: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient querying
chatSchema.index({ userId: 1, createdAt: -1 });

export const Chat = mongoose.model<IChat>('Chat', chatSchema); 