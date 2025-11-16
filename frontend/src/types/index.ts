export interface Prompt {
  _id: string;
  title: string;
  content: string;
  description: string;
  tags: Tag[];
  aiPlatforms: AIPlatform[];
  votes: number;
  createdAt: string;
  updatedAt: string;
  isRecommended?: boolean;
  author?: string;
}

export interface Tag {
  _id: string;
  name: string;
  description: string;
  color: string;
  category: 'specialty' | 'use-case' | 'difficulty' | 'other';
}

export interface AIPlatform {
  _id: string;
  name: string;
  description: string;
  icon?: string;
  url?: string;
}

export interface User {
  _id: string;
  email: string;
  role: 'admin' | 'user';
  name: string;
}

export interface VoteData {
  promptId: string;
  value: 1 | -1;
}

export interface CreatePromptData {
  title: string;
  content: string;
  description: string;
  tags: string[];
  aiPlatforms: string[];
}

export interface FilterOptions {
  tags?: string[];
  aiPlatforms?: string[];
  search?: string;
  sortBy?: 'votes' | 'recent' | 'alphabetical';
}
