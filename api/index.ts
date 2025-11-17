// Vercel Serverless Function
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Import Supabase client inline
import { createClient } from '@supabase/supabase-js';

// Initialize dotenv
dotenv.config();

// Supabase clients
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

const supabaseAdmin = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY!
);

// Initialize database connection (without throwing)
const connectDB = async (): Promise<void> => {
  try {
    const { data, error } = await supabase.from('tags').select('count');
    if (error && error.code !== 'PGRST116') throw error;
    console.log('✅ Supabase connected');
  } catch (error: any) {
    console.warn('⚠️ Initial Supabase connection test failed');
  }
};

// Auth middleware types
interface AuthRequest extends express.Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

// Auth middleware
const authenticateToken = async (
  req: AuthRequest,
  res: express.Response,
  next: express.NextFunction
) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Token de autenticación requerido' });
  }

  try {
    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (error || !user) {
      return res.status(403).json({ message: 'Token inválido o expirado' });
    }

    const { data: profile } = await supabase
      .from('user_profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    req.user = {
      id: user.id,
      email: user.email || '',
      role: profile?.role || 'user',
    };

    next();
  } catch (error) {
    return res.status(403).json({ message: 'Token inválido o expirado' });
  }
};

const requireAdmin = (
  req: AuthRequest,
  res: express.Response,
  next: express.NextFunction
) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ message: 'Acceso denegado' });
  }
  next();
};

// Create Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize DB
connectDB();

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Biblio Prompt Salud API is running' });
});

// Auth routes
app.post('/api/auth/login', async (req: express.Request, res: express.Response) => {
  try {
    const { email, password } = req.body;
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) return res.status(401).json({ message: 'Credenciales inválidas' });

    const { data: profile } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', data.user.id)
      .single();

    res.json({
      token: data.session.access_token,
      user: {
        id: data.user.id,
        email: data.user.email,
        name: profile?.name || 'User',
        role: profile?.role || 'user',
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Error en el servidor' });
  }
});

// Prompts routes
app.get('/api/prompts', async (req: express.Request, res: express.Response) => {
  try {
    const { data: prompts, error } = await supabaseAdmin.from('prompts').select('*').order('votes', { ascending: false });
    if (error) throw error;

    for (const prompt of prompts || []) {
      const { data: promptTags } = await supabaseAdmin.from('prompt_tags').select('tags(*)').eq('prompt_id', prompt.id);
      const { data: promptPlatforms } = await supabaseAdmin.from('prompt_platforms').select('ai_platforms(*)').eq('prompt_id', prompt.id);
      prompt.tags = promptTags?.map((pt: any) => pt.tags) || [];
      prompt.ai_platforms = promptPlatforms?.map((pp: any) => pp.ai_platforms) || [];
    }

    res.json(prompts);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener prompts' });
  }
});

app.get('/api/prompts/top-voted', async (req: express.Request, res: express.Response) => {
  try {
    const limit = parseInt(req.query.limit as string) || 6;
    const { data: prompts, error } = await supabaseAdmin.from('prompts').select('*').order('votes', { ascending: false }).limit(limit);
    if (error) throw error;

    for (const prompt of prompts || []) {
      const { data: promptTags } = await supabaseAdmin.from('prompt_tags').select('tags(*)').eq('prompt_id', prompt.id);
      const { data: promptPlatforms } = await supabaseAdmin.from('prompt_platforms').select('ai_platforms(*)').eq('prompt_id', prompt.id);
      prompt.tags = promptTags?.map((pt: any) => pt.tags) || [];
      prompt.ai_platforms = promptPlatforms?.map((pp: any) => pp.ai_platforms) || [];
    }

    res.json(prompts);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener prompts' });
  }
});

app.get('/api/prompts/recommended', async (req: express.Request, res: express.Response) => {
  try {
    const limit = parseInt(req.query.limit as string) || 6;
    const { data: prompts, error } = await supabaseAdmin.from('prompts').select('*').eq('is_recommended', true).order('votes', { ascending: false }).limit(limit);
    if (error) throw error;

    for (const prompt of prompts || []) {
      const { data: promptTags } = await supabaseAdmin.from('prompt_tags').select('tags(*)').eq('prompt_id', prompt.id);
      const { data: promptPlatforms } = await supabaseAdmin.from('prompt_platforms').select('ai_platforms(*)').eq('prompt_id', prompt.id);
      prompt.tags = promptTags?.map((pt: any) => pt.tags) || [];
      prompt.ai_platforms = promptPlatforms?.map((pp: any) => pp.ai_platforms) || [];
    }

    res.json(prompts);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener prompts' });
  }
});

// Tags routes
app.get('/api/tags', async (req: express.Request, res: express.Response) => {
  try {
    const { data: tags, error } = await supabaseAdmin.from('tags').select('*').order('category').order('name');
    if (error) throw error;
    res.json(tags);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener etiquetas' });
  }
});

// AI Platforms routes
app.get('/api/ai-platforms', async (req: express.Request, res: express.Response) => {
  try {
    const { data: platforms, error } = await supabaseAdmin.from('ai_platforms').select('*').order('name');
    if (error) throw error;
    res.json(platforms);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener plataformas IA' });
  }
});

// Vote endpoint
app.post('/api/prompts/vote', async (req: express.Request, res: express.Response) => {
  try {
    const { promptId, value } = req.body;
    const { data: prompt, error: getError } = await supabaseAdmin.from('prompts').select('votes').eq('id', promptId).single();

    if (getError) throw getError;
    if (!prompt) return res.status(404).json({ message: 'Prompt no encontrado' });

    let newVotes = prompt.votes + value;
    if (newVotes < 0) newVotes = 0;

    const { error: updateError } = await supabaseAdmin.from('prompts').update({ votes: newVotes }).eq('id', promptId);
    if (updateError) throw updateError;

    const { data: updatedPrompt } = await supabaseAdmin.from('prompts').select('*').eq('id', promptId).single();
    res.json(updatedPrompt);
  } catch (error) {
    res.status(500).json({ message: 'Error al votar' });
  }
});

// Error handling
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ message: err.message || 'Internal Server Error' });
});

// Export for Vercel Serverless
export default app;
