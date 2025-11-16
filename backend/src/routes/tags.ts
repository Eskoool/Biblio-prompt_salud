import express from 'express';
import Tag from '../models/Tag';
import { authenticateToken, requireAdmin } from '../middleware/auth';

const router = express.Router();

// Get all tags
router.get('/', async (req, res) => {
  try {
    const tags = await Tag.find().sort({ category: 1, name: 1 });
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

    const tag = new Tag({
      name,
      description,
      color,
      category,
    });

    await tag.save();
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

    const tag = await Tag.findByIdAndUpdate(
      req.params.id,
      { name, description, color, category },
      { new: true }
    );

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
    const tag = await Tag.findByIdAndDelete(req.params.id);

    if (!tag) {
      return res.status(404).json({ message: 'Etiqueta no encontrada' });
    }

    res.json({ message: 'Etiqueta eliminada exitosamente' });
  } catch (error) {
    console.error('Error deleting tag:', error);
    res.status(500).json({ message: 'Error al eliminar etiqueta' });
  }
});

export default router;
