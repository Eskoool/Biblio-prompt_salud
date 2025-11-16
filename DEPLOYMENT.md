# 🚀 Guía de Deployment en Vercel

Esta guía te ayudará a deployar **Biblio Prompt Salud** en Vercel (monorepo con Frontend + Backend).

## 📦 Estructura del Proyecto

```
Biblio-prompt_salud/
├── frontend/          # React + Vite
├── backend/           # Express + Supabase
├── vercel.json        # Config para Frontend
└── backend/vercel.json # Config para Backend
```

## 🎯 Opción 1: Deploy Recomendado (Proyectos Separados)

### Frontend en Vercel

1. **Crear proyecto en Vercel:**
   - Ve a https://vercel.com/new
   - Selecciona tu repositorio GitHub
   - Framework Preset: **Vite**
   - Root Directory: **frontend**
   - Build Command: `npm run build`
   - Output Directory: `dist`

2. **Variables de entorno:**
   ```
   VITE_SUPABASE_URL=https://erlfovrvvhdadvepokdh.supabase.co
   VITE_SUPABASE_ANON_KEY=tu_anon_key
   VITE_API_URL=https://tu-backend.vercel.app
   ```

3. **Deploy:**
   - Click "Deploy"
   - URL del frontend: `https://biblio-prompt-salud.vercel.app`

### Backend en Vercel

1. **Crear segundo proyecto en Vercel:**
   - Ve a https://vercel.com/new
   - Selecciona el MISMO repositorio
   - Framework Preset: **Other**
   - Root Directory: **backend**
   - Build Command: `npm run build`
   - Output Directory: `dist`

2. **Variables de entorno:**
   ```
   NODE_ENV=production
   SUPABASE_URL=https://erlfovrvvhdadvepokdh.supabase.co
   SUPABASE_ANON_KEY=tu_anon_key
   SUPABASE_SERVICE_ROLE_KEY=tu_service_role_key
   ```

3. **Deploy:**
   - Click "Deploy"
   - URL del backend: `https://biblio-prompt-backend.vercel.app`

4. **Actualizar Frontend:**
   - Ve al proyecto del frontend en Vercel
   - Settings → Environment Variables
   - Actualiza `VITE_API_URL` con la URL del backend
   - Redeploy el frontend

## 🎯 Opción 2: Deploy desde Root (No Recomendado)

Si prefieres deployar todo desde la raíz:

### Frontend (Default)

El `vercel.json` en la raíz está configurado para deployar el frontend por defecto.

```bash
vercel --prod
```

### Backend (Manual)

```bash
cd backend
vercel --prod
```

## ⚙️ Configuración Post-Deploy

### 1. Crear Usuario Admin en Supabase

```sql
-- En Supabase SQL Editor
UPDATE user_profiles
SET role = 'admin'
WHERE email = 'admin@biblioprompt.com';
```

### 2. Verificar Variables de Entorno

Frontend necesita:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_API_URL` (URL del backend en Vercel)

Backend necesita:
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NODE_ENV=production`

### 3. Configurar CORS en Backend

Si tienes problemas de CORS, actualiza `backend/src/server.ts`:

```typescript
app.use(cors({
  origin: [
    'https://biblio-prompt-salud.vercel.app',
    'http://localhost:3000'
  ],
  credentials: true
}));
```

## 🔧 Troubleshooting

### Error: `tsc: command not found`

✅ **Solucionado:** TypeScript ahora está en `dependencies` en lugar de `devDependencies`.

### Error: Build fails

1. Verifica que estás usando Node.js 18.x o superior
2. Verifica que la Root Directory está correctamente configurada
3. Revisa los logs de build en Vercel Dashboard

### Error: API calls fail

1. Verifica que `VITE_API_URL` apunta a la URL correcta del backend
2. Verifica CORS en el backend
3. Revisa Network tab en DevTools del navegador

### Error: Supabase connection fails

1. Verifica las variables de entorno en Vercel Settings
2. Verifica que las keys de Supabase son las correctas
3. Verifica RLS policies en Supabase

## 📊 URLs de Producción

Después del deployment:

- Frontend: `https://tu-proyecto-frontend.vercel.app`
- Backend: `https://tu-proyecto-backend.vercel.app`
- Supabase: `https://erlfovrvvhdadvepokdh.supabase.co`

## 🔄 Redeploy Automático

Vercel automáticamente redeploya cuando haces push a tu branch principal:

```bash
git add .
git commit -m "feat: nueva funcionalidad"
git push origin main
```

## 📝 Notas Importantes

- **Supabase RLS:** Asegúrate de que las políticas RLS permiten acceso público para lectura
- **Service Role Key:** Solo úsala en el backend, NUNCA en el frontend
- **Variables de entorno:** No commitees archivos `.env` al repositorio
- **Build time:** El primer deploy puede tardar 2-3 minutos

## 🎉 ¡Listo!

Tu aplicación estará disponible en:
- Frontend: https://biblio-prompt-salud.vercel.app
- API: https://biblio-prompt-backend.vercel.app/api/health
