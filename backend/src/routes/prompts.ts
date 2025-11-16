import express from 'express';
import Prompt from '../models/Prompt';
import { authenticateToken, requireAdmin, AuthRequest } from '../middleware/auth';

const router = express.Router();

// Get all prompts
router.get('/', async (req, res) => {
  try {
    const prompts = await Prompt.find()
      .populate('tags')
      .populate('aiPlatforms')
      .sort({ votes: -1 });

    res.json(prompts);
  } catch (error) {
    console.error('Error fetching prompts:', error);
    res.status(500).json({ message: 'Error al obtener prompts' });
  }
});

// Get top voted prompts
router.get('/top-voted', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit as string) || 6;
    const prompts = await Prompt.find()
      .populate('tags')
      .populate('aiPlatforms')
      .sort({ votes: -1 })
      .limit(limit);

    res.json(prompts);
  } catch (error) {
    console.error('Error fetching top voted prompts:', error);
    res.status(500).json({ message: 'Error al obtener prompts más votados' });
  }
});

// Get recommended prompts
router.get('/recommended', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit as string) || 6;
    const prompts = await Prompt.find({ isRecommended: true })
      .populate('tags')
      .populate('aiPlatforms')
      .sort({ votes: -1 })
      .limit(limit);

    res.json(prompts);
  } catch (error) {
    console.error('Error fetching recommended prompts:', error);
    res.status(500).json({ message: 'Error al obtener prompts recomendados' });
  }
});

// Get single prompt
router.get('/:id', async (req, res) => {
  try {
    const prompt = await Prompt.findById(req.params.id)
      .populate('tags')
      .populate('aiPlatforms');

    if (!prompt) {
      return res.status(404).json({ message: 'Prompt no encontrado' });
    }

    res.json(prompt);
  } catch (error) {
    console.error('Error fetching prompt:', error);
    res.status(500).json({ message: 'Error al obtener prompt' });
  }
});

// Create prompt (admin only)
router.post('/', authenticateToken, requireAdmin, async (req: AuthRequest, res) => {
  try {
    const { title, content, description, tags, aiPlatforms } = req.body;

    const prompt = new Prompt({
      title,
      content,
      description,
      tags,
      aiPlatforms,
      author: req.user?.email,
    });

    await prompt.save();
    await prompt.populate(['tags', 'aiPlatforms']);

    res.status(201).json(prompt);
  } catch (error) {
    console.error('Error creating prompt:', error);
    res.status(500).json({ message: 'Error al crear prompt' });
  }
});

// Update prompt (admin only)
router.put('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { title, content, description, tags, aiPlatforms, isRecommended } = req.body;

    const prompt = await Prompt.findByIdAndUpdate(
      req.params.id,
      { title, content, description, tags, aiPlatforms, isRecommended },
      { new: true }
    )
      .populate('tags')
      .populate('aiPlatforms');

    if (!prompt) {
      return res.status(404).json({ message: 'Prompt no encontrado' });
    }

    res.json(prompt);
  } catch (error) {
    console.error('Error updating prompt:', error);
    res.status(500).json({ message: 'Error al actualizar prompt' });
  }
});

// Delete prompt (admin only)
router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const prompt = await Prompt.findByIdAndDelete(req.params.id);

    if (!prompt) {
      return res.status(404).json({ message: 'Prompt no encontrado' });
    }

    res.json({ message: 'Prompt eliminado exitosamente' });
  } catch (error) {
    console.error('Error deleting prompt:', error);
    res.status(500).json({ message: 'Error al eliminar prompt' });
  }
});

// Vote for prompt (public)
router.post('/vote', async (req, res) => {
  try {
    const { promptId, value } = req.body;

    const prompt = await Prompt.findById(promptId);
    if (!prompt) {
      return res.status(404).json({ message: 'Prompt no encontrado' });
    }

    // Increment or decrement votes
    prompt.votes += value;
    if (prompt.votes < 0) prompt.votes = 0;

    await prompt.save();
    await prompt.populate(['tags', 'aiPlatforms']);

    res.json(prompt);
  } catch (error) {
    console.error('Error voting:', error);
    res.status(500).json({ message: 'Error al votar' });
  }
});

export default router;
