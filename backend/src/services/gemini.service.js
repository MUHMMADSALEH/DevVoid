import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { AppError } from '../middleware/errorHandler.js';

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

export class GeminiService {
  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    console.log('Initializing GeminiService with API key:', apiKey ? 'Present' : 'Missing');
    
    if (!apiKey) {
      throw new AppError('GEMINI_API_KEY is not configured', 500);
    }

    try {
      this.genAI = new GoogleGenerativeAI(apiKey);
      this.model = this.genAI.getGenerativeModel({ 
        model: 'gemini-2.0-flash',
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        },
        safetySettings: [
          {
            category: 'HARM_CATEGORY_HARASSMENT',
            threshold: 'BLOCK_MEDIUM_AND_ABOVE',
          },
          {
            category: 'HARM_CATEGORY_HATE_SPEECH',
            threshold: 'BLOCK_MEDIUM_AND_ABOVE',
          },
          {
            category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
            threshold: 'BLOCK_MEDIUM_AND_ABOVE',
          },
          {
            category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
            threshold: 'BLOCK_MEDIUM_AND_ABOVE',
          },
        ],
      });
      console.log('Gemini model initialized successfully');
    } catch (error) {
      console.error('Error initializing Gemini:', error);
      throw new AppError('Failed to initialize Gemini service', 500);
    }
  }

  async generateText(prompt) {
    console.log('Generating text with prompt:', prompt);
    try {
      const result = await this.model.generateContent({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
      });
      const response = await result.response;
      const text = response.text();
      console.log('Generated response:', text);
      return text;
    } catch (error) {
      console.error('Gemini API Error:', error);
      if (error.message?.includes('API key')) {
        throw new AppError('Invalid Gemini API key', 500);
      }
      throw new AppError('Failed to generate response from Gemini', 500);
    }
  }

  async generateResponse(userMessage) {
    console.log('Generating response for message:', userMessage);
    try {
      const prompt = `You are a supportive AI journaling companion. Your role is to help users reflect on their thoughts and experiences. 
      Respond to their journal entry in a thoughtful and empathetic way. Focus on:
      1. Acknowledging their feelings and experiences
      2. Asking relevant follow-up questions to encourage deeper reflection
      3. Offering gentle insights or observations
      4. Maintaining a supportive and non-judgmental tone
      
      User's journal entry: ${userMessage}`;
      
      const response = await this.generateText(prompt);
      console.log('Generated journal response:', response);
      return response;
    } catch (error) {
      console.error('Error generating response:', error);
      throw new AppError('Failed to generate AI response', 500);
    }
  }

  async analyzeMood(message) {
    console.log('Analyzing mood for message:', message);
    try {
      const prompt = `Analyze the emotional tone of this journal entry and respond with exactly one of these emotions: happy, sad, neutral, stressed, excited. 
      Consider the overall sentiment, key words, and emotional indicators in the text.
      
      Journal entry: ${message}`;
      
      const mood = await this.generateText(prompt);
      const normalizedMood = mood.toLowerCase().trim();
      
      // Validate mood
      const validMoods = ['happy', 'sad', 'neutral', 'stressed', 'excited'];
      if (!validMoods.includes(normalizedMood)) {
        console.log('Invalid mood detected, defaulting to neutral:', normalizedMood);
        return 'neutral';
      }
      
      console.log('Detected mood:', normalizedMood);
      return normalizedMood;
    } catch (error) {
      console.error('Error analyzing mood:', error);
      return 'neutral';
    }
  }

  async generateSummary(messages) {
    console.log('Generating summary for messages:', messages);
    try {
      if (!messages.length) {
        return 'No entries to summarize';
      }

      const prompt = `Generate a thoughtful summary of these journal entries. Focus on:
      1. Key themes and patterns
      2. Emotional journey
      3. Significant events or realizations
      4. Growth or changes observed
      
      Journal entries:
      ${messages.map(m => m.content).join('\n\n')}`;
      
      const summary = await this.generateText(prompt);
      console.log('Generated summary:', summary);
      return summary;
    } catch (error) {
      console.error('Error generating summary:', error);
      throw new AppError('Failed to generate journal summary', 500);
    }
  }

  async generateMotivation(messages) {
    console.log('Generating motivation for messages:', messages);
    try {
      if (!messages.length) {
        return 'No entries to analyze for motivation';
      }

      const prompt = `Based on these journal entries, provide motivational insights and encouragement. Focus on:
      1. Positive aspects and achievements
      2. Growth opportunities
      3. Encouraging words and support
      4. Actionable steps for moving forward
      
      Journal entries:
      ${messages.map(m => m.content).join('\n\n')}`;
      
      const motivation = await this.generateText(prompt);
      console.log('Generated motivation:', motivation);
      return motivation;
    } catch (error) {
      console.error('Error generating motivation:', error);
      throw new AppError('Failed to generate motivation', 500);
    }
  }

  async generateImprovements(messages) {
    console.log('Generating improvements for messages:', messages);
    try {
      if (!messages.length) {
        return 'No entries to analyze for improvements';
      }

      const prompt = `Based on these journal entries, suggest areas for improvement and growth. Focus on:
      1. Patterns that could be changed
      2. Healthy coping strategies
      3. Self-care suggestions
      4. Practical steps for personal development
      
      Journal entries:
      ${messages.map(m => m.content).join('\n\n')}`;
      
      const improvements = await this.generateText(prompt);
      console.log('Generated improvements:', improvements);
      return improvements;
    } catch (error) {
      console.error('Error generating improvements:', error);
      throw new AppError('Failed to generate improvements', 500);
    }
  }

  async generateInsights(messages) {
    console.log('Generating insights for messages:', messages);
    try {
      if (!messages.length) {
        return 'No entries to analyze';
      }

      const prompt = `Analyze these journal entries and provide meaningful insights. Consider:
      1. Patterns in thoughts or behaviors
      2. Potential areas for growth or change
      3. Strengths and coping mechanisms
      4. Suggestions for self-care or reflection
      
      Journal entries:
      ${messages.join('\n\n')}`;
      
      const insights = await this.generateText(prompt);
      console.log('Generated insights:', insights);
      return insights;
    } catch (error) {
      console.error('Error generating insights:', error);
      throw new AppError('Failed to generate journal insights', 500);
    }
  }
} 