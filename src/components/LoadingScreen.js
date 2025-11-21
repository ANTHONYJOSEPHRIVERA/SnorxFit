import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const LoadingScreen = () => {
  const [currentMessage, setCurrentMessage] = useState(0);
  
  const messages = [
    "Snorlax está despertando...",
    "Estirando sus brazos enormes...",
    "Bostezando profundamente...",
    "Preparando el mejor entrenamiento...",
    "¡Ya casi está listo!"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessage((prev) => (prev + 1) % messages.length);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center"
      >
        {/* Snorlax animado */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, -10, 10, 0]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="text-9xl mb-6"
        >
          😴
        </motion.div>

        {/* Título */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4"
        >
          SnorxFit
        </motion.h1>

        {/* Mensaje de carga animado */}
        <motion.p
          key={currentMessage}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.5 }}
          className="text-xl text-gray-600 dark:text-gray-400 mb-8 min-h-[2rem]"
        >
          {messages[currentMessage]}
        </motion.p>

        {/* Barra de progreso */}
        <div className="w-64 mx-auto mb-6">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ duration: 5, ease: "easeInOut" }}
            className="h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
          />
          <div className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full -mt-3 -z-10"></div>
        </div>

        {/* Puntos de carga animados */}
        <motion.div
          className="flex justify-center items-center space-x-3"
        >
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{
                y: [0, -15, 0],
                opacity: [0.3, 1, 0.3],
                scale: [0.8, 1.2, 0.8]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.3,
                ease: "easeInOut"
              }}
              className="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
            />
          ))}
        </motion.div>

        {/* Texto adicional */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="text-sm text-gray-500 dark:text-gray-500 mt-6"
        >
          Tu compañero de fitness favorito está preparando todo...
        </motion.p>
      </motion.div>
    </div>
  );
};

export default LoadingScreen;