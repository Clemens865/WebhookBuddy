import React from 'react';
import { Microphone, StopCircle, PaperPlaneTilt, X, Info, Plus, PencilSimple, Trash } from 'phosphor-react';
import { Button } from '../../../components/ui/Button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from '../../../components/ui/Dialog';
import { Input } from '../../../components/ui/Input';
import { Label } from '../../../components/ui/Label';
import { useVoiceChannelManagement } from '../../../hooks/useVoiceChannelManagement';
import { useVoiceRecording } from '../../../hooks/useVoiceRecording';
// Using VoiceChannel type from the hook

const VoiceChannelSection: React.FC = () => {
  const {
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
  } = useVoiceChannelManagement();

  const {
    isRecording,
    isSending,
    recordingStatus,
    recordingTimeLeft,
    startRecording,
    stopRecording,
    cancelRecording,
    sendRecording
  } = useVoiceRecording();

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Voice Channels</h2>
        <Dialog open={channelDialogOpen} onOpenChange={setChannelDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center space-x-1"
              onClick={() => {
                setIsEditingChannel(false);
                setNewChannel({ name: '', webhookUrl: '' });
              }}
            >
              <Plus size={16} />
              <span>Add</span>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{isEditingChannel ? 'Edit Channel' : 'Create Channel'}</DialogTitle>
              <DialogDescription>
                {isEditingChannel ? 'Update an existing voice channel.' : 'Add a new voice channel for communication.'}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-6 py-6">
              <div className="flex flex-col space-y-2">
                <Label htmlFor="channelName">
                  Name
                </Label>
                <Input
                  id="channelName"
                  value={newChannel.name}
                  onChange={(e) => setNewChannel({...newChannel, name: e.target.value})}
                />
              </div>
              <div className="flex flex-col space-y-2">
                <Label htmlFor="channelWebhookUrl">
                  Webhook URL
                </Label>
                <Input
                  id="channelWebhookUrl"
                  value={newChannel.webhookUrl}
                  onChange={(e) => setNewChannel({...newChannel, webhookUrl: e.target.value})}
                  placeholder="https://example.com/webhook"
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleChannelSubmit}>Save</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {recordingStatus && (
        <div className={`p-3 rounded-md ${recordingStatus.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {recordingStatus.message}
        </div>
      )}

      <div className="space-y-2">
        {channels.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No voice channels yet. Add one to get started.
          </div>
        ) : (
          channels.map((channel) => (
            <div 
              key={channel.id} 
              className={`flex items-center justify-between p-3 rounded-md ${selectedChannel === channel.id ? 'bg-neon-pulse text-void-black ring-2 ring-white' : 'border border-gray-200'}`}
              onClick={() => setSelectedChannel(channel.id || null)}
            >
              <div className="flex-1 truncate">
                <span className={`font-medium ${selectedChannel === channel.id ? 'text-void-black' : ''}`}>{channel.name}</span>
              </div>
              <div className="flex items-center space-x-2">
                {selectedChannel === channel.id && (
                  <div className="flex items-center space-x-2">
                    {isRecording ? (
                      <>
                        <div className="flex items-center mr-2 text-sm font-medium">
                          <span className="text-red-500">{Math.floor(recordingTimeLeft / 60)}:{(recordingTimeLeft % 60).toString().padStart(2, '0')}</span>
                        </div>
                        <Button 
                          variant="default" 
                          size="sm" 
                          className="flex items-center space-x-1 bg-neon-pulse text-void-black hover:bg-neon-pulse/90 !text-void-black"
                          onClick={(e) => {
                            e.stopPropagation();
                            stopRecording();
                          }}
                        >
                          <StopCircle size={16} />
                          <span>Stop</span>
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex items-center space-x-1 !text-void-black"
                          onClick={(e) => {
                            e.stopPropagation();
                            cancelRecording();
                          }}
                        >
                          <X size={16} />
                          <span>Cancel</span>
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button 
                          variant="default" 
                          size="sm" 
                          className="flex items-center space-x-1 bg-neon-pulse text-void-black hover:bg-neon-pulse/90 !text-void-black"
                          onClick={(e) => {
                            e.stopPropagation();
                            startRecording();
                          }}
                          disabled={isSending}
                        >
                          <Microphone size={16} />
                          <span>Record</span>
                        </Button>
                        <Button 
                          variant="default" 
                          size="sm" 
                          className="flex items-center space-x-1 bg-neon-pulse text-void-black hover:bg-neon-pulse/90 !text-void-black"
                          onClick={(e) => {
                            e.stopPropagation();
                            sendRecording(channel.id || 0);
                          }}
                          disabled={isSending || isRecording}
                        >
                          <PaperPlaneTilt size={16} />
                          <span>Send</span>
                        </Button>
                      </>
                    )}
                  </div>
                )}
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleChannelInfo(channel);
                  }}
                  className={selectedChannel === channel.id ? '!text-void-black hover:!text-void-black/80' : ''}
                >
                  <Info size={16} />
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleChannelEdit(channel);
                  }}
                  className={selectedChannel === channel.id ? '!text-void-black hover:!text-void-black/80' : ''}
                >
                  <PencilSimple size={16} />
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleChannelDelete(channel.id || 0);
                  }}
                  className={selectedChannel === channel.id ? '!text-void-black hover:!text-void-black/80' : ''}
                >
                  <Trash size={16} />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default VoiceChannelSection;
