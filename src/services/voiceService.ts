import { db } from './db';
import { extractPageData } from './flowService';

// Define the data structure that will be sent to the webhook
interface VoiceWebhookPayload {
  // User information
  userId: string;
  userName: string;
  userEmail: string;
  userUrl?: string;
  userMission?: string;
  
  // Channel information
  channelId: number;
  channelName: string;
  
  // Page context
  pageData?: any;
  
  // Audio metadata (the actual binary file is sent separately in multipart request)
  audio: {
    data?: string; // Base64 encoded audio data (included for backward compatibility)
    mimeType: string;
    format: string; // 'webm', 'mp3', etc.
    sampleRate?: number;
    duration?: number; // in seconds
    size: number; // in bytes
    filename: string; // Filename used in the multipart request
  };
  
  // Request metadata
  timestamp: string;
  source: string; // 'yorizon-buddy-extension'
  version: string; // Extension version
  
  // Flag to indicate if this is a multipart request with binary audio
  binaryAudioAvailable: boolean;
}

// Class for handling voice recording
export class VoiceRecorder {
  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: Blob[] = [];
  private stream: MediaStream | null = null;
  
  private recordingStartTime: number = 0;
  private audioFormat: string = 'webm';
  private sampleRate: number = 48000;
  
  // Start recording with options
  async startRecording(options: { format?: string; sampleRate?: number } = {}): Promise<boolean> {
    try {
      // Set options
      this.audioFormat = options.format || 'webm';
      this.sampleRate = options.sampleRate || 48000;
      
      // Get user media (microphone) with specified constraints
      const constraints: MediaStreamConstraints = {
        audio: {
          sampleRate: this.sampleRate,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      };
      
      this.stream = await navigator.mediaDevices.getUserMedia(constraints);
      
      // Determine the mime type based on format
      const mimeType = this.getSupportedMimeType();
      
      // Create media recorder with options
      const recorderOptions = { mimeType };
      this.mediaRecorder = new MediaRecorder(this.stream, recorderOptions);
      this.audioChunks = [];
      this.recordingStartTime = Date.now();
      
      // Handle data available event
      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.audioChunks.push(event.data);
        }
      };
      
      // Start recording with 10ms timeslice for more frequent ondataavailable events
      this.mediaRecorder.start(10);
      return true;
    } catch (error) {
      console.error('Error starting recording:', error);
      return false;
    }
  }
  
  // Get supported mime type based on format
  private getSupportedMimeType(): string {
    const supportedTypes = [
      `audio/${this.audioFormat}`,
      `audio/${this.audioFormat};codecs=opus`,
      'audio/webm;codecs=opus',
      'audio/webm',
      'audio/ogg;codecs=opus',
      'audio/mp4;codecs=opus',
      'audio/mpeg'
    ];
    
    for (const type of supportedTypes) {
      if (MediaRecorder.isTypeSupported(type)) {
        return type;
      }
    }
    
    // Fallback to default
    return 'audio/webm';
  }

  // Stop recording and get audio data with metadata
  stopRecording(): Promise<{
    blob: Blob;
    format: string;
    mimeType: string;
    duration: number;
    sampleRate: number;
    size: number;
  }> {
    return new Promise((resolve, reject) => {
      if (!this.mediaRecorder) {
        reject(new Error('No recording in progress'));
        return;
      }
      
      this.mediaRecorder.onstop = () => {
        // Calculate duration in seconds
        const duration = (Date.now() - this.recordingStartTime) / 1000;
        
        // Create blob from audio chunks
        const mimeType = this.mediaRecorder?.mimeType || `audio/${this.audioFormat}`;
        const audioBlob = new Blob(this.audioChunks, { type: mimeType });
        
        // Clean up
        this.audioChunks = [];
        if (this.stream) {
          this.stream.getTracks().forEach(track => track.stop());
          this.stream = null;
        }
        
        // Resolve with audio data and metadata
        resolve({
          blob: audioBlob,
          format: this.audioFormat,
          mimeType: mimeType,
          duration: duration,
          sampleRate: this.sampleRate,
          size: audioBlob.size
        });
      };
      
      this.mediaRecorder.stop();
    });
  }
  
  // Cancel recording
  cancelRecording(): void {
    if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
      this.mediaRecorder.stop();
    }
    
    this.audioChunks = [];
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }
  }
  
  // Get recording state
  isRecording(): boolean {
    return this.mediaRecorder !== null && this.mediaRecorder.state === 'recording';
  }
}

// Extension version
const EXTENSION_VERSION = '1.3.0';

// Function to send voice message
export async function sendVoiceMessage(
  channelId: number,
  audioData: {
    blob: Blob;
    format: string;
    mimeType: string;
    duration: number;
    sampleRate: number;
    size: number;
  }
): Promise<{ success: boolean; message: string }> {
  try {
    // Get the channel details
    const channel = await db.getVoiceChannelById(channelId);
    if (!channel) {
      return { success: false, message: 'Channel not found' };
    }
    
    // Get the user details
    const user = await db.getUser();
    if (!user) {
      return { success: false, message: 'User information not found. Please set up your user profile.' };
    }
    
    // Convert blob to base64
    const base64Audio = await blobToBase64(audioData.blob);
    
    // Generate a unique filename for the audio
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `voice_message_${timestamp}.${audioData.format}`;
    
    // Try to extract page data (if in a browser context)
    let pageData;
    try {
      pageData = await extractPageData();
    } catch (error) {
      console.log('Page data extraction not available or failed:', error);
      // Continue without page data
    }
    
    // Prepare the payload
    const payload: VoiceWebhookPayload = {
      userId: user.id?.toString() || 'unknown',
      userName: user.name,
      userEmail: user.email,
      userUrl: user.url,
      userMission: user.missionStatement,
      channelId: channel.id || 0,
      channelName: channel.name,
      pageData,
      audio: {
        data: base64Audio, // Include base64 for backward compatibility
        mimeType: audioData.mimeType,
        format: audioData.format,
        sampleRate: audioData.sampleRate,
        duration: audioData.duration,
        size: audioData.size,
        filename: filename
      },
      timestamp: new Date().toISOString(),
      source: 'yorizon-buddy-extension',
      version: EXTENSION_VERSION,
      binaryAudioAvailable: true // Flag indicating binary audio is available in multipart request
    };
    
    // Prepare form data for multipart request (better for binary data)
    const formData = new FormData();
    
    // Add the audio file as binary data
    const audioFile = new File([audioData.blob], payload.audio.filename, { 
      type: audioData.mimeType 
    });
    formData.append('audio', audioFile);
    
    // Add metadata as JSON
    const metadataBlob = new Blob([JSON.stringify(payload)], { type: 'application/json' });
    formData.append('metadata', metadataBlob);
    
    // Add user data as separate fields for easier access in Make.com
    formData.append('userName', user.name);
    formData.append('userEmail', user.email);
    formData.append('userUrl', user.url || '');
    formData.append('userMission', user.missionStatement || '');
    formData.append('userId', user.id?.toString() || 'unknown');
    
    // Log what we're sending for debugging
    console.log('Sending voice message to webhook:', channel.webhookUrl);
    console.log('User data included:', {
      userName: user.name,
      userEmail: user.email,
      userUrl: user.url || '',
      userMission: user.missionStatement || '',
      userId: user.id?.toString() || 'unknown'
    });
    
    // Send the data to the webhook as multipart/form-data
    const response = await fetch(channel.webhookUrl, {
      method: 'POST',
      // No need to set Content-Type header as it's automatically set with boundary
      body: formData,
    });
    
    // Log response for debugging
    console.log('Webhook response status:', response.status);
    let responseText = '';
    try {
      responseText = await response.text();
      console.log('Webhook response:', responseText);
    } catch (e) {
      console.log('Could not read response text:', e);
    }
    
    if (!response.ok) {
      throw new Error(`Webhook responded with status: ${response.status} - ${responseText}`);
    }
    
    // Log the execution
    console.log(`Voice message sent successfully to channel ${channel.name}`);
    
    return { 
      success: true, 
      message: `Voice message sent successfully to channel "${channel.name}"` 
    };
  } catch (error) {
    console.error('Error sending voice message:', error);
    return { 
      success: false, 
      message: `Error sending voice message: ${error instanceof Error ? error.message : String(error)}` 
    };
  }
}

// Helper function to convert blob to base64
function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      // Remove the data URL prefix (e.g., "data:audio/webm;base64,")
      const base64Data = base64String.split(',')[1];
      resolve(base64Data);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}
