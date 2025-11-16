import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaPlus, FaEdit, FaTrash, FaRobot } from 'react-icons/fa';
import { aiPlatformsAPI } from '../../services/api';
import type { AIPlatform } from '../../types';
import toast from 'react-hot-toast';
import PlatformFormModal from './PlatformFormModal';

const AdminPlatforms = () => {
  const [platforms, setPlatforms] = useState<AIPlatform[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPlatform, setEditingPlatform] = useState<AIPlatform | null>(null);

  useEffect(() => {
    loadPlatforms();
  }, []);

  const loadPlatforms = async () => {
    try {
      setLoading(true);
      const data = await aiPlatformsAPI.getAll();
      setPlatforms(data);
    } catch (error) {
      toast.error('Error al cargar plataformas');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingPlatform(null);
    setModalOpen(true);
  };

  const handleEdit = (platform: AIPlatform) => {
    setEditingPlatform(platform);
    setModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar esta plataforma?')) return;

    try {
      await aiPlatformsAPI.delete(id);
      setPlatforms((prev) => prev.filter((p) => p._id !== id));
      toast.success('Plataforma eliminada');
    } catch (error) {
      toast.error('Error al eliminar plataforma');
    }
  };

  const handleSave = async (data: Omit<AIPlatform, '_id'>) => {
    try {
      if (editingPlatform) {
        const updated = await aiPlatformsAPI.update(editingPlatform._id, data);
        setPlatforms((prev) =>
          prev.map((p) => (p._id === updated._id ? updated : p))
        );
        toast.success('Plataforma actualizada');
      } else {
        const created = await aiPlatformsAPI.create(data);
        setPlatforms((prev) => [...prev, created]);
        toast.success('Plataforma creada');
      }
      setModalOpen(false);
    } catch (error) {
      toast.error('Error al guardar plataforma');
    }
  };

  if (loading) {
    return <div className="text-center py-12">Cargando...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          Plataformas IA ({platforms.length})
        </h2>
        <button onClick={handleCreate} className="btn-primary">
          <FaPlus className="mr-2" />
          Nueva Plataforma
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {platforms.map((platform) => (
          <motion.div
            key={platform._id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="card p-6"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center">
                <div className="bg-blue-100 p-3 rounded-lg mr-3">
                  <FaRobot className="text-blue-600 text-xl" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {platform.name}
                </h3>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(platform)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <FaEdit />
                </button>
                <button
                  onClick={() => handleDelete(platform._id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <FaTrash />
                </button>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-3">{platform.description}</p>
            {platform.url && (
              <a
                href={platform.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:underline"
              >
                Visitar sitio web
              </a>
            )}
          </motion.div>
        ))}
      </div>

      {modalOpen && (
        <PlatformFormModal
          platform={editingPlatform}
          onSave={handleSave}
          onClose={() => setModalOpen(false)}
        />
      )}
    </div>
  );
};

export default AdminPlatforms;
