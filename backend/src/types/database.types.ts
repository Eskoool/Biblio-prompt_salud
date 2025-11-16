// TypeScript types for Supabase database

export interface Tag {
  id: string;
  name: string;
  description: string;
  color: string;
  category: 'specialty' | 'use-case' | 'difficulty' | 'other';
  created_at: string;
  updated_at: string;
}

export interface AIPlatform {
  id: string;
  name: string;
  description: string;
  icon?: string;
  url?: string;
  created_at: string;
  updated_at: string;
}

export interface Prompt {
  id: string;
  title: string;
  content: string;
  description: string;
  votes: number;
  is_recommended: boolean;
  author?: string;
  created_at: string;
  updated_at: string;
  tags?: Tag[];
  ai_platforms?: AIPlatform[];
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
  created_at: string;
  updated_at: string;
}

export interface PromptTag {
  prompt_id: string;
  tag_id: string;
}

export interface PromptPlatform {
  prompt_id: string;
  platform_id: string;
}

export interface CreatePromptData {
  title: string;
  content: string;
  description: string;
  tags: string[];
  aiPlatforms: string[];
  author?: string;
}

export interface UpdatePromptData {
  title?: string;
  content?: string;
  description?: string;
  tags?: string[];
  aiPlatforms?: string[];
  is_recommended?: boolean;
}
