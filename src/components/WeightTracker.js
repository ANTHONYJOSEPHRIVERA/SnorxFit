import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Scale, Calendar, X, PlusCircle, Trash2 } from 'lucide-react';
import { useToast } from '../contexts/ToastContext';
import WeightChart from './WeightChart';
import { useAuth } from '../contexts/AuthContext';
import { collection, query, orderBy, limit, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../config/firebase';

// Helper: Obtener fecha local en formato YYYY-MM-DD (SIN conversión a UTC)
const getLocalDateString = (date = new Date()) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const WeightTracker = ({ onBack, userProfile }) => {
  const { isOnline, user } = useAuth();
  const toast = useToast();
  const [entries, setEntries] = useState([]); // {id?, date, weight}
  const [newWeight, setNewWeight] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);

  // Cargar pesos (últimos 60 días) al montar
  useEffect(() => {
    const loadWeights = async () => {
      setIsLoading(true);
      try {
        // 1. Cargar desde localStorage (cache) primero
        const cached = localStorage.getItem(`snorxfit_weights_${user.uid}`);
        if (cached) {
          setEntries(JSON.parse(cached));
        }
        
        // 2. Cargar desde Firebase si estamos online
        if (isOnline && user) {
          const weightsRef = collection(db, 'users', user.uid, 'weights');
          const q = query(weightsRef, orderBy('date', 'desc'), limit(60));
          const querySnapshot = await getDocs(q);
          
          const firebaseWeights = [];
          querySnapshot.forEach((doc) => {
            firebaseWeights.push({
              id: doc.id,
              ...doc.data()
            });
          });
          
          // Ordenar por fecha ascendente para el gráfico
          const sortedWeights = firebaseWeights.reverse();
          console.log('📥 Pesos cargados desde Firebase:', sortedWeights.length);
          
          setEntries(sortedWeights);
          localStorage.setItem(`snorxfit_weights_${user.uid}`, JSON.stringify(sortedWeights));
        }
      } catch (error) {
        console.error('❌ Error al cargar pesos:', error);
        toast.error('Error al cargar historial de peso');
      } finally {
        setIsLoading(false);
      }
    };
    
    if (user) loadWeights();
  }, [isOnline, user, toast]);

  const addWeight = async (e) => {
    e.preventDefault();
    if (!newWeight || !user) return;
    
    const weightValue = parseFloat(newWeight);
    
    // ✅ VALIDACIÓN: Peso debe estar entre 30kg y 300kg
    if (isNaN(weightValue) || weightValue < 30 || weightValue > 300) {
      toast.error('⚠️ Peso inválido. Debe estar entre 30 y 300 kg');
      return;
    }
    
    // ⚠️ ADVERTENCIA: Cambio drástico (>10kg en un día)
    if (entries.length > 0) {
      const lastWeight = entries[entries.length - 1].weight;
      const difference = Math.abs(weightValue - lastWeight);
      
      if (difference > 10) {
        const confirmed = window.confirm(
          `⚠️ Cambio significativo detectado:\n\n` +
          `Último peso: ${lastWeight} kg\n` +
          `Nuevo peso: ${weightValue} kg\n` +
          `Diferencia: ${difference.toFixed(1)} kg\n\n` +
          `¿Estás seguro que el peso es correcto?`
        );
        
        if (!confirmed) {
          toast.info('Registro cancelado');
          return;
        }
      }
    }
    
    setIsLoading(true);
    try {
      const today = getLocalDateString();
      
      const newEntry = {
        date: today,
        weight: weightValue,
        createdAt: new Date().toISOString(),
        timestamp: new Date().getTime()
      };
      
      // 1. Guardar en Firebase si estamos online
      let savedId = Date.now().toString();
      if (isOnline) {
        try {
          const weightsRef = collection(db, 'users', user.uid, 'weights');
          const docRef = await addDoc(weightsRef, newEntry);
          savedId = docRef.id;
          console.log('💾 Peso guardado en Firebase:', savedId, weightValue, 'kg');
          toast.success(`✅ Peso registrado: ${weightValue} kg`);
        } catch (error) {
          console.error('❌ Error al guardar en Firebase:', error);
          toast.warning('Guardado localmente. Se sincronizará cuando haya conexión.');
        }
      } else {
        toast.info('Guardado localmente. Se sincronizará cuando haya conexión.');
      }
      
      // 2. Actualizar estado local
      const newEntryWithId = { id: savedId, ...newEntry };
      setEntries(prev => {
        // Eliminar entrada del mismo día si existe y agregar la nueva
        const filtered = prev.filter(p => p.date !== today);
        const updated = [...filtered, newEntryWithId].sort((a, b) => 
          new Date(a.date) - new Date(b.date)
        );
        
        // Actualizar cache
        localStorage.setItem(`snorxfit_weights_${user.uid}`, JSON.stringify(updated));
        
        // 🔄 TRIGGER: Forzar recarga de datos en App.js
        window.dispatchEvent(new CustomEvent('weightUpdated', { 
          detail: { weight: weightValue, date: today } 
        }));
        
        return updated;
      });
      
      setNewWeight('');
      setShowForm(false);
    } catch (error) {
      console.error('❌ Error al registrar peso:', error);
      toast.error('Error al registrar peso');
    } finally {
      setIsLoading(false);
    }
  };

  const removeEntry = async (id) => {
    if (!window.confirm('¿Eliminar registro de peso?')) return;
    if (!user) return;
    
    try {
      // 1. Eliminar de Firebase si estamos online
      if (isOnline) {
        const weightRef = doc(db, 'users', user.uid, 'weights', id);
        await deleteDoc(weightRef);
        console.log('🗑️ Peso eliminado de Firebase:', id);
        toast.success('Registro eliminado');
      }
      
      // 2. Actualizar estado local
      setEntries(prev => {
        const updated = prev.filter(e => e.id !== id);
        localStorage.setItem(`snorxfit_weights_${user.uid}`, JSON.stringify(updated));
        return updated;
      });
    } catch (error) {
      console.error('❌ Error al eliminar peso:', error);
      toast.error('Error al eliminar registro');
    }
  };

  return (
    <div className="min-h-screen p-0 text-gray-900 dark:text-white">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Peso & Progreso</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">Últimas semanas</p>
          </div>
          <motion.button whileHover={{ scale:1.05 }} whileTap={{ scale:.95 }} onClick={()=> setShowForm(true)} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 text-white shadow-md hover:bg-indigo-700">
            <PlusCircle size={18}/> Registrar
          </motion.button>
        </div>

        {/* Current Weight Info */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-gray-200 dark:border-gray-700 rounded-3xl p-6 shadow-xl">
            <div className="flex items-center gap-3 mb-2">
              <Scale className="w-7 h-7 text-indigo-600" />
              <h2 className="font-semibold">Resumen</h2>
            </div>
            <p className="text-4xl font-bold text-indigo-600 dark:text-indigo-400 mb-1">{entries.length ? entries[entries.length-1].weight : userProfile.weight} kg</p>
            <p className="text-xs text-gray-500 mb-4">Peso actual</p>
            <WeightChart data={entries.slice(-14)} />
          </div>
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-gray-200 dark:border-gray-700 rounded-3xl p-6 shadow-xl flex flex-col">
            <h2 className="font-semibold mb-4">Histórico Rápido</h2>
            <div className="flex-1 overflow-y-auto pr-2 space-y-2">
              {entries.length === 0 && <p className="text-sm text-gray-500">Sin registros aún.</p>}
              {entries.slice().reverse().map(e => (
                <div key={e.id} className="flex items-center justify-between text-sm bg-gray-50 dark:bg-gray-700/60 px-3 py-2 rounded-xl">
                  <span className="font-medium text-gray-700 dark:text-gray-200">{e.date}</span>
                  <span className="text-indigo-600 dark:text-indigo-400 font-semibold">{e.weight} kg</span>
                  <button onClick={()=> removeEntry(e.id)} className="text-gray-400 hover:text-red-500"><Trash2 size={14} /></button>
                </div>
              ))}
            </div>
            {entries.length > 0 && (
              <button onClick={() => {
                const rows = [['Fecha','Peso (kg)'], ...entries.map(e => [e.date, e.weight])];
                const csv = rows.map(r => r.join(',')).join('\n');
                const blob = new Blob([csv], { type:'text/csv;charset=utf-8;' });
                const a = document.createElement('a');
                a.href = URL.createObjectURL(blob);
                a.download = 'peso.csv';
                a.click();
              }} className="mt-4 text-xs px-3 py-2 rounded-lg bg-indigo-50 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-800">Exportar CSV</button>
            )}
          </div>
        </div>

        {/* Entry List */}
        {/* (Espacio futuro para métricas adicionales) */}

        {/* New Entry Form Modal */}
        <AnimatePresence>
          {showForm && (
            <motion.div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50" initial={{ opacity:0}} animate={{ opacity:1}} exit={{ opacity:0}} onClick={()=> setShowForm(false)}>
              <motion.form onSubmit={addWeight} initial={{ scale:.9, opacity:0}} animate={{ scale:1, opacity:1}} exit={{ scale:.9, opacity:0}} onClick={e=> e.stopPropagation()} className="bg-white dark:bg-gray-800 rounded-3xl p-8 w-full max-w-sm space-y-5 shadow-2xl">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-lg">Registrar peso de hoy</h3>
                  <button type="button" onClick={()=> setShowForm(false)} className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600">
                    <X size={16}/>
                  </button>
                </div>
                <div>
                  <label className="text-sm font-medium block mb-1">Peso (kg)</label>
                  <input 
                    type="number" 
                    step="0.1" 
                    min="30" 
                    max="300" 
                    value={newWeight} 
                    onChange={(e)=> setNewWeight(e.target.value)} 
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/40" 
                    placeholder="Ej: 68.5"
                    required 
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    ⚠️ Rango válido: 30 - 300 kg
                  </p>
                  {newWeight && (parseFloat(newWeight) < 30 || parseFloat(newWeight) > 300) && (
                    <p className="text-xs text-red-500 mt-1">
                      ❌ Peso fuera de rango. Verifica el valor ingresado.
                    </p>
                  )}
                  {newWeight && entries.length > 0 && (
                    <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                      📊 Último peso: {entries[entries.length - 1].weight} kg
                      {Math.abs(parseFloat(newWeight) - entries[entries.length - 1].weight) > 10 && 
                        <span className="text-orange-600 dark:text-orange-400"> (Cambio significativo detectado)</span>
                      }
                    </p>
                  )}
                </div>
                <motion.button disabled={isLoading || (newWeight && (parseFloat(newWeight) < 30 || parseFloat(newWeight) > 300))} whileHover={{ scale:1.02 }} whileTap={{ scale:.97 }} type="submit" className="w-full py-3 rounded-xl bg-indigo-600 text-white font-semibold shadow-md hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed">
                  {isLoading ? 'Guardando...' : 'Guardar'}
                </motion.button>
              </motion.form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default WeightTracker;