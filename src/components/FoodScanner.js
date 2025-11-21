import React, { useState } from 'react';
// import { aiApi } from '../services/apiService'; // REMOVIDO - Migrado a Firebase
import { motion } from 'framer-motion';
import { Camera, Loader2 } from 'lucide-react';

const FoodScanner = () => {
  const [file, setFile] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const submit = async (e) => {
    e.preventDefault();
    if (!file) return;
    setLoading(true); setError(null); setAnalysis(null);
    // TODO: Integrar con Gemini AI
    // const res = await aiApi.analyzeFood(file);
    const res = { success: false, error: 'Función no disponible - Migrar a Firebase' };
    setLoading(false);
    if (res.success) setAnalysis(res.data.analysis || res.data.data?.analysis || res.data); else setError(res.error);
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <h1 className="text-2xl font-bold flex items-center gap-2"><Camera/> Escanear Comida</h1>
      <form onSubmit={submit} className="bg-white/70 dark:bg-gray-800/70 rounded-3xl p-6 space-y-4 border border-gray-200 dark:border-gray-700">
        <input type="file" accept="image/*" onChange={e=> setFile(e.target.files[0])} required className="text-sm" />
        <motion.button whileHover={{scale:1.02}} whileTap={{scale:.97}} disabled={loading} type="submit" className="px-6 py-2 rounded-xl bg-indigo-600 text-white font-semibold flex items-center gap-2 disabled:opacity-60">
          {loading && <Loader2 className="animate-spin" size={16}/>} Analizar
        </motion.button>
      </form>
      {error && <p className="text-sm text-red-500">{error}</p>}
      {analysis && (
        <div className="bg-white/70 dark:bg-gray-800/70 rounded-3xl p-6 border border-gray-200 dark:border-gray-700">
          <h2 className="font-semibold text-lg mb-2">Resultado</h2>
          <p className="text-sm"><span className="font-medium">Nombre:</span> {analysis.name || '—'}</p>
            <p className="text-sm"><span className="font-medium">Calorías:</span> {analysis.calories || '—'}</p>
            <p className="text-sm"><span className="font-medium">Proteínas:</span> {analysis.macros?.proteins_g || '—'} g | Carbs: {analysis.macros?.carbs_g || '—'} g | Grasas: {analysis.macros?.fats_g || '—'} g</p>
            <p className="text-sm mt-2 text-gray-600 dark:text-gray-300">{analysis.description}</p>
        </div>
      )}
    </div>
  );
};

export default FoodScanner;
