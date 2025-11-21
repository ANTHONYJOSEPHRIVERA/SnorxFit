import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, MessageSquare, Settings as SettingsIcon, 
  BarChart3, TrendingUp, Activity, Search,
  Shield, LogOut
} from 'lucide-react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../config/firebase';

const AdminDashboard = ({ userProfile, onLogout }) => {
  const [activeSection, setActiveSection] = useState('overview');
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalQueries: 0,
    popularFoods: [],
    loading: true
  });
  const [allUsers, setAllUsers] = useState([]);

  useEffect(() => {
    loadAdminStats();
  }, []);

  const loadAdminStats = async () => {
    try {
      setStats(prev => ({ ...prev, loading: true }));

      // 1. Cargar todos los usuarios desde Firebase
      const usersRef = collection(db, 'users');
      const usersSnapshot = await getDocs(usersRef);
      const users = [];
      
      usersSnapshot.forEach((doc) => {
        users.push({
          id: doc.id,
          ...doc.data()
        });
      });

      setAllUsers(users);

      // 2. Calcular usuarios activos (últimos 30 días)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const activeUsers = users.filter(user => {
        if (!user.updatedAt) return false;
        const lastUpdate = new Date(user.updatedAt);
        return lastUpdate >= thirtyDaysAgo;
      }).length;

      // 3. Contar consultas al chatbot (desde localStorage - estimado)
      let totalQueries = 0;
      try {
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && key.startsWith('chatHistory_')) {
            const history = JSON.parse(localStorage.getItem(key) || '[]');
            totalQueries += history.filter(msg => msg.sender === 'user').length;
          }
        }
      } catch (e) {
        console.log('No se pudieron cargar consultas del chatbot');
      }

      // 4. Alimentos más registrados (desde localStorage)
      const foodCount = {};
      try {
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && key.startsWith('foodLog_')) {
            const foodLog = JSON.parse(localStorage.getItem(key) || '{}');
            const meals = foodLog.meals || {};
            Object.values(meals).flat().forEach(food => {
              const name = food.name || food.nombre || 'Desconocido';
              foodCount[name] = (foodCount[name] || 0) + 1;
            });
          }
        }
      } catch (e) {
        console.log('No se pudieron cargar alimentos');
      }

      const popularFoods = Object.entries(foodCount)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([name, count]) => ({ name, count }));

      setStats({
        totalUsers: users.length,
        activeUsers: activeUsers,
        totalQueries: totalQueries,
        popularFoods: popularFoods,
        loading: false
      });

    } catch (error) {
      console.error('Error cargando estadísticas:', error);
      setStats({
        totalUsers: 0,
        activeUsers: 0,
        totalQueries: 0,
        popularFoods: [],
        loading: false
      });
    }
  };

  const menuItems = [
    { id: 'overview', label: 'Panel General', icon: BarChart3 },
    { id: 'users', label: 'Gestión de Usuarios', icon: Users },
    { id: 'chatbot', label: 'Chatbot Analytics', icon: MessageSquare },
    { id: 'support', label: 'Soporte', icon: Activity },
    { id: 'settings', label: 'Configuraciones', icon: SettingsIcon }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700">
      {/* Header Admin */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 shadow-xl"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Shield className="w-10 h-10" />
            <div>
              <h1 className="text-3xl font-extrabold">Panel de Administrador</h1>
              <p className="text-sm opacity-90">Bienvenido, {userProfile?.name || 'Admin'}</p>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-xl transition"
          >
            <LogOut size={20} />
            Cerrar Sesión
          </button>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl p-4 shadow-xl">
              <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">
                Menú Admin
              </h3>
              <nav className="space-y-2">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveSection(item.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition ${
                        activeSection === item.id
                          ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg'
                          : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      <Icon size={20} />
                      <span className="font-medium">{item.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </motion.div>

          {/* Contenido Principal */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-3"
          >
            {activeSection === 'overview' && <OverviewSection stats={stats} />}
            {activeSection === 'users' && <UsersSection allUsers={allUsers} />}
            {activeSection === 'chatbot' && <ChatbotSection stats={stats} />}
            {activeSection === 'support' && <SupportSection />}
            {activeSection === 'settings' && <SettingsSection />}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

// Sección: Panel General
const OverviewSection = ({ stats }) => {
  if (stats.loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
        📊 Panel General
      </h2>

      {/* Tarjetas de Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-cyan-500 text-white rounded-2xl p-6 shadow-xl">
          <Users className="w-8 h-8 opacity-80 mb-2" />
          <p className="text-sm opacity-90">Usuarios Totales</p>
          <p className="text-4xl font-extrabold">{stats.totalUsers}</p>
          <p className="text-xs opacity-75 mt-2">Registrados en Firebase</p>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-emerald-500 text-white rounded-2xl p-6 shadow-xl">
          <Activity className="w-8 h-8 opacity-80 mb-2" />
          <p className="text-sm opacity-90">Usuarios Activos (30d)</p>
          <p className="text-4xl font-extrabold">{stats.activeUsers}</p>
          <p className="text-xs opacity-75 mt-2">Con actividad reciente</p>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-pink-500 text-white rounded-2xl p-6 shadow-xl">
          <MessageSquare className="w-8 h-8 opacity-80 mb-2" />
          <p className="text-sm opacity-90">Consultas Chatbot</p>
          <p className="text-4xl font-extrabold">{stats.totalQueries}</p>
          <p className="text-xs opacity-75 mt-2">Mensajes enviados</p>
        </div>
      </div>

      {/* Alimentos Más Registrados */}
      {stats.popularFoods && stats.popularFoods.length > 0 && (
        <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl p-6 shadow-xl">
          <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">
            🍽️ Alimentos Más Registrados
          </h3>
          <div className="space-y-3">
            {stats.popularFoods.map((food, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-100 dark:bg-gray-700 rounded-xl">
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                    #{index + 1}
                  </span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {food.name}
                  </span>
                </div>
                <span className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full text-sm font-bold">
                  {food.count} veces
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Sección: Gestión de Usuarios
const UsersSection = ({ allUsers = [] }) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
        👥 Gestión de Usuarios
      </h2>

      {/* Buscador */}
      <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl p-4 shadow-xl">
        <div className="flex items-center gap-3 px-4 py-3 bg-gray-100 dark:bg-gray-700 rounded-xl">
          <Search className="w-5 h-5 text-gray-500" />
          <input
            type="text"
            placeholder="Buscar usuario por email o nombre..."
            className="flex-1 bg-transparent outline-none text-gray-900 dark:text-white"
          />
        </div>
      </div>

      {/* Lista de Usuarios */}
      <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl p-6 shadow-xl">
        <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">
          Lista de Usuarios ({allUsers.length})
        </h3>
        
        {allUsers.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <Users className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p>No hay usuarios registrados aún</p>
            <p className="text-sm mt-2">Los usuarios aparecerán aquí cuando se registren</p>
          </div>
        ) : (
          <div className="space-y-3">
            {allUsers.map((user) => (
              <div key={user.id} className="p-4 bg-gray-100 dark:bg-gray-700 rounded-xl">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-bold text-gray-900 dark:text-white">
                        {user.name || 'Sin nombre'}
                      </h4>
                      {user.role === 'admin' && (
                        <span className="px-2 py-0.5 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 text-xs font-bold rounded">
                          ADMIN
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      📧 {user.email}
                    </p>
                    {user.age && (
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        👤 {user.age} años • {user.gender === 'male' ? '♂️' : user.gender === 'female' ? '♀️' : ''}
                      </p>
                    )}
                    {user.weight && user.height && (
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        ⚖️ {user.weight} kg • 📏 {user.height} cm
                      </p>
                    )}
                    {user.goal && (
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        🎯 Objetivo: {
                          user.goal === 'lose' ? 'Perder peso' :
                          user.goal === 'gain' ? 'Ganar músculo' :
                          'Mantener peso'
                        }
                      </p>
                    )}
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                      📅 Registrado: {user.createdAt ? new Date(user.createdAt).toLocaleDateString('es-ES') : 'N/A'}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Sección: Chatbot Analytics
const ChatbotSection = ({ stats }) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
        🤖 Chatbot Analytics
      </h2>

      {/* Estadísticas del Chatbot */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl p-6 shadow-xl">
          <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">
            📊 Estadísticas Generales
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-gray-100 dark:bg-gray-700 rounded-xl">
              <span className="text-sm text-gray-700 dark:text-gray-300">Total de Consultas</span>
              <span className="font-bold text-indigo-600 dark:text-indigo-400 text-xl">{stats.totalQueries}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-100 dark:bg-gray-700 rounded-xl">
              <span className="text-sm text-gray-700 dark:text-gray-300">Alimentos en Base</span>
              <span className="font-bold text-indigo-600 dark:text-indigo-400 text-xl">220+</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-100 dark:bg-gray-700 rounded-xl">
              <span className="text-sm text-gray-700 dark:text-gray-300">Modelo IA</span>
              <span className="font-bold text-indigo-600 dark:text-indigo-400 text-sm">Gemini 2.5 Flash</span>
            </div>
          </div>
        </div>

        {/* Alimentos Más Consultados */}
        {stats.popularFoods && stats.popularFoods.length > 0 && (
          <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl p-6 shadow-xl">
            <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">
              🍽️ Alimentos Más Registrados
            </h3>
            <div className="space-y-2">
              {stats.popularFoods.slice(0, 3).map((food, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-gray-100 dark:bg-gray-700 rounded-xl">
                  <span className="text-sm text-gray-700 dark:text-gray-300">{food.name}</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">{food.count}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl p-6 shadow-xl">
          <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">
            Configuración del Chatbot
          </h3>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Modelo IA Actual
              </label>
              <input
                type="text"
                value="Gemini 2.5 Flash"
                disabled
                className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-xl text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Temperatura (Creatividad)
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                defaultValue="0.7"
                className="w-full"
              />
              <p className="text-xs text-gray-500 mt-1">Actual: 0.7</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Sección: Soporte
const SupportSection = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
        🆘 Soporte y Feedback
      </h2>

      <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl p-6 shadow-xl">
        <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">
          Tickets de Soporte
        </h3>
        <div className="text-center text-gray-500 py-8">
          <MessageSquare className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <p>No hay tickets pendientes</p>
          <p className="text-sm mt-2">Los usuarios pueden enviar feedback desde Configuración</p>
        </div>
      </div>
    </div>
  );
};

// Sección: Configuraciones
const SettingsSection = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
        ⚙️ Configuraciones del Sistema
      </h2>

      <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl p-6 shadow-xl">
        <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">
          Parámetros Generales
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Nombre de la App
            </label>
            <input
              type="text"
              defaultValue="SnorxFit"
              className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-xl"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Versión Actual
            </label>
            <input
              type="text"
              defaultValue="1.0.0"
              className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-xl"
            />
          </div>
          <div>
            <label className="flex items-center gap-2">
              <input type="checkbox" defaultChecked className="rounded" />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                Permitir registro de nuevos usuarios
              </span>
            </label>
          </div>
          <div>
            <label className="flex items-center gap-2">
              <input type="checkbox" defaultChecked className="rounded" />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                Activar modo mantenimiento
              </span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
