import React, { createContext, useContext, useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const remove = useCallback(id => setToasts(t => t.filter(x => x.id !== id)), []);

  const push = useCallback((message, { type='info', ttl=3500 } = {}) => {
    const id = Date.now() + Math.random();
    setToasts(t => [...t, { id, message, type }]);
    if (ttl) setTimeout(()=> remove(id), ttl);
    return id;
  }, [remove]);

  const api = {
    success: (m, opt) => push(m, { type:'success', ...opt }),
    error: (m, opt) => push(m, { type:'error', ...opt }),
    info: (m, opt) => push(m, { type:'info', ...opt }),
    remove
  };

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div className="fixed z-[999] top-4 right-4 w-72 space-y-2">
        <AnimatePresence>
          {toasts.map(t => {
            const Icon = t.type === 'success' ? CheckCircle2 : t.type === 'error' ? AlertCircle : Info;
            const color = t.type === 'success' ? 'bg-emerald-600' : t.type === 'error' ? 'bg-red-600' : 'bg-indigo-600';
            return (
              <motion.div key={t.id} initial={{ x: 60, opacity:0 }} animate={{ x:0, opacity:1 }} exit={{ x:60, opacity:0 }} className={`text-white px-4 py-3 rounded-2xl shadow-lg flex items-start gap-3 ${color} backdrop-blur-xl bg-opacity-90`}>
                <Icon size={18} className="mt-0.5" />
                <div className="text-sm flex-1 leading-snug">{t.message}</div>
                <button onClick={()=> remove(t.id)} className="opacity-70 hover:opacity-100"><X size={14}/></button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);
