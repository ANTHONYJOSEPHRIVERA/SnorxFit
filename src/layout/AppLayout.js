import React, { useState } from 'react';
import SidebarNav from './SidebarNav';
import { motion } from 'framer-motion';
import { MessageSquare, LogOut, Sun, Moon, Menu } from 'lucide-react';

const AppLayout = ({ children, currentView, onSelectView, onToggleChat, showChat, onLogout, isDarkMode, toggleDarkMode }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  
  return (
    <div className="min-h-screen flex bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-800">
      <SidebarNav 
        current={currentView} 
        onSelect={onSelectView} 
        collapsed={collapsed} 
        onToggle={() => setCollapsed(c => !c)}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-14 backdrop-blur-xl bg-white/70 dark:bg-gray-900/60 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-3 sm:px-4">
          <div className="flex items-center gap-2 sm:gap-3">
            <button 
              onClick={() => setMobileOpen(true)} 
              className="lg:hidden p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
            >
              <Menu size={18} />
            </button>
            <div className="font-semibold text-sm sm:text-base text-gray-700 dark:text-gray-200 capitalize truncate">{currentView}</div>
          </div>
          <div className="flex items-center gap-1 sm:gap-2">
            <motion.button whileHover={{ scale:1.1 }} whileTap={{ scale:.9 }} onClick={toggleDarkMode} className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
              {isDarkMode ? <Sun size={18}/> : <Moon size={18}/>}
            </motion.button>
            <motion.button whileHover={{ scale:1.1 }} whileTap={{ scale:.9 }} onClick={onToggleChat} className="p-2 rounded-lg bg-indigo-600 text-white shadow-md">
              <MessageSquare size={18} />
            </motion.button>
            <motion.button whileHover={{ scale:1.1 }} whileTap={{ scale:.9 }} onClick={onLogout} className="p-2 rounded-lg bg-red-600 text-white shadow-md">
              <LogOut size={18} />
            </motion.button>
          </div>
        </header>
        <main className="p-2 sm:p-4 flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
};

export default AppLayout;
