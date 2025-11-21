import React from 'react';
import { motion } from 'framer-motion';
import { ThumbsDown, Plus, Star, Zap, Heart } from 'lucide-react';

const FoodRecommendationCard = ({ 
  food, 
  groupName, 
  macroProfile, 
  onReject, 
  onAdd, 
  isAlternative = false 
}) => {
  const getCardStyle = () => {
    if (macroProfile.protein === 'high') {
      return 'border-l-4 border-l-red-400 bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20';
    } else if (macroProfile.carbs === 'high') {
      return 'border-l-4 border-l-yellow-400 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20';
    } else if (macroProfile.fat === 'high') {
      return 'border-l-4 border-l-green-400 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20';
    }
    return 'border-l-4 border-l-gray-400 bg-gradient-to-r from-gray-50 to-slate-50 dark:from-gray-900/20 dark:to-slate-900/20';
  };

  const getMacroIcon = () => {
    if (macroProfile.protein === 'high') return <Zap className="w-4 h-4 text-red-500" />;
    if (macroProfile.carbs === 'high') return <Star className="w-4 h-4 text-yellow-500" />;
    if (macroProfile.fat === 'high') return <Heart className="w-4 h-4 text-green-500" />;
    return <div className="w-4 h-4 rounded-full bg-gray-400" />;
  };

  const calories = food.calorias || 0;
  const protein = food.proteina || 0;
  const carbs = food.carbohidratos || 0;
  const fat = food.grasa_total || 0;

  return (
    <motion.div
      className={`rounded-2xl p-4 shadow-sm hover:shadow-md transition-all duration-300 ${getCardStyle()}`}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02, y: -2 }}
      transition={{ duration: 0.2 }}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            {getMacroIcon()}
            <h4 className="font-semibold text-gray-900 dark:text-white text-sm">
              {food.nombre_es || food.nombre}
            </h4>
            {isAlternative && (
              <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200 text-xs rounded-full">
                Alternativa
              </span>
            )}
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">{groupName}</p>
        </div>
        
        {!isAlternative && (
          <motion.button
            onClick={() => onReject(food)}
            className="p-1.5 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            title="No me gusta - mostrar alternativas"
          >
            <ThumbsDown className="w-4 h-4" />
          </motion.button>
        )}
      </div>

      {/* Macros */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        <div className="bg-white/60 dark:bg-gray-800/60 rounded-lg p-2">
          <div className="text-xs text-gray-600 dark:text-gray-400">Calorías</div>
          <div className="font-bold text-gray-900 dark:text-white">{calories}</div>
        </div>
        <div className="bg-white/60 dark:bg-gray-800/60 rounded-lg p-2">
          <div className="text-xs text-gray-600 dark:text-gray-400">Proteína</div>
          <div className="font-bold text-gray-900 dark:text-white">{protein}g</div>
        </div>
        <div className="bg-white/60 dark:bg-gray-800/60 rounded-lg p-2">
          <div className="text-xs text-gray-600 dark:text-gray-400">Carbohidratos</div>
          <div className="font-bold text-gray-900 dark:text-white">{carbs}g</div>
        </div>
        <div className="bg-white/60 dark:bg-gray-800/60 rounded-lg p-2">
          <div className="text-xs text-gray-600 dark:text-gray-400">Grasa</div>
          <div className="font-bold text-gray-900 dark:text-white">{fat}g</div>
        </div>
      </div>

      {/* Action Button */}
      <motion.button
        onClick={() => onAdd(food)}
        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all font-medium text-sm shadow-lg"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Plus className="w-4 h-4" />
        Agregar al Plan
      </motion.button>
    </motion.div>
  );
};

export default FoodRecommendationCard;