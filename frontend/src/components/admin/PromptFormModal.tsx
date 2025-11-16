import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaTimes } from 'react-icons/fa';
import type { Prompt, Tag, AIPlatform, CreatePromptData } from '../../types';

interface PromptFormModalProps {
  prompt: Prompt | null;
  tags: Tag[];
  platforms: AIPlatform[];
  onSave: (data: CreatePromptData) => void;
  onClose: () => void;
}

const PromptFormModal = ({
  prompt,
  tags,
  platforms,
  onSave,
  onClose,
}: PromptFormModalProps) => {
  const [formData, setFormData] = useState<CreatePromptData>({
    title: '',
    description: '',
    content: '',
    tags: [],
    aiPlatforms: [],
  });

  useEffect(() => {
    if (prompt) {
      setFormData({
        title: prompt.title,
        description: prompt.description,
        content: prompt.content,
        tags: prompt.tags.map((t) => t._id),
        aiPlatforms: prompt.aiPlatforms.map((p) => p._id),
      });
    }
  }, [prompt]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const toggleTag = (tagId: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.includes(tagId)
        ? prev.tags.filter((id) => id !== tagId)
        : [...prev.tags, tagId],
    }));
  };

  const togglePlatform = (platformId: string) => {
    setFormData((prev) => ({
      ...prev,
      aiPlatforms: prev.aiPlatforms.includes(platformId)
        ? prev.aiPlatforms.filter((id) => id !== platformId)
        : [...prev.aiPlatforms, platformId],
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">
            {prompt ? 'Editar Prompt' : 'Nuevo Prompt'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <FaTimes className="text-2xl" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Título *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="input-field"
              placeholder="Ej: Diagnóstico diferencial en medicina interna"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descripción *
            </label>
            <textarea
              required
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={3}
              className="input-field"
              placeholder="Breve descripción del prompt y su utilidad..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contenido del Prompt *
            </label>
            <textarea
              required
              value={formData.content}
              onChange={(e) =>
                setFormData({ ...formData, content: e.target.value })
              }
              rows={8}
              className="input-field font-mono text-sm"
              placeholder="Escribe aquí el prompt completo que será copiado por los usuarios..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Etiquetas
            </label>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <button
                  key={tag._id}
                  type="button"
                  onClick={() => toggleTag(tag._id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    formData.tags.includes(tag._id)
                      ? 'shadow-md scale-105'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  style={
                    formData.tags.includes(tag._id)
                      ? { backgroundColor: tag.color, color: 'white' }
                      : {}
                  }
                >
                  {tag.name}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Plataformas IA
            </label>
            <div className="flex flex-wrap gap-2">
              {platforms.map((platform) => (
                <button
                  key={platform._id}
                  type="button"
                  onClick={() => togglePlatform(platform._id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    formData.aiPlatforms.includes(platform._id)
                      ? 'bg-blue-600 text-white shadow-md scale-105'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {platform.name}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-end space-x-4 pt-4">
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancelar
            </button>
            <button type="submit" className="btn-primary">
              {prompt ? 'Actualizar' : 'Crear'} Prompt
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default PromptFormModal;
