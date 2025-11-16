-- Schema for Biblio Prompt Salud - Supabase PostgreSQL

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tags table
CREATE TABLE tags (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) UNIQUE NOT NULL,
  description TEXT DEFAULT '',
  color VARCHAR(7) DEFAULT '#0ea5e9',
  category VARCHAR(50) CHECK (category IN ('specialty', 'use-case', 'difficulty', 'other')) DEFAULT 'other',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- AI Platforms table
CREATE TABLE ai_platforms (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) UNIQUE NOT NULL,
  description TEXT NOT NULL,
  icon VARCHAR(500) DEFAULT '',
  url VARCHAR(500) DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Prompts table
CREATE TABLE prompts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  description TEXT NOT NULL,
  votes INTEGER DEFAULT 0,
  is_recommended BOOLEAN DEFAULT FALSE,
  author VARCHAR(255) DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Junction table for prompts and tags (many-to-many)
CREATE TABLE prompt_tags (
  prompt_id UUID REFERENCES prompts(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (prompt_id, tag_id)
);

-- Junction table for prompts and ai_platforms (many-to-many)
CREATE TABLE prompt_platforms (
  prompt_id UUID REFERENCES prompts(id) ON DELETE CASCADE,
  platform_id UUID REFERENCES ai_platforms(id) ON DELETE CASCADE,
  PRIMARY KEY (prompt_id, platform_id)
);

-- User profiles table (extends Supabase auth.users)
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(20) CHECK (role IN ('admin', 'user')) DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for better performance
CREATE INDEX idx_prompts_votes ON prompts(votes DESC);
CREATE INDEX idx_prompts_recommended ON prompts(is_recommended);
CREATE INDEX idx_prompts_created_at ON prompts(created_at DESC);
CREATE INDEX idx_tags_category ON tags(category);
CREATE INDEX idx_prompt_tags_prompt ON prompt_tags(prompt_id);
CREATE INDEX idx_prompt_tags_tag ON prompt_tags(tag_id);
CREATE INDEX idx_prompt_platforms_prompt ON prompt_platforms(prompt_id);
CREATE INDEX idx_prompt_platforms_platform ON prompt_platforms(platform_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers to auto-update updated_at
CREATE TRIGGER update_tags_updated_at BEFORE UPDATE ON tags
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ai_platforms_updated_at BEFORE UPDATE ON ai_platforms
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_prompts_updated_at BEFORE UPDATE ON prompts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_platforms ENABLE ROW LEVEL SECURITY;
ALTER TABLE prompts ENABLE ROW LEVEL SECURITY;
ALTER TABLE prompt_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE prompt_platforms ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies - Public read access, admin write access
-- Tags
CREATE POLICY "Tags are viewable by everyone" ON tags FOR SELECT USING (true);
CREATE POLICY "Tags are insertable by admins" ON tags FOR INSERT
  WITH CHECK ((SELECT role FROM user_profiles WHERE id = auth.uid()) = 'admin');
CREATE POLICY "Tags are updatable by admins" ON tags FOR UPDATE
  USING ((SELECT role FROM user_profiles WHERE id = auth.uid()) = 'admin');
CREATE POLICY "Tags are deletable by admins" ON tags FOR DELETE
  USING ((SELECT role FROM user_profiles WHERE id = auth.uid()) = 'admin');

-- AI Platforms
CREATE POLICY "AI Platforms are viewable by everyone" ON ai_platforms FOR SELECT USING (true);
CREATE POLICY "AI Platforms are insertable by admins" ON ai_platforms FOR INSERT
  WITH CHECK ((SELECT role FROM user_profiles WHERE id = auth.uid()) = 'admin');
CREATE POLICY "AI Platforms are updatable by admins" ON ai_platforms FOR UPDATE
  USING ((SELECT role FROM user_profiles WHERE id = auth.uid()) = 'admin');
CREATE POLICY "AI Platforms are deletable by admins" ON ai_platforms FOR DELETE
  USING ((SELECT role FROM user_profiles WHERE id = auth.uid()) = 'admin');

-- Prompts
CREATE POLICY "Prompts are viewable by everyone" ON prompts FOR SELECT USING (true);
CREATE POLICY "Prompts are insertable by admins" ON prompts FOR INSERT
  WITH CHECK ((SELECT role FROM user_profiles WHERE id = auth.uid()) = 'admin');
CREATE POLICY "Prompts are updatable by admins" ON prompts FOR UPDATE
  USING ((SELECT role FROM user_profiles WHERE id = auth.uid()) = 'admin');
CREATE POLICY "Prompts are deletable by admins" ON prompts FOR DELETE
  USING ((SELECT role FROM user_profiles WHERE id = auth.uid()) = 'admin');

-- Prompt Tags
CREATE POLICY "Prompt tags are viewable by everyone" ON prompt_tags FOR SELECT USING (true);
CREATE POLICY "Prompt tags are insertable by admins" ON prompt_tags FOR INSERT
  WITH CHECK ((SELECT role FROM user_profiles WHERE id = auth.uid()) = 'admin');
CREATE POLICY "Prompt tags are deletable by admins" ON prompt_tags FOR DELETE
  USING ((SELECT role FROM user_profiles WHERE id = auth.uid()) = 'admin');

-- Prompt Platforms
CREATE POLICY "Prompt platforms are viewable by everyone" ON prompt_platforms FOR SELECT USING (true);
CREATE POLICY "Prompt platforms are insertable by admins" ON prompt_platforms FOR INSERT
  WITH CHECK ((SELECT role FROM user_profiles WHERE id = auth.uid()) = 'admin');
CREATE POLICY "Prompt platforms are deletable by admins" ON prompt_platforms FOR DELETE
  USING ((SELECT role FROM user_profiles WHERE id = auth.uid()) = 'admin');

-- User Profiles
CREATE POLICY "User profiles are viewable by everyone" ON user_profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON user_profiles FOR UPDATE
  USING (auth.uid() = id);

-- Function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email, name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', 'User'),
    COALESCE(NEW.raw_user_meta_data->>'role', 'user')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to auto-create user profile on auth.users insert
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
