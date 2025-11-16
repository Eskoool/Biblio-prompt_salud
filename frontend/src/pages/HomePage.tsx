import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaRocket, FaStar, FaLightbulb } from 'react-icons/fa';
import PromptSection from '../components/PromptSection';
import { promptsAPI } from '../services/api';
import type { Prompt } from '../types';
import toast from 'react-hot-toast';

const HomePage = () => {
  const [topVoted, setTopVoted] = useState<Prompt[]>([]);
  const [recommended, setRecommended] = useState<Prompt[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPrompts();
  }, []);

  const loadPrompts = async () => {
    try {
      setLoading(true);
      const [topVotedData, recommendedData] = await Promise.all([
        promptsAPI.getTopVoted(6),
        promptsAPI.getRecommended(6),
      ]);
      setTopVoted(topVotedData);
      setRecommended(recommendedData);
    } catch (error) {
      toast.error('Error al cargar los prompts');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleVoteUpdate = (updatedPrompt: Prompt) => {
    setTopVoted((prev) =>
      prev.map((p) => (p._id === updatedPrompt._id ? updatedPrompt : p))
    );
    setRecommended((prev) =>
      prev.map((p) => (p._id === updatedPrompt._id ? updatedPrompt : p))
    );
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-gradient-to-br from-primary-600 via-primary-700 to-medical-600 text-white py-20 px-4"
      >
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Prompts de IA para Profesionales Sanitarios
            </h1>
            <p className="text-xl md:text-2xl text-primary-100 mb-8 max-w-3xl mx-auto">
              Descubre, comparte y utiliza prompts especializados para mejorar tu práctica
              médica con inteligencia artificial
            </p>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12"
          >
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <FaRocket className="text-4xl mb-4 mx-auto" />
              <h3 className="text-xl font-semibold mb-2">Prompts Especializados</h3>
              <p className="text-primary-100">
                Accede a prompts creados específicamente para el sector sanitario
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <FaStar className="text-4xl mb-4 mx-auto" />
              <h3 className="text-xl font-semibold mb-2">Votación Comunitaria</h3>
              <p className="text-primary-100">
                Los mejores prompts votados por profesionales como tú
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <FaLightbulb className="text-4xl mb-4 mx-auto" />
              <h3 className="text-xl font-semibold mb-2">Fácil de Usar</h3>
              <p className="text-primary-100">
                Copia y usa los prompts con un solo clic
              </p>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Content Sections */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Top Voted */}
        <PromptSection
          title="🔥 Más Votados"
          description="Los prompts favoritos de la comunidad sanitaria"
          prompts={topVoted}
          loading={loading}
          onVoteUpdate={handleVoteUpdate}
        />

        {/* Recommended */}
        <PromptSection
          title="⭐ Recomendados"
          description="Selección curada de prompts por nuestro equipo"
          prompts={recommended}
          loading={loading}
          onVoteUpdate={handleVoteUpdate}
        />
      </div>
    </div>
  );
};

export default HomePage;
