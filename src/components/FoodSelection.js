import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle, XCircle, Utensils } from 'lucide-react';
import { foodCategories } from '../data/foodGallery';

const FoodSelection = ({ onBack, onSelectFoods }) => {
  const [selectedFoods, setSelectedFoods] = useState({});
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);

  const currentCategory = foodCategories[currentCategoryIndex];

  const handleFoodToggle = (categoryId, foodId) => {
    setSelectedFoods(prev => {
      const newCategoryFoods = prev[categoryId] ? [...prev[categoryId]] : [];
      if (newCategoryFoods.includes(foodId)) {
        return {
          ...prev,
          [categoryId]: newCategoryFoods.filter(id => id !== foodId)
        };
      } else {
        return {
          ...prev,
          [categoryId]: [...newCategoryFoods, foodId]
        };
      }
    });
  };

  const handleNextCategory = () => {
    if (currentCategoryIndex < foodCategories.length - 1) {
      setCurrentCategoryIndex(prev => prev + 1);
    } else {
      onSelectFoods(selectedFoods);
    }
  };

  const handlePrevCategory = () => {
    if (currentCategoryIndex > 0) {
      setCurrentCategoryIndex(prev => prev - 1);
    }
  };

  const handleSkipAll = () => {
    onSelectFoods({}); // Pass empty selection
  };

  const isLastCategory = currentCategoryIndex === foodCategories.length - 1;

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50 p-4 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 text-gray-900 dark:text-white">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          className="bg-white/90 backdrop-blur-xl border border-gray-200/50 rounded-3xl p-6 mb-8 shadow-xl dark:bg-gray-800/90 dark:border-gray-700"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <motion.button
                onClick={onBack}
                className="p-3 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ArrowLeft className="w-5 h-5" />
              </motion.button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Selecciona tus Alimentos</h1>
                <p className="text-gray-600 dark:text-gray-400">Dinos qué te gusta y qué no</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600 dark:text-gray-400">Categoría</p>
              <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">{currentCategoryIndex + 1}/{foodCategories.length}</p>
            </div>
          </div>
        </motion.div>

        {/* Category Display */}
        <motion.div
          key={currentCategory.id}
          className="bg-white/90 backdrop-blur-xl border border-gray-200/50 rounded-3xl p-8 shadow-xl dark:bg-gray-800/90 dark:border-gray-700"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.5 }}
        >
          <div className="relative h-48 rounded-2xl overflow-hidden mb-6">
            <img src={currentCategory.image} alt={currentCategory.name} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <h2 className="text-4xl font-bold text-white drop-shadow-lg">{currentCategory.name}</h2>
            </div>
          </div>

          <p className="text-lg font-semibold text-gray-800 mb-6 dark:text-gray-200">
            Selecciona los alimentos de esta categoría que te gustaría incluir en tu dieta:
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {currentCategory.items.map(food => {
              const isSelected = selectedFoods[currentCategory.id]?.includes(food.id);
              return (
                <motion.button
                  key={food.id}
                  onClick={() => handleFoodToggle(currentCategory.id, food.id)}
                  className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all duration-200 ${
                    isSelected
                      ? 'border-green-500 bg-green-50/50 dark:bg-green-900/50'
                      : 'border-gray-200 bg-gray-50/50 hover:border-orange-300 dark:border-gray-700 dark:bg-gray-700/50 dark:hover:border-orange-500'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="text-4xl mb-2">{food.icon}</span>
                  <span className="text-center font-medium text-gray-800 dark:text-gray-200">{food.name}</span>
                  {isSelected ? (
                    <CheckCircle className="w-5 h-5 text-green-500 mt-2" />
                  ) : (
                    <XCircle className="w-5 h-5 text-gray-400 mt-2" />
                  )}
                </motion.button>
              );
            })}
          </div>

          <div className="flex justify-between mt-8">
            <motion.button
              onClick={handlePrevCategory}
              disabled={currentCategoryIndex === 0}
              className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                currentCategoryIndex === 0
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed dark:bg-gray-700 dark:text-gray-500'
                  : 'bg-orange-100 text-orange-700 hover:bg-orange-200 dark:bg-orange-900 dark:text-orange-200 dark:hover:bg-orange-800'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Anterior
            </motion.button>
            <motion.button
              onClick={handleNextCategory}
              className="px-6 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 shadow-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isLastCategory ? 'Finalizar Selección' : 'Siguiente'}
            </motion.button>
          </div>
          <motion.button
            onClick={handleSkipAll}
            className="w-full mt-4 py-3 rounded-xl font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Saltar Selección (Usar Plan Básico)
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
};

export default FoodSelection;