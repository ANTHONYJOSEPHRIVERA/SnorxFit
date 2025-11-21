import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { db } from '../config/firebase';
import { collection, query, orderBy, limit, getDocs, where } from 'firebase/firestore';
import { ArrowLeft, TrendingUp, Clock, CheckCircle, XCircle, Zap, Activity } from 'lucide-react';

export const MetricsDashboard = ({ onBack }) => {
  const [metrics, setMetrics] = useState({
    total: 0,
    localFood: 0,
    localPredefined: 0,
    geminiAPI: 0,
    successRate: 0,
    avgLatency: 0,
    avgLatencyLocal: 0,
    avgLatencyAPI: 0,
    recentQueries: []
  });
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('today'); // 'today', 'week', 'all'

  useEffect(() => {
    loadMetrics();
  }, [timeRange]);

  const loadMetrics = async () => {
    setLoading(true);
    try {
      const metricsRef = collection(db, 'chat_metrics');
      let q = query(metricsRef, orderBy('timestamp', 'desc'), limit(100));

      // Filtrar por rango de tiempo
      if (timeRange === 'today') {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        q = query(metricsRef, where('timestamp', '>=', today), orderBy('timestamp', 'desc'));
      } else if (timeRange === 'week') {
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        q = query(metricsRef, where('timestamp', '>=', weekAgo), orderBy('timestamp', 'desc'));
      }

      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => doc.data());

      // Calcular estadísticas
      const total = data.length;
      const localFood = data.filter(m => m.messageType === 'local_food').length;
      const localPredefined = data.filter(m => m.messageType === 'local_predefined').length;
      const geminiAPI = data.filter(m => m.messageType === 'gemini_api').length;
      const successful = data.filter(m => m.success).length;
      const successRate = total > 0 ? (successful / total) * 100 : 0;

      // Latencias promedio
      const validLatencies = data.filter(m => m.latency > 0);
      const avgLatency = validLatencies.length > 0
        ? validLatencies.reduce((sum, m) => sum + m.latency, 0) / validLatencies.length
        : 0;

      const localLatencies = data.filter(m => m.messageType.includes('local') && m.latency > 0);
      const avgLatencyLocal = localLatencies.length > 0
        ? localLatencies.reduce((sum, m) => sum + m.latency, 0) / localLatencies.length
        : 0;

      const apiLatencies = data.filter(m => m.messageType === 'gemini_api' && m.latency > 0);
      const avgLatencyAPI = apiLatencies.length > 0
        ? apiLatencies.reduce((sum, m) => sum + m.latency, 0) / apiLatencies.length
        : 0;

      setMetrics({
        total,
        localFood,
        localPredefined,
        geminiAPI,
        successRate,
        avgLatency,
        avgLatencyLocal,
        avgLatencyAPI,
        recentQueries: data.slice(0, 10)
      });

      console.log('📊 Métricas cargadas:', {
        total,
        localFood,
        localPredefined,
        geminiAPI,
        successRate: successRate.toFixed(1) + '%',
        avgLatency: avgLatency.toFixed(0) + 'ms'
      });
    } catch (error) {
      console.error('❌ Error cargando métricas:', error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ icon: Icon, label, value, color, subtitle }) => (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
    >
      <div className="flex items-center gap-4">
        <div className={`p-3 rounded-xl ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400">{label}</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{value}</p>
          {subtitle && (
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">{subtitle}</p>
          )}
        </div>
      </div>
    </motion.div>
  );

  const getMessageTypeLabel = (type) => {
    const labels = {
      'local_food': '🍎 Alimento Local',
      'local_predefined': '💬 Respuesta Local',
      'gemini_api': '🤖 Gemini API'
    };
    return labels[type] || type;
  };

  const getMessageTypeColor = (type) => {
    const colors = {
      'local_food': 'text-green-600',
      'local_predefined': 'text-blue-600',
      'gemini_api': 'text-purple-600'
    };
    return colors[type] || 'text-gray-600';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-purple-900 dark:to-gray-900 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onBack}
              className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg hover:shadow-xl transition-shadow"
            >
              <ArrowLeft size={24} className="text-gray-700 dark:text-gray-300" />
            </motion.button>
            <div>
              <h1 className="text-4xl font-extrabold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Dashboard de Métricas
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Análisis de rendimiento del chatbot
              </p>
            </div>
          </div>

          {/* Time Range Selector */}
          <div className="flex gap-2">
            {['today', 'week', 'all'].map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  timeRange === range
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                {range === 'today' ? 'Hoy' : range === 'week' ? 'Esta Semana' : 'Todo'}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Cargando métricas...</p>
          </div>
        ) : (
          <>
            {/* Stats Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <StatCard
                icon={Activity}
                label="Total de Consultas"
                value={metrics.total}
                color="bg-gradient-to-r from-blue-500 to-blue-600"
                subtitle={`${metrics.localFood + metrics.localPredefined} locales, ${metrics.geminiAPI} API`}
              />
              <StatCard
                icon={Clock}
                label="Latencia Promedio"
                value={`${metrics.avgLatency.toFixed(0)}ms`}
                color="bg-gradient-to-r from-purple-500 to-purple-600"
                subtitle={`Local: ${metrics.avgLatencyLocal.toFixed(0)}ms | API: ${metrics.avgLatencyAPI.toFixed(0)}ms`}
              />
              <StatCard
                icon={CheckCircle}
                label="Tasa de Éxito"
                value={`${metrics.successRate.toFixed(1)}%`}
                color="bg-gradient-to-r from-green-500 to-green-600"
                subtitle={`${Math.round((metrics.successRate / 100) * metrics.total)} exitosas`}
              />
              <StatCard
                icon={Zap}
                label="Eficiencia Local"
                value={`${((metrics.localFood + metrics.localPredefined) / metrics.total * 100).toFixed(0)}%`}
                color="bg-gradient-to-r from-orange-500 to-orange-600"
                subtitle="Consultas resueltas sin API"
              />
            </div>

            {/* Distribution Chart */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg mb-8 border border-gray-200 dark:border-gray-700">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Distribución de Tipos de Respuesta
              </h2>
              <div className="space-y-4">
                {[
                  { type: 'local_food', count: metrics.localFood, label: 'Alimentos Locales', color: 'from-green-500 to-green-600' },
                  { type: 'local_predefined', count: metrics.localPredefined, label: 'Respuestas Predefinidas', color: 'from-blue-500 to-blue-600' },
                  { type: 'gemini_api', count: metrics.geminiAPI, label: 'Gemini API', color: 'from-purple-500 to-purple-600' }
                ].map(({ type, count, label, color }) => (
                  <div key={type}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium text-gray-700 dark:text-gray-300">{label}</span>
                      <span className="font-bold text-gray-900 dark:text-white">
                        {count} ({metrics.total > 0 ? ((count / metrics.total) * 100).toFixed(1) : 0}%)
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                      <div
                        className={`bg-gradient-to-r ${color} h-3 rounded-full transition-all duration-500`}
                        style={{ width: `${metrics.total > 0 ? (count / metrics.total) * 100 : 0}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Queries Table */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Consultas Recientes
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">Tipo</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">Latencia</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">Estado</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">Fecha</th>
                    </tr>
                  </thead>
                  <tbody>
                    {metrics.recentQueries.map((query, index) => (
                      <tr key={index} className="border-b border-gray-100 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-700/30">
                        <td className="py-3 px-4">
                          <span className={`font-medium ${getMessageTypeColor(query.messageType)}`}>
                            {getMessageTypeLabel(query.messageType)}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-gray-700 dark:text-gray-300">
                          {query.latency}ms
                        </td>
                        <td className="py-3 px-4">
                          {query.success ? (
                            <span className="flex items-center gap-1 text-green-600">
                              <CheckCircle size={16} /> Exitoso
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 text-red-600">
                              <XCircle size={16} /> Error
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-500 dark:text-gray-500">
                          {query.timestamp?.toDate?.()?.toLocaleString('es-PE') || 'N/A'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Performance Insights */}
            <div className="mt-8 grid md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-lg">
                <h3 className="text-xl font-bold mb-2">🚀 Rendimiento Excelente</h3>
                <p className="text-green-100 mb-4">
                  {((metrics.localFood + metrics.localPredefined) / metrics.total * 100).toFixed(0)}% de consultas 
                  resueltas localmente en &lt;200ms
                </p>
                <div className="text-sm opacity-90">
                  ✅ Objetivo: &gt;70% respuestas locales
                </div>
              </div>

              <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg">
                <h3 className="text-xl font-bold mb-2">📊 Métricas Clave</h3>
                <ul className="space-y-2 text-blue-100">
                  <li>• Latencia local: {metrics.avgLatencyLocal.toFixed(0)}ms (objetivo: &lt;200ms)</li>
                  <li>• Latencia API: {metrics.avgLatencyAPI.toFixed(0)}ms (objetivo: &lt;5000ms)</li>
                  <li>• Tasa éxito: {metrics.successRate.toFixed(1)}% (objetivo: &gt;95%)</li>
                </ul>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
