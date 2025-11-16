import { Link, useNavigate } from 'react-router-dom';
import { FaUserMd, FaSignOutAlt, FaCog } from 'react-icons/fa';
import { authAPI } from '../services/api';

const Navbar = () => {
  const navigate = useNavigate();
  const isAuthenticated = authAPI.isAuthenticated();
  const isAdmin = authAPI.isAdmin();

  const handleLogout = () => {
    authAPI.logout();
    navigate('/');
    window.location.reload();
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="bg-gradient-to-br from-primary-500 to-medical-500 p-2 rounded-lg group-hover:scale-105 transition-transform duration-200">
              <FaUserMd className="text-white text-2xl" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Biblio Prompt Salud</h1>
              <p className="text-xs text-gray-500">Prompts IA para Sanitarios</p>
            </div>
          </Link>

          {/* Navigation */}
          <div className="flex items-center space-x-6">
            <Link
              to="/"
              className="text-gray-700 hover:text-primary-600 font-medium transition-colors duration-200"
            >
              Inicio
            </Link>
            <Link
              to="/prompts"
              className="text-gray-700 hover:text-primary-600 font-medium transition-colors duration-200"
            >
              Todos los Prompts
            </Link>

            {isAuthenticated && isAdmin && (
              <Link
                to="/admin"
                className="flex items-center space-x-2 text-gray-700 hover:text-primary-600 font-medium transition-colors duration-200"
              >
                <FaCog />
                <span>Admin</span>
              </Link>
            )}

            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 btn-secondary"
              >
                <FaSignOutAlt />
                <span>Salir</span>
              </button>
            ) : (
              <Link to="/login" className="btn-primary">
                Acceso Admin
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
