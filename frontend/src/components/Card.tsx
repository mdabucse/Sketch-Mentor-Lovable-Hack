

import React, { ReactNode } from 'react';

interface CardProps {
  className?: string;
  children?: ReactNode;
  [key: string]: any;
}

export const Card = ({ className = '', children, ...props }: CardProps) => {
  return (
    <div 
      className={`bg-white rounded-lg border border-gray-200 shadow-sm ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader = ({ className = '', children, ...props }: CardProps) => {
  return (
    <div 
      className={`p-6 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardTitle = ({ className = '', children, ...props }: CardProps) => {
  return (
    <h3 
      className={`text-lg font-semibold text-gray-900 ${className}`}
      {...props}
    >
      {children}
    </h3>
  );
};

export const CardContent = ({ className = '', children, ...props }: CardProps) => {
  return (
    <div 
      className={`p-6 pt-0 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;