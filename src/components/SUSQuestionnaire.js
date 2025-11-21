import React, { useState } from 'react';
import { db } from '../config/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertCircle } from 'lucide-react';

const SUS_QUESTIONS = [
  { id: 1, text: "Creo que me gustaría usar SnorxFit frecuentemente", reverse: false },
  { id: 2, text: "Encontré la aplicación innecesariamente compleja", reverse: true },
  { id: 3, text: "Pensé que la aplicación era fácil de usar", reverse: false },
  { id: 4, text: "Creo que necesitaría ayuda técnica para usar esta app", reverse: true },
  { id: 5, text: "Encontré que las funciones estaban bien integradas", reverse: false },
  { id: 6, text: "Pensé que había demasiada inconsistencia en la app", reverse: true },
  { id: 7, text: "La mayoría de personas aprenderían a usar esto rápidamente", reverse: false },
  { id: 8, text: "Encontré la aplicación muy incómoda de usar", reverse: true },
  { id: 9, text: "Me sentí muy confiado usando la aplicación", reverse: false },
  { id: 10, text: "Necesité aprender muchas cosas antes de poder usarla", reverse: true }
];

export const SUSQuestionnaire = ({ onComplete }) => {
  const { user } = useAuth();
  const [responses, setResponses] = useState(Array(10).fill(null));
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const calculateSUS = () => {
    let score = 0;
    responses.forEach((response, index) => {
      const question = SUS_QUESTIONS[index];
      if (question.reverse) {
        score += (5 - response);
      } else {
        score += (response - 1);
      }
    });
    return score * 2.5;
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      const score = calculateSUS();
      
      await addDoc(collection(db, 'sus_responses'), {
        responses,
        score,
        timestamp: serverTimestamp(),
        userId: user?.uid || 'anonymous',
        userName: user?.displayName || user?.email || 'Anónimo'
      });
      
      console.log('✅ SUS Score guardado:', score);
      setSubmitted(true);
      
      setTimeout(() => {
        onComplete?.(score);
      }, 3000);
    } catch (error) {
      console.error('❌ Error guardando SUS:', error);
      alert('Error al guardar. Por favor intenta de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isComplete = responses.every(r => r !== null);
  const currentScore = isComplete ? calculateSUS() : 0;

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 68) return 'text-blue-600';
    return 'text-orange-600';
  };

  const getScoreLabel = (score) => {
    if (score >= 80) return '¡Excelente usabilidad!';
    if (score >= 68) return 'Buena usabilidad';
    return 'Hay oportunidades de mejora';
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-900 dark:to-purple-900 rounded-2xl shadow-2xl">
      <AnimatePresence mode="wait">
        {!submitted ? (
          <motion.div
            key="questionnaire"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <div className="text-center mb-8">
              <h2 className="text-4xl font-extrabold mb-3 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Evaluación de Usabilidad
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                Tu opinión nos ayuda a mejorar SnorxFit 💪
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                Califica del 1 (Totalmente en desacuerdo) al 5 (Totalmente de acuerdo)
              </p>
            </div>

            {/* Progress Bar */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                  Progreso: {responses.filter(r => r !== null).length}/10
                </span>
                {isComplete && (
                  <span className={`text-sm font-bold ${getScoreColor(currentScore)}`}>
                    Score SUS: {currentScore.toFixed(1)}/100
                  </span>
                )}
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-purple-600 to-pink-600 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${(responses.filter(r => r !== null).length / 10) * 100}%` }}
                />
              </div>
            </div>
            
            <div className="space-y-5">
              {SUS_QUESTIONS.map((question, index) => (
                <motion.div
                  key={question.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`p-5 rounded-xl transition-all ${
                    responses[index] !== null
                      ? 'bg-white dark:bg-gray-800 shadow-lg border-2 border-purple-200 dark:border-purple-700'
                      : 'bg-white/50 dark:bg-gray-800/50 border-2 border-transparent'
                  }`}
                >
                  <p className="mb-4 font-semibold text-gray-800 dark:text-white flex items-start gap-2">
                    <span className="flex-shrink-0 w-7 h-7 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full flex items-center justify-center text-sm">
                      {question.id}
                    </span>
                    <span className="flex-1">{question.text}</span>
                  </p>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-400 w-20 text-left">Desacuerdo</span>
                    <div className="flex gap-2 flex-1 justify-center">
                      {[1, 2, 3, 4, 5].map(value => (
                        <motion.button
                          key={value}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => {
                            const newResponses = [...responses];
                            newResponses[index] = value;
                            setResponses(newResponses);
                          }}
                          className={`w-12 h-12 rounded-full font-bold transition-all ${
                            responses[index] === value
                              ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg scale-110'
                              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                          }`}
                        >
                          {value}
                        </motion.button>
                      ))}
                    </div>
                    <span className="text-xs text-gray-400 w-20 text-right">De acuerdo</span>
                  </div>
                </motion.div>
              ))}
            </div>
            
            <motion.button
              whileHover={{ scale: isComplete ? 1.02 : 1 }}
              whileTap={{ scale: isComplete ? 0.98 : 1 }}
              onClick={handleSubmit}
              disabled={!isComplete || isSubmitting}
              className={`w-full mt-8 py-5 rounded-xl text-white font-bold text-lg shadow-xl transition-all ${
                isComplete
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:shadow-2xl cursor-pointer'
                  : 'bg-gray-300 dark:bg-gray-700 cursor-not-allowed opacity-50'
              }`}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Guardando...
                </span>
              ) : isComplete ? (
                <span className="flex items-center justify-center gap-2">
                  <CheckCircle size={24} />
                  Enviar Evaluación
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <AlertCircle size={24} />
                  Por favor responde todas las preguntas
                </span>
              )}
            </motion.button>
          </motion.div>
        ) : (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-16"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 10 }}
              className="text-8xl mb-6"
            >
              🎉
            </motion.div>
            <h3 className="text-3xl font-bold mb-4 text-gray-800 dark:text-white">
              ¡Gracias por tu feedback!
            </h3>
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-md mx-auto shadow-xl">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Tu puntuación SUS:</p>
              <p className={`text-6xl font-extrabold mb-4 ${getScoreColor(calculateSUS())}`}>
                {calculateSUS().toFixed(1)}
                <span className="text-2xl">/100</span>
              </p>
              <p className={`text-lg font-semibold ${getScoreColor(calculateSUS())}`}>
                {getScoreLabel(calculateSUS())}
              </p>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-8">
              Cerrando en 3 segundos...
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
