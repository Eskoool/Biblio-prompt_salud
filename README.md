# 🏥 Biblio Prompt Salud

**Biblioteca de prompts de IA para profesionales sanitarios**

Una plataforma web moderna y profesional donde los profesionales de la salud pueden descubrir, compartir y votar prompts especializados para inteligencia artificial aplicada al sector sanitario.

## ✨ Características

- 🎯 **Prompts Especializados**: Colección curada de prompts para diferentes especialidades médicas
- ⭐ **Sistema de Votación**: Los usuarios pueden votar por los mejores prompts
- 🏷️ **Sistema de Etiquetas**: Organización por especialidad, caso de uso y dificultad
- 🤖 **Plataformas IA**: Información sobre compatibilidad con diferentes plataformas (ChatGPT, Claude, etc.)
- 📋 **Copiar con un Click**: Funcionalidad de copia rápida al portapapeles
- 🔐 **Panel de Administración**: Gestión completa de prompts, etiquetas y plataformas
- 📱 **Diseño Responsive**: Optimizado para todos los dispositivos
- 🎨 **Interfaz Moderna**: Diseño minimalista y profesional con animaciones suaves

## 🛠️ Stack Tecnológico

### Frontend
- **React 18** - Biblioteca de interfaz de usuario
- **TypeScript** - Tipado estático
- **Vite** - Build tool ultra-rápido
- **Tailwind CSS** - Framework de estilos utility-first
- **Framer Motion** - Animaciones fluidas
- **React Router** - Navegación SPA
- **Axios** - Cliente HTTP
- **React Hot Toast** - Notificaciones elegantes

### Backend
- **Node.js** - Runtime de JavaScript
- **Express** - Framework web
- **TypeScript** - Tipado estático
- **Supabase** - Backend-as-a-Service (PostgreSQL + Auth + Storage)
- **@supabase/supabase-js** - Cliente de Supabase

## 🚀 Instalación y Configuración

### Requisitos Previos

- Node.js 18+
- Cuenta de Supabase (gratuita)
- npm o yarn

### 1. Clonar el Repositorio

```bash
git clone https://github.com/tu-usuario/biblio-prompt-salud.git
cd biblio-prompt-salud
```

### 2. Configurar Supabase

**Sigue la guía detallada en [`SUPABASE_SETUP.md`](./SUPABASE_SETUP.md)**

Resumen rápido:

1. Crea un proyecto en [supabase.com](https://supabase.com)
2. Ejecuta el schema SQL (`backend/supabase-schema.sql`) en el SQL Editor
3. Obtén tus API keys en Settings → API
4. Crea un usuario admin en Authentication → Users

### 3. Configurar el Backend

```bash
cd backend

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus credenciales de Supabase:
# SUPABASE_URL=https://tu-proyecto.supabase.co
# SUPABASE_ANON_KEY=tu-anon-key
# SUPABASE_SERVICE_ROLE_KEY=tu-service-role-key

# Iniciar el servidor de desarrollo
npm run dev
```

El backend estará disponible en `http://localhost:5000`

### 4. Configurar el Frontend

```bash
cd frontend

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus credenciales de Supabase:
# VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
# VITE_SUPABASE_ANON_KEY=tu-anon-key

# Iniciar el servidor de desarrollo
npm run dev
```

El frontend estará disponible en `http://localhost:3000`

## 📦 Scripts Disponibles

### Frontend

```bash
npm run dev      # Servidor de desarrollo
npm run build    # Build para producción
npm run preview  # Preview del build
npm run lint     # Linter
```

### Backend

```bash
npm run dev      # Servidor de desarrollo con hot reload
npm run build    # Compilar TypeScript
npm run start    # Servidor de producción
```

**Nota**: El seed de datos se hace directamente en Supabase SQL Editor (ver `SUPABASE_SETUP.md`)

## 🔑 Credenciales de Acceso

Configura el usuario admin en Supabase Dashboard:

- **Email**: admin@biblioprompt.com (o el que prefieras)
- **Contraseña**: admin123 (configúralo en Supabase)
- **Rol**: Actualiza a 'admin' en la tabla `user_profiles`

⚠️ **Importante**: Cambia estas credenciales en producción.

Ver guía completa en [`SUPABASE_SETUP.md`](./SUPABASE_SETUP.md)

## 📱 Características del Proyecto

### Página Principal
- Sección de prompts más votados
- Sección de prompts recomendados
- Hero section con información del proyecto
- Navegación intuitiva

### Página de Todos los Prompts
- Búsqueda en tiempo real
- Filtros por etiquetas
- Filtros por plataformas IA
- Ordenamiento (más votados, recientes, alfabético)
- Sistema de paginación

### Panel de Administración
- CRUD completo de prompts
- Gestión de etiquetas (nombre, color, categoría)
- Gestión de plataformas IA
- Marcar prompts como recomendados
- Interfaz con pestañas

### Tarjetas de Prompt
- Título y descripción
- Vista previa del contenido
- Etiquetas con colores
- Plataformas compatibles
- Contador de votos
- Botón de copia rápida
- Efectos visuales al interactuar

## 🏗️ Estructura del Proyecto

```
biblio-prompt-salud/
├── frontend/
│   ├── src/
│   │   ├── components/      # Componentes React
│   │   ├── pages/          # Páginas principales
│   │   ├── services/       # API clients
│   │   ├── types/          # TypeScript types
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── public/
│   └── package.json
├── backend/
│   ├── src/
│   │   ├── config/         # Configuración
│   │   ├── models/         # Modelos Mongoose
│   │   ├── routes/         # Rutas API
│   │   ├── middleware/     # Middleware personalizado
│   │   ├── scripts/        # Scripts utilitarios
│   │   └── server.ts       # Entry point
│   └── package.json
└── README.md
```

## 🌐 API Endpoints

### Prompts
- `GET /api/prompts` - Obtener todos los prompts
- `GET /api/prompts/top-voted` - Prompts más votados
- `GET /api/prompts/recommended` - Prompts recomendados
- `GET /api/prompts/:id` - Obtener un prompt específico
- `POST /api/prompts` - Crear prompt (admin)
- `PUT /api/prompts/:id` - Actualizar prompt (admin)
- `DELETE /api/prompts/:id` - Eliminar prompt (admin)
- `POST /api/prompts/vote` - Votar por un prompt

### Tags
- `GET /api/tags` - Obtener todas las etiquetas
- `POST /api/tags` - Crear etiqueta (admin)
- `PUT /api/tags/:id` - Actualizar etiqueta (admin)
- `DELETE /api/tags/:id` - Eliminar etiqueta (admin)

### Plataformas IA
- `GET /api/ai-platforms` - Obtener todas las plataformas
- `POST /api/ai-platforms` - Crear plataforma (admin)
- `PUT /api/ai-platforms/:id` - Actualizar plataforma (admin)
- `DELETE /api/ai-platforms/:id` - Eliminar plataforma (admin)

### Autenticación
- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/register` - Registrar usuario

## 🎨 Paleta de Colores

- **Primary**: Azul (#0ea5e9) - Confianza y profesionalidad
- **Medical**: Turquesa (#14b8a6) - Sector sanitario
- **Accent**: Colores variados para etiquetas
- **Neutral**: Grises para texto y fondos

## 🤝 Contribución

Las contribuciones son bienvenidas. Para cambios importantes:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 👥 Autor

Creado con ❤️ para la comunidad sanitaria

## 🙏 Agradecimientos

- Diseñado para mejorar la atención médica mediante IA
- Inspirado en las necesidades de profesionales de la salud
- Construido con las mejores prácticas de desarrollo web

---

**Nota**: Este es un proyecto educativo/demostrativo. Los prompts médicos deben ser validados por profesionales antes de su uso clínico.