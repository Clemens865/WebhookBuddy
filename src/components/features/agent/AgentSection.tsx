import React, { useState, useRef } from 'react';
import { Info, Plus, PencilSimple, Trash, PaperPlaneRight, Paperclip, X } from 'phosphor-react';
import { Button } from '../../../components/ui/Button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from '../../../components/ui/Dialog';
import { Input } from '../../../components/ui/Input';
import { Textarea } from '../../../components/ui/Textarea';
import { Label } from '../../../components/ui/Label';
import { Select } from '../../../components/ui/Select';
import { useAgentManagement } from '../../../hooks/useAgentManagement';
import { useChatMessages } from '../../../hooks/useChatMessages';
import type { ChatMessage } from '../../../services/agentService';

const AgentSection: React.FC = () => {
  const {
    agents,
    selectedAgent,
    isEditingAgent,
    agentDialogOpen,
    newAgent,
    setSelectedAgent,
    setAgentDialogOpen,
    setNewAgent,
    setIsEditingAgent,
    handleAgentSubmit,
    handleAgentEdit,
    handleAgentDelete,
    handleAgentInfo
  } = useAgentManagement();

  const {
    messages,
    isLoading,
    error,
    sendMessage,
    clearMessages
  } = useChatMessages();

  // Chat input state
  const [chatInput, setChatInput] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle file selection
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const filesArray = Array.from(e.target.files);
      setSelectedFiles(prev => [...prev, ...filesArray]);
    }
  };

  // Remove a selected file
  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  // Trigger file input click
  const openFileSelector = () => {
    fileInputRef.current?.click();
  };

  // Handle chat form submission
  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAgent) return;

    await sendMessage(selectedAgent, chatInput, selectedFiles);
    setChatInput('');
    setSelectedFiles([]);
  };

  // Format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  // Render chat message
  const renderMessage = (message: ChatMessage) => {
    const isUser = message.sender === 'user';
    const isSystem = message.text.startsWith('Workflow was');
    
    return (
      <div 
        key={message.id}
        className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}
      >
        <div 
          className={`max-w-[80%] rounded-lg p-3 ${
            isUser 
              ? 'bg-neon-pulse text-void-black' 
              : isSystem 
                ? 'dark:bg-card-gray bg-highlight-gray dark:text-text-primary text-void-black border dark:border-border-gray border-gray-300' 
                : 'dark:bg-card-gray bg-highlight-gray dark:text-text-primary text-void-black'
          }`}
        >
          <div className="text-sm">{message.text}</div>
          
          {/* Render attachments if any */}
          {message.attachments && message.attachments.length > 0 && (
            <div className="mt-2 space-y-2">
              {message.attachments.map(attachment => (
                <div key={attachment.id} className="flex items-center space-x-2 p-2 dark:bg-black dark:bg-opacity-20 bg-gray-200 rounded">
                  {attachment.thumbnailData ? (
                    <img 
                      src={`data:${attachment.type};base64,${attachment.thumbnailData}`} 
                      alt={attachment.name}
                      className="w-10 h-10 object-cover rounded"
                    />
                  ) : (
                    <div className="w-10 h-10 flex items-center justify-center dark:bg-gray-700 bg-gray-300 rounded">
                      <Paperclip size={16} />
                    </div>
                  )}
                  <div className="flex-1 overflow-hidden">
                    <div className="text-xs truncate">{attachment.name}</div>
                    <div className="text-xs opacity-70">{formatFileSize(attachment.size)}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          <div className="text-xs opacity-70 mt-1">
            {new Date(message.timestamp).toLocaleTimeString()}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full">
      {/* Agent selection and management */}
      <div className="flex items-center space-x-4 mb-4">
        <div className="flex-1">
          <Select
            value={selectedAgent?.toString() || ''}
            onChange={(e) => {
              const agentId = e.target.value ? parseInt(e.target.value) : null;
              setSelectedAgent(agentId);
              clearMessages(); // Clear chat when changing agents
            }}
            className="w-full"
          >
            <option value="">Select an agent</option>
            {agents.map((agent) => (
              <option key={agent.id} value={agent.id?.toString()}>
                {agent.name}
              </option>
            ))}
          </Select>
        </div>
        
        <Dialog open={agentDialogOpen} onOpenChange={setAgentDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center space-x-1"
              onClick={() => {
                setIsEditingAgent(false);
                setNewAgent({ name: '', description: '', webhookUrl: '' });
              }}
            >
              <Plus size={16} />
              <span>Add</span>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{isEditingAgent ? 'Edit Agent' : 'Create Agent'}</DialogTitle>
              <DialogDescription>
                {isEditingAgent ? 'Update an existing agent.' : 'Add a new agent for communication.'}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-6 py-6">
              <div className="flex flex-col space-y-2">
                <Label htmlFor="agentName">
                  Name
                </Label>
                <Input
                  id="agentName"
                  value={newAgent.name}
                  onChange={(e) => setNewAgent({...newAgent, name: e.target.value})}
                />
              </div>
              <div className="flex flex-col space-y-2">
                <Label htmlFor="agentDescription">
                  Description
                </Label>
                <Textarea
                  id="agentDescription"
                  value={newAgent.description}
                  onChange={(e) => setNewAgent({...newAgent, description: e.target.value})}
                  rows={3}
                />
              </div>
              <div className="flex flex-col space-y-2">
                <Label htmlFor="agentWebhookUrl">
                  Webhook URL
                </Label>
                <Input
                  id="agentWebhookUrl"
                  value={newAgent.webhookUrl}
                  onChange={(e) => setNewAgent({...newAgent, webhookUrl: e.target.value})}
                  placeholder="https://example.com/webhook"
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleAgentSubmit}>Save</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        {selectedAgent && (
          <>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => {
                const agent = agents.find(a => a.id === selectedAgent);
                if (agent) handleAgentEdit(agent);
              }}
            >
              <PencilSimple size={16} />
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => {
                if (selectedAgent) handleAgentDelete(selectedAgent);
              }}
            >
              <Trash size={16} />
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => {
                const agent = agents.find(a => a.id === selectedAgent);
                if (agent) handleAgentInfo(agent);
              }}
            >
              <Info size={16} />
            </Button>
          </>
        )}
      </div>
      
      {/* Chat area */}
      <div className="flex flex-col bg-card-gray dark:bg-card-gray bg-white border border-border-gray dark:border-border-gray rounded-lg overflow-hidden h-[calc(100vh-500px)]">
        {/* Chat messages */}
        <div className="flex-1 p-4 overflow-y-auto">
          {messages.length === 0 ? (
            <div className="h-full flex items-center justify-center dark:text-gray-500 text-gray-400">
              {selectedAgent ? 'Send a message to start chatting' : 'Select an agent to start chatting'}
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map(renderMessage)}
            </div>
          )}
          
          {error && (
            <div className="dark:bg-red-500 dark:bg-opacity-20 bg-red-100 dark:text-red-200 text-red-700 p-3 rounded mt-4 border dark:border-red-500/30 border-red-300">
              {error}
            </div>
          )}
        </div>
        
        {/* Selected files */}
        {selectedFiles.length > 0 && (
          <div className="px-4 py-2 dark:bg-black dark:bg-opacity-20 bg-gray-100 border-t dark:border-gray-700 border-gray-200">
            <div className="text-xs mb-2">Attachments:</div>
            <div className="flex flex-wrap gap-2">
              {selectedFiles.map((file, index) => (
                <div 
                  key={index} 
                  className="flex items-center space-x-2 dark:bg-gray-800 bg-gray-200 rounded px-2 py-1"
                >
                  <span className="text-xs truncate max-w-[100px]">{file.name}</span>
                  <button 
                    onClick={() => removeFile(index)}
                    className="text-gray-400 hover:text-white"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Chat input */}
        <form 
          onSubmit={handleChatSubmit}
          className="p-4 border-t dark:border-gray-700 border-gray-200 flex items-end space-x-2 h-[200px]"
        >
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileSelect} 
            className="hidden" 
            multiple 
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={openFileSelector}
            className="flex-shrink-0"
          >
            <Paperclip size={20} />
          </Button>
          
          <div className="flex-1">
            <Textarea
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Type your message..."
              className="resize-none h-[170px] w-full"
              rows={8}
              disabled={!selectedAgent || isLoading}
            />
          </div>
          
          <Button
            type="submit"
            variant="default"
            size="sm"
            className="flex-shrink-0 bg-neon-pulse text-void-black hover:bg-neon-pulse/90"
            disabled={(!chatInput.trim() && selectedFiles.length === 0) || !selectedAgent || isLoading}
          >
            <PaperPlaneRight size={20} />
          </Button>
        </form>
      </div>
    </div>
  );
};

export default AgentSection;
