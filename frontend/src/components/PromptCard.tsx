import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaThumbsUp, FaCopy, FaCheck, FaTag, FaRobot } from 'react-icons/fa';
import toast from 'react-hot-toast';
import type { Prompt } from '../types';
import { promptsAPI } from '../services/api';

interface PromptCardProps {
  prompt: Prompt;
  onVoteUpdate?: (updatedPrompt: Prompt) => void;
}

const PromptCard = ({ prompt, onVoteUpdate }: PromptCardProps) => {
  const [copied, setCopied] = useState(false);
  const [isVoting, setIsVoting] = useState(false);
  const [localVotes, setLocalVotes] = useState(prompt.votes);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(prompt.content);
      setCopied(true);
      toast.success('Prompt copiado al portapapeles');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error('Error al copiar el prompt');
    }
  };

  const handleVote = async () => {
    if (isVoting) return;

    setIsVoting(true);
    try {
      const updated = await promptsAPI.vote({
        promptId: prompt._id,
        value: 1,
      });
      setLocalVotes(updated.votes);
      if (onVoteUpdate) {
        onVoteUpdate(updated);
      }
      toast.success('¡Voto registrado!');
    } catch (error) {
      toast.error('Error al votar. Intenta de nuevo.');
    } finally {
      setIsVoting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
      className="card p-6 h-full flex flex-col"
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {prompt.title}
          </h3>
          <p className="text-sm text-gray-600 line-clamp-2">
            {prompt.description}
          </p>
        </div>
        {prompt.isRecommended && (
          <span className="ml-2 px-3 py-1 bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-xs font-bold rounded-full">
            Recomendado
          </span>
        )}
      </div>

      {/* Tags */}
      {prompt.tags && prompt.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {prompt.tags.map((tag) => (
            <span
              key={tag._id}
              className="tag"
              style={{ backgroundColor: tag.color + '20', color: tag.color }}
            >
              <FaTag className="mr-1" />
              {tag.name}
            </span>
          ))}
        </div>
      )}

      {/* AI Platforms */}
      {prompt.aiPlatforms && prompt.aiPlatforms.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {prompt.aiPlatforms.map((platform) => (
            <span
              key={platform._id}
              className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
            >
              <FaRobot className="mr-1" />
              {platform.name}
            </span>
          ))}
        </div>
      )}

      {/* Content Preview */}
      <div className="flex-1 mb-4">
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <p className="text-sm text-gray-700 font-mono line-clamp-4">
            {prompt.content}
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <button
          onClick={handleVote}
          disabled={isVoting}
          className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-gray-100 hover:bg-primary-100 text-gray-700 hover:text-primary-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <FaThumbsUp className={isVoting ? 'animate-pulse' : ''} />
          <span className="font-semibold">{localVotes}</span>
        </button>

        <button
          onClick={handleCopy}
          className="flex items-center space-x-2 btn-primary"
        >
          {copied ? (
            <>
              <FaCheck />
              <span>¡Copiado!</span>
            </>
          ) : (
            <>
              <FaCopy />
              <span>Copiar</span>
            </>
          )}
        </button>
      </div>

      {/* Metadata */}
      <div className="mt-3 text-xs text-gray-500">
        {prompt.author && <span>Por {prompt.author} • </span>}
        {new Date(prompt.createdAt).toLocaleDateString('es-ES', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })}
      </div>
    </motion.div>
  );
};

export default PromptCard;
