import { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { ChatMessage, ChatAttachment, sendChatMessage, createImageThumbnail } from '../services/agentService';

interface UseChatMessagesReturn {
  messages: ChatMessage[];
  isLoading: boolean;
  error: string | null;
  sendMessage: (agentId: number, text: string, files?: File[]) => Promise<void>;
  clearMessages: () => void;
}

export function useChatMessages(): UseChatMessagesReturn {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Send a message to the agent
  const sendMessage = useCallback(async (agentId: number, text: string, files: File[] = []) => {
    if (!text.trim() && files.length === 0) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Process file attachments
      const attachments: ChatAttachment[] = [];
      
      for (const file of files) {
        const fileData = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            const base64 = (reader.result as string).split(',')[1];
            resolve(base64);
          };
          reader.readAsDataURL(file);
        });
        
        // Create thumbnail for images
        let thumbnailData: string | undefined = undefined;
        if (file.type.startsWith('image/')) {
          const thumbnail = await createImageThumbnail(file);
          if (thumbnail) thumbnailData = thumbnail;
        }
        
        attachments.push({
          id: uuidv4(),
          name: file.name,
          type: file.type,
          size: file.size,
          data: fileData,
          thumbnailData
        });
      }
      
      // Add user message to chat
      const userMessage: ChatMessage = {
        id: uuidv4(),
        text,
        timestamp: new Date(),
        sender: 'user',
        attachments
      };
      
      setMessages(prev => [...prev, userMessage]);
      
      // Send message to agent
      const result = await sendChatMessage(agentId, text, files);
      
      if (result.success) {
        // If we received a response, add it to the chat
        if (result.response) {
          let responseText = '';
          
          // Handle different response formats
          if (typeof result.response === 'string') {
            responseText = result.response;
          } else if (typeof result.response === 'object') {
            // Try to extract message from common API response formats
            if (result.response.message) {
              responseText = result.response.message;
            } else if (result.response.text) {
              responseText = result.response.text;
            } else if (result.response.content) {
              responseText = result.response.content;
            } else {
              // Fallback to JSON string
              responseText = JSON.stringify(result.response, null, 2);
            }
          }
          
          // Add agent response to chat
          const agentMessage: ChatMessage = {
            id: uuidv4(),
            text: responseText,
            timestamp: new Date(),
            sender: 'agent'
          };
          
          setMessages(prev => [...prev, agentMessage]);
        }
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError(`Error sending message: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Clear all messages
  const clearMessages = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    clearMessages
  };
}
