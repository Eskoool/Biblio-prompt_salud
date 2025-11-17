-- ============================================================================
-- SQL PARA VERIFICAR Y CORREGIR POLÍTICAS RLS
-- ============================================================================
-- Ejecuta esto en Supabase SQL Editor

-- 1. DESACTIVAR RLS TEMPORALMENTE PARA VERIFICAR
-- (Solo para debugging - NO dejar así en producción)
ALTER TABLE tags DISABLE ROW LEVEL SECURITY;
ALTER TABLE ai_platforms DISABLE ROW LEVEL SECURITY;
ALTER TABLE prompts DISABLE ROW LEVEL SECURITY;
ALTER TABLE prompt_tags DISABLE ROW LEVEL SECURITY;
ALTER TABLE prompt_platforms DISABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles DISABLE ROW LEVEL SECURITY;

-- 2. VERIFICAR QUE HAY DATOS
SELECT 'TAGS COUNT' as table_name, COUNT(*) as count FROM tags
UNION ALL
SELECT 'AI_PLATFORMS COUNT', COUNT(*) FROM ai_platforms
UNION ALL
SELECT 'PROMPTS COUNT', COUNT(*) FROM prompts
UNION ALL
SELECT 'USER_PROFILES COUNT', COUNT(*) FROM user_profiles;

-- 3. VER DATOS ESPECÍFICOS
SELECT * FROM tags LIMIT 5;
SELECT * FROM ai_platforms LIMIT 5;
SELECT * FROM prompts LIMIT 5;

-- 4. SI TODO FUNCIONA SIN RLS, REACTIVAR RLS CON POLÍTICAS CORRECTAS
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_platforms ENABLE ROW LEVEL SECURITY;
ALTER TABLE prompts ENABLE ROW LEVEL SECURITY;
ALTER TABLE prompt_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE prompt_platforms ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- 5. CREAR POLÍTICAS PERMISIVAS (ACCESO PÚBLICO PARA LECTURA)
-- Tags
DROP POLICY IF EXISTS "Tags are viewable by everyone" ON tags;
CREATE POLICY "Tags are viewable by everyone"
  ON tags FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Tags can be managed by admins" ON tags;
CREATE POLICY "Tags can be managed by admins"
  ON tags FOR ALL
  USING ((SELECT role FROM user_profiles WHERE id = auth.uid()) = 'admin');

-- AI Platforms
DROP POLICY IF EXISTS "AI Platforms are viewable by everyone" ON ai_platforms;
CREATE POLICY "AI Platforms are viewable by everyone"
  ON ai_platforms FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "AI Platforms can be managed by admins" ON ai_platforms;
CREATE POLICY "AI Platforms can be managed by admins"
  ON ai_platforms FOR ALL
  USING ((SELECT role FROM user_profiles WHERE id = auth.uid()) = 'admin');

-- Prompts
DROP POLICY IF EXISTS "Prompts are viewable by everyone" ON prompts;
CREATE POLICY "Prompts are viewable by everyone"
  ON prompts FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Prompts can be created by admins" ON prompts;
CREATE POLICY "Prompts can be created by admins"
  ON prompts FOR INSERT
  WITH CHECK ((SELECT role FROM user_profiles WHERE id = auth.uid()) = 'admin');

DROP POLICY IF EXISTS "Prompts can be updated by admins" ON prompts;
CREATE POLICY "Prompts can be updated by admins"
  ON prompts FOR UPDATE
  USING ((SELECT role FROM user_profiles WHERE id = auth.uid()) = 'admin');

DROP POLICY IF EXISTS "Prompts can be deleted by admins" ON prompts;
CREATE POLICY "Prompts can be deleted by admins"
  ON prompts FOR DELETE
  USING ((SELECT role FROM user_profiles WHERE id = auth.uid()) = 'admin');

-- Prompt Tags (Junction Table)
DROP POLICY IF EXISTS "Prompt tags are viewable by everyone" ON prompt_tags;
CREATE POLICY "Prompt tags are viewable by everyone"
  ON prompt_tags FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Prompt tags can be managed by admins" ON prompt_tags;
CREATE POLICY "Prompt tags can be managed by admins"
  ON prompt_tags FOR ALL
  USING ((SELECT role FROM user_profiles WHERE id = auth.uid()) = 'admin');

-- Prompt Platforms (Junction Table)
DROP POLICY IF EXISTS "Prompt platforms are viewable by everyone" ON prompt_platforms;
CREATE POLICY "Prompt platforms are viewable by everyone"
  ON prompt_platforms FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Prompt platforms can be managed by admins" ON prompt_platforms;
CREATE POLICY "Prompt platforms can be managed by admins"
  ON prompt_platforms FOR ALL
  USING ((SELECT role FROM user_profiles WHERE id = auth.uid()) = 'admin');

-- User Profiles
DROP POLICY IF EXISTS "User profiles are viewable by everyone" ON user_profiles;
CREATE POLICY "User profiles are viewable by everyone"
  ON user_profiles FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;
CREATE POLICY "Users can update own profile"
  ON user_profiles FOR UPDATE
  USING (auth.uid() = id);

-- 6. VERIFICAR POLÍTICAS
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
