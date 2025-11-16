import express from 'express';
import { supabaseAdmin } from '../config/database';
import { authenticateToken, requireAdmin, AuthRequest } from '../middleware/auth';

const router = express.Router();

// Helper function to get prompts with related data
async function getPromptsWithRelations(query: any) {
  const { data: prompts, error } = await query;

  if (error) throw error;
  if (!prompts) return [];

  // Get tags and platforms for each prompt
  for (const prompt of prompts) {
    // Get tags
    const { data: promptTags } = await supabaseAdmin
      .from('prompt_tags')
      .select('tags(*)')
      .eq('prompt_id', prompt.id);

    prompt.tags = promptTags?.map((pt: any) => pt.tags) || [];

    // Get platforms
    const { data: promptPlatforms } = await supabaseAdmin
      .from('prompt_platforms')
      .select('ai_platforms(*)')
      .eq('prompt_id', prompt.id);

    prompt.ai_platforms = promptPlatforms?.map((pp: any) => pp.ai_platforms) || [];
  }

  return prompts;
}

// Get all prompts
router.get('/', async (req, res) => {
  try {
    const query = supabaseAdmin
      .from('prompts')
      .select('*')
      .order('votes', { ascending: false });

    const prompts = await getPromptsWithRelations(query);
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

    const query = supabaseAdmin
      .from('prompts')
      .select('*')
      .order('votes', { ascending: false })
      .limit(limit);

    const prompts = await getPromptsWithRelations(query);
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

    const query = supabaseAdmin
      .from('prompts')
      .select('*')
      .eq('is_recommended', true)
      .order('votes', { ascending: false })
      .limit(limit);

    const prompts = await getPromptsWithRelations(query);
    res.json(prompts);
  } catch (error) {
    console.error('Error fetching recommended prompts:', error);
    res.status(500).json({ message: 'Error al obtener prompts recomendados' });
  }
});

// Get single prompt
router.get('/:id', async (req, res) => {
  try {
    const query = supabaseAdmin
      .from('prompts')
      .select('*')
      .eq('id', req.params.id);

    const prompts = await getPromptsWithRelations(query);

    if (!prompts || prompts.length === 0) {
      return res.status(404).json({ message: 'Prompt no encontrado' });
    }

    res.json(prompts[0]);
  } catch (error) {
    console.error('Error fetching prompt:', error);
    res.status(500).json({ message: 'Error al obtener prompt' });
  }
});

// Create prompt (admin only)
router.post('/', authenticateToken, requireAdmin, async (req: AuthRequest, res) => {
  try {
    const { title, content, description, tags, aiPlatforms } = req.body;

    // Insert prompt
    const { data: prompt, error: promptError } = await supabaseAdmin
      .from('prompts')
      .insert([{
        title,
        content,
        description,
        author: req.user?.email,
      }])
      .select()
      .single();

    if (promptError) throw promptError;

    // Insert tag relationships
    if (tags && tags.length > 0) {
      const tagRelations = tags.map((tagId: string) => ({
        prompt_id: prompt.id,
        tag_id: tagId,
      }));

      const { error: tagError } = await supabaseAdmin
        .from('prompt_tags')
        .insert(tagRelations);

      if (tagError) throw tagError;
    }

    // Insert platform relationships
    if (aiPlatforms && aiPlatforms.length > 0) {
      const platformRelations = aiPlatforms.map((platformId: string) => ({
        prompt_id: prompt.id,
        platform_id: platformId,
      }));

      const { error: platformError } = await supabaseAdmin
        .from('prompt_platforms')
        .insert(platformRelations);

      if (platformError) throw platformError;
    }

    // Get prompt with relations
    const prompts = await getPromptsWithRelations(
      supabaseAdmin.from('prompts').select('*').eq('id', prompt.id)
    );

    res.status(201).json(prompts[0]);
  } catch (error) {
    console.error('Error creating prompt:', error);
    res.status(500).json({ message: 'Error al crear prompt' });
  }
});

// Update prompt (admin only)
router.put('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { title, content, description, tags, aiPlatforms, isRecommended } = req.body;

    // Update prompt
    const { data: prompt, error: promptError } = await supabaseAdmin
      .from('prompts')
      .update({
        title,
        content,
        description,
        is_recommended: isRecommended,
      })
      .eq('id', req.params.id)
      .select()
      .single();

    if (promptError) throw promptError;

    if (!prompt) {
      return res.status(404).json({ message: 'Prompt no encontrado' });
    }

    // Update tag relationships
    if (tags) {
      // Delete existing relations
      await supabaseAdmin
        .from('prompt_tags')
        .delete()
        .eq('prompt_id', req.params.id);

      // Insert new relations
      if (tags.length > 0) {
        const tagRelations = tags.map((tagId: string) => ({
          prompt_id: req.params.id,
          tag_id: tagId,
        }));

        await supabaseAdmin
          .from('prompt_tags')
          .insert(tagRelations);
      }
    }

    // Update platform relationships
    if (aiPlatforms) {
      // Delete existing relations
      await supabaseAdmin
        .from('prompt_platforms')
        .delete()
        .eq('prompt_id', req.params.id);

      // Insert new relations
      if (aiPlatforms.length > 0) {
        const platformRelations = aiPlatforms.map((platformId: string) => ({
          prompt_id: req.params.id,
          platform_id: platformId,
        }));

        await supabaseAdmin
          .from('prompt_platforms')
          .insert(platformRelations);
      }
    }

    // Get prompt with relations
    const prompts = await getPromptsWithRelations(
      supabaseAdmin.from('prompts').select('*').eq('id', req.params.id)
    );

    res.json(prompts[0]);
  } catch (error) {
    console.error('Error updating prompt:', error);
    res.status(500).json({ message: 'Error al actualizar prompt' });
  }
});

// Delete prompt (admin only)
router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    // Cascade delete should handle relations automatically
    const { error } = await supabaseAdmin
      .from('prompts')
      .delete()
      .eq('id', req.params.id);

    if (error) throw error;

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

    // Get current votes
    const { data: prompt, error: getError } = await supabaseAdmin
      .from('prompts')
      .select('votes')
      .eq('id', promptId)
      .single();

    if (getError) throw getError;

    if (!prompt) {
      return res.status(404).json({ message: 'Prompt no encontrado' });
    }

    // Calculate new votes
    let newVotes = prompt.votes + value;
    if (newVotes < 0) newVotes = 0;

    // Update votes
    const { error: updateError } = await supabaseAdmin
      .from('prompts')
      .update({ votes: newVotes })
      .eq('id', promptId);

    if (updateError) throw updateError;

    // Get updated prompt with relations
    const prompts = await getPromptsWithRelations(
      supabaseAdmin.from('prompts').select('*').eq('id', promptId)
    );

    res.json(prompts[0]);
  } catch (error) {
    console.error('Error voting:', error);
    res.status(500).json({ message: 'Error al votar' });
  }
});

export default router;
