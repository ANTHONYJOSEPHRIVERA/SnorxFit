import React, { useEffect, useState } from 'react';
// import { reminderApi } from '../services/apiService'; // REMOVIDO - Migrado a Firebase
import { enqueueOp } from '../utils/offlineQueue';
import { useToast } from '../contexts/ToastContext';
import { motion, AnimatePresence } from 'framer-motion';
import { AlarmClock, Bell, PlusCircle, X, ToggleLeft, ToggleRight, Trash2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const types = [
  { key:'water', label:'Agua' },
  { key:'meal', label:'Comida' },
  { key:'workout', label:'Entrenamiento' },
  { key:'sleep', label:'Dormir' }
];

const RemindersManager = () => {
  const { isOnline } = useAuth();
  const toast = useToast();
  const [reminders, setReminders] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ type:'water', scheduledAt:'', message:'' });

  const load = async () => {
    if (isOnline) {
      // TODO: Cargar desde Firebase Firestore
      // const res = await reminderApi.list();
      const res = { success: false };
      if (res.success) setReminders(res.data.data || res.data || []);
    }
  };
  useEffect(()=> { load(); }, [isOnline]);

  const submit = async (e) => {
    e.preventDefault();
    if (!form.type || !form.scheduledAt || !form.message) return;
    const optimistic = { id: Date.now(), type: form.type, scheduled_at: form.scheduledAt, message: form.message, active:1 };
    setReminders(prev => [...prev, optimistic]);
    setShowForm(false);
    setForm({ type:'water', scheduledAt:'', message:'' });
    if (isOnline) {
      // TODO: Guardar en Firebase Firestore
      // const r = await reminderApi.add(optimistic.type, form.scheduledAt, form.message);
      const r = { success: false };
      if (!r.success) toast.error('No se pudo guardar'); else toast.success('Recordatorio creado');
    } else {
      enqueueOp({ type:'reminder:add', payload:{ type: optimistic.type, scheduledAt: form.scheduledAt, message: form.message }});
      toast.info('En cola offline');
    }
  };

  const toggle = async (r) => {
    setReminders(prev => prev.map(x => x.id === r.id ? { ...x, active: x.active?0:1 } : x));
    // TODO: Actualizar en Firebase Firestore
    // if (isOnline && String(r.id).length < 15) { await reminderApi.toggle(r.id, r.active?0:1); }
  };

  const remove = async (id) => {
    setReminders(prev => prev.filter(r => r.id !== id));
    if (!window.confirm('¿Eliminar recordatorio?')) return;
    // TODO: Eliminar de Firebase Firestore
    // if (isOnline && String(id).length < 15) { await reminderApi.remove(id); toast.info('Eliminado'); }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Recordatorios</h1>
        <motion.button whileHover={{scale:1.05}} whileTap={{scale:.95}} onClick={()=> setShowForm(true)} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl shadow-md"><PlusCircle size={18}/>Nuevo</motion.button>
      </div>
      <div className="space-y-2">
        {reminders.length===0 && <p className="text-sm text-gray-500">Sin recordatorios.</p>}
        {reminders.map(r => (
          <div key={r.id} className="flex items-center gap-3 bg-white/70 dark:bg-gray-800/70 border border-gray-200 dark:border-gray-700 rounded-2xl px-4 py-2">
            <AlarmClock className="text-indigo-500" size={18} />
            <div className="flex-1 text-sm">
              <p className="font-semibold capitalize">{r.type}</p>
              <p className="text-gray-500 text-xs">{new Date(r.scheduled_at || r.scheduledAt).toLocaleString()}</p>
              <p className="text-gray-600 dark:text-gray-300 text-xs mt-1">{r.message}</p>
            </div>
            <button onClick={()=> toggle(r)} className="text-indigo-600">{r.active? <ToggleRight size={28}/> : <ToggleLeft size={28}/>}</button>
            <button onClick={()=> remove(r.id)} className="text-gray-400 hover:text-red-500"><Trash2 size={16}/></button>
          </div>
        ))}
      </div>
      <AnimatePresence>
        {showForm && (
          <motion.div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onClick={()=> setShowForm(false)}>
            <motion.form onSubmit={submit} initial={{scale:.9, opacity:0}} animate={{scale:1, opacity:1}} exit={{scale:.9, opacity:0}} onClick={e=> e.stopPropagation()} className="bg-white dark:bg-gray-800 rounded-3xl p-6 w-full max-w-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Nuevo Recordatorio</h3>
                <button type="button" onClick={()=> setShowForm(false)} className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700"><X size={14}/></button>
              </div>
              <div>
                <label className="text-xs font-medium">Tipo</label>
                <select value={form.type} onChange={e=> setForm(f=> ({...f, type:e.target.value}))} className="w-full mt-1 px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-sm">
                  {types.map(t => <option key={t.key} value={t.key}>{t.label}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-medium">Fecha y hora</label>
                <input type="datetime-local" value={form.scheduledAt} onChange={e=> setForm(f=> ({...f, scheduledAt:e.target.value}))} className="w-full mt-1 px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-sm" required />
              </div>
              <div>
                <label className="text-xs font-medium">Mensaje</label>
                <input type="text" value={form.message} onChange={e=> setForm(f=> ({...f, message:e.target.value}))} className="w-full mt-1 px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-sm" required />
              </div>
              <motion.button whileHover={{scale:1.02}} whileTap={{scale:.97}} type="submit" className="w-full py-2 bg-indigo-600 text-white rounded-xl font-semibold">Guardar</motion.button>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default RemindersManager;
