import React from 'react';
import { FileText } from 'phosphor-react';
import { Button } from '../../../components/ui/Button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from '../../../components/ui/Dialog';
import { Input } from '../../../components/ui/Input';
import { Textarea } from '../../../components/ui/Textarea';
import { Label } from '../../../components/ui/Label';
import { PencilSimple, Trash, Info } from 'phosphor-react';
import { PromptManagement } from '../../../hooks/usePromptManagement';

interface PromptSectionProps extends PromptManagement {}

const PromptSection: React.FC<PromptSectionProps> = ({
  prompts,
  selectedPrompt,
  isEditingPrompt,
  promptDialogOpen,
  newPrompt,
  setSelectedPrompt,
  setPromptDialogOpen,
  setNewPrompt,
  setIsEditingPrompt,
  handlePromptSubmit,
  handlePromptEdit,
  handlePromptDelete,
  handlePromptInfo
}) => {
  return (
    <div className="space-y-4">
      {/* Prompt Actions */}
      <div className="flex space-x-4 mb-8 ml-2 mt-10">
        <Dialog open={promptDialogOpen} onOpenChange={setPromptDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center space-x-1"
              onClick={() => {
                setNewPrompt({
                  name: '',
                  systemPrompt: '',
                  userPrompt: ''
                });
                setIsEditingPrompt(false);
              }}
            >
              <PencilSimple size={16} />
              <span>Add</span>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{isEditingPrompt ? 'Edit Prompt' : 'Create Prompt'}</DialogTitle>
              <DialogDescription>
                {isEditingPrompt 
                  ? 'Edit your prompt details below.'
                  : 'Create a new prompt with system and user instructions.'}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6 py-6">
              <div className="grid grid-cols-4 items-center gap-6">
                <Label htmlFor="promptName" className="text-right">
                  Name
                </Label>
                <Input
                  id="promptName"
                  value={newPrompt.name}
                  onChange={(e) => setNewPrompt({...newPrompt, name: e.target.value})}
                  className="col-span-3"
                  placeholder="Enter a name for this prompt"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-6">
                <Label htmlFor="systemPrompt" className="text-right">
                  System Prompt
                </Label>
                <Textarea
                  id="systemPrompt"
                  value={newPrompt.systemPrompt}
                  onChange={(e) => setNewPrompt({...newPrompt, systemPrompt: e.target.value})}
                  className="col-span-3 min-h-[100px]"
                  placeholder="Enter system instructions for the AI"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-6">
                <Label htmlFor="userPrompt" className="text-right">
                  User Prompt
                </Label>
                <Textarea
                  id="userPrompt"
                  value={newPrompt.userPrompt}
                  onChange={(e) => setNewPrompt({...newPrompt, userPrompt: e.target.value})}
                  className="col-span-3 min-h-[100px]"
                  placeholder="Enter user instructions or template"
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handlePromptSubmit}>Save</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <Button 
          variant="outline" 
          size="sm" 
          className="flex items-center space-x-1" 
          disabled={!selectedPrompt}
          onClick={() => selectedPrompt && handlePromptEdit(prompts.find(p => p.id === selectedPrompt)!)}
        >
          <PencilSimple size={16} />
          <span>Edit</span>
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          className="flex items-center space-x-1" 
          disabled={!selectedPrompt}
          onClick={() => selectedPrompt && handlePromptDelete(selectedPrompt)}
        >
          <Trash size={16} />
          <span>Delete</span>
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          className="flex items-center space-x-1" 
          disabled={!selectedPrompt}
          onClick={() => selectedPrompt && handlePromptInfo(prompts.find(p => p.id === selectedPrompt)!)}
        >
          <Info size={16} />
          <span>Info</span>
        </Button>
      </div>
      
      {/* Prompt List */}
      <div className="grid grid-cols-4 gap-x-4 gap-y-6 mt-16">
        {prompts.length > 0 ? (
          prompts.map((prompt) => (
            <div 
              key={prompt.id} 
              className={`${selectedPrompt === prompt.id ? 'bg-void-black text-white' : 'bg-transparent dark:text-white text-void-black'} p-4 rounded-lg text-center cursor-pointer aspect-square flex flex-col justify-center border ${selectedPrompt === prompt.id ? 'border-neon-pulse border-2' : 'border-border-gray'} transition-all duration-200`}
              onClick={() => setSelectedPrompt(prompt.id === selectedPrompt ? null : prompt.id as number)}
            >
              <FileText size={24} weight="regular" className="mx-auto mb-2" />
              <div className="font-medium">{prompt.name}</div>
            </div>
          ))
        ) : (
          <div className="col-span-4 text-center py-8 text-text-secondary">
            No prompts found. Create your first prompt by clicking the Add button.
          </div>
        )}
      </div>
    </div>
  );
};

export default PromptSection;
