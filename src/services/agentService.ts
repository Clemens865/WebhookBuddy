import { db } from './db';
import { extractPageData } from './flowService';

// Define the data structure for a chat message
export interface ChatMessage {
  id: string;
  text: string;
  timestamp: Date;
  sender: 'user' | 'agent';
  attachments?: ChatAttachment[];
}

// Define the data structure for a file attachment
export interface ChatAttachment {
  id: string;
  name: string;
  type: string;
  size: number;
  data: string; // Base64 encoded data
  thumbnailData?: string; // Base64 encoded thumbnail for images
}

// Define the data structure that will be sent to the webhook
interface AgentWebhookPayload {
  // User information
  userId: string;
  userName: string;
  userEmail: string;
  userUrl?: string;
  userMission?: string;
  
  // Agent information
  agentId: number;
  agentName: string;
  
  // Message content
  message: string;
  
  // Page context
  pageData?: any;
  
  // Attachments
  attachments?: {
    count: number;
    files: {
      name: string;
      type: string;
      size: number;
      data: string; // Base64 encoded data
    }[];
  };
  
  // Request metadata
  timestamp: string;
  source: string; // 'yorizon-buddy-extension'
  version: string; // Extension version
  
  // Flag to indicate if this is a multipart request with binary files
  binaryFilesAvailable: boolean;
}

// Extension version
const EXTENSION_VERSION = '1.3.0';

// Function to send a chat message to an agent
export async function sendChatMessage(
  agentId: number,
  message: string,
  attachments: File[] = []
): Promise<{ success: boolean; message: string; response?: any }> {
  try {
    // Get the agent details
    const agent = await db.getAgentById(agentId);
    if (!agent) {
      return { success: false, message: 'Agent not found' };
    }
    
    // Get the user details
    const user = await db.getUser();
    if (!user) {
      return { success: false, message: 'User information not found. Please set up your user profile.' };
    }
    
    // Process attachments
    const processedAttachments = await Promise.all(
      attachments.map(async (file) => ({
        name: file.name,
        type: file.type,
        size: file.size,
        data: await fileToBase64(file)
      }))
    );
    
    // Try to extract page data (if in a browser context)
    let pageData;
    try {
      pageData = await extractPageData();
    } catch (error) {
      console.log('Page data extraction not available or failed:', error);
      // Continue without page data
    }
    
    // Prepare the payload
    const payload: AgentWebhookPayload = {
      userId: user.id?.toString() || 'unknown',
      userName: user.name,
      userEmail: user.email,
      userUrl: user.url,
      userMission: user.missionStatement,
      agentId: agent.id || 0,
      agentName: agent.name,
      message,
      pageData,
      timestamp: new Date().toISOString(),
      source: 'yorizon-buddy-extension',
      version: EXTENSION_VERSION,
      binaryFilesAvailable: attachments.length > 0
    };
    
    // Add attachments if any
    if (processedAttachments.length > 0) {
      payload.attachments = {
        count: processedAttachments.length,
        files: processedAttachments
      };
    }
    
    // Prepare form data for multipart request if there are attachments
    let requestBody: string | FormData;
    let headers: Record<string, string>;
    
    if (attachments.length > 0) {
      // Use FormData for multipart request
      const formData = new FormData();
      
      // Add each attachment as a binary file
      attachments.forEach((file, index) => {
        formData.append(`file${index}`, file, file.name);
      });
      
      // Add metadata as JSON
      const metadataBlob = new Blob([JSON.stringify(payload)], { type: 'application/json' });
      formData.append('metadata', metadataBlob);
      
      requestBody = formData;
      headers = {}; // Content-Type is automatically set with boundary
    } else {
      // Use JSON for simple requests
      requestBody = JSON.stringify(payload);
      headers = {
        'Content-Type': 'application/json'
      };
    }
    
    // Send the data to the webhook
    const response = await fetch(agent.webhookUrl, {
      method: 'POST',
      headers,
      body: requestBody
    });
    
    if (!response.ok) {
      throw new Error(`Webhook responded with status: ${response.status}`);
    }
    
    // Parse the response if it's JSON
    let responseData;
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      responseData = await response.json();
    } else {
      responseData = await response.text();
    }
    
    // Log the execution
    console.log(`Message sent successfully to agent ${agent.name}`);
    
    return { 
      success: true, 
      message: `Message sent successfully to agent "${agent.name}"`,
      response: responseData
    };
  } catch (error) {
    console.error('Error sending message:', error);
    return { 
      success: false, 
      message: `Error sending message: ${error instanceof Error ? error.message : String(error)}` 
    };
  }
}

// Helper function to convert file to base64
function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      // Remove the data URL prefix (e.g., "data:image/png;base64,")
      const base64Data = base64String.split(',')[1];
      resolve(base64Data);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// Helper function to create a thumbnail for image files
export async function createImageThumbnail(file: File, maxWidth = 100, maxHeight = 100): Promise<string | null> {
  if (!file.type.startsWith('image/')) {
    return null;
  }
  
  return new Promise((resolve, reject) => {
    const img = new Image();
    const reader = new FileReader();
    
    reader.onload = (e) => {
      img.src = e.target?.result as string;
      
      img.onload = () => {
        // Calculate thumbnail dimensions
        let width = img.width;
        let height = img.height;
        
        if (width > height) {
          if (width > maxWidth) {
            height = Math.round(height * maxWidth / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round(width * maxHeight / height);
            height = maxHeight;
          }
        }
        
        // Create canvas and draw image
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Could not get canvas context'));
          return;
        }
        
        ctx.drawImage(img, 0, 0, width, height);
        
        // Get base64 data
        const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
        const base64Data = dataUrl.split(',')[1];
        resolve(base64Data);
      };
      
      img.onerror = () => {
        reject(new Error('Error loading image'));
      };
    };
    
    reader.onerror = () => {
      reject(new Error('Error reading file'));
    };
    
    reader.readAsDataURL(file);
  });
}
