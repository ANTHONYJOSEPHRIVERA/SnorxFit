import React from 'react';

// weights: [{date: '2025-09-20', weight: 82.5}]
const WeightChart = ({ data = [], range = 'week' }) => {
  if (!data.length) return <div className="text-sm text-gray-500">Sin datos suficientes.</div>;
  // Ordenar por fecha asc
  const sortedAll = [...data].sort((a,b)=> new Date(a.date)-new Date(b.date));
  const now = new Date();
  let cutoff;
  if (range === 'year') cutoff = new Date(now.getFullYear(), 0, 1);
  else if (range === 'month') cutoff = new Date(now.getFullYear(), now.getMonth(), 1);
  else cutoff = new Date(now.getTime() - 6*24*60*60*1000); // 7 días
  const sorted = sortedAll.filter(d => new Date(d.date) >= cutoff) || sortedAll.slice(-14);
  const values = sorted.map(d => parseFloat(d.weight));
  const min = Math.min(...values);
  const max = Math.max(...values);
  const pad = (max - min) * 0.15 || 1;
  const vmin = min - pad;
  const vmax = max + pad;
  const points = sorted.map((d,i)=>{
    const x = (i/(sorted.length-1))*100; // porcentaje
    const y = 100 - ((parseFloat(d.weight)-vmin)/(vmax - vmin))*100;
    return `${x},${y}`;
  }).join(' ');
  const first = values[0];
  const last = values[values.length-1];
  const diff = (last-first).toFixed(1);
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2 text-sm">
        <span className="font-medium text-gray-700 dark:text-gray-300 capitalize">Vista {range}</span>
        <span className={`font-semibold ${diff>=0?'text-red-600':'text-green-600'}`}>{diff>=0?'+':''}{diff} kg</span>
      </div>
      <svg viewBox="0 0 100 100" className="w-full h-40 overflow-visible">
        <defs>
          <linearGradient id="gradWeight" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#6366f1" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
          </linearGradient>
        </defs>
        <polyline fill="none" stroke="#6366f1" strokeWidth="1.5" points={points} vectorEffect="non-scaling-stroke" />
        <polygon fill="url(#gradWeight)" points={`0,100 ${points} 100,100`} opacity="0.4" />
        {sorted.map((d,i)=>{
          const x = (i/(sorted.length-1))*100;
          const y = 100 - ((parseFloat(d.weight)-vmin)/(vmax - vmin))*100;
          return <circle key={d.date} cx={x} cy={y} r={1.5} fill="#4338ca" />
        })}
      </svg>
      <div className="flex justify-between text-[10px] mt-1 text-gray-500 dark:text-gray-400">
        <span>{sorted[0].date}</span>
        <span>{sorted[sorted.length-1].date}</span>
      </div>
    </div>
  );
};

export default WeightChart;
