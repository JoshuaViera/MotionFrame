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
  const baseStyles = 'bg-gray-800/50 backdrop-blur-sm rounded-xl border-2 transition-all duration-200 shadow-lg';
  const interactiveStyles = onClick ? 'cursor-pointer hover:border-electric-blue hover:shadow-electric-blue/20 hover:shadow-xl' : '';
  const selectedStyles = selected ? 'border-electric-blue bg-gray-700/50 shadow-electric-blue/30 shadow-xl' : 'border-gray-700/50';
  
  return (
    <div
      className={`${baseStyles} ${interactiveStyles} ${selectedStyles} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};