'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface AdminStatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  description?: string;
  color?: string;
  trend?: { value: number; isUp: boolean };
}

export default function AdminStatsCard({
  title,
  value,
  icon,
  description,
  color = 'primary',
  trend,
}: AdminStatsCardProps) {
  const colorMap: Record<string, string> = {
    primary: 'from-primary-500 to-primary-700',
    success: 'from-green-500 to-green-700',
    warning: 'from-yellow-500 to-yellow-700',
    danger: 'from-red-500 to-red-700',
    info: 'from-blue-500 to-blue-700',
    indigo: 'from-indigo-500 to-indigo-700',
    purple: 'from-purple-500 to-purple-700',
    pink: 'from-pink-500 to-pink-700',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`bg-gradient-to-br ${colorMap[color] || colorMap.primary} rounded-xl p-6 text-white shadow-lg hover:shadow-xl transition-shadow duration-300`}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm text-white/80 font-medium">{title}</p>
          <h3 className="text-3xl font-bold tracking-tight">{value}</h3>
          {description && (
            <p className="text-xs text-white/70">{description}</p>
          )}
        </div>
        <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm">
          {icon}
        </div>
      </div>
      {trend && (
        <div className="mt-4 flex items-center gap-1.5 pt-3 border-t border-white/20">
          <span className={`text-sm font-semibold ${trend.isUp ? 'text-green-300' : 'text-red-300'}`}>
            {trend.isUp ? '↑' : '↓'} {Math.abs(trend.value)}%
          </span>
          <span className="text-xs text-white/70">vs last month</span>
        </div>
      )}
    </motion.div>
  );
}