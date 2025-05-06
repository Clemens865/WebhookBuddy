export interface Agent {
  id?: number;
  name: string;
  description?: string;
  webhookUrl: string;
  createdAt?: Date;
  updatedAt?: Date;
}
