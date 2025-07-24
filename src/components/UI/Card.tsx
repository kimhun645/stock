import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hover?: boolean;
}

export function Card({ children, className = '', onClick, hover = false }: CardProps) {
  return (
    <div
      className={`bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl shadow-lg ${
        hover ? 'hover:bg-white/15 hover:shadow-xl hover:scale-105' : ''
      } ${onClick ? 'cursor-pointer' : ''} transition-all duration-300 ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
}