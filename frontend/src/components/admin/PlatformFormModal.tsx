import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaTimes } from 'react-icons/fa';
import type { AIPlatform } from '../../types';

interface PlatformFormModalProps {
  platform: AIPlatform | null;
  onSave: (data: Omit<AIPlatform, '_id'>) => void;
  onClose: () => void;
}

const PlatformFormModal = ({
  platform,
  onSave,
  onClose,
}: PlatformFormModalProps) => {
  const [formData, setFormData] = useState<Omit<AIPlatform, '_id'>>({
    name: '',
    description: '',
    icon: '',
    url: '',
  });

  useEffect(() => {
    if (platform) {
      setFormData({
        name: platform.name,
        description: platform.description,
        icon: platform.icon || '',
        url: platform.url || '',
      });
    }
  }, [platform]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-xl shadow-xl max-w-lg w-full"
      >
        <div className="border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">
            {platform ? 'Editar Plataforma' : 'Nueva Plataforma'}
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
              placeholder="Ej: ChatGPT"
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
              placeholder="Descripción de la plataforma de IA..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              URL
            </label>
            <input
              type="url"
              value={formData.url}
              onChange={(e) =>
                setFormData({ ...formData, url: e.target.value })
              }
              className="input-field"
              placeholder="https://ejemplo.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Icono (URL)
            </label>
            <input
              type="text"
              value={formData.icon}
              onChange={(e) =>
                setFormData({ ...formData, icon: e.target.value })
              }
              className="input-field"
              placeholder="URL del icono (opcional)"
            />
          </div>

          <div className="flex justify-end space-x-4 pt-4">
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancelar
            </button>
            <button type="submit" className="btn-primary">
              {platform ? 'Actualizar' : 'Crear'} Plataforma
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default PlatformFormModal;
