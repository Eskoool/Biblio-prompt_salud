# 🚀 Configuración de Supabase para Biblio Prompt Salud

Este proyecto utiliza **Supabase** como backend (PostgreSQL + Auth + Storage).

## 📋 Paso 1: Crear Proyecto en Supabase

1. Ve a [https://supabase.com](https://supabase.com)
2. Crea una cuenta o inicia sesión
3. Haz clic en "New Project"
4. Completa:
   - **Name**: biblio-prompt-salud
   - **Database Password**: Guarda esta contraseña de forma segura
   - **Region**: Elige la más cercana
   - **Pricing Plan**: Free (suficiente para desarrollo)
5. Haz clic en "Create new project"
6. Espera 1-2 minutos mientras se aprovisiona el proyecto

## 📦 Paso 2: Ejecutar el Schema SQL

1. En tu proyecto de Supabase, ve a **SQL Editor** (icono de base de datos en el menú lateral)
2. Haz clic en "+ New query"
3. Copia **TODO** el contenido del archivo `backend/supabase-schema.sql`
4. Pega en el editor SQL
5. Haz clic en **"Run"** o presiona `Ctrl/Cmd + Enter`
6. Verifica que se haya ejecutado sin errores (debería mostrar "Success. No rows returned")

Esto creará:
- ✅ 6 tablas: `tags`, `ai_platforms`, `prompts`, `prompt_tags`, `prompt_platforms`, `user_profiles`
- ✅ Índices para mejor rendimiento
- ✅ Row Level Security (RLS) policies
- ✅ Triggers para actualizar timestamps
- ✅ Función para crear perfiles de usuario automáticamente

## 🔑 Paso 3: Obtener las API Keys

1. En Supabase, ve a **Settings** → **API** (icono de engranaje)
2. En la sección "Project API keys" encontrarás:

   - **Project URL**: `https://xxxxxxxxxxxxx.supabase.co`
   - **anon public**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
   - **service_role secret**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (haz clic en "Reveal")

3. **IMPORTANTE**: Nunca compartas la `service_role` key públicamente

## ⚙️ Paso 4: Configurar Variables de Entorno

### Backend

1. Ve a `backend/` y copia el archivo de ejemplo:
   ```bash
   cd backend
   cp .env.example .env
   ```

2. Abre `backend/.env` y reemplaza con tus valores:
   ```env
   PORT=5000
   SUPABASE_URL=https://tu-proyecto.supabase.co
   SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   NODE_ENV=development
   ```

### Frontend

1. Ve a `frontend/` y crea un archivo `.env`:
   ```bash
   cd frontend
   touch .env
   ```

2. Agrega tus credenciales:
   ```env
   VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

## 👤 Paso 5: Crear Usuario Admin

### Opción A: Desde Supabase Dashboard (Recomendado)

1. Ve a **Authentication** → **Users**
2. Haz clic en **"Add user"** → **"Create new user"**
3. Completa:
   - **Email**: admin@biblioprompt.com
   - **Password**: admin123 (o la que prefieras)
   - **Auto Confirm User**: ✅ Activado
4. Haz clic en **"Create user"**
5. Copia el **User UID** que se muestra
6. Ve a **SQL Editor** y ejecuta esta query para hacerlo admin:
   ```sql
   UPDATE user_profiles
   SET role = 'admin'
   WHERE email = 'admin@biblioprompt.com';
   ```

### Opción B: Desde el API

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@biblioprompt.com",
    "password": "admin123",
    "name": "Administrador",
    "role": "admin"
  }'
```

## 🌱 Paso 6: Poblar con Datos de Ejemplo (Seed)

### Usando SQL Editor (Recomendado)

Crea una nueva query en SQL Editor y ejecuta:

```sql
-- Insertar Tags
INSERT INTO tags (name, description, color, category) VALUES
('Cardiología', 'Prompts relacionados con cardiología', '#ef4444', 'specialty'),
('Medicina Interna', 'Prompts para medicina interna general', '#3b82f6', 'specialty'),
('Pediatría', 'Prompts específicos para pediatría', '#ec4899', 'specialty'),
('Diagnóstico', 'Ayuda en diagnóstico diferencial', '#8b5cf6', 'use-case'),
('Tratamiento', 'Recomendaciones de tratamiento', '#14b8a6', 'use-case'),
('Principiante', 'Prompts fáciles de usar', '#84cc16', 'difficulty');

-- Insertar Plataformas IA
INSERT INTO ai_platforms (name, description, url) VALUES
('ChatGPT', 'Modelo de lenguaje de OpenAI', 'https://chat.openai.com'),
('Claude', 'Asistente de IA de Anthropic', 'https://claude.ai'),
('Google Gemini', 'Modelo de IA de Google', 'https://gemini.google.com'),
('Perplexity', 'Motor de búsqueda con IA', 'https://perplexity.ai');

-- Insertar un Prompt de ejemplo
INSERT INTO prompts (title, content, description, votes, is_recommended) VALUES
('Diagnóstico Diferencial en Dolor Torácico',
'Actúa como un médico especialista en medicina de urgencias...',
'Ayuda a establecer un diagnóstico diferencial completo para pacientes con dolor torácico agudo.',
45,
true);
```

## 🧪 Paso 7: Verificar la Instalación

### 1. Verificar Tablas
```sql
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public';
```

Deberías ver: `tags`, `ai_platforms`, `prompts`, `prompt_tags`, `prompt_platforms`, `user_profiles`

### 2. Verificar Usuario Admin
```sql
SELECT email, role
FROM user_profiles
WHERE role = 'admin';
```

### 3. Verificar Datos de Ejemplo
```sql
SELECT COUNT(*) FROM tags;
SELECT COUNT(*) FROM ai_platforms;
SELECT COUNT(*) FROM prompts;
```

## 🚀 Paso 8: Iniciar la Aplicación

### Backend
```bash
cd backend
npm install
npm run dev
```

El servidor debería iniciar en `http://localhost:5000` y mostrar:
```
✅ Supabase connected successfully
📦 Database: https://tu-proyecto.supabase.co
🚀 Server running on port 5000
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

La aplicación debería abrir en `http://localhost:3000`

## 🔐 Credenciales de Prueba

- **Email**: admin@biblioprompt.com
- **Password**: admin123 (o la que hayas configurado)

## 📊 Monitoreo y Gestión

### Supabase Dashboard

Desde el dashboard de Supabase puedes:

- **Table Editor**: Ver y editar datos directamente
- **SQL Editor**: Ejecutar queries personalizadas
- **Authentication**: Gestionar usuarios
- **Database** → **Roles**: Ver políticas RLS
- **Logs**: Ver logs de queries y errores
- **API Docs**: Documentación auto-generada de tu API

### Límites del Plan Free

- **Database**: 500 MB
- **Storage**: 1 GB
- **Bandwidth**: 2 GB
- **Auth Users**: Ilimitados
- **API Requests**: Ilimitadas

## 🔒 Seguridad (Producción)

Antes de desplegar en producción:

1. **Cambia las contraseñas** del usuario admin
2. **Regenera las API keys** en Supabase Settings
3. **Habilita Email Confirmation** en Auth settings
4. **Configura un dominio personalizado**
5. **Activa 2FA** para tu cuenta de Supabase
6. **Revisa las RLS policies** y ajusta según necesites
7. **Configura límites de rate limiting**

## ⚠️ Troubleshooting

### Error: "relation does not exist"
- Verifica que ejecutaste el schema SQL completo
- Revisa que no haya errores en SQL Editor

### Error: "Invalid API key"
- Verifica que copiaste las keys correctamente
- Asegúrate de usar la `anon` key para el frontend
- Usa la `service_role` key solo en el backend

### Error: "No rows returned" al crear usuario
- Verifica que el trigger `on_auth_user_created` existe
- Ejecuta manualmente: `SELECT public.handle_new_user()`

### No puedo hacer login
- Verifica que el usuario existe en Authentication → Users
- Verifica que el email está confirmado (columna `email_confirmed_at`)
- Revisa que el perfil existe en `user_profiles`

## 📚 Recursos Adicionales

- [Documentación de Supabase](https://supabase.com/docs)
- [Supabase Auth](https://supabase.com/docs/guides/auth)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript/introduction)

## 🆘 Soporte

Si tienes problemas:

1. Revisa la consola del navegador (F12)
2. Revisa los logs del backend
3. Revisa los logs en Supabase Dashboard → Logs
4. Abre un issue en GitHub con:
   - Descripción del error
   - Mensaje de error completo
   - Pasos para reproducir

---

¡Listo! Ahora tienes Biblio Prompt Salud corriendo con Supabase 🎉
