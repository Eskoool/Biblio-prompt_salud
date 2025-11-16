import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaSearch, FaFilter, FaTimes } from 'react-icons/fa';
import PromptCard from '../components/PromptCard';
import { promptsAPI, tagsAPI, aiPlatformsAPI } from '../services/api';
import type { Prompt, Tag, AIPlatform, FilterOptions } from '../types';
import toast from 'react-hot-toast';

const AllPromptsPage = () => {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [filteredPrompts, setFilteredPrompts] = useState<Prompt[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [aiPlatforms, setAIPlatforms] = useState<AIPlatform[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  const [filters, setFilters] = useState<FilterOptions>({
    search: '',
    tags: [],
    aiPlatforms: [],
    sortBy: 'votes',
  });

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filters, prompts]);

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
      setAIPlatforms(platformsData);
    } catch (error) {
      toast.error('Error al cargar los datos');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...prompts];

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.title.toLowerCase().includes(searchLower) ||
          p.description.toLowerCase().includes(searchLower) ||
          p.content.toLowerCase().includes(searchLower)
      );
    }

    // Tags filter
    if (filters.tags && filters.tags.length > 0) {
      filtered = filtered.filter((p) =>
        p.tags.some((tag) => filters.tags!.includes(tag._id))
      );
    }

    // AI Platforms filter
    if (filters.aiPlatforms && filters.aiPlatforms.length > 0) {
      filtered = filtered.filter((p) =>
        p.aiPlatforms.some((platform) => filters.aiPlatforms!.includes(platform._id))
      );
    }

    // Sort
    switch (filters.sortBy) {
      case 'votes':
        filtered.sort((a, b) => b.votes - a.votes);
        break;
      case 'recent':
        filtered.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        break;
      case 'alphabetical':
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
    }

    setFilteredPrompts(filtered);
  };

  const handleVoteUpdate = (updatedPrompt: Prompt) => {
    setPrompts((prev) =>
      prev.map((p) => (p._id === updatedPrompt._id ? updatedPrompt : p))
    );
  };

  const toggleTag = (tagId: string) => {
    setFilters((prev) => ({
      ...prev,
      tags: prev.tags?.includes(tagId)
        ? prev.tags.filter((id) => id !== tagId)
        : [...(prev.tags || []), tagId],
    }));
  };

  const togglePlatform = (platformId: string) => {
    setFilters((prev) => ({
      ...prev,
      aiPlatforms: prev.aiPlatforms?.includes(platformId)
        ? prev.aiPlatforms.filter((id) => id !== platformId)
        : [...(prev.aiPlatforms || []), platformId],
    }));
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      tags: [],
      aiPlatforms: [],
      sortBy: 'votes',
    });
  };

  const activeFiltersCount =
    (filters.tags?.length || 0) + (filters.aiPlatforms?.length || 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Todos los Prompts
        </h1>
        <p className="text-gray-600 text-lg">
          Explora nuestra colección completa de {prompts.length} prompts especializados
        </p>
      </motion.div>

      {/* Search and Filters */}
      <div className="mb-8 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar prompts..."
              value={filters.search}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, search: e.target.value }))
              }
              className="input-field pl-12"
            />
          </div>

          {/* Sort */}
          <select
            value={filters.sortBy}
            onChange={(e) =>
              setFilters((prev) => ({
                ...prev,
                sortBy: e.target.value as FilterOptions['sortBy'],
              }))
            }
            className="input-field sm:w-48"
          >
            <option value="votes">Más votados</option>
            <option value="recent">Más recientes</option>
            <option value="alphabetical">Alfabético</option>
          </select>

          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="btn-secondary relative"
          >
            <FaFilter className="mr-2" />
            Filtros
            {activeFiltersCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-primary-600 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                {activeFiltersCount}
              </span>
            )}
          </button>
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="card p-6"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Filtros</h3>
              {activeFiltersCount > 0 && (
                <button
                  onClick={clearFilters}
                  className="text-sm text-primary-600 hover:text-primary-700 flex items-center"
                >
                  <FaTimes className="mr-1" />
                  Limpiar filtros
                </button>
              )}
            </div>

            {/* Tags Filter */}
            {tags.length > 0 && (
              <div className="mb-6">
                <h4 className="font-medium text-gray-900 mb-3">Etiquetas</h4>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <button
                      key={tag._id}
                      onClick={() => toggleTag(tag._id)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                        filters.tags?.includes(tag._id)
                          ? 'bg-primary-600 text-white shadow-md scale-105'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                      style={
                        filters.tags?.includes(tag._id)
                          ? { backgroundColor: tag.color }
                          : {}
                      }
                    >
                      {tag.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* AI Platforms Filter */}
            {aiPlatforms.length > 0 && (
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Plataformas IA</h4>
                <div className="flex flex-wrap gap-2">
                  {aiPlatforms.map((platform) => (
                    <button
                      key={platform._id}
                      onClick={() => togglePlatform(platform._id)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                        filters.aiPlatforms?.includes(platform._id)
                          ? 'bg-blue-600 text-white shadow-md scale-105'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {platform.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </div>

      {/* Results */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="card p-6 animate-pulse">
              <div className="h-6 bg-gray-200 rounded mb-4"></div>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded mb-4"></div>
              <div className="h-24 bg-gray-100 rounded"></div>
            </div>
          ))}
        </div>
      ) : filteredPrompts.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-500 text-lg">
            No se encontraron prompts con los filtros seleccionados.
          </p>
          <button onClick={clearFilters} className="btn-primary mt-4">
            Limpiar filtros
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPrompts.map((prompt, index) => (
            <motion.div
              key={prompt._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <PromptCard prompt={prompt} onVoteUpdate={handleVoteUpdate} />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AllPromptsPage;
