# 🚀 Guía de Deployment en Vercel

Esta guía te ayudará a deployar **Biblio Prompt Salud** en Vercel con **un solo proyecto** (Frontend + Backend juntos).

## 📦 Arquitectura

El proyecto está configurado como **monorepo unificado**:

```
Biblio-prompt_salud/
├── frontend/          # React + Vite (se sirve como sitio estático)
├── backend/           # Express + Supabase (se compila a /api)
├── api/               # Vercel Serverless Functions (wrapper del backend)
└── vercel.json        # Configuración unificada
```

**¿Cómo funciona?**
- Frontend → Se sirve desde `/` (Vite build estático)
- Backend → Se ejecuta como función serverless en `/api/*`
- En desarrollo → Vite hace proxy de `/api` a `localhost:5000`
- En producción → Vercel enruta `/api` a la función serverless

## 🚀 Deploy en Un Solo Proyecto

### 1. Conectar con Vercel

1. Ve a https://vercel.com/new
2. Selecciona tu repositorio `Biblio-prompt_salud`
3. **No cambies ninguna configuración** (el `vercel.json` lo maneja todo)
4. Click **"Deploy"**

### 2. Configurar Variables de Entorno

En el proyecto de Vercel, ve a **Settings** → **Environment Variables** y agrega:

```env
# Supabase (requerido)
SUPABASE_URL=https://erlfovrvvhdadvepokdh.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Node Environment
NODE_ENV=production

# Frontend (con VITE_ prefix)
VITE_SUPABASE_URL=https://erlfovrvvhdadvepokdh.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Importante:** Las variables `VITE_*` son para el frontend (se inyectan en build time).

### 3. Redeploy

Después de configurar las variables de entorno:
- Ve a **Deployments**
- Click en los 3 puntos del último deploy
- Click **"Redeploy"**

## ✅ Verificar Deployment

Una vez completado el deploy:

1. **Frontend:** `https://tu-proyecto.vercel.app/`
   - Deberías ver la página principal con prompts

2. **Backend API:** `https://tu-proyecto.vercel.app/api/health`
   - Debería responder: `{"status":"OK","message":"Biblio Prompt Salud API is running"}`

3. **Prompts:** `https://tu-proyecto.vercel.app/api/prompts`
   - Debería devolver array de prompts desde Supabase

## 🔧 Configuración Post-Deploy

### Crear Usuario Admin

El último paso es crear tu usuario administrador en Supabase:

**Opción 1: Desde Supabase Dashboard**

1. Ve a https://supabase.com/dashboard
2. Selecciona tu proyecto
3. **Authentication** → **Users** → **Add user** → **Create new user**
   - Email: `admin@biblioprompt.com`
   - Password: `admin123` (o el que prefieras)
   - ✅ Activa **"Auto Confirm User"**
4. Click **"Create user"**

5. Ve a **SQL Editor** y ejecuta:
```sql
UPDATE user_profiles
SET role = 'admin'
WHERE email = 'admin@biblioprompt.com';
```

**Opción 2: Desde la aplicación (si el registro está habilitado)**

1. Abre `https://tu-proyecto.vercel.app`
2. Click en **"Acceso Admin"**
3. Regístrate con email y contraseña
4. Ejecuta el SQL en Supabase para cambiar tu rol a admin

### Verificar RLS Policies

Asegúrate de que ejecutaste el `complete-setup.sql` en Supabase, que incluye:

- ✅ Políticas RLS para acceso público de lectura
- ✅ Políticas RLS para escritura solo admin
- ✅ Triggers para auto-crear perfiles de usuario
- ✅ Datos de ejemplo (tags, plataformas, prompts)

## 🔄 Desarrollo Local

Para desarrollar localmente:

```bash
# Instalar dependencias
npm run install:all

# Terminal 1: Backend
cd backend && npm run dev

# Terminal 2: Frontend
cd frontend && npm run dev
```

- Frontend: http://localhost:3000
- Backend: http://localhost:5000
- Vite hace proxy de `/api` → `http://localhost:5000/api`

## 🐛 Troubleshooting

### Error: "Cannot find module '../backend/dist/server.js'"

El backend no se compiló. Verifica:
1. `backend/package.json` tiene `typescript` en `dependencies` ✅
2. `backend/tsconfig.json` existe con `outDir: "./dist"` ✅
3. El build command se ejecutó: `cd backend && npm run build`

### Error: API calls return 404

Verifica el `vercel.json`:
```json
"rewrites": [
  {
    "source": "/api/:path*",
    "destination": "/api/index"
  }
]
```

### Error: CORS issues

Actualiza `backend/src/server.ts` para permitir tu dominio de Vercel:

```typescript
app.use(cors({
  origin: [
    'https://tu-proyecto.vercel.app',
    'http://localhost:3000'
  ],
  credentials: true
}));
```

### Error: Supabase connection failed

1. Verifica las variables de entorno en Vercel
2. Asegúrate de usar la **service role key** en el backend
3. Verifica que tu URL de Supabase es correcta

### Build fails: "tsc: command not found"

✅ **Ya solucionado:** TypeScript está en `dependencies`.

Si aún falla, verifica que `backend/package.json` tiene:
```json
{
  "dependencies": {
    "typescript": "^5.3.3",
    "ts-node": "^10.9.2"
  }
}
```

## 📊 Estructura de URLs en Producción

```
https://tu-proyecto.vercel.app/
├── /                          → Frontend (Vite SPA)
├── /api/health               → Backend health check
├── /api/prompts              → GET all prompts
├── /api/prompts/top-voted    → GET top voted prompts
├── /api/prompts/recommended  → GET recommended prompts
├── /api/tags                 → GET/POST/PUT/DELETE tags
├── /api/ai-platforms         → GET/POST/PUT/DELETE platforms
└── /api/auth/login           → POST login
```

## 🎯 Ventajas de Esta Configuración

✅ **Un solo proyecto** - Todo en Vercel, fácil de manejar
✅ **No necesitas CORS complicado** - Todo en el mismo dominio
✅ **Auto-scaling** - Vercel escala automáticamente backend y frontend
✅ **Deploy atómico** - Frontend y backend se actualizan juntos
✅ **URLs limpias** - Sin subdominios ni dominios separados
✅ **Costo optimizado** - Un solo proyecto en Vercel

## 🎉 ¡Listo!

Tu aplicación completa estará disponible en:
- **Aplicación:** https://tu-proyecto.vercel.app
- **API Health:** https://tu-proyecto.vercel.app/api/health
- **Admin Panel:** https://tu-proyecto.vercel.app/admin

¡Disfruta de **Biblio Prompt Salud**! 🏥✨
