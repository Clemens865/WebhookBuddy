import { useState, useCallback, useRef } from 'react';
import { VoiceRecorder, sendVoiceMessage } from '../services/voiceService';

interface RecordingStatus {
  success: boolean;
  message: string;
}

interface UseVoiceRecordingReturn {
  isRecording: boolean;
  isSending: boolean;
  recordingStatus: RecordingStatus | null;
  startRecording: () => Promise<void>;
  stopRecording: () => Promise<void>;
  cancelRecording: () => void;
  sendRecording: (channelId: number) => Promise<void>;
}

export function useVoiceRecording(): UseVoiceRecordingReturn {
  const [isRecording, setIsRecording] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [recordingStatus, setRecordingStatus] = useState<RecordingStatus | null>(null);
  const recorderRef = useRef<VoiceRecorder>(new VoiceRecorder());
  const audioRef = useRef<{
    blob: Blob;
    format: string;
    mimeType: string;
    duration: number;
    sampleRate: number;
    size: number;
  } | null>(null);

  // Start recording with high-quality audio settings
  const startRecording = useCallback(async () => {
    try {
      // Configure optimal audio settings for automation platforms
      const audioOptions = {
        format: 'webm', // Best compatibility with automation platforms
        sampleRate: 48000 // High-quality audio
      };
      
      const success = await recorderRef.current.startRecording(audioOptions);
      if (success) {
        setIsRecording(true);
        setRecordingStatus(null);
      } else {
        setRecordingStatus({
          success: false,
          message: 'Failed to start recording. Please check microphone permissions.'
        });
      }
    } catch (error) {
      console.error('Error starting recording:', error);
      setRecordingStatus({
        success: false,
        message: `Error starting recording: ${error instanceof Error ? error.message : String(error)}`
      });
    }
  }, []);

  // Stop recording and get enhanced audio metadata
  const stopRecording = useCallback(async () => {
    if (!isRecording) return;
    
    try {
      // Get audio data with enhanced metadata
      const audioData = await recorderRef.current.stopRecording();
      audioRef.current = audioData;
      
      // Log audio metadata for debugging
      console.log('Audio recorded successfully:', {
        format: audioData.format,
        mimeType: audioData.mimeType,
        duration: `${audioData.duration.toFixed(2)} seconds`,
        size: `${(audioData.size / 1024).toFixed(2)} KB`,
        sampleRate: `${audioData.sampleRate} Hz`
      });
      
      setIsRecording(false);
    } catch (error) {
      console.error('Error stopping recording:', error);
      setRecordingStatus({
        success: false,
        message: `Error stopping recording: ${error instanceof Error ? error.message : String(error)}`
      });
      setIsRecording(false);
    }
  }, [isRecording]);

  // Cancel recording
  const cancelRecording = useCallback(() => {
    if (!isRecording) return;
    
    recorderRef.current.cancelRecording();
    audioRef.current = null;
    setIsRecording(false);
    setRecordingStatus(null);
  }, [isRecording]);

  // Send recording with enhanced metadata for automation platforms
  const sendRecording = useCallback(async (channelId: number) => {
    if (!audioRef.current) {
      setRecordingStatus({
        success: false,
        message: 'No recording available to send.'
      });
      return;
    }
    
    setIsSending(true);
    try {
      // Show status message with audio details
      setRecordingStatus({
        success: true,
        message: `Sending audio (${(audioRef.current.size / 1024).toFixed(2)} KB, ${audioRef.current.duration.toFixed(1)}s)...`
      });
      
      // Send audio with enhanced metadata
      const result = await sendVoiceMessage(channelId, audioRef.current);
      setRecordingStatus(result);
      
      if (result.success) {
        // Clear the audio data after successful sending
        audioRef.current = null;
      }
    } catch (error) {
      console.error('Error sending voice message:', error);
      setRecordingStatus({
        success: false,
        message: `Error sending voice message: ${error instanceof Error ? error.message : String(error)}`
      });
    } finally {
      setIsSending(false);
    }
  }, []);

  return {
    isRecording,
    isSending,
    recordingStatus,
    startRecording,
    stopRecording,
    cancelRecording,
    sendRecording
  };
}
