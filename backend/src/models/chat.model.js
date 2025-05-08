import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: () => new Date().getTime().toString(),
    },
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
      type: String,
      default: () => new Date().toISOString(),
    },
    mood: {
      type: String,
      enum: ['happy', 'sad', 'neutral', 'stressed', 'excited'],
      default: 'neutral',
    },
  },
  {
    timestamps: true,
  }
);

const chatSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: true,
      default: 'New Chat',
      trim: true,
      maxlength: [100, 'Title cannot be more than 100 characters'],
    },
    messages: [messageSchema],
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
chatSchema.index({ userId: 1, createdAt: -1 });

export const Chat = mongoose.model('Chat', chatSchema); 