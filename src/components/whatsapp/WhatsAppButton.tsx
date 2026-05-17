'use client';

import React from 'react';
import { FaWhatsapp } from 'react-icons/fa';
import toast from 'react-hot-toast';

interface WhatsAppButtonProps {
  phone: string;
  message?: string;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'button' | 'icon';
  className?: string;
}

export default function WhatsAppButton({
  phone,
  message = 'Hello, I would like to check my report status.',
  label = 'Send WhatsApp',
  size = 'md',
  variant = 'button',
  className = '',
}: WhatsAppButtonProps) {
  const cleanPhone = phone.replace(/[^0-9]/g, '');
  const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;

  const handleClick = () => {
    if (!cleanPhone) {
      toast.error('Invalid phone number');
      return;
    }
    window.open(waUrl, '_blank');
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs gap-1.5',
    md: 'px-4 py-2 text-sm gap-2',
    lg: 'px-6 py-3 text-base gap-2',
  };

  if (variant === 'icon') {
    return (
      <button
        onClick={handleClick}
        className={`p-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors shadow-lg hover:shadow-xl ${className}`}
        title={label}
      >
        <FaWhatsapp className={size === 'sm' ? 'h-4 w-4' : 'h-5 w-5'} />
      </button>
    );
  }

  return (
    <button
      onClick={handleClick}
      className={`inline-flex items-center justify-center bg-green-500 text-white font-medium rounded-lg hover:bg-green-600 transition-all duration-200 shadow-sm hover:shadow-md ${sizeClasses[size]} ${className}`}
    >
      <FaWhatsapp className="h-4 w-4" />
      {label}
    </button>
  );
}