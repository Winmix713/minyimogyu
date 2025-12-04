import React, { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface PhotoMarqueeProps {
  images: string[];
  speed?: 'slow' | 'normal' | 'fast';
  direction?: 'left' | 'right';
  className?: string;
  pauseOnHover?: boolean;
}

const PhotoMarquee = ({ 
  images, 
  speed = 'normal',
  direction = 'left',
  className,
  pauseOnHover = true
}: PhotoMarqueeProps) => {
  const marqueeRef = useRef<HTMLDivElement>(null);

  const speedMap = {
    slow: 'animate-marquee-slow',
    normal: 'animate-marquee',
    fast: 'animate-marquee-fast'
  };

  const directionMap = {
    left: speedMap[speed],
    right: `${speedMap[speed]} animate-reverse`
  };

  return (
    <div className={cn("relative w-full overflow-hidden", className)}>
      <div 
        className={cn(
          "flex gap-6 py-4",
          directionMap[direction],
          pauseOnHover && "hover:animation-pause"
        )}
        ref={marqueeRef}
      >
        {[...images, ...images].map((image, index) => (
          <div
            key={index}
            className="flex-shrink-0 relative group"
          >
            <div className="relative overflow-hidden rounded-2xl ring-1 ring-border/50 bg-card/50 backdrop-blur-sm">
              <img
                src={image}
                alt={`Marquee image ${index + 1}`}
                className="w-32 h-20 sm:w-40 sm:h-24 object-cover transition-transform duration-300 group-hover:scale-110"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          </div>
        ))}
      </div>
      
      {/* Fade edges */}
      <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-background via-background/50 to-transparent pointer-events-none z-10" />
      <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-background via-background/50 to-transparent pointer-events-none z-10" />
    </div>
  );
};

export default PhotoMarquee;