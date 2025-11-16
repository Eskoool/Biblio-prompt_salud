import express from 'express';
import { supabaseAdmin } from '../config/database';
import { authenticateToken, requireAdmin } from '../middleware/auth';

const router = express.Router();

// Get all AI platforms
router.get('/', async (req, res) => {
  try {
    const { data: platforms, error } = await supabaseAdmin
      .from('ai_platforms')
      .select('*')
      .order('name', { ascending: true });

    if (error) throw error;

    res.json(platforms);
  } catch (error) {
    console.error('Error fetching AI platforms:', error);
    res.status(500).json({ message: 'Error al obtener plataformas IA' });
  }
});

// Create AI platform (admin only)
router.post('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { name, description, icon, url } = req.body;

    const { data: platform, error } = await supabaseAdmin
      .from('ai_platforms')
      .insert([{ name, description, icon, url }])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json(platform);
  } catch (error) {
    console.error('Error creating AI platform:', error);
    res.status(500).json({ message: 'Error al crear plataforma IA' });
  }
});

// Update AI platform (admin only)
router.put('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { name, description, icon, url } = req.body;

    const { data: platform, error } = await supabaseAdmin
      .from('ai_platforms')
      .update({ name, description, icon, url })
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) throw error;

    if (!platform) {
      return res.status(404).json({ message: 'Plataforma IA no encontrada' });
    }

    res.json(platform);
  } catch (error) {
    console.error('Error updating AI platform:', error);
    res.status(500).json({ message: 'Error al actualizar plataforma IA' });
  }
});

// Delete AI platform (admin only)
router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { error } = await supabaseAdmin
      .from('ai_platforms')
      .delete()
      .eq('id', req.params.id);

    if (error) throw error;

    res.json({ message: 'Plataforma IA eliminada exitosamente' });
  } catch (error) {
    console.error('Error deleting AI platform:', error);
    res.status(500).json({ message: 'Error al eliminar plataforma IA' });
  }
});

export default router;
