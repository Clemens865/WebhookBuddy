import { useState, useEffect, useCallback } from 'react';
import { db, VoiceChannel } from '../services/db';

interface VoiceChannelFormData {
  name: string;
  webhookUrl: string;
}

interface UseVoiceChannelManagementReturn {
  channels: VoiceChannel[];
  selectedChannel: number | null;
  isEditingChannel: boolean;
  channelDialogOpen: boolean;
  newChannel: VoiceChannelFormData;
  setSelectedChannel: (id: number | null) => void;
  setChannelDialogOpen: (open: boolean) => void;
  setNewChannel: (channel: VoiceChannelFormData) => void;
  setIsEditingChannel: (isEditing: boolean) => void;
  handleChannelSubmit: () => Promise<void>;
  handleChannelEdit: (channel: VoiceChannel) => void;
  handleChannelDelete: (id: number) => Promise<void>;
  handleChannelInfo: (channel: VoiceChannel) => void;
}

export function useVoiceChannelManagement(): UseVoiceChannelManagementReturn {
  const [channels, setChannels] = useState<VoiceChannel[]>([]);
  const [selectedChannel, setSelectedChannel] = useState<number | null>(null);
  const [isEditingChannel, setIsEditingChannel] = useState(false);
  const [channelDialogOpen, setChannelDialogOpen] = useState(false);
  const [newChannel, setNewChannel] = useState<VoiceChannelFormData>({
    name: '',
    webhookUrl: ''
  });

  // Load voice channels
  useEffect(() => {
    const loadChannels = async () => {
      try {
        const allChannels = await db.getVoiceChannels();
        setChannels(allChannels);
      } catch (error) {
        console.error('Error loading voice channels:', error);
      }
    };

    loadChannels();
  }, []);

  // Handle channel submission (create or update)
  const handleChannelSubmit = useCallback(async () => {
    if (!newChannel.name.trim()) return;

    try {
      if (isEditingChannel && selectedChannel) {
        await db.updateVoiceChannel(selectedChannel, {
          ...newChannel
        });
      } else {
        await db.createVoiceChannel({
          ...newChannel
        });
      }

      // Refresh channels
      const updatedChannels = await db.getVoiceChannels();
      setChannels(updatedChannels);
      
      // Reset form and close dialog
      setNewChannel({ name: '', webhookUrl: '' });
      setChannelDialogOpen(false);
    } catch (error) {
      console.error('Error saving voice channel:', error);
    }
  }, [newChannel, isEditingChannel, selectedChannel]);

  // Handle channel edit
  const handleChannelEdit = useCallback((channel: VoiceChannel) => {
    setIsEditingChannel(true);
    setNewChannel({
      name: channel.name,
      webhookUrl: channel.webhookUrl
    });
    setChannelDialogOpen(true);
  }, []);

  // Handle channel delete
  const handleChannelDelete = useCallback(async (id: number) => {
    try {
      await db.deleteVoiceChannel(id);
      
      // If the deleted channel was selected, deselect it
      if (selectedChannel === id) {
        setSelectedChannel(null);
      }
      
      // Refresh channels
      const updatedChannels = await db.getVoiceChannels();
      setChannels(updatedChannels);
    } catch (error) {
      console.error('Error deleting voice channel:', error);
    }
  }, [selectedChannel]);

  // Handle channel info
  const handleChannelInfo = useCallback((channel: VoiceChannel) => {
    // For now, just log the channel info
    console.log('Channel Info:', channel);
    // In a real app, you might show a modal with more details
  }, []);

  return {
    channels,
    selectedChannel,
    isEditingChannel,
    channelDialogOpen,
    newChannel,
    setSelectedChannel,
    setChannelDialogOpen,
    setNewChannel,
    setIsEditingChannel,
    handleChannelSubmit,
    handleChannelEdit,
    handleChannelDelete,
    handleChannelInfo
  };
}
