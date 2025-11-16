import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import { tagsAPI } from '../../services/api';
import type { Tag } from '../../types';
import toast from 'react-hot-toast';
import TagFormModal from './TagFormModal';

const AdminTags = () => {
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTag, setEditingTag] = useState<Tag | null>(null);

  useEffect(() => {
    loadTags();
  }, []);

  const loadTags = async () => {
    try {
      setLoading(true);
      const data = await tagsAPI.getAll();
      setTags(data);
    } catch (error) {
      toast.error('Error al cargar etiquetas');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingTag(null);
    setModalOpen(true);
  };

  const handleEdit = (tag: Tag) => {
    setEditingTag(tag);
    setModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar esta etiqueta?')) return;

    try {
      await tagsAPI.delete(id);
      setTags((prev) => prev.filter((t) => t._id !== id));
      toast.success('Etiqueta eliminada');
    } catch (error) {
      toast.error('Error al eliminar etiqueta');
    }
  };

  const handleSave = async (data: Omit<Tag, '_id'>) => {
    try {
      if (editingTag) {
        const updated = await tagsAPI.update(editingTag._id, data);
        setTags((prev) => prev.map((t) => (t._id === updated._id ? updated : t)));
        toast.success('Etiqueta actualizada');
      } else {
        const created = await tagsAPI.create(data);
        setTags((prev) => [...prev, created]);
        toast.success('Etiqueta creada');
      }
      setModalOpen(false);
    } catch (error) {
      toast.error('Error al guardar etiqueta');
    }
  };

  if (loading) {
    return <div className="text-center py-12">Cargando...</div>;
  }

  const tagsByCategory = tags.reduce((acc, tag) => {
    if (!acc[tag.category]) acc[tag.category] = [];
    acc[tag.category].push(tag);
    return acc;
  }, {} as Record<string, Tag[]>);

  const categoryLabels = {
    specialty: 'Especialidades',
    'use-case': 'Casos de Uso',
    difficulty: 'Dificultad',
    other: 'Otras',
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          Etiquetas ({tags.length})
        </h2>
        <button onClick={handleCreate} className="btn-primary">
          <FaPlus className="mr-2" />
          Nueva Etiqueta
        </button>
      </div>

      {Object.entries(tagsByCategory).map(([category, categoryTags]) => (
        <div key={category} className="mb-8">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">
            {categoryLabels[category as keyof typeof categoryLabels] || category}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categoryTags.map((tag) => (
              <motion.div
                key={tag._id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="card p-4"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div
                      className="inline-block px-3 py-1 rounded-full text-sm font-medium mb-2"
                      style={{
                        backgroundColor: tag.color + '20',
                        color: tag.color,
                      }}
                    >
                      {tag.name}
                    </div>
                    <p className="text-sm text-gray-600">{tag.description}</p>
                  </div>
                  <div className="flex space-x-2 ml-2">
                    <button
                      onClick={() => handleEdit(tag)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(tag._id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      ))}

      {modalOpen && (
        <TagFormModal
          tag={editingTag}
          onSave={handleSave}
          onClose={() => setModalOpen(false)}
        />
      )}
    </div>
  );
};

export default AdminTags;
