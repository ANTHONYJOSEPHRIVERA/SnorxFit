import React, { useEffect, useState } from 'react';
// import { moodApi } from '../services/apiService'; // REMOVIDO - Migrado a Firebase
import { enqueueOp } from '../utils/offlineQueue';
import { useToast } from '../contexts/ToastContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Smile, Frown, Meh, PlusCircle, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const moodsList = [
  { key:'happy', label:'Feliz', icon: <Smile className="text-yellow-500" /> },
  { key:'neutral', label:'Neutral', icon: <Meh className="text-gray-500" /> },
  { key:'sad', label:'Triste', icon: <Frown className="text-blue-500" /> }
];

const MoodDiary = () => {
  const { isOnline, user } = useAuth();
  const toast = useToast();
  const [moods, setMoods] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedMood, setSelectedMood] = useState(null);
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      if (isOnline) {
        // TODO: Cargar desde Firebase Firestore
        // const res = await moodApi.list();
        const res = { success: false };
        if (res.success) {
          setMoods(res.data.data || res.data || []);
          localStorage.setItem(`snorxfit_moods_${user.id}`, JSON.stringify(res.data.data || res.data || []));
        }
      } else {
        const local = localStorage.getItem(`snorxfit_moods_${user.id}`);
        if (local) setMoods(JSON.parse(local));
      }
    } finally { setLoading(false); }
  };

  useEffect(()=> { if (user) load(); }, [user, isOnline]);

  const saveMood = async (e) => {
    e.preventDefault();
    if (!selectedMood) return;
    const optimistic = { id: Date.now(), mood: selectedMood, note, created_at: new Date().toISOString() };
    setMoods(prev => [optimistic, ...prev]);
    localStorage.setItem(`snorxfit_moods_${user.id}`, JSON.stringify([optimistic, ...moods]));
    setShowForm(false); setSelectedMood(null); setNote('');
    if (isOnline) {
      // TODO: Guardar en Firebase Firestore
      // const res = await moodApi.add(selectedMood, note);
      const res = { success: false };
      if (!res.success) toast.error('Error guardando'); else toast.success('Ánimo registrado');
    } else {
      enqueueOp({ type:'mood:add', payload:{ mood:selectedMood, note }});
      toast.info('En cola offline');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Estado de Ánimo</h1>
        <motion.button whileHover={{scale:1.05}} whileTap={{scale:.95}} onClick={()=> setShowForm(true)} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 text-white shadow-md"><PlusCircle size={18}/>Registrar</motion.button>
      </div>
      <div className="grid md:grid-cols-3 gap-4">
        {moodsList.map(m => (
          <button key={m.key} onClick={()=> { setSelectedMood(m.key); setShowForm(true); }} className={`p-4 rounded-2xl border flex flex-col items-center gap-2 bg-white/70 dark:bg-gray-800/70 hover:shadow ${selectedMood===m.key? 'border-indigo-500':'border-gray-200 dark:border-gray-700'}`}>{m.icon}<span className="text-sm font-medium">{m.label}</span></button>
        ))}
      </div>
      <div className="space-y-3">
        <h2 className="font-semibold text-sm text-gray-500">Historial</h2>
        {loading && <p className="text-xs text-gray-500">Cargando...</p>}
        <div className="space-y-2 max-h-80 overflow-y-auto pr-2">
          {moods.length===0 && <p className="text-sm text-gray-500">Sin registros</p>}
          {moods.map(m => (
            <div key={m.id} className="flex items-center justify-between px-3 py-2 rounded-xl bg-gray-50 dark:bg-gray-700/60 text-sm">
              <span className="font-medium capitalize">{m.mood}</span>
              <span className="text-gray-500 text-xs">{new Date(m.created_at).toLocaleString()}</span>
            </div>
          ))}
        </div>
      </div>
      <AnimatePresence>
        {showForm && (
          <motion.div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onClick={()=> { setShowForm(false); setSelectedMood(null); }}>
            <motion.form onSubmit={saveMood} initial={{scale:.9, opacity:0}} animate={{scale:1, opacity:1}} exit={{scale:.9, opacity:0}} onClick={e=> e.stopPropagation()} className="bg-white dark:bg-gray-800 rounded-3xl p-6 w-full max-w-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Registrar Ánimo</h3>
                <button type="button" onClick={()=> setShowForm(false)} className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700"><X size={14}/></button>
              </div>
              <p className="text-xs text-gray-500">Seleccionado: <span className="font-medium">{selectedMood || '—'}</span></p>
              <textarea value={note} onChange={e=> setNote(e.target.value)} placeholder="Nota (opcional)" className="w-full h-24 resize-none rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 px-3 py-2 text-sm"></textarea>
              <motion.button whileHover={{scale:1.02}} whileTap={{scale:.97}} type="submit" className="w-full py-2 bg-indigo-600 text-white rounded-xl font-semibold">Guardar</motion.button>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MoodDiary;
