import React from 'react';
import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, TrendingDown } from 'lucide-react';

const Chart = ({ 
  data = [], 
  type = 'line', 
  title = 'Chart', 
  height = 200, 
  loading = false,
  className = '' 
}) => {
  if (loading) {
    return (
      <div className={`flex items-center justify-center h-${height} bg-gray-50 dark:bg-gray-800 rounded-lg ${className}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-2"></div>
          <p className="text-sm text-gray-500">Loading chart...</p>
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className={`flex items-center justify-center h-${height} bg-gray-50 dark:bg-gray-800 rounded-lg ${className}`}>
        <div className="text-center">
          <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-2" />
          <p className="text-sm text-gray-500">No data available</p>
        </div>
      </div>
    );
  }

  const maxValue = Math.max(...data.map(item => item.value));
  const minValue = Math.min(...data.map(item => item.value));
  const range = maxValue - minValue;

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg p-4 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
        <div className="flex items-center gap-2">
          {range > 0 ? (
            <TrendingUp className="w-4 h-4 text-success-600" />
          ) : (
            <TrendingDown className="w-4 h-4 text-error-600" />
          )}
          <span className="text-sm text-gray-500">
            {range > 0 ? '+' : ''}{range.toFixed(1)}
          </span>
        </div>
      </div>
      
      <div className={`h-${height} relative`}>
        <svg width="100%" height="100%" className="overflow-visible">
          {data.map((item, index) => {
            const x = (index / (data.length - 1)) * 100;
            const y = range > 0 ? 100 - ((item.value - minValue) / range) * 100 : 50;
            
            return (
              <motion.g
                key={index}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                <circle
                  cx={`${x}%`}
                  cy={`${y}%`}
                  r="4"
                  fill="currentColor"
                  className="text-primary-600"
                />
                <text
                  x={`${x}%`}
                  y={`${y - 10}%`}
                  textAnchor="middle"
                  className="text-xs fill-gray-600 dark:fill-gray-400"
                >
                  {item.value}
                </text>
                <text
                  x={`${x}%`}
                  y="100%"
                  textAnchor="middle"
                  className="text-xs fill-gray-500 dark:fill-gray-400"
                  transform="translate(0, 15)"
                >
                  {item.label}
                </text>
              </motion.g>
            );
          })}
          
          {/* Connect points with lines for line chart */}
          {type === 'line' && data.length > 1 && (
            <motion.path
              d={data.map((item, index) => {
                const x = (index / (data.length - 1)) * 100;
                const y = range > 0 ? 100 - ((item.value - minValue) / range) * 100 : 50;
                return `${index === 0 ? 'M' : 'L'} ${x}% ${y}%`;
              }).join(' ')}
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
              className="text-primary-600"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1, ease: "easeInOut" }}
            />
          )}
        </svg>
      </div>
    </div>
  );
};

export default Chart;
