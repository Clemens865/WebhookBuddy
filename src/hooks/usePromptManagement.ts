import { useState, useEffect, useCallback } from 'react';
import { Prompt } from '../types/Prompt';
import { db } from '../services/db';

export interface PromptManagementState {
  prompts: Prompt[];
  selectedPrompt: number | null;
  isEditingPrompt: boolean;
  promptDialogOpen: boolean;
  newPrompt: Prompt;
}

export interface PromptManagementActions {
  setSelectedPrompt: (id: number | null) => void;
  setPromptDialogOpen: (open: boolean) => void;
  setNewPrompt: (prompt: Prompt) => void;
  setIsEditingPrompt: (isEditing: boolean) => void;
  handlePromptSubmit: () => void;
  handlePromptEdit: (prompt: Prompt) => void;
  handlePromptDelete: (id: number) => void;
  handlePromptInfo: (prompt: Prompt) => void;
}

export type PromptManagement = PromptManagementState & PromptManagementActions;

export const usePromptManagement = (): PromptManagement => {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [selectedPrompt, setSelectedPrompt] = useState<number | null>(null);
  const [isEditingPrompt, setIsEditingPrompt] = useState(false);
  const [promptDialogOpen, setPromptDialogOpen] = useState(false);
  const [newPrompt, setNewPrompt] = useState<Prompt>({
    name: '',
    systemPrompt: '',
    userPrompt: ''
  });

  // Load prompts
  const loadPrompts = useCallback(async () => {
    try {
      const loadedPrompts = await db.getPrompts();
      setPrompts(loadedPrompts);
    } catch (error) {
      console.error('Error loading prompts:', error);
    }
  }, []);

  useEffect(() => {
    loadPrompts();
  }, [loadPrompts]);

  // Handle prompt submission (create or update)
  const handlePromptSubmit = useCallback(async () => {
    try {
      if (isEditingPrompt && selectedPrompt) {
        // Update existing prompt
        await db.updatePrompt(selectedPrompt, newPrompt);
      } else {
        // Create new prompt
        await db.createPrompt(newPrompt);
      }
      
      // Reset form and refresh prompts
      setNewPrompt({
        name: '',
        systemPrompt: '',
        userPrompt: ''
      });
      setPromptDialogOpen(false);
      setIsEditingPrompt(false);
      loadPrompts();
    } catch (error) {
      console.error('Error submitting prompt:', error);
    }
  }, [isEditingPrompt, loadPrompts, newPrompt, selectedPrompt]);

  // Handle prompt edit
  const handlePromptEdit = useCallback((prompt: Prompt) => {
    setNewPrompt(prompt);
    setIsEditingPrompt(true);
    setPromptDialogOpen(true);
  }, []);

  // Handle prompt delete
  const handlePromptDelete = useCallback(async (id: number) => {
    try {
      await db.deletePrompt(id);
      if (selectedPrompt === id) {
        setSelectedPrompt(null);
      }
      loadPrompts();
    } catch (error) {
      console.error('Error deleting prompt:', error);
    }
  }, [loadPrompts, selectedPrompt]);

  // Handle prompt info display
  const handlePromptInfo = useCallback((prompt: Prompt) => {
    // This could be expanded to show more detailed information about the prompt
    alert(`Prompt: ${prompt.name}\n\nSystem Prompt: ${prompt.systemPrompt}\n\nUser Prompt: ${prompt.userPrompt}`);
  }, []);

  return {
    // State
    prompts,
    selectedPrompt,
    isEditingPrompt,
    promptDialogOpen,
    newPrompt,
    
    // Actions
    setSelectedPrompt,
    setPromptDialogOpen,
    setNewPrompt,
    setIsEditingPrompt,
    handlePromptSubmit,
    handlePromptEdit,
    handlePromptDelete,
    handlePromptInfo
  };
};
