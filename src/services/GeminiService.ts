// Agriculture-specific system prompt
const SYSTEM_PROMPT = `You are KisaanGPT, an agricultural assistant for Indian farmers and gardeners. 
Your expertise covers:
- Crop selection and rotation strategies
- Soil health and preparation
- Pest and disease management
- Sustainable farming practices
- Weather patterns and climate adaptation
- Irrigation techniques
- Organic and traditional farming methods
- Modern agricultural technology
- Government schemes and subsidies for farmers

Provide helpful, clear, and practical advice for agricultural questions.
Keep your responses concise but informative, emphasizing sustainable practices when possible.
You're especially knowledgeable about Indian agriculture and local farming conditions.
When appropriate, mention both traditional knowledge and modern scientific approaches.
Always prioritize farmer safety and environmental sustainability in your recommendations.`;

// API key for Gemini API
const API_KEY = "AIzaSyCG_5ycSxht1fPmNPOhVwfGXeTc5IYCFE0";

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface GeminiPart {
  text: string;
}

interface GeminiMessage {
  role: string;
  parts: GeminiPart[];
}

interface GeminiRequest {
  contents?: GeminiMessage[];
  systemInstruction?: {
    parts: {
      text: string;
    }[]
  };
  generationConfig?: {
    temperature: number;
    topK: number;
    topP: number;
    maxOutputTokens: number;
  };
}

export class GeminiService {
  async generateResponse(messages: ChatMessage[]): Promise<string> {
    try {
      console.log("Sending messages to Gemini:", JSON.stringify(messages));
      
      // URL for the Gemini API
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${API_KEY}`;
      
      // Format messages for Gemini API
      const formattedMessages = messages
        .filter(msg => msg.role !== 'system')
        .map(msg => ({
          role: msg.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: msg.content }]
        }));
      
      // Create the request payload
      const requestData: GeminiRequest = {
        contents: formattedMessages,
        systemInstruction: {
          parts: [{ text: SYSTEM_PROMPT }]
        },
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024
        }
      };
      
      // Make the API request
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
      });
      
      // Parse the response
      const data = await response.json();
      console.log("Gemini API response:", data);
      
      // Check for errors
      if (!response.ok) {
        console.error("API Error:", data.error);
        if (data.error?.message) {
          if (data.error.message.includes("API key")) {
            return "Sorry, there's an issue with the API key. Please contact support.";
          } else if (data.error.message.includes("quota") || data.error.message.includes("rate")) {
            return "Sorry, we've reached the API rate limit. Please try again in a few minutes.";
          }
        }
        return "Sorry, I encountered an error. Please try again later.";
      }
      
      // Extract and return the text response
      const textResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
      return textResponse;
    } catch (error: any) {
      console.error("Error generating response:", error);
      if (error.message) {
        console.error("Error message:", error.message);
      }
      
      return "Sorry, I encountered an error. Please try again later.";
    }
  }
}

// Export a singleton instance
export const geminiService = new GeminiService();