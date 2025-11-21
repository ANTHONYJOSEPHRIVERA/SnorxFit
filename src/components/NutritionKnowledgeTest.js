import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { db } from '../config/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import { Brain, CheckCircle, XCircle, ArrowRight } from 'lucide-react';

const NUTRITION_QUESTIONS = [
  {
    id: 1,
    question: "¿Cuántas calorías aproximadamente tiene 100g de pechuga de pollo a la plancha?",
    options: ["100 kcal", "165 kcal", "250 kcal", "400 kcal"],
    correct: 1,
    explanation: "El pollo a la plancha tiene aproximadamente 165 kcal por cada 100g, siendo una excelente fuente de proteína magra."
  },
  {
    id: 2,
    question: "¿Qué macronutriente es esencial para la construcción de músculo?",
    options: ["Carbohidratos", "Proteína", "Grasas", "Vitaminas"],
    correct: 1,
    explanation: "La proteína es el macronutriente clave para construir y reparar músculo. Se recomienda consumir 1.6-2.2g por kg de peso corporal."
  },
  {
    id: 3,
    question: "Para perder peso, necesitas estar en:",
    options: ["Superávit calórico", "Déficit calórico", "Equilibrio calórico", "Ayuno"],
    correct: 1,
    explanation: "Un déficit calórico significa consumir menos calorías de las que quemas, lo cual es necesario para perder peso."
  },
  {
    id: 4,
    question: "¿Cuántos gramos de proteína tiene aproximadamente un huevo grande?",
    options: ["3-4g", "6-7g", "10-12g", "15-18g"],
    correct: 1,
    explanation: "Un huevo grande tiene aproximadamente 6-7g de proteína, principalmente en la clara."
  },
  {
    id: 5,
    question: "¿Cuánta agua se recomienda beber diariamente?",
    options: ["1 litro", "2 litros", "3 litros", "5 litros"],
    correct: 1,
    explanation: "Se recomienda beber alrededor de 2 litros (8 vasos) de agua al día, aunque puede variar según actividad física."
  },
  {
    id: 6,
    question: "¿Qué alimento tiene más proteína por 100g?",
    options: ["Arroz blanco", "Pechuga de pollo", "Manzana", "Pan integral"],
    correct: 1,
    explanation: "La pechuga de pollo tiene ~31g de proteína por 100g, siendo una de las fuentes más ricas."
  },
  {
    id: 7,
    question: "Las grasas saludables se encuentran principalmente en:",
    options: ["Frituras", "Aguacate y frutos secos", "Dulces", "Gaseosas"],
    correct: 1,
    explanation: "El aguacate, frutos secos y pescado azul contienen grasas monoinsaturadas y omega-3, que son beneficiosas."
  },
  {
    id: 8,
    question: "¿Cuál es la función principal de los carbohidratos?",
    options: ["Construir músculo", "Proporcionar energía", "Absorber vitaminas", "Reparar células"],
    correct: 1,
    explanation: "Los carbohidratos son la principal fuente de energía del cuerpo, especialmente para el cerebro y músculos."
  },
  {
    id: 9,
    question: "¿Qué bebida tiene CERO calorías?",
    options: ["Coca Cola normal", "Jugo de naranja", "Coca Cola Zero", "Gatorade"],
    correct: 2,
    explanation: "Las bebidas Zero/Light usan edulcorantes artificiales y tienen 0 calorías, a diferencia de las versiones normales."
  },
  {
    id: 10,
    question: "¿Cuántas calorías tiene aproximadamente 1g de grasa?",
    options: ["2 kcal", "4 kcal", "7 kcal", "9 kcal"],
    correct: 3,
    explanation: "1g de grasa aporta 9 kcal, mientras que proteínas y carbohidratos aportan 4 kcal por gramo."
  }
];

export const NutritionKnowledgeTest = ({ type = 'pre', onComplete }) => {
  const { user } = useAuth();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState(Array(10).fill(null));
  const [showExplanation, setShowExplanation] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const handleAnswer = (answerIndex) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answerIndex;
    setAnswers(newAnswers);
    setShowExplanation(true);

    // Auto-avanzar después de 3 segundos
    setTimeout(() => {
      if (currentQuestion < NUTRITION_QUESTIONS.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setShowExplanation(false);
      }
    }, 3000);
  };

  const calculateScore = () => {
    return answers.filter((answer, index) => 
      answer === NUTRITION_QUESTIONS[index].correct
    ).length;
  };

  const handleSubmit = async () => {
    const finalScore = calculateScore();
    setScore(finalScore);
    setSubmitted(true);

    try {
      await addDoc(collection(db, 'knowledge_tests'), {
        userId: user?.uid || 'anonymous',
        userName: user?.displayName || user?.email || 'Anónimo',
        type, // 'pre' or 'post'
        score: finalScore,
        totalQuestions: NUTRITION_QUESTIONS.length,
        percentage: (finalScore / NUTRITION_QUESTIONS.length) * 100,
        answers,
        timestamp: serverTimestamp()
      });

      console.log(`✅ Test ${type} guardado:`, finalScore, '/', NUTRITION_QUESTIONS.length);
    } catch (error) {
      console.error('❌ Error guardando test:', error);
    }

    setTimeout(() => {
      onComplete?.(finalScore);
    }, 5000);
  };

  const isComplete = answers.every(a => a !== null);
  const currentQ = NUTRITION_QUESTIONS[currentQuestion];
  const percentage = (score / NUTRITION_QUESTIONS.length) * 100;

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-2xl mx-auto p-8 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-900 dark:to-purple-900 rounded-2xl shadow-2xl text-center"
      >
        <div className="text-8xl mb-6">
          {percentage >= 80 ? '🎉' : percentage >= 60 ? '😊' : '📚'}
        </div>
        <h2 className="text-4xl font-extrabold mb-4 text-gray-900 dark:text-white">
          Test {type === 'pre' ? 'Inicial' : 'Final'} Completado
        </h2>
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 mb-6 shadow-xl">
          <p className="text-6xl font-extrabold text-purple-600 mb-2">
            {score}/{NUTRITION_QUESTIONS.length}
          </p>
          <p className="text-2xl font-bold text-gray-700 dark:text-gray-300">
            {percentage.toFixed(0)}% de aciertos
          </p>
        </div>
        <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">
          {percentage >= 80 && "¡Excelente conocimiento nutricional! 🌟"}
          {percentage >= 60 && percentage < 80 && "Buen nivel, sigue aprendiendo 📈"}
          {percentage < 60 && "Hay espacio para mejorar, ¡sigue usando SnorxFit! 💪"}
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-500">
          Cerrando en 5 segundos...
        </p>
      </motion.div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Brain className="w-12 h-12 text-purple-600" />
          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Test de Conocimiento Nutricional
          </h1>
        </div>
        <p className="text-gray-600 dark:text-gray-400 text-lg">
          {type === 'pre' ? 'Evaluación Inicial' : 'Evaluación Final'}
        </p>
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
            Pregunta {currentQuestion + 1} de {NUTRITION_QUESTIONS.length}
          </span>
          <span className="text-sm font-medium text-purple-600">
            {Math.round(((currentQuestion + 1) / NUTRITION_QUESTIONS.length) * 100)}%
          </span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
          <div 
            className="bg-gradient-to-r from-purple-600 to-pink-600 h-3 rounded-full transition-all duration-500"
            style={{ width: `${((currentQuestion + 1) / NUTRITION_QUESTIONS.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Question Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestion}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-2xl border border-gray-200 dark:border-gray-700"
        >
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            {currentQ.question}
          </h2>

          <div className="space-y-4">
            {currentQ.options.map((option, index) => {
              const isSelected = answers[currentQuestion] === index;
              const isCorrect = index === currentQ.correct;
              const showResult = showExplanation;

              return (
                <motion.button
                  key={index}
                  whileHover={{ scale: answers[currentQuestion] === null ? 1.02 : 1 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => !showExplanation && handleAnswer(index)}
                  disabled={showExplanation}
                  className={`w-full p-4 rounded-xl text-left font-medium transition-all ${
                    showResult && isSelected && isCorrect
                      ? 'bg-green-100 dark:bg-green-900/30 border-2 border-green-500 text-green-700 dark:text-green-400'
                      : showResult && isSelected && !isCorrect
                      ? 'bg-red-100 dark:bg-red-900/30 border-2 border-red-500 text-red-700 dark:text-red-400'
                      : showResult && isCorrect
                      ? 'bg-green-50 dark:bg-green-900/20 border-2 border-green-300 text-green-600 dark:text-green-500'
                      : isSelected
                      ? 'bg-purple-100 dark:bg-purple-900/30 border-2 border-purple-500 text-purple-700 dark:text-purple-400'
                      : 'bg-gray-50 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{option}</span>
                    {showResult && isSelected && isCorrect && <CheckCircle className="text-green-600" />}
                    {showResult && isSelected && !isCorrect && <XCircle className="text-red-600" />}
                  </div>
                </motion.button>
              );
            })}
          </div>

          {/* Explanation */}
          <AnimatePresence>
            {showExplanation && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className={`mt-6 p-4 rounded-xl ${
                  answers[currentQuestion] === currentQ.correct
                    ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
                    : 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800'
                }`}
              >
                <p className="font-semibold text-gray-900 dark:text-white mb-2">
                  {answers[currentQuestion] === currentQ.correct ? '✅ ¡Correcto!' : '💡 Explicación:'}
                </p>
                <p className="text-gray-700 dark:text-gray-300">
                  {currentQ.explanation}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="mt-8 flex justify-between items-center">
        <button
          onClick={() => currentQuestion > 0 && setCurrentQuestion(currentQuestion - 1)}
          disabled={currentQuestion === 0}
          className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-medium disabled:opacity-50"
        >
          ← Anterior
        </button>

        {currentQuestion === NUTRITION_QUESTIONS.length - 1 && isComplete ? (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSubmit}
            className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-bold shadow-lg flex items-center gap-2"
          >
            Finalizar Test
            <ArrowRight />
          </motion.button>
        ) : (
          <button
            onClick={() => currentQuestion < NUTRITION_QUESTIONS.length - 1 && setCurrentQuestion(currentQuestion + 1)}
            disabled={currentQuestion === NUTRITION_QUESTIONS.length - 1}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg font-medium disabled:opacity-50 flex items-center gap-2"
          >
            Siguiente
            <ArrowRight />
          </button>
        )}
      </div>
    </div>
  );
};
