import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaFileAlt, FaTags, FaRobot } from 'react-icons/fa';
import AdminPrompts from '../components/admin/AdminPrompts';
import AdminTags from '../components/admin/AdminTags';
import AdminPlatforms from '../components/admin/AdminPlatforms';

const AdminPage = () => {
  const location = useLocation();

  const tabs = [
    { path: '/admin', label: 'Prompts', icon: FaFileAlt },
    { path: '/admin/tags', label: 'Etiquetas', icon: FaTags },
    { path: '/admin/platforms', label: 'Plataformas IA', icon: FaRobot },
  ];

  const isActive = (path: string) => {
    if (path === '/admin') {
      return location.pathname === '/admin';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Panel de Administración
        </h1>
        <p className="text-gray-600">
          Gestiona prompts, etiquetas y plataformas de IA
        </p>
      </motion.div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-8">
        <nav className="flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <Link
                key={tab.path}
                to={tab.path}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                  isActive(tab.path)
                    ? 'border-primary-600 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon />
                <span>{tab.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Content */}
      <Routes>
        <Route index element={<AdminPrompts />} />
        <Route path="tags" element={<AdminTags />} />
        <Route path="platforms" element={<AdminPlatforms />} />
      </Routes>
    </div>
  );
};

export default AdminPage;
