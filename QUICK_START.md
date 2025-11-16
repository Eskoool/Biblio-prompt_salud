# ⚡ Inicio Rápido - Biblio Prompt Salud

## ✅ Archivos .env Ya Configurados

Los archivos de configuración ya están listos con tus credenciales de Supabase:
- ✅ `backend/.env`
- ✅ `frontend/.env`

## 🚀 Pasos para Iniciar (5 minutos)

### 1️⃣ Ejecutar Schema SQL en Supabase (2 minutos)

**IMPORTANTE:** Solo necesitas hacer esto UNA VEZ

1. Ve a [Supabase Dashboard](https://supabase.com/dashboard)
2. Selecciona tu proyecto
3. Click en **SQL Editor** (menú lateral izquierdo)
4. Click en **"+ New query"**
5. Copia **TODO** el contenido de `backend/supabase-schema.sql`
6. Pégalo en el editor
7. Click **"Run"** o presiona `Ctrl/Cmd + Enter`
8. ✅ Debe mostrar **"Success. No rows returned"**

**¿Qué hace esto?**
- Crea las 6 tablas necesarias (tags, prompts, users, etc.)
- Configura seguridad (Row Level Security)
- Agrega índices para performance
- Configura triggers automáticos

### 2️⃣ Instalar Dependencias

```bash
# Backend
cd backend
npm install

# Frontend (en otra terminal)
cd frontend
npm install
```

### 3️⃣ Poblar con Datos de Ejemplo (30 segundos)

```bash
cd backend
npm run setup
```

Esto insertará:
- 9 tags (Cardiología, Pediatría, etc.)
- 4 plataformas IA (ChatGPT, Claude, etc.)
- 3 prompts de ejemplo
- Relaciones entre prompts, tags y plataformas

### 4️⃣ Crear Usuario Admin (1 minuto)

**Opción A: Desde Supabase Dashboard (Recomendado)**

1. Ve a **Authentication** → **Users**
2. Click **"Add user"** → **"Create new user"**
3. Completa:
   - **Email:** `admin@biblioprompt.com`
   - **Password:** `admin123` (o el que prefieras)
   - ✅ **Auto Confirm User:** Activado
4. Click **"Create user"**
5. Ve a **SQL Editor** y ejecuta:

```sql
UPDATE user_profiles
SET role = 'admin'
WHERE email = 'admin@biblioprompt.com';
```

**Opción B: Desde Terminal**

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

### 5️⃣ Iniciar la Aplicación

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```
✅ Debe mostrar: `✅ Supabase connected successfully`
✅ Server en: `http://localhost:5000`

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```
✅ App en: `http://localhost:3000`

### 6️⃣ Probar la Aplicación

1. Abre `http://localhost:3000`
2. Deberías ver prompts de ejemplo
3. Click en **"Acceso Admin"**
4. Login:
   - Email: `admin@biblioprompt.com`
   - Password: `admin123`
5. Accede al panel de administración

## 📊 Verificación

### Verificar Base de Datos

En Supabase Dashboard → **Table Editor**:

- **tags:** Deberías ver 9 etiquetas
- **ai_platforms:** 4 plataformas
- **prompts:** 3 prompts de ejemplo
- **user_profiles:** Tu usuario admin

### Verificar API

```bash
# Obtener tags
curl http://localhost:5000/api/tags

# Obtener prompts
curl http://localhost:5000/api/prompts
```

## ⚠️ Troubleshooting

### Error: "relation does not exist"
- ❌ No ejecutaste el schema SQL
- ✅ Ve al paso 1 y ejecuta `backend/supabase-schema.sql`

### Error: "Missing Supabase environment variables"
- ❌ Archivos .env no configurados
- ✅ Ya están configurados, verifica que existan:
  - `backend/.env`
  - `frontend/.env`

### No puedo hacer login
- ❌ Usuario admin no creado o no tiene rol admin
- ✅ Ve al paso 4 y ejecuta el UPDATE de SQL

### Backend no conecta
- ❌ Credenciales incorrectas en .env
- ✅ Verifica que `SUPABASE_URL` y `SUPABASE_ANON_KEY` sean correctos

## 🎯 Próximos Pasos

Una vez que todo funcione:

1. **Explora la app** - Navega por las secciones
2. **Crea prompts** - Usa el panel de administración
3. **Prueba el sistema de votación** - Vota por prompts
4. **Personaliza tags** - Agrega especialidades médicas
5. **Agrega más plataformas** - Otras IAs que uses

## 📚 Recursos

- **Guía Completa:** `SUPABASE_SETUP.md`
- **Schema SQL:** `backend/supabase-schema.sql`
- **Docs Supabase:** https://supabase.com/docs
- **Dashboard:** https://supabase.com/dashboard

---

## 🔥 Comandos Rápidos

```bash
# Instalar todo
npm run install:all

# Backend
cd backend
npm install
npm run setup    # Poblar datos
npm run dev      # Iniciar servidor

# Frontend
cd frontend
npm install
npm run dev      # Iniciar app

# Verificar datos
curl http://localhost:5000/api/tags
curl http://localhost:5000/api/prompts
```

---

**¿Listo? ¡Ejecuta el paso 1 y continúa desde ahí!** 🚀
