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
  const baseStyles = 'bg-gray-800 rounded-lg border-2 transition-all duration-200';
  const interactiveStyles = onClick ? 'cursor-pointer hover:border-electric-blue' : '';
  const selectedStyles = selected ? 'border-electric-blue bg-gray-700' : 'border-gray-700';
  
  return (
    <div
      className={`${baseStyles} ${interactiveStyles} ${selectedStyles} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};