import Dexie, { Table } from 'dexie';
import { v4 as uuidv4 } from 'uuid';
import { Prompt } from '../types/Prompt';
import { VoiceChannel } from '../types/VoiceChannel';
import { Agent } from '../types/Agent';

// Re-export types
export type { VoiceChannel, Agent };

// Define interfaces for our database entities
export interface User {
  id?: number;
  name: string;
  email: string;
  url?: string;
  missionStatement?: string;
}

export interface Category {
  id?: number;
  uuid: string;
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Flow {
  id?: number;
  uuid: string;
  name: string;
  description?: string;
  webhookUrl: string;
  categoryId: number;
  promptId?: number | null;
  createdAt: Date;
  updatedAt: Date;
}

// Define our database
class WebhookBuddyDatabase extends Dexie {
  users!: Table<User>;
  categories!: Table<Category>;
  flows!: Table<Flow>;
  prompts!: Table<Prompt>;
  voiceChannels!: Table<VoiceChannel>;
  agents!: Table<Agent>;

  constructor() {
    super('WebhookBuddyDB');
    this.version(5).stores({
      users: '++id',
      categories: '++id, uuid, name',
      flows: '++id, uuid, categoryId, promptId, name',
      prompts: '++id, name',
      voiceChannels: '++id, name',
      agents: '++id, name',
    });
  }

  // User methods
  async getUser(): Promise<User | undefined> {
    return await this.users.toCollection().first();
  }

  async saveUser(user: User): Promise<number> {
    // Since we only have one user, we'll clear the table first if there's already a user
    const existingUser = await this.getUser();
    if (existingUser) {
      await this.users.clear();
    }
    const id = await this.users.add(user);
    return typeof id === 'number' ? id : parseInt(id.toString(), 10);
  }

  async updateUser(user: User): Promise<number> {
    if (!user.id) {
      throw new Error('User ID is required for update');
    }
    return await this.users.update(user.id, user);
  }

  // Category methods
  async getCategories(): Promise<Category[]> {
    return await this.categories.toArray();
  }

  async getCategoryById(id: number): Promise<Category | undefined> {
    return await this.categories.get(id);
  }

  async createCategory(category: Omit<Category, 'uuid' | 'createdAt' | 'updatedAt'>): Promise<number> {
    const now = new Date();
    const newCategory: Category = {
      ...category,
      uuid: uuidv4(),
      createdAt: now,
      updatedAt: now,
    };
    const id = await this.categories.add(newCategory);
    return typeof id === 'number' ? id : parseInt(id.toString(), 10);
  }

  async updateCategory(id: number, category: Partial<Category>): Promise<number> {
    const now = new Date();
    return await this.categories.update(id, {
      ...category,
      updatedAt: now,
    });
  }

  async deleteCategory(id: number): Promise<void> {
    // First, delete all flows associated with this category
    await this.flows.where('categoryId').equals(id).delete();
    // Then delete the category
    await this.categories.delete(id);
  }

  // Flow methods
  async getFlows(): Promise<Flow[]> {
    return await this.flows.toArray();
  }

  async getFlowsByCategoryId(categoryId: number): Promise<Flow[]> {
    return await this.flows.where('categoryId').equals(categoryId).toArray();
  }

  async getFlowById(id: number): Promise<Flow | undefined> {
    return await this.flows.get(id);
  }

  async createFlow(flow: Omit<Flow, 'uuid' | 'createdAt' | 'updatedAt'>): Promise<number> {
    const now = new Date();
    const newFlow: Flow = {
      ...flow,
      uuid: uuidv4(),
      createdAt: now,
      updatedAt: now,
    };
    const id = await this.flows.add(newFlow);
    return typeof id === 'number' ? id : parseInt(id.toString(), 10);
  }

  async updateFlow(id: number, flow: Partial<Flow>): Promise<number> {
    const now = new Date();
    return await this.flows.update(id, {
      ...flow,
      updatedAt: now,
    });
  }

  async deleteFlow(id: number): Promise<void> {
    await this.flows.delete(id);
  }

  // Prompt methods
  async getPrompts(): Promise<Prompt[]> {
    return await this.prompts.toArray();
  }

  async getPromptById(id: number): Promise<Prompt | undefined> {
    return await this.prompts.get(id);
  }

  async createPrompt(prompt: Omit<Prompt, 'createdAt' | 'updatedAt'>): Promise<number> {
    const now = new Date();
    const id = await this.prompts.add({
      ...prompt,
      createdAt: now,
      updatedAt: now
    });
    return typeof id === 'number' ? id : parseInt(id.toString(), 10);
  }

  async updatePrompt(id: number, prompt: Partial<Prompt>): Promise<number> {
    await this.prompts.update(id, {
      ...prompt,
      updatedAt: new Date()
    });
    return id;
  }

  async deletePrompt(id: number): Promise<void> {
    await this.prompts.delete(id);
  }

  // Voice Channel methods
  async getVoiceChannels(): Promise<VoiceChannel[]> {
    return await this.voiceChannels.toArray();
  }

  async getVoiceChannelById(id: number): Promise<VoiceChannel | undefined> {
    return await this.voiceChannels.get(id);
  }

  async createVoiceChannel(channel: Omit<VoiceChannel, 'createdAt' | 'updatedAt'>): Promise<number> {
    const now = new Date();
    const id = await this.voiceChannels.add({
      ...channel,
      createdAt: now,
      updatedAt: now
    });
    return typeof id === 'number' ? id : parseInt(id.toString(), 10);
  }

  async updateVoiceChannel(id: number, channel: Partial<VoiceChannel>): Promise<number> {
    await this.voiceChannels.update(id, {
      ...channel,
      updatedAt: new Date()
    });
    return id;
  }

  async deleteVoiceChannel(id: number): Promise<void> {
    await this.voiceChannels.delete(id);
  }

  // Agent methods
  async getAgents(): Promise<Agent[]> {
    return await this.agents.toArray();
  }

  async getAgentById(id: number): Promise<Agent | undefined> {
    return await this.agents.get(id);
  }

  async createAgent(agent: Omit<Agent, 'createdAt' | 'updatedAt'>): Promise<number> {
    const now = new Date();
    const id = await this.agents.add({
      ...agent,
      createdAt: now,
      updatedAt: now
    });
    return typeof id === 'number' ? id : parseInt(id.toString(), 10);
  }

  async updateAgent(id: number, agent: Partial<Agent>): Promise<number> {
    await this.agents.update(id, {
      ...agent,
      updatedAt: new Date()
    });
    return id;
  }

  async deleteAgent(id: number): Promise<void> {
    await this.agents.delete(id);
  }
}

// Create and export a single instance of the database
export const db = new WebhookBuddyDatabase();
