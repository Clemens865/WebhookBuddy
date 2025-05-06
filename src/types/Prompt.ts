export interface Prompt {
  id?: number;
  name: string;
  systemPrompt: string;
  userPrompt: string;
  createdAt?: Date;
  updatedAt?: Date;
}
