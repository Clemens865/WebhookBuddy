import { useState, useEffect, useCallback } from 'react';
import { db, Agent } from '../services/db';

interface AgentFormData {
  name: string;
  description: string;
  webhookUrl: string;
}

interface UseAgentManagementReturn {
  agents: Agent[];
  selectedAgent: number | null;
  isEditingAgent: boolean;
  agentDialogOpen: boolean;
  newAgent: AgentFormData;
  setSelectedAgent: (id: number | null) => void;
  setAgentDialogOpen: (open: boolean) => void;
  setNewAgent: (agent: AgentFormData) => void;
  setIsEditingAgent: (isEditing: boolean) => void;
  handleAgentSubmit: () => Promise<void>;
  handleAgentEdit: (agent: Agent) => void;
  handleAgentDelete: (id: number) => Promise<void>;
  handleAgentInfo: (agent: Agent) => void;
}

export function useAgentManagement(): UseAgentManagementReturn {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [selectedAgent, setSelectedAgent] = useState<number | null>(null);
  const [isEditingAgent, setIsEditingAgent] = useState(false);
  const [agentDialogOpen, setAgentDialogOpen] = useState(false);
  const [newAgent, setNewAgent] = useState<AgentFormData>({
    name: '',
    description: '',
    webhookUrl: ''
  });

  // Load agents
  useEffect(() => {
    const loadAgents = async () => {
      try {
        const allAgents = await db.getAgents();
        setAgents(allAgents);
      } catch (error) {
        console.error('Error loading agents:', error);
      }
    };

    loadAgents();
  }, []);

  // Handle agent submission (create or update)
  const handleAgentSubmit = useCallback(async () => {
    if (!newAgent.name.trim()) return;

    try {
      if (isEditingAgent && selectedAgent) {
        await db.updateAgent(selectedAgent, {
          ...newAgent
        });
      } else {
        await db.createAgent({
          ...newAgent
        });
      }

      // Refresh agents
      const updatedAgents = await db.getAgents();
      setAgents(updatedAgents);
      
      // Reset form and close dialog
      setNewAgent({ name: '', description: '', webhookUrl: '' });
      setAgentDialogOpen(false);
    } catch (error) {
      console.error('Error saving agent:', error);
    }
  }, [newAgent, isEditingAgent, selectedAgent]);

  // Handle agent edit
  const handleAgentEdit = useCallback((agent: Agent) => {
    setIsEditingAgent(true);
    setNewAgent({
      name: agent.name,
      description: agent.description || '',
      webhookUrl: agent.webhookUrl
    });
    setAgentDialogOpen(true);
  }, []);

  // Handle agent delete
  const handleAgentDelete = useCallback(async (id: number) => {
    try {
      await db.deleteAgent(id);
      
      // If the deleted agent was selected, deselect it
      if (selectedAgent === id) {
        setSelectedAgent(null);
      }
      
      // Refresh agents
      const updatedAgents = await db.getAgents();
      setAgents(updatedAgents);
    } catch (error) {
      console.error('Error deleting agent:', error);
    }
  }, [selectedAgent]);

  // Handle agent info
  const handleAgentInfo = useCallback((agent: Agent) => {
    // For now, just log the agent info
    console.log('Agent Info:', agent);
    // In a real app, you might show a modal with more details
  }, []);

  return {
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
  };
}
