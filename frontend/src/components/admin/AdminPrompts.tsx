import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaPlus, FaEdit, FaTrash, FaStar } from 'react-icons/fa';
import { promptsAPI, tagsAPI, aiPlatformsAPI } from '../../services/api';
import type { Prompt, Tag, AIPlatform, CreatePromptData } from '../../types';
import toast from 'react-hot-toast';
import PromptFormModal from './PromptFormModal';

const AdminPrompts = () => {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [platforms, setPlatforms] = useState<AIPlatform[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPrompt, setEditingPrompt] = useState<Prompt | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [promptsData, tagsData, platformsData] = await Promise.all([
        promptsAPI.getAll(),
        tagsAPI.getAll(),
        aiPlatformsAPI.getAll(),
      ]);
      setPrompts(promptsData);
      setTags(tagsData);
      setPlatforms(platformsData);
    } catch (error) {
      toast.error('Error al cargar datos');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingPrompt(null);
    setModalOpen(true);
  };

  const handleEdit = (prompt: Prompt) => {
    setEditingPrompt(prompt);
    setModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar este prompt?')) return;

    try {
      await promptsAPI.delete(id);
      setPrompts((prev) => prev.filter((p) => p._id !== id));
      toast.success('Prompt eliminado');
    } catch (error) {
      toast.error('Error al eliminar prompt');
    }
  };

  const handleSave = async (data: CreatePromptData) => {
    try {
      if (editingPrompt) {
        const updated = await promptsAPI.update(editingPrompt._id, data);
        setPrompts((prev) =>
          prev.map((p) => (p._id === updated._id ? updated : p))
        );
        toast.success('Prompt actualizado');
      } else {
        const created = await promptsAPI.create(data);
        setPrompts((prev) => [created, ...prev]);
        toast.success('Prompt creado');
      }
      setModalOpen(false);
    } catch (error) {
      toast.error('Error al guardar prompt');
    }
  };

  if (loading) {
    return <div className="text-center py-12">Cargando...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          Prompts ({prompts.length})
        </h2>
        <button onClick={handleCreate} className="btn-primary">
          <FaPlus className="mr-2" />
          Nuevo Prompt
        </button>
      </div>

      <div className="grid gap-4">
        {prompts.map((prompt) => (
          <motion.div
            key={prompt._id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="card p-6"
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center mb-2">
                  <h3 className="text-xl font-semibold text-gray-900">
                    {prompt.title}
                  </h3>
                  {prompt.isRecommended && (
                    <FaStar className="ml-2 text-yellow-500" />
                  )}
                </div>
                <p className="text-gray-600 mb-3">{prompt.description}</p>

                <div className="flex flex-wrap gap-2 mb-3">
                  {prompt.tags.map((tag) => (
                    <span
                      key={tag._id}
                      className="px-3 py-1 rounded-full text-xs font-medium"
                      style={{
                        backgroundColor: tag.color + '20',
                        color: tag.color,
                      }}
                    >
                      {tag.name}
                    </span>
                  ))}
                </div>

                <div className="flex items-center text-sm text-gray-500">
                  <span className="mr-4">Votos: {prompt.votes}</span>
                  <span>
                    {new Date(prompt.createdAt).toLocaleDateString('es-ES')}
                  </span>
                </div>
              </div>

              <div className="flex space-x-2 ml-4">
                <button
                  onClick={() => handleEdit(prompt)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <FaEdit />
                </button>
                <button
                  onClick={() => handleDelete(prompt._id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {modalOpen && (
        <PromptFormModal
          prompt={editingPrompt}
          tags={tags}
          platforms={platforms}
          onSave={handleSave}
          onClose={() => setModalOpen(false)}
        />
      )}
    </div>
  );
};

export default AdminPrompts;
