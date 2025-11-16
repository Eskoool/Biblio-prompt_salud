import express from 'express';
import { supabaseAdmin } from '../config/database';
import { authenticateToken, requireAdmin } from '../middleware/auth';

const router = express.Router();

// Get all tags
router.get('/', async (req, res) => {
  try {
    const { data: tags, error } = await supabaseAdmin
      .from('tags')
      .select('*')
      .order('category', { ascending: true })
      .order('name', { ascending: true });

    if (error) throw error;

    res.json(tags);
  } catch (error) {
    console.error('Error fetching tags:', error);
    res.status(500).json({ message: 'Error al obtener etiquetas' });
  }
});

// Create tag (admin only)
router.post('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { name, description, color, category } = req.body;

    const { data: tag, error } = await supabaseAdmin
      .from('tags')
      .insert([{ name, description, color, category }])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json(tag);
  } catch (error) {
    console.error('Error creating tag:', error);
    res.status(500).json({ message: 'Error al crear etiqueta' });
  }
});

// Update tag (admin only)
router.put('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { name, description, color, category } = req.body;

    const { data: tag, error } = await supabaseAdmin
      .from('tags')
      .update({ name, description, color, category })
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) throw error;

    if (!tag) {
      return res.status(404).json({ message: 'Etiqueta no encontrada' });
    }

    res.json(tag);
  } catch (error) {
    console.error('Error updating tag:', error);
    res.status(500).json({ message: 'Error al actualizar etiqueta' });
  }
});

// Delete tag (admin only)
router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { error } = await supabaseAdmin
      .from('tags')
      .delete()
      .eq('id', req.params.id);

    if (error) throw error;

    res.json({ message: 'Etiqueta eliminada exitosamente' });
  } catch (error) {
    console.error('Error deleting tag:', error);
    res.status(500).json({ message: 'Error al eliminar etiqueta' });
  }
});

export default router;
