import React, { useEffect, useState } from 'react';
import { FlowArrow } from 'phosphor-react';
import { Prompt } from '../../../types/Prompt';
import { db } from '../../../services/db';
import { Button } from '../../../components/ui/Button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from '../../../components/ui/Dialog';
import { Input } from '../../../components/ui/Input';
import { Textarea } from '../../../components/ui/Textarea';
import { Label } from '../../../components/ui/Label';
import { Select } from '../../../components/ui/Select';
import { Info, Plus, PencilSimple, Trash } from 'phosphor-react';
// Using Flow type from UseFlowManagementReturn
import { UseFlowManagementReturn } from '../../../hooks/useFlowManagement';

interface FlowSectionProps extends UseFlowManagementReturn {
  selectedCategory: number | null;
}

const FlowSection: React.FC<FlowSectionProps> = ({
  flows,
  selectedFlow,
  selectedCategory,
  isEditingFlow,
  flowDialogOpen,
  newFlow,
  isExecuting,
  executionStatus,
  setSelectedFlow,
  setFlowDialogOpen,
  setNewFlow,
  setIsEditingFlow,
  handleFlowSubmit,
  handleFlowEdit,
  handleFlowDelete,
  handleFlowInfo,
  handleExecuteFlow
}) => {
  const [prompts, setPrompts] = useState<Prompt[]>([]);

  // Load prompts for the dropdown
  useEffect(() => {
    const loadPrompts = async () => {
      try {
        const allPrompts = await db.getPrompts();
        setPrompts(allPrompts);
      } catch (error) {
        console.error('Error loading prompts:', error);
      }
    };

    loadPrompts();
  }, []);
  const filteredFlows = flows.filter(flow => flow.categoryId === selectedCategory);
  
  return (
    <div className="space-y-4">
      {/* Flow Actions */}
      <div className="flex space-x-4 mb-8 ml-2 mt-10">
        <Dialog open={flowDialogOpen} onOpenChange={setFlowDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center space-x-1"
              disabled={!selectedCategory}
              onClick={() => {
                setIsEditingFlow(false);
                setNewFlow({ name: '', description: '', webhookUrl: '', promptId: null });
              }}
            >
              <Plus size={16} />
              <span>Add</span>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{isEditingFlow ? 'Edit Flow' : 'Create Flow'}</DialogTitle>
              <DialogDescription>
                {isEditingFlow ? 'Update an existing flow.' : 'Add a new flow for automation.'}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-6 py-6">
              <div className="grid grid-cols-4 items-center gap-6">
                <Label htmlFor="flowName" className="text-right">
                  Name
                </Label>
                <Input
                  id="flowName"
                  value={newFlow.name}
                  onChange={(e) => setNewFlow({...newFlow, name: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-6">
                <Label htmlFor="flowDescription" className="text-right">
                  Description
                </Label>
                <Textarea
                  id="flowDescription"
                  value={newFlow.description}
                  onChange={(e) => setNewFlow({...newFlow, description: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-6">
                <Label htmlFor="flowWebhookUrl" className="text-right">
                  Webhook URL
                </Label>
                <Input
                  id="flowWebhookUrl"
                  value={newFlow.webhookUrl}
                  onChange={(e) => setNewFlow({...newFlow, webhookUrl: e.target.value})}
                  className="col-span-3"
                  placeholder="https://example.com/webhook"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-6">
                <Label htmlFor="flowPrompt" className="text-right">
                  Prompt
                </Label>
                <Select
                  id="flowPrompt"
                  value={newFlow.promptId?.toString() || ""}
                  onChange={(e) => setNewFlow({...newFlow, promptId: e.target.value ? parseInt(e.target.value) : null})}
                  className="col-span-3"
                >
                  <option value="">Select a prompt (optional)</option>
                  {prompts.map((prompt) => (
                    <option key={prompt.id} value={prompt.id?.toString()}>
                      {prompt.name}
                    </option>
                  ))}
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={() => selectedCategory && handleFlowSubmit(selectedCategory)}>Save</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <Button 
          variant="outline" 
          size="sm" 
          className="flex items-center space-x-1" 
          disabled={!selectedFlow}
          onClick={() => selectedFlow && handleFlowEdit(flows.find(f => f.id === selectedFlow)!)}
        >
          <PencilSimple size={16} />
          <span>Edit</span>
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          className="flex items-center space-x-1" 
          disabled={!selectedFlow}
          onClick={() => selectedFlow && handleFlowDelete(selectedFlow)}
        >
          <Trash size={16} />
          <span>Delete</span>
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          className="flex items-center space-x-1" 
          disabled={!selectedFlow}
          onClick={() => selectedFlow && handleFlowInfo(flows.find(f => f.id === selectedFlow)!)}
        >
          <Info size={16} />
          <span>Info</span>
        </Button>
      </div>
      
      {/* Flow List */}
      <div className="grid grid-cols-4 gap-x-4 gap-y-6 mt-16">
        {selectedCategory && filteredFlows.length > 0 ? (
          filteredFlows.map(flow => (
            <div 
              key={flow.id} 
              className={`${selectedFlow === flow.id ? 'bg-void-black text-white' : 'bg-transparent dark:text-white text-void-black'} rounded-lg p-4 text-center cursor-pointer aspect-square flex flex-col justify-center border ${selectedFlow === flow.id ? 'border-neon-pulse border-2' : 'border-border-gray'} transition-all duration-200`}
              onClick={() => setSelectedFlow(flow.id === selectedFlow ? null : flow.id as number)}
            >
              <FlowArrow size={24} weight="regular" className="mx-auto mb-2" />
              <div className="font-medium">{flow.name}</div>
            </div>
          ))
        ) : (
          <div className="col-span-4 text-center py-4 text-gray-500">
            {selectedCategory !== null && selectedCategory !== undefined ? 'No flows in this category yet. Click "Add" to create your first flow.' : 'Select a category to view flows.'}
          </div>
        )}
      </div>
      
      {/* Execute Flow Section */}
      {selectedFlow && (
        <div className="mt-6 mb-4">
          <div className="flex justify-center items-center py-2">
            <Button 
              onClick={handleExecuteFlow} 
              disabled={isExecuting}
              className="bg-neon-pulse hover:bg-brand-secondary-dark text-void-black font-medium px-4 py-2 shadow-md hover:shadow-lg shadow-neon-pulse/20 transition-all duration-200 flex items-center justify-center space-x-2 w-full sm:w-auto border-2 border-transparent hover:border-brand-secondary-dark"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" />
              </svg>
              <span>{isExecuting ? 'Executing...' : 'Execute Flow'}</span>
            </Button>
          </div>
          
          {executionStatus && (
            <div className={`mt-3 p-3 rounded-md ${executionStatus.success ? 'dark:bg-green-900/20 bg-green-100 border dark:border-green-500/30 border-green-300' : 'dark:bg-red-900/20 bg-red-100 border dark:border-red-500/30 border-red-300'} transition-all duration-300`}>
              <div className="flex items-start space-x-2">
                {executionStatus.success ? (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0">
                    <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0">
                    <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-1.72 6.97a.75.75 0 10-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 101.06 1.06L12 13.06l1.72 1.72a.75.75 0 101.06-1.06L13.06 12l1.72-1.72a.75.75 0 10-1.06-1.06L12 10.94l-1.72-1.72z" clipRule="evenodd" />
                  </svg>
                )}
                <p className={`text-sm ${executionStatus.success ? 'dark:text-green-500 text-green-700' : 'dark:text-red-500 text-red-700'}`}>{executionStatus.message}</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FlowSection;
