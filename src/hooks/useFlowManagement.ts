import { useState, useEffect, useCallback } from 'react';
import { db, Flow } from '../services/db';
import { executeFlow } from '../services/flowService';

export interface FlowFormData {
  name: string;
  description: string;
  webhookUrl: string;
  promptId: number | null;
}

export interface ExecutionStatus {
  success: boolean;
  message: string;
}

export interface UseFlowManagementReturn {
  flows: Flow[];
  selectedFlow: number | null;
  isEditingFlow: boolean;
  flowDialogOpen: boolean;
  newFlow: FlowFormData;
  isExecuting: boolean;
  executionStatus: ExecutionStatus | null;
  setSelectedFlow: (id: number | null) => void;
  setFlowDialogOpen: (open: boolean) => void;
  setNewFlow: (flow: FlowFormData) => void;
  setIsEditingFlow: (isEditing: boolean) => void;
  handleFlowSubmit: (categoryId: number) => Promise<void>;
  handleFlowEdit: (flow: Flow) => void;
  handleFlowDelete: (id: number) => Promise<void>;
  handleFlowInfo: (flow: Flow) => void;
  handleExecuteFlow: () => Promise<void>;
}

export const useFlowManagement = (selectedCategory: number | null, refreshTrigger: number = 0): UseFlowManagementReturn => {
  const [flows, setFlows] = useState<Flow[]>([]);
  const [selectedFlow, setSelectedFlow] = useState<number | null>(null);
  const [isEditingFlow, setIsEditingFlow] = useState(false);
  const [flowDialogOpen, setFlowDialogOpen] = useState(false);
  const [newFlow, setNewFlow] = useState<FlowFormData>({
    name: '',
    description: '',
    webhookUrl: '',
    promptId: null
  });
  const [executionStatus, setExecutionStatus] = useState<ExecutionStatus | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);

  // Load flows based on selected category
  useEffect(() => {
    const loadFlows = async () => {
      const allFlows = await db.getFlows();
      // Filter flows by category if a category is selected
      if (selectedCategory !== null) {
        setFlows(allFlows.filter(flow => flow.categoryId === selectedCategory));
      } else {
        setFlows(allFlows);
      }
    };

    // Clear selected flow when category changes to prevent accidental triggering
    setSelectedFlow(null);
    
    loadFlows();
  }, [selectedCategory, refreshTrigger]); // Re-run when selectedCategory or refreshTrigger changes

  // Handle flow submission (create or update)
  const handleFlowSubmit = useCallback(async (categoryId: number) => {
    if (!newFlow.name.trim() || !categoryId) return;

    try {
      if (isEditingFlow && selectedFlow) {
        await db.updateFlow(selectedFlow, {
          ...newFlow,
          categoryId
        });
      } else {
        await db.createFlow({
          ...newFlow,
          categoryId
        });
      }

      // Refresh flows
      const updatedFlows = await db.getFlows();
      setFlows(updatedFlows);
      
      // Reset form and close dialog
      setNewFlow({ name: '', description: '', webhookUrl: '', promptId: null });
      setFlowDialogOpen(false);
    } catch (error) {
      console.error('Error saving flow:', error);
    }
  }, [newFlow, isEditingFlow, selectedFlow]);

  // Handle flow edit
  const handleFlowEdit = useCallback((flow: Flow) => {
    setIsEditingFlow(true);
    setNewFlow({
      name: flow.name,
      description: flow.description || '',
      webhookUrl: flow.webhookUrl || '',
      promptId: flow.promptId || null
    });
    setFlowDialogOpen(true);
  }, []);

  // Handle flow delete
  const handleFlowDelete = useCallback(async (id: number) => {
    if (window.confirm('Are you sure you want to delete this flow?')) {
      try {
        await db.deleteFlow(id);
        
        // Refresh flows
        const updatedFlows = await db.getFlows();
        setFlows(updatedFlows);
        
        // Clear selection if the deleted flow was selected
        if (selectedFlow === id) {
          setSelectedFlow(null);
        }
      } catch (error) {
        console.error('Error deleting flow:', error);
      }
    }
  }, [selectedFlow]);

  // Handle flow info display
  const handleFlowInfo = useCallback((flow: Flow) => {
    alert(`Flow: ${flow.name}\nDescription: ${flow.description || 'No description'}\nWebhook URL: ${flow.webhookUrl || 'No webhook URL'}\nCreated: ${flow.createdAt?.toLocaleString() || 'Unknown'}`);
  }, []);

  // Handle flow execution
  const handleExecuteFlow = useCallback(async () => {
    if (!selectedFlow) return;
    
    setIsExecuting(true);
    setExecutionStatus(null);
    
    try {
      const flow = flows.find(f => f.id === selectedFlow);
      if (!flow) throw new Error('Flow not found');
      
      // Execute the flow by ID instead of passing the whole flow object
      const result = await executeFlow(flow.id || 0);
      setExecutionStatus({
        success: true,
        message: `Flow executed successfully: ${result.message}`
      });
    } catch (error) {
      console.error('Error executing flow:', error);
      setExecutionStatus({
        success: false,
        message: `Error executing flow: ${error instanceof Error ? error.message : 'Unknown error'}`
      });
    } finally {
      setIsExecuting(false);
    }
  }, [selectedFlow, flows]);

  return {
    flows,
    selectedFlow,
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
  };
};
