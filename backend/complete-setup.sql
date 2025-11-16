-- ============================================================================
-- BIBLIO PROMPT SALUD - SETUP COMPLETO
-- Ejecuta este archivo COMPLETO en Supabase SQL Editor
-- ============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- 1. CREAR TABLAS
-- ============================================================================

-- Tags table
CREATE TABLE IF NOT EXISTS tags (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) UNIQUE NOT NULL,
  description TEXT DEFAULT '',
  color VARCHAR(7) DEFAULT '#0ea5e9',
  category VARCHAR(50) CHECK (category IN ('specialty', 'use-case', 'difficulty', 'other')) DEFAULT 'other',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- AI Platforms table
CREATE TABLE IF NOT EXISTS ai_platforms (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) UNIQUE NOT NULL,
  description TEXT NOT NULL,
  icon VARCHAR(500) DEFAULT '',
  url VARCHAR(500) DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Prompts table
CREATE TABLE IF NOT EXISTS prompts (
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
CREATE TABLE IF NOT EXISTS prompt_tags (
  prompt_id UUID REFERENCES prompts(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (prompt_id, tag_id)
);

-- Junction table for prompts and ai_platforms (many-to-many)
CREATE TABLE IF NOT EXISTS prompt_platforms (
  prompt_id UUID REFERENCES prompts(id) ON DELETE CASCADE,
  platform_id UUID REFERENCES ai_platforms(id) ON DELETE CASCADE,
  PRIMARY KEY (prompt_id, platform_id)
);

-- User profiles table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(20) CHECK (role IN ('admin', 'user')) DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- 2. CREAR ÍNDICES
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_prompts_votes ON prompts(votes DESC);
CREATE INDEX IF NOT EXISTS idx_prompts_recommended ON prompts(is_recommended);
CREATE INDEX IF NOT EXISTS idx_prompts_created_at ON prompts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_tags_category ON tags(category);
CREATE INDEX IF NOT EXISTS idx_prompt_tags_prompt ON prompt_tags(prompt_id);
CREATE INDEX IF NOT EXISTS idx_prompt_tags_tag ON prompt_tags(tag_id);
CREATE INDEX IF NOT EXISTS idx_prompt_platforms_prompt ON prompt_platforms(prompt_id);
CREATE INDEX IF NOT EXISTS idx_prompt_platforms_platform ON prompt_platforms(platform_id);

-- ============================================================================
-- 3. CREAR TRIGGERS
-- ============================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers to auto-update updated_at
DROP TRIGGER IF EXISTS update_tags_updated_at ON tags;
CREATE TRIGGER update_tags_updated_at BEFORE UPDATE ON tags
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_ai_platforms_updated_at ON ai_platforms;
CREATE TRIGGER update_ai_platforms_updated_at BEFORE UPDATE ON ai_platforms
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_prompts_updated_at ON prompts;
CREATE TRIGGER update_prompts_updated_at BEFORE UPDATE ON prompts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON user_profiles;
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- 4. HABILITAR ROW LEVEL SECURITY (RLS)
-- ============================================================================

ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_platforms ENABLE ROW LEVEL SECURITY;
ALTER TABLE prompts ENABLE ROW LEVEL SECURITY;
ALTER TABLE prompt_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE prompt_platforms ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- 5. CREAR POLÍTICAS RLS
-- ============================================================================

-- Tags Policies
DROP POLICY IF EXISTS "Tags are viewable by everyone" ON tags;
CREATE POLICY "Tags are viewable by everyone" ON tags FOR SELECT USING (true);

DROP POLICY IF EXISTS "Tags are insertable by admins" ON tags;
CREATE POLICY "Tags are insertable by admins" ON tags FOR INSERT
  WITH CHECK ((SELECT role FROM user_profiles WHERE id = auth.uid()) = 'admin');

DROP POLICY IF EXISTS "Tags are updatable by admins" ON tags;
CREATE POLICY "Tags are updatable by admins" ON tags FOR UPDATE
  USING ((SELECT role FROM user_profiles WHERE id = auth.uid()) = 'admin');

DROP POLICY IF EXISTS "Tags are deletable by admins" ON tags;
CREATE POLICY "Tags are deletable by admins" ON tags FOR DELETE
  USING ((SELECT role FROM user_profiles WHERE id = auth.uid()) = 'admin');

-- AI Platforms Policies
DROP POLICY IF EXISTS "AI Platforms are viewable by everyone" ON ai_platforms;
CREATE POLICY "AI Platforms are viewable by everyone" ON ai_platforms FOR SELECT USING (true);

DROP POLICY IF EXISTS "AI Platforms are insertable by admins" ON ai_platforms;
CREATE POLICY "AI Platforms are insertable by admins" ON ai_platforms FOR INSERT
  WITH CHECK ((SELECT role FROM user_profiles WHERE id = auth.uid()) = 'admin');

DROP POLICY IF EXISTS "AI Platforms are updatable by admins" ON ai_platforms;
CREATE POLICY "AI Platforms are updatable by admins" ON ai_platforms FOR UPDATE
  USING ((SELECT role FROM user_profiles WHERE id = auth.uid()) = 'admin');

DROP POLICY IF EXISTS "AI Platforms are deletable by admins" ON ai_platforms;
CREATE POLICY "AI Platforms are deletable by admins" ON ai_platforms FOR DELETE
  USING ((SELECT role FROM user_profiles WHERE id = auth.uid()) = 'admin');

-- Prompts Policies
DROP POLICY IF EXISTS "Prompts are viewable by everyone" ON prompts;
CREATE POLICY "Prompts are viewable by everyone" ON prompts FOR SELECT USING (true);

DROP POLICY IF EXISTS "Prompts are insertable by admins" ON prompts;
CREATE POLICY "Prompts are insertable by admins" ON prompts FOR INSERT
  WITH CHECK ((SELECT role FROM user_profiles WHERE id = auth.uid()) = 'admin');

DROP POLICY IF EXISTS "Prompts are updatable by admins" ON prompts;
CREATE POLICY "Prompts are updatable by admins" ON prompts FOR UPDATE
  USING ((SELECT role FROM user_profiles WHERE id = auth.uid()) = 'admin');

DROP POLICY IF EXISTS "Prompts are deletable by admins" ON prompts;
CREATE POLICY "Prompts are deletable by admins" ON prompts FOR DELETE
  USING ((SELECT role FROM user_profiles WHERE id = auth.uid()) = 'admin');

-- Prompt Tags Policies
DROP POLICY IF EXISTS "Prompt tags are viewable by everyone" ON prompt_tags;
CREATE POLICY "Prompt tags are viewable by everyone" ON prompt_tags FOR SELECT USING (true);

DROP POLICY IF EXISTS "Prompt tags are insertable by admins" ON prompt_tags;
CREATE POLICY "Prompt tags are insertable by admins" ON prompt_tags FOR INSERT
  WITH CHECK ((SELECT role FROM user_profiles WHERE id = auth.uid()) = 'admin');

DROP POLICY IF EXISTS "Prompt tags are deletable by admins" ON prompt_tags;
CREATE POLICY "Prompt tags are deletable by admins" ON prompt_tags FOR DELETE
  USING ((SELECT role FROM user_profiles WHERE id = auth.uid()) = 'admin');

-- Prompt Platforms Policies
DROP POLICY IF EXISTS "Prompt platforms are viewable by everyone" ON prompt_platforms;
CREATE POLICY "Prompt platforms are viewable by everyone" ON prompt_platforms FOR SELECT USING (true);

DROP POLICY IF EXISTS "Prompt platforms are insertable by admins" ON prompt_platforms;
CREATE POLICY "Prompt platforms are insertable by admins" ON prompt_platforms FOR INSERT
  WITH CHECK ((SELECT role FROM user_profiles WHERE id = auth.uid()) = 'admin');

DROP POLICY IF EXISTS "Prompt platforms are deletable by admins" ON prompt_platforms;
CREATE POLICY "Prompt platforms are deletable by admins" ON prompt_platforms FOR DELETE
  USING ((SELECT role FROM user_profiles WHERE id = auth.uid()) = 'admin');

-- User Profiles Policies
DROP POLICY IF EXISTS "User profiles are viewable by everyone" ON user_profiles;
CREATE POLICY "User profiles are viewable by everyone" ON user_profiles FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;
CREATE POLICY "Users can update own profile" ON user_profiles FOR UPDATE
  USING (auth.uid() = id);

-- ============================================================================
-- 6. FUNCIÓN PARA CREAR PERFIL DE USUARIO AUTOMÁTICAMENTE
-- ============================================================================

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

-- Trigger para auto-crear perfil de usuario
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================================
-- 7. INSERTAR DATOS DE EJEMPLO
-- ============================================================================

-- Insertar Tags
INSERT INTO tags (name, description, color, category) VALUES
('Cardiología', 'Prompts relacionados con cardiología', '#ef4444', 'specialty'),
('Medicina Interna', 'Prompts para medicina interna general', '#3b82f6', 'specialty'),
('Pediatría', 'Prompts específicos para pediatría', '#ec4899', 'specialty'),
('Diagnóstico', 'Ayuda en diagnóstico diferencial', '#8b5cf6', 'use-case'),
('Tratamiento', 'Recomendaciones de tratamiento', '#14b8a6', 'use-case'),
('Investigación', 'Búsqueda de literatura científica', '#f59e0b', 'use-case'),
('Documentación', 'Ayuda con documentación clínica', '#10b981', 'use-case'),
('Principiante', 'Prompts fáciles de usar', '#84cc16', 'difficulty'),
('Avanzado', 'Prompts para usuarios experimentados', '#f97316', 'difficulty')
ON CONFLICT (name) DO NOTHING;

-- Insertar Plataformas IA
INSERT INTO ai_platforms (name, description, url) VALUES
('ChatGPT', 'Modelo de lenguaje de OpenAI', 'https://chat.openai.com'),
('Claude', 'Asistente de IA de Anthropic', 'https://claude.ai'),
('Google Gemini', 'Modelo de IA de Google', 'https://gemini.google.com'),
('Perplexity', 'Motor de búsqueda con IA', 'https://perplexity.ai')
ON CONFLICT (name) DO NOTHING;

-- Insertar Prompts de ejemplo
INSERT INTO prompts (title, content, description, votes, is_recommended, author) VALUES
('Diagnóstico Diferencial en Dolor Torácico',
'Actúa como un médico especialista en medicina de urgencias. Tengo un paciente con las siguientes características:

[Edad, sexo, antecedentes relevantes]
Síntomas: [Descripción del dolor torácico]
Signos vitales: [TA, FC, FR, SatO2, Temperatura]
Exploración física: [Hallazgos relevantes]

Por favor, proporciona:
1. Diagnóstico diferencial ordenado por probabilidad
2. Estudios complementarios necesarios para cada diagnóstico
3. Criterios de gravedad y necesidad de ingreso
4. Tratamiento inicial según cada posibilidad diagnóstica

Enfócate en las patologías que requieren intervención urgente.',
'Ayuda a establecer un diagnóstico diferencial completo para pacientes con dolor torácico agudo.',
45,
true,
'admin@biblioprompt.com'),

('Interpretación de Gasometría Arterial',
'Actúa como un médico internista experto en interpretación de gasometrías.

Datos de la gasometría arterial:
- pH: [valor]
- PaCO2: [valor] mmHg
- PaO2: [valor] mmHg
- HCO3-: [valor] mEq/L
- BE: [valor]
- SatO2: [valor] %

Por favor, realiza:
1. Evaluación del estado ácido-base (acidosis/alcalosis, metabólica/respiratoria)
2. Identificación de compensación (completa, parcial, o sin compensar)
3. Cálculo del anion gap si corresponde
4. Evaluación de la oxigenación
5. Interpretación clínica y posibles causas
6. Recomendaciones de manejo inicial',
'Prompt para ayudar en la interpretación sistemática de gasometrías arteriales.',
38,
true,
'admin@biblioprompt.com'),

('Dosis Pediátricas de Medicamentos',
'Actúa como un pediatra especializado en farmacología pediátrica.

Paciente pediátrico:
- Edad: [edad]
- Peso: [kg]
- Diagnóstico: [diagnóstico]
- Medicamento a prescribir: [nombre del medicamento]

Por favor, proporciona:
1. Dosis recomendada en mg/kg/dosis
2. Dosis total calculada para este paciente
3. Frecuencia de administración
4. Vía de administración recomendada
5. Dosis máxima permitida
6. Precauciones específicas
7. Alternativas terapéuticas si las hay

Asegúrate de verificar contraindicaciones por edad y peso.',
'Cálculo seguro de dosis de medicamentos en pediatría según peso y edad.',
52,
true,
'admin@biblioprompt.com')
ON CONFLICT DO NOTHING;

-- Relacionar prompts con tags y plataformas
-- (Se ejecutará después de que se inserten los datos)
DO $$
DECLARE
  prompt1_id UUID;
  prompt2_id UUID;
  prompt3_id UUID;
  tag_cardio UUID;
  tag_diag UUID;
  tag_ped UUID;
  tag_trat UUID;
  tag_med_int UUID;
  tag_avanz UUID;
  plat_chatgpt UUID;
  plat_claude UUID;
BEGIN
  -- Obtener IDs de prompts
  SELECT id INTO prompt1_id FROM prompts WHERE title = 'Diagnóstico Diferencial en Dolor Torácico' LIMIT 1;
  SELECT id INTO prompt2_id FROM prompts WHERE title = 'Interpretación de Gasometría Arterial' LIMIT 1;
  SELECT id INTO prompt3_id FROM prompts WHERE title = 'Dosis Pediátricas de Medicamentos' LIMIT 1;

  -- Obtener IDs de tags
  SELECT id INTO tag_cardio FROM tags WHERE name = 'Cardiología' LIMIT 1;
  SELECT id INTO tag_diag FROM tags WHERE name = 'Diagnóstico' LIMIT 1;
  SELECT id INTO tag_ped FROM tags WHERE name = 'Pediatría' LIMIT 1;
  SELECT id INTO tag_trat FROM tags WHERE name = 'Tratamiento' LIMIT 1;
  SELECT id INTO tag_med_int FROM tags WHERE name = 'Medicina Interna' LIMIT 1;
  SELECT id INTO tag_avanz FROM tags WHERE name = 'Avanzado' LIMIT 1;

  -- Obtener IDs de plataformas
  SELECT id INTO plat_chatgpt FROM ai_platforms WHERE name = 'ChatGPT' LIMIT 1;
  SELECT id INTO plat_claude FROM ai_platforms WHERE name = 'Claude' LIMIT 1;

  -- Relacionar Prompt 1 (Dolor Torácico)
  IF prompt1_id IS NOT NULL THEN
    INSERT INTO prompt_tags (prompt_id, tag_id) VALUES (prompt1_id, tag_cardio) ON CONFLICT DO NOTHING;
    INSERT INTO prompt_tags (prompt_id, tag_id) VALUES (prompt1_id, tag_diag) ON CONFLICT DO NOTHING;
    INSERT INTO prompt_platforms (prompt_id, platform_id) VALUES (prompt1_id, plat_chatgpt) ON CONFLICT DO NOTHING;
    INSERT INTO prompt_platforms (prompt_id, platform_id) VALUES (prompt1_id, plat_claude) ON CONFLICT DO NOTHING;
  END IF;

  -- Relacionar Prompt 2 (Gasometría)
  IF prompt2_id IS NOT NULL THEN
    INSERT INTO prompt_tags (prompt_id, tag_id) VALUES (prompt2_id, tag_med_int) ON CONFLICT DO NOTHING;
    INSERT INTO prompt_tags (prompt_id, tag_id) VALUES (prompt2_id, tag_diag) ON CONFLICT DO NOTHING;
    INSERT INTO prompt_tags (prompt_id, tag_id) VALUES (prompt2_id, tag_avanz) ON CONFLICT DO NOTHING;
    INSERT INTO prompt_platforms (prompt_id, platform_id) VALUES (prompt2_id, plat_chatgpt) ON CONFLICT DO NOTHING;
    INSERT INTO prompt_platforms (prompt_id, platform_id) VALUES (prompt2_id, plat_claude) ON CONFLICT DO NOTHING;
  END IF;

  -- Relacionar Prompt 3 (Pediatría)
  IF prompt3_id IS NOT NULL THEN
    INSERT INTO prompt_tags (prompt_id, tag_id) VALUES (prompt3_id, tag_ped) ON CONFLICT DO NOTHING;
    INSERT INTO prompt_tags (prompt_id, tag_id) VALUES (prompt3_id, tag_trat) ON CONFLICT DO NOTHING;
    INSERT INTO prompt_platforms (prompt_id, platform_id) VALUES (prompt3_id, plat_chatgpt) ON CONFLICT DO NOTHING;
    INSERT INTO prompt_platforms (prompt_id, platform_id) VALUES (prompt3_id, plat_claude) ON CONFLICT DO NOTHING;
  END IF;
END $$;

-- ============================================================================
-- 8. VERIFICACIÓN
-- ============================================================================

-- Mostrar resumen de lo creado
DO $$
DECLARE
  tag_count INTEGER;
  platform_count INTEGER;
  prompt_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO tag_count FROM tags;
  SELECT COUNT(*) INTO platform_count FROM ai_platforms;
  SELECT COUNT(*) INTO prompt_count FROM prompts;

  RAISE NOTICE '✅ Setup completado exitosamente!';
  RAISE NOTICE '📊 Resumen:';
  RAISE NOTICE '   - Tags: %', tag_count;
  RAISE NOTICE '   - Plataformas IA: %', platform_count;
  RAISE NOTICE '   - Prompts: %', prompt_count;
  RAISE NOTICE '';
  RAISE NOTICE '🔑 Siguiente paso:';
  RAISE NOTICE '   1. Ve a Authentication → Users en Supabase Dashboard';
  RAISE NOTICE '   2. Crea un usuario: admin@biblioprompt.com';
  RAISE NOTICE '   3. Ejecuta: UPDATE user_profiles SET role = ''admin'' WHERE email = ''admin@biblioprompt.com'';';
END $$;

-- FIN DEL SCRIPT
