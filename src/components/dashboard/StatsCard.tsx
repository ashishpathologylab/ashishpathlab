'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: { value: number; isUp: boolean };
  color?: string;
  subtitle?: string;
  onClick?: () => void;
}

export default function StatsCard({
  title,
  value,
  icon,
  trend,
  color = 'primary',
  subtitle,
  onClick,
}: StatsCardProps) {
  const colorMap: Record<string, string> = {
    primary: 'bg-primary-50 text-primary-600 dark:bg-primary-950 dark:text-primary-400',
    success: 'bg-green-50 text-green-600 dark:bg-green-950 dark:text-green-400',
    warning: 'bg-yellow-50 text-yellow-600 dark:bg-yellow-950 dark:text-yellow-400',
    danger: 'bg-red-50 text-red-600 dark:bg-red-950 dark:text-red-400',
    info: 'bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400',
  };

  return (
    <motion.div
      whileHover={{ y: -2 }}
      onClick={onClick}
      className={`bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-200 dark:border-gray-700 ${onClick ? 'cursor-pointer' : ''}`}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{value}</h3>
          {subtitle && (
            <p className="text-xs text-gray-400">{subtitle}</p>
          )}
        </div>
        <div className={`p-3 rounded-lg ${colorMap[color] || colorMap.primary}`}>
          {icon}
        </div>
      </div>
      {trend && (
        <div className="mt-4 flex items-center gap-1">
          <span className={`text-xs font-medium ${trend.isUp ? 'text-green-600' : 'text-red-600'}`}>
            {trend.isUp ? '↑' : '↓'} {Math.abs(trend.value)}%
          </span>
          <span className="text-xs text-gray-400">vs last month</span>
        </div>
      )}
    </motion.div>
  );
}