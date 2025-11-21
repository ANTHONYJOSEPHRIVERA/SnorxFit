import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import ForgotPasswordForm from './ForgotPasswordForm';
import { Moon, Sun } from 'lucide-react';

const AuthScreen = () => {
  const [currentForm, setCurrentForm] = useState('login'); // 'login', 'register', 'forgot'
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Cargar preferencia de tema desde localStorage
    const savedTheme = localStorage.getItem('snorxfit_theme');
    return savedTheme === 'dark';
  });
  const [error, setError] = useState('');
  const { login, register, forgotPassword, isLoading } = useAuth();

  // Aplicar modo oscuro y guardar preferencia
  React.useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('snorxfit_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('snorxfit_theme', 'light');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleLogin = async (email, password) => {
    setError('');
    const result = await login(email, password);
    if (!result.success) {
      setError(result.error);
    }
  };

  const handleRegister = async (userData) => {
    setError('');
    const result = await register(userData);
    if (!result.success) {
      setError(result.error);
    }
  };

  const handleForgotPassword = async (email) => {
    setError('');
    return await forgotPassword(email);
  };

  const switchForm = (formType) => {
    setCurrentForm(formType);
    setError('');
  };

  const renderSnorlaxMessage = () => {
    const messages = {
      login: {
        emoji: '😴',
        title: '¡Hola de nuevo!',
        message: 'Snorlax te estaba esperando... bueno, en realidad estaba durmiendo, pero ahora está emocionado de verte.'
      },
      register: {
        emoji: '🌟',
        title: '¡Bienvenido!',
        message: 'Snorlax quiere ser tu compañero de fitness. Promete no dormir... bueno, tal vez solo un poquito.'
      },
      forgot: {
        emoji: '🔑',
        title: '¡No te preocupes!',
        message: 'Incluso Snorlax olvida cosas a veces. Te ayudaremos a recuperar tu contraseña.'
      }
    };

    const current = messages[currentForm];

    return (
      <motion.div
        key={currentForm}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-8"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
          className="text-8xl mb-4"
        >
          {current.emoji}
        </motion.div>
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-4xl font-bold text-gray-900 dark:text-white mb-2"
        >
          {current.title}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="text-lg text-gray-600 dark:text-gray-400 max-w-md mx-auto"
        >
          {current.message}
        </motion.p>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900 transition-colors duration-500">
      {/* Botón de modo oscuro */}
      <motion.button
        onClick={toggleDarkMode}
        className={`fixed top-4 right-4 p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 z-50 ${
          isDarkMode 
            ? 'bg-gradient-to-r from-orange-400 to-yellow-400 text-white shadow-orange-500/25' 
            : 'bg-gradient-to-r from-slate-700 to-slate-800 text-white shadow-slate-500/25'
        }`}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        title={isDarkMode ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
      >
        <motion.div
          initial={false}
          animate={{ rotate: isDarkMode ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          {isDarkMode ? (
            <Sun className="w-6 h-6" />
          ) : (
            <Moon className="w-6 h-6" />
          )}
        </motion.div>
      </motion.button>

      {/* Decoraciones de fondo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-10 left-10 text-6xl opacity-20"
        >
          💤
        </motion.div>
        <motion.div
          animate={{
            x: [0, -80, 0],
            y: [0, 100, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-20 right-20 text-4xl opacity-20"
        >
          ⭐
        </motion.div>
        <motion.div
          animate={{
            x: [0, 120, 0],
            y: [0, -80, 0],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute bottom-20 left-1/4 text-5xl opacity-20"
        >
          🏋️
        </motion.div>
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-6xl mx-auto flex flex-col lg:flex-row items-center justify-center gap-12">
          
          {/* Sección de bienvenida con Snorlax */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="flex-1 max-w-lg"
          >
            <AnimatePresence mode="wait">
              {renderSnorlaxMessage()}
            </AnimatePresence>
            
            {/* Información adicional */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl"
            >
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                ¿Por qué SnorxFit?
              </h3>
              <ul className="space-y-3 text-gray-600 dark:text-gray-400">
                <motion.li
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.2 }}
                  className="flex items-center"
                >
                  <span className="text-2xl mr-3">🎯</span>
                  Planes personalizados de fitness
                </motion.li>
                <motion.li
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.4 }}
                  className="flex items-center"
                >
                  <span className="text-2xl mr-3">🍎</span>
                  Seguimiento nutricional inteligente
                </motion.li>
                <motion.li
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.6 }}
                  className="flex items-center"
                >
                  <span className="text-2xl mr-3">📊</span>
                  Progreso visual y motivador
                </motion.li>
                <motion.li
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.8 }}
                  className="flex items-center"
                >
                  <span className="text-2xl mr-3">😴</span>
                  Con Snorlax como tu compañero
                </motion.li>
              </ul>
            </motion.div>
          </motion.div>

          {/* Sección de formularios */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="flex-1 max-w-md w-full"
          >
            {/* Mostrar error general */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="mb-6 p-4 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 text-red-700 dark:text-red-300 rounded-lg"
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Formularios */}
            <AnimatePresence mode="wait">
              {currentForm === 'login' && (
                <LoginForm
                  key="login"
                  onSubmit={handleLogin}
                  onSwitchToRegister={() => switchForm('register')}
                  onSwitchToForgotPassword={() => switchForm('forgot')}
                  isLoading={isLoading}
                />
              )}
              {currentForm === 'register' && (
                <RegisterForm
                  key="register"
                  onSubmit={handleRegister}
                  onSwitchToLogin={() => switchForm('login')}
                  isLoading={isLoading}
                />
              )}
              {currentForm === 'forgot' && (
                <ForgotPasswordForm
                  key="forgot"
                  onSubmit={handleForgotPassword}
                  onBack={() => switchForm('login')}
                  isLoading={isLoading}
                />
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="mt-12 text-center text-gray-500 dark:text-gray-400"
        >
          <p>&copy; 2025 SnorxFit - Tu compañero de fitness con Snorlax</p>
        </motion.footer>
      </div>
    </div>
  );
};

export default AuthScreen;
