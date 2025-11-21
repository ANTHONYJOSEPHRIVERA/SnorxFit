import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as Icons from 'lucide-react';
import { navItems } from '../config/navigation';

const SidebarNav = ({ current, onSelect, collapsed, onToggle, mobileOpen, setMobileOpen }) => {
  // Detectar si estamos en pantalla grande (lg) para no aplicar la animación de movimiento móvil
  const [isLarge, setIsLarge] = useState(() => {
    try {
      return window.matchMedia('(min-width: 1024px)').matches;
    } catch (e) {
      return false;
    }
  });

  useEffect(() => {
    let mq;
    try {
      mq = window.matchMedia('(min-width: 1024px)');
      const handler = (e) => setIsLarge(e.matches);
      if (mq.addEventListener) mq.addEventListener('change', handler);
      else mq.addListener(handler);
      return () => {
        if (mq.removeEventListener) mq.removeEventListener('change', handler);
        else mq.removeListener(handler);
      };
    } catch (e) {
      return () => {};
    }
  }, []);

  // Si es pantalla grande, siempre mostrar x=0; en móvil usar mobileOpen para mostrar/ocultar
  const animateX = isLarge ? 0 : (mobileOpen ? 0 : '-100%');

  return (
    <>
      {/* Overlay para móvil */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileOpen(false)}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.div 
        initial={false}
        animate={{ x: animateX }}
        className={`fixed lg:relative inset-y-0 left-0 z-50 h-full flex flex-col ${collapsed ? 'lg:w-20' : 'lg:w-60'} w-72 transition-all duration-300 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-r border-gray-200 dark:border-gray-700 lg:translate-x-0`}
      > 
        <div className="p-4 flex items-center justify-between">
          <div className="text-lg font-bold bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">
            {!collapsed && 'SnorxFit'}
          </div>
          <button onClick={onToggle} className="hidden lg:block p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600">
            {collapsed ? <Icons.ChevronRight size={18} /> : <Icons.ChevronLeft size={18} />}
          </button>
          <button onClick={() => setMobileOpen(false)} className="lg:hidden p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600">
            <Icons.X size={18} />
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto px-2 space-y-1">
          {navItems.map(item => {
            const Icon = Icons[item.icon] || Icons.Circle;
            const active = current === item.key;
            return (
              <motion.button
                key={item.key}
                onClick={() => {
                  onSelect(item.key);
                  setMobileOpen(false);
                }}
                whileHover={{ scale: 1.02 }}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-colors ${active ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-700 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-gray-800'}`}
              >
                <Icon size={18} />
                {!collapsed && <span>{item.label}</span>}
              </motion.button>
            );
          })}
        </nav>
        <div className="p-4 text-xs text-gray-500 dark:text-gray-500">v1.0</div>
      </motion.div>
    </>
  );
};

export default SidebarNav;
