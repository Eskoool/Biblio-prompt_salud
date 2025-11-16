import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaTimes } from 'react-icons/fa';
import type { Tag } from '../../types';

interface TagFormModalProps {
  tag: Tag | null;
  onSave: (data: Omit<Tag, '_id'>) => void;
  onClose: () => void;
}

const TagFormModal = ({ tag, onSave, onClose }: TagFormModalProps) => {
  const [formData, setFormData] = useState<Omit<Tag, '_id'>>({
    name: '',
    description: '',
    color: '#0ea5e9',
    category: 'other',
  });

  useEffect(() => {
    if (tag) {
      setFormData({
        name: tag.name,
        description: tag.description,
        color: tag.color,
        category: tag.category,
      });
    }
  }, [tag]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const presetColors = [
    '#0ea5e9', // blue
    '#14b8a6', // teal
    '#8b5cf6', // purple
    '#ec4899', // pink
    '#f59e0b', // amber
    '#10b981', // green
    '#ef4444', // red
    '#6366f1', // indigo
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-xl shadow-xl max-w-lg w-full"
      >
        <div className="border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">
            {tag ? 'Editar Etiqueta' : 'Nueva Etiqueta'}
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
              Nombre *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="input-field"
              placeholder="Ej: Cardiología"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descripción
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={3}
              className="input-field"
              placeholder="Descripción de la etiqueta..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Categoría *
            </label>
            <select
              required
              value={formData.category}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  category: e.target.value as Tag['category'],
                })
              }
              className="input-field"
            >
              <option value="specialty">Especialidad</option>
              <option value="use-case">Caso de Uso</option>
              <option value="difficulty">Dificultad</option>
              <option value="other">Otra</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Color *
            </label>
            <div className="flex flex-wrap gap-3 mb-3">
              {presetColors.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setFormData({ ...formData, color })}
                  className={`w-10 h-10 rounded-full transition-all duration-200 ${
                    formData.color === color
                      ? 'ring-4 ring-offset-2 scale-110'
                      : 'hover:scale-105'
                  }`}
                  style={{
                    backgroundColor: color,
                  }}
                />
              ))}
            </div>
            <input
              type="color"
              value={formData.color}
              onChange={(e) =>
                setFormData({ ...formData, color: e.target.value })
              }
              className="w-full h-12 rounded-lg cursor-pointer"
            />
          </div>

          <div className="flex justify-end space-x-4 pt-4">
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancelar
            </button>
            <button type="submit" className="btn-primary">
              {tag ? 'Actualizar' : 'Crear'} Etiqueta
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default TagFormModal;
