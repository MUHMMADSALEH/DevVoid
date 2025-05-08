import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: [true, 'Message content is required'],
    },
    role: {
      type: String,
      enum: ['user', 'assistant'],
      required: true,
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
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Chat title is required'],
      trim: true,
    },
    messages: [messageSchema],
    summary: {
      type: String,
      default: '',
    },
    insights: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
chatSchema.index({ user: 1, createdAt: -1 });

export const Chat = mongoose.model('Chat', chatSchema); 