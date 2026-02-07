import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  selected?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  onClick,
  selected = false
}) => {
  const baseStyles = 'glass-card rounded-2xl p-0 overflow-hidden';
  const interactiveStyles = onClick ? 'cursor-pointer' : '';
  const selectedStyles = selected ? 'border-electric-blue/50 bg-electric-blue/5 shadow-[0_0_25px_rgba(0,212,255,0.1)]' : '';

  return (
    <div
      className={`${baseStyles} ${interactiveStyles} ${selectedStyles} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};