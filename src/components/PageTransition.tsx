import React, { useEffect, useState } from 'react';

interface PageTransitionProps {
  children: React.ReactNode;
  transitionKey: string;
  type?: 'fade' | 'slide' | 'scale' | 'slideUp';
}

export function PageTransition({ children, transitionKey, type = 'fade' }: PageTransitionProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [displayChildren, setDisplayChildren] = useState(children);

  useEffect(() => {
    // Start exit animation
    setIsVisible(false);

    const exitTimer = setTimeout(() => {
      // Update content
      setDisplayChildren(children);
      
      // Start enter animation
      requestAnimationFrame(() => {
        setIsVisible(true);
      });
    }, 200); // Match exit animation duration

    return () => clearTimeout(exitTimer);
  }, [transitionKey, children]);

  // Initialize as visible
  useEffect(() => {
    setIsVisible(true);
  }, []);

  const getTransitionStyles = () => {
    const baseStyles = 'transition-all duration-200 ease-in-out';
    
    switch (type) {
      case 'fade':
        return `${baseStyles} ${isVisible ? 'opacity-100' : 'opacity-0'}`;
      
      case 'slide':
        return `${baseStyles} ${
          isVisible 
            ? 'opacity-100 translate-x-0' 
            : 'opacity-0 translate-x-8'
        }`;
      
      case 'slideUp':
        return `${baseStyles} ${
          isVisible 
            ? 'opacity-100 translate-y-0' 
            : 'opacity-0 translate-y-4'
        }`;
      
      case 'scale':
        return `${baseStyles} ${
          isVisible 
            ? 'opacity-100 scale-100' 
            : 'opacity-0 scale-95'
        }`;
      
      default:
        return baseStyles;
    }
  };

  return (
    <div className={getTransitionStyles()}>
      {displayChildren}
    </div>
  );
}

// Stagger children animations
export function StaggeredList({ children, staggerDelay = 50 }: { children: React.ReactNode[]; staggerDelay?: number }) {
  return (
    <>
      {React.Children.map(children, (child, index) => (
        <div
          style={{
            animation: `fadeInUp 0.3s ease-out forwards`,
            animationDelay: `${index * staggerDelay}ms`,
            opacity: 0
          }}
        >
          {child}
        </div>
      ))}
    </>
  );
}
