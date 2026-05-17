'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { FiCheck, FiStar, FiCrown } from 'react-icons/fi';
import Button from '@/components/ui/Button';
import { Plan } from '@/services/subscriptionService';

interface PlanCardProps {
  plan: Plan;
  isCurrentPlan?: boolean;
  onSelect: (plan: Plan) => void;
  loading?: boolean;
}

export default function PlanCard({ plan, isCurrentPlan = false, onSelect, loading = false }: PlanCardProps) {
  const isPopular = plan.isPopular;
  const isFree = plan.price === 0;

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className={`relative bg-white dark:bg-gray-800 rounded-2xl border-2 p-6 transition-all ${
        isPopular
          ? 'border-primary-500 shadow-xl shadow-primary-500/10'
          : isCurrentPlan
          ? 'border-green-500'
          : 'border-gray-200 dark:border-gray-700'
      }`}
    >
      {isPopular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-primary-500 to-primary-700 text-white text-xs font-bold px-4 py-1 rounded-full flex items-center gap-1">
          <FiStar className="h-3 w-3" /> Most Popular
        </div>
      )}

      {isCurrentPlan && (
        <div className="absolute -top-3 right-4 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
          <FiCheck className="h-3 w-3" /> Current
        </div>
      )}

      <div className="text-center mb-6">
        <div className={`inline-flex p-3 rounded-xl mb-3 ${isFree ? 'bg-gray-100 dark:bg-gray-700' : 'bg-primary-50 dark:bg-primary-950'}`}>
          {isFree ? (
            <FiCrown className="h-6 w-6 text-gray-400" />
          ) : (
            <FiCrown className="h-6 w-6 text-primary-600 dark:text-primary-400" />
          )}
        </div>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">{plan.name}</h3>
        <div className="mt-2">
          <span className="text-3xl font-bold text-gray-900 dark:text-white">₹{plan.price}</span>
          <span className="text-gray-500 dark:text-gray-400 text-sm ml-1">/{plan.duration}d</span>
        </div>
      </div>

      <ul className="space-y-3 mb-6">
        {plan.features.map((feature, i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-300">
            <FiCheck className={`h-4 w-4 mt-0.5 flex-shrink-0 ${isPopular ? 'text-primary-500' : 'text-green-500'}`} />
            {feature}
          </li>
        ))}
      </ul>

      <Button
        fullWidth
        variant={isPopular ? 'primary' : isCurrentPlan ? 'success' : 'outline'}
        onClick={() => onSelect(plan)}
        loading={loading}
        disabled={isCurrentPlan}
        size="lg"
      >
        {isCurrentPlan ? 'Current Plan' : isFree ? 'Get Started Free' : `Subscribe - ₹${plan.price}`}
      </Button>
    </motion.div>
  );
}