import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ArrowRight } from 'lucide-react';

interface AnimatedShinyButtonProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  href?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'secondary';
}

const AnimatedShinyButton = ({ 
  children, 
  className, 
  onClick, 
  href,
  size = 'lg',
  variant = 'primary'
}: AnimatedShinyButtonProps) => {
  const baseClasses = "group relative overflow-hidden inline-flex items-center gap-2 rounded-lg transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]";
  
  const sizeClasses = {
    sm: "h-9 px-4 text-sm",
    md: "h-11 px-6 text-base",
    lg: "h-12 px-8 text-base font-semibold"
  };
  
  const variantClasses = {
    primary: "bg-gradient-to-r from-primary to-primary text-primary-foreground ring-1 ring-primary hover:ring-primary/80 shadow-lg shadow-primary/20",
    secondary: "bg-gradient-to-r from-secondary to-secondary text-secondary-foreground ring-1 ring-secondary hover:ring-secondary/80 shadow-lg shadow-secondary/20"
  };

  const content = (
    <>
      <span className="relative z-10 inline-flex items-center gap-2">
        {children}
        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
      </span>
      <span className="absolute inset-0 -translate-x-full group-hover:translate-x-0 transition-transform duration-500 bg-gradient-to-r from-white/0 via-white/20 to-white/0"></span>
      <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer"></span>
      </span>
    </>
  );

  const buttonClasses = cn(
    baseClasses,
    sizeClasses[size],
    variantClasses[variant],
    className
  );

  if (href) {
    return (
      <a href={href} className={buttonClasses}>
        {content}
      </a>
    );
  }

  return (
    <Button onClick={onClick} className={buttonClasses}>
      {content}
    </Button>
  );
};

export default AnimatedShinyButton;