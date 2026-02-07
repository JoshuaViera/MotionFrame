import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  disabled,
  ...props
}) => {
  const baseStyles = 'font-bold rounded-xl transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed uppercase tracking-wider scale-100 active:scale-95';
  
  const variants = {
    primary: 'bg-electric-blue text-obsidian hover:shadow-[0_0_20px_rgba(0,212,255,0.4)] hover:scale-[1.02]',
    secondary: 'bg-glass text-white border border-glass-border hover:bg-glass-hover hover:border-electric-blue/30',
    outline: 'border border-electric-blue/50 text-electric-blue hover:bg-electric-blue/10 hover:shadow-[0_0_15px_rgba(0,212,255,0.2)]'
  };
  
  const sizes = {
    sm: 'px-4 py-2 text-xs',
    md: 'px-6 py-2.5 text-sm',
    lg: 'px-10 py-4 text-base'
  };
  
  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};