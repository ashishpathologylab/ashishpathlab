'use client';

import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';

export function useTrial() {
  const { user } = useAuth();
  const [daysLeft, setDaysLeft] = useState<number>(0);
  const [isExpired, setIsExpired] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    if (user.isPremium) {
      setDaysLeft(999);
      setIsExpired(false);
      setIsLoading(false);
      return;
    }

    if (user.trialEndsAt) {
      const end = new Date(user.trialEndsAt);
      const now = new Date();
      const diff = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      setDaysLeft(Math.max(0, diff));
      setIsExpired(diff <= 0);
    } else {
      setDaysLeft(14);
      setIsExpired(false);
    }

    setIsLoading(false);
  }, [user]);

  return { daysLeft, isExpired, isLoading, isPremium: user?.isPremium || false };
}