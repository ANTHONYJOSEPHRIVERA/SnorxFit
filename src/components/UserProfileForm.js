import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Scale, Ruler, Calendar, Target, Activity, AlertTriangle, Heart } from 'lucide-react';

const UserProfileForm = ({ onSubmit = () => {}, initialData = null }) => {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    birthDate: initialData?.birthDate || '',
    weight: initialData?.weight || '',
    height: initialData?.height || '',
    gender: initialData?.gender || 'male',
    goal: initialData?.goal || 'maintain',
    activityLevel: initialData?.activityLevel || 'moderate',
    fitnessLevel: initialData?.fitnessLevel || 'beginner',
    allergies: initialData?.allergies || '',
    chronicDiseases: initialData?.chronicDiseases || ''
  });

  const [imc, setImc] = useState(0);
  const [imcCategory, setImcCategory] = useState('');
  const [age, setAge] = useState(0);

  // Calcular edad desde fecha de nacimiento
  const calculateAge = (birthDate) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
  };

  // Calcular IMC y categoría
  const calculateIMC = (weight, height) => {
    if (!weight || !height) return { imc: 0, category: '' };
    
    const heightInMeters = height / 100;
    const calculatedIMC = weight / (heightInMeters * heightInMeters);
    
    let category = '';
    if (calculatedIMC < 18.5) {
      category = 'Bajo peso';
    } else if (calculatedIMC < 25) {
      category = 'Peso normal';
    } else if (calculatedIMC < 30) {
      category = 'Sobrepeso';
    } else {
      category = 'Obesidad';
    }
    
    return { imc: calculatedIMC, category };
  };

  // Actualizar IMC y edad cuando cambien los datos
  useEffect(() => {
    if (formData.weight && formData.height) {
      const { imc: newIMC, category } = calculateIMC(formData.weight, formData.height);
      setImc(newIMC);
      setImcCategory(category);
    }
    
    if (formData.birthDate) {
      const calculatedAge = calculateAge(formData.birthDate);
      setAge(calculatedAge);
    }
  }, [formData.weight, formData.height, formData.birthDate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.name && formData.birthDate && formData.weight && formData.height) {
      // Calcular goalWeight razonable basado en el objetivo
      let goalWeight;
      const currentWeight = parseFloat(formData.weight);
      
      if (formData.goal === 'lose') {
        // Perder peso: 10% menos
        goalWeight = Math.round(currentWeight * 0.90);
      } else if (formData.goal === 'gain') {
        // Ganar músculo: 10% más
        goalWeight = Math.round(currentWeight * 1.10);
      } else {
        // Mantener peso actual
        goalWeight = currentWeight;
      }
      
      // Agregar edad calculada, IMC y goalWeight a los datos del formulario
      const submissionData = {
        ...formData,
        age: age,
        imc: imc.toFixed(1),
        imcCategory: imcCategory,
        goalWeight: goalWeight,
        weight: parseFloat(formData.weight), // Asegurar que sea número
        height: parseFloat(formData.height)  // Asegurar que sea número
      };
      
      console.log('📝 UserProfileForm - Datos enviados:', submissionData);
      console.log('🔍 Validación:', {
        hasWeight: !!submissionData.weight,
        hasHeight: !!submissionData.height,
        hasAge: !!submissionData.age,
        hasGoal: !!submissionData.goal,
        hasGoalWeight: !!submissionData.goalWeight
      });
      
      onSubmit(submissionData);
    }
  };

  const isFormValid = formData.name && formData.birthDate && formData.weight && formData.height && age >= 16;

  // Obtener color del IMC
  const getIMCColor = () => {
    if (imc < 18.5) return 'text-blue-600';
    if (imc < 25) return 'text-green-600';
    if (imc < 30) return 'text-orange-600';
    return 'text-red-600';
  };

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <motion.div
        className="bg-white/90 backdrop-blur-xl border border-gray-200/50 rounded-3xl p-8 w-full max-w-2xl shadow-2xl"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <motion.div
          className="text-center mb-8"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
            ¡Bienvenido a SnorxFit!
          </h1>
          <p className="text-gray-600 font-medium">
            Cuéntanos sobre ti para crear tu plan personalizado
          </p>
        </motion.div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <div>
              <label className="flex items-center gap-2 text-gray-700 font-semibold mb-2">
                <User className="w-4 h-4" />
                Nombre
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500 transition-all"
                placeholder="Tu nombre"
                required
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-gray-700 font-semibold mb-2">
                <Calendar className="w-4 h-4" />
                Fecha de Nacimiento
              </label>
              <input
                type="date"
                name="birthDate"
                value={formData.birthDate}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500 transition-all"
                max={new Date().toISOString().split('T')[0]}
                required
              />
              {age > 0 && (
                <p className="text-sm text-gray-600 mt-1">Edad: {age} años</p>
              )}
            </div>

            <div>
              <label className="flex items-center gap-2 text-gray-700 font-semibold mb-2">
                <Scale className="w-4 h-4" />
                Peso (kg)
              </label>
              <input
                type="number"
                name="weight"
                value={formData.weight}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500 transition-all"
                placeholder="Kilogramos"
                min="30"
                max="300"
                required
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-gray-700 font-semibold mb-2">
                <Ruler className="w-4 h-4" />
                Altura (cm)
              </label>
              <input
                type="number"
                name="height"
                value={formData.height}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500 transition-all"
                placeholder="Centímetros"
                min="120"
                max="250"
                required
              />
            </div>
          </motion.div>

          {/* Indicador de IMC */}
          {imc > 0 && (
            <motion.div
              className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-700 mb-1">Índice de Masa Corporal (IMC)</h3>
                  <p className={`text-2xl font-bold ${getIMCColor()}`}>
                    {imc.toFixed(1)} - {imcCategory}
                  </p>
                </div>
                <div className="text-4xl">
                  {imc < 18.5 ? '📏' : imc < 25 ? '✅' : imc < 30 ? '⚠️' : '🚨'}
                </div>
              </div>
            </motion.div>
          )}

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <div>
              <label className="flex items-center gap-2 text-gray-700 font-semibold mb-2">
                <AlertTriangle className="w-4 h-4" />
                Alergias (opcional)
              </label>
              <textarea
                name="allergies"
                value={formData.allergies}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500 transition-all"
                placeholder="Ej: Frutos secos, mariscos, lactosa..."
                rows="2"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-gray-700 font-semibold mb-2">
                <Heart className="w-4 h-4" />
                Enfermedades Crónicas (opcional)
              </label>
              <textarea
                name="chronicDiseases"
                value={formData.chronicDiseases}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500 transition-all"
                placeholder="Ej: Diabetes, hipertensión, asma..."
                rows="2"
              />
            </div>
          </motion.div>

          <motion.div
            className="space-y-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
          >
            <div>
              <label className="text-gray-700 font-semibold mb-3 block">Género</label>
              <div className="flex gap-4">
                {[
                  { value: 'male', label: 'Masculino' },
                  { value: 'female', label: 'Femenino' }
                ].map((option) => (
                  <label key={option.value} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="gender"
                      value={option.value}
                      checked={formData.gender === option.value}
                      onChange={handleChange}
                      className="w-4 h-4 text-purple-600"
                    />
                    <span className="text-gray-700">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="flex items-center gap-2 text-gray-700 font-semibold mb-3">
                <Target className="w-4 h-4" />
                Objetivo Principal
              </label>
              <select
                name="goal"
                value={formData.goal}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500 transition-all"
              >
                <option value="lose">Perder peso</option>
                <option value="maintain">Mantener peso</option>
                <option value="gain">Ganar músculo</option>
              </select>
            </div>

            <div>
              <label className="flex items-center gap-2 text-gray-700 font-semibold mb-3">
                <Activity className="w-4 h-4" />
                Nivel de Actividad
              </label>
              <select
                name="activityLevel"
                value={formData.activityLevel}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500 transition-all"
              >
                <option value="sedentary">Sedentario (poco o nada de ejercicio)</option>
                <option value="light">Ligero (ejercicio ligero 1-3 días/semana)</option>
                <option value="moderate">Moderado (ejercicio moderado 3-5 días/semana)</option>
                <option value="active">Activo (ejercicio intenso 6-7 días/semana)</option>
                <option value="veryActive">Muy activo (ejercicio muy intenso, trabajo físico)</option>
              </select>
            </div>

            <div>
              <label className="text-gray-700 font-semibold mb-3 block">Nivel de Fitness</label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { value: 'beginner', label: 'Principiante' },
                  { value: 'intermediate', label: 'Intermedio' },
                  { value: 'advanced', label: 'Avanzado' }
                ].map((option) => (
                  <label key={option.value} className="cursor-pointer">
                    <input
                      type="radio"
                      name="fitnessLevel"
                      value={option.value}
                      checked={formData.fitnessLevel === option.value}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    <div className={`p-3 text-center rounded-xl border-2 transition-all ${
                      formData.fitnessLevel === option.value
                        ? 'border-purple-500 bg-purple-50 text-purple-700'
                        : 'border-gray-200 bg-gray-50 text-gray-700 hover:border-purple-300'
                    }`}>
                      <span className="font-medium text-sm">{option.label}</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.button
            type="submit"
            disabled={!isFormValid}
            className={`w-full py-4 rounded-xl font-semibold text-white transition-all duration-300 ${
              isFormValid
                ? 'bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 shadow-lg hover:shadow-xl'
                : 'bg-gray-300 cursor-not-allowed'
            }`}
            whileHover={isFormValid ? { scale: 1.02 } : {}}
            whileTap={isFormValid ? { scale: 0.98 } : {}}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            Crear Mi Plan Personalizado
          </motion.button>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default UserProfileForm;