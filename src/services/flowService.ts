import { db } from './db';

// Define the data structure that will be sent to the webhook
interface WebhookPayload {
  userId: string;
  userName: string;
  userEmail: string;
  userUrl?: string;
  userMission?: string;
  flowId: string;
  flowName: string;
  pageData: PageData;
  timestamp: string;
  prompt?: {
    name: string;
    systemPrompt: string;
    userPrompt: string;
  };
}

// Define the structure for page data
interface PageData {
  url: string;
  title: string;
  metaTags: Array<{ name: string; content: string }>;
  headings: Array<{ level: string; text: string }>;
  paragraphs: string[];
  selectedText?: string;
}

// Function to extract data from the current page
export async function extractPageData(): Promise<PageData> {
  // Get the active tab to extract data from
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  
  if (!tab || !tab.id) {
    throw new Error('No active tab found');
  }
  
  // Execute script in the active tab to extract data
  const result = await chrome.tabs.sendMessage(tab.id, { action: 'extractData' });
  
  if (!result || !result.success) {
    throw new Error('Failed to extract data from page');
  }
  
  return result.data;
}

// Function to execute a flow
export async function executeFlow(flowId: number): Promise<{ success: boolean; message: string }> {
  try {
    // Get the flow details
    const flow = await db.getFlowById(flowId);
    if (!flow) {
      return { success: false, message: 'Flow not found' };
    }
    
    // Get the user details
    const user = await db.getUser();
    if (!user) {
      return { success: false, message: 'User information not found. Please set up your user profile.' };
    }
    
    // Extract data from the current page
    const pageData = await extractPageData();
    
    // Prepare the payload
    const payload: WebhookPayload = {
      userId: user.id?.toString() || 'unknown',
      userName: user.name,
      userEmail: user.email,
      userUrl: user.url,
      userMission: user.missionStatement,
      flowId: flow.uuid,
      flowName: flow.name,
      pageData,
      timestamp: new Date().toISOString()
    };
    
    // Add prompt data if the flow has an associated prompt
    if (flow.promptId) {
      const prompt = await db.getPromptById(flow.promptId);
      if (prompt) {
        payload.prompt = {
          name: prompt.name,
          systemPrompt: prompt.systemPrompt,
          userPrompt: prompt.userPrompt
        };
      }
    }
    
    // Send the data to the webhook
    const response = await fetch(flow.webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    
    if (!response.ok) {
      throw new Error(`Webhook responded with status: ${response.status}`);
    }
    
    // Log the execution
    console.log(`Flow ${flow.name} executed successfully`);
    
    return { 
      success: true, 
      message: `Flow "${flow.name}" executed successfully. Data sent to ${flow.webhookUrl}` 
    };
  } catch (error) {
    console.error('Error executing flow:', error);
    return { 
      success: false, 
      message: `Error executing flow: ${error instanceof Error ? error.message : String(error)}` 
    };
  }
}
