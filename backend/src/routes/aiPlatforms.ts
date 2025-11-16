import express from 'express';
import AIPlatform from '../models/AIPlatform';
import { authenticateToken, requireAdmin } from '../middleware/auth';

const router = express.Router();

// Get all AI platforms
router.get('/', async (req, res) => {
  try {
    const platforms = await AIPlatform.find().sort({ name: 1 });
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

    const platform = new AIPlatform({
      name,
      description,
      icon,
      url,
    });

    await platform.save();
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

    const platform = await AIPlatform.findByIdAndUpdate(
      req.params.id,
      { name, description, icon, url },
      { new: true }
    );

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
    const platform = await AIPlatform.findByIdAndDelete(req.params.id);

    if (!platform) {
      return res.status(404).json({ message: 'Plataforma IA no encontrada' });
    }

    res.json({ message: 'Plataforma IA eliminada exitosamente' });
  } catch (error) {
    console.error('Error deleting AI platform:', error);
    res.status(500).json({ message: 'Error al eliminar plataforma IA' });
  }
});

export default router;
