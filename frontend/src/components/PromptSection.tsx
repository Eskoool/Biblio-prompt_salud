import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaArrowRight } from 'react-icons/fa';
import PromptCard from './PromptCard';
import type { Prompt } from '../types';

interface PromptSectionProps {
  title: string;
  description: string;
  prompts: Prompt[];
  loading?: boolean;
  onVoteUpdate?: (updatedPrompt: Prompt) => void;
}

const PromptSection = ({
  title,
  description,
  prompts,
  loading = false,
  onVoteUpdate,
}: PromptSectionProps) => {
  if (loading) {
    return (
      <section className="mb-16">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">{title}</h2>
          <p className="text-gray-600">{description}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="card p-6 animate-pulse">
              <div className="h-6 bg-gray-200 rounded mb-4"></div>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded mb-4"></div>
              <div className="h-24 bg-gray-100 rounded"></div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="mb-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h2 className="text-3xl font-bold text-gray-900 mb-2">{title}</h2>
        <p className="text-gray-600">{description}</p>
      </motion.div>

      {prompts.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No hay prompts disponibles en esta sección.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {prompts.map((prompt, index) => (
              <motion.div
                key={prompt._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <PromptCard prompt={prompt} onVoteUpdate={onVoteUpdate} />
              </motion.div>
            ))}
          </div>

          <div className="flex justify-center">
            <Link
              to="/prompts"
              className="inline-flex items-center space-x-2 btn-primary text-lg"
            >
              <span>Ver todos los prompts</span>
              <FaArrowRight />
            </Link>
          </div>
        </>
      )}
    </section>
  );
};

export default PromptSection;
