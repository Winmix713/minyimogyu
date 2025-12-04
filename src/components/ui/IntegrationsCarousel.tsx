import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Integration {
  name: string;
  logo: string;
  description: string;
  category: string;
}

interface IntegrationsCarouselProps {
  integrations?: Integration[];
  className?: string;
  autoPlay?: boolean;
  autoPlayInterval?: number;
}

const defaultIntegrations: Integration[] = [
  {
    name: "Bet365",
    logo: "https://via.placeholder.com/80x40/1a1a1a/10b981?text=Bet365",
    description: "Real-time odds and betting data",
    category: "Betting"
  },
  {
    name: "Opta",
    logo: "https://via.placeholder.com/80x40/1a1a1a/a855f7?text=Opta",
    description: "Advanced sports statistics",
    category: "Analytics"
  },
  {
    name: "ESPN",
    logo: "https://via.placeholder.com/80x40/1a1a1a/10b981?text=ESPN",
    description: "Live match updates and news",
    category: "Media"
  },
  {
    name: "StatsBomb",
    logo: "https://via.placeholder.com/80x40/1a1a1a/a855f7?text=StatsBomb",
    description: "Detailed performance metrics",
    category: "Analytics"
  },
  {
    name: "Sky Sports",
    logo: "https://via.placeholder.com/80x40/1a1a1a/10b981?text=SkySports",
    description: "Premium sports coverage",
    category: "Media"
  },
  {
    name: "WhoScored",
    logo: "https://via.placeholder.com/80x40/1a1a1a/a855f7?text=WhoScored",
    description: "Player ratings and analysis",
    category: "Analytics"
  }
];

const IntegrationsCarousel = ({ 
  integrations = defaultIntegrations,
  className,
  autoPlay = true,
  autoPlayInterval = 4000
}: IntegrationsCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const visibleItems = 3;
  const totalItems = integrations.length;
  const maxIndex = Math.max(0, totalItems - visibleItems);

  useEffect(() => {
    if (autoPlay && !isPaused) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
      }, autoPlayInterval);

      return () => clearInterval(interval);
    }
  }, [autoPlay, autoPlayInterval, isPaused, maxIndex]);

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  const handleDotClick = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <div 
      className={cn("relative w-full", className)}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Navigation Buttons */}
      <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 flex justify-between items-center px-4 z-20 pointer-events-none">
        <Button
          variant="outline"
          size="icon"
          onClick={handlePrevious}
          className="pointer-events-auto bg-background/80 backdrop-blur-sm ring-1 ring-border/50 hover:bg-background hover:scale-110 transition-all duration-200"
          disabled={currentIndex === 0}
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>
        
        <Button
          variant="outline"
          size="icon"
          onClick={handleNext}
          className="pointer-events-auto bg-background/80 backdrop-blur-sm ring-1 ring-border/50 hover:bg-background hover:scale-110 transition-all duration-200"
          disabled={currentIndex === maxIndex}
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>

      {/* Carousel Track */}
      <div className="overflow-hidden">
        <div 
          className="flex gap-6 transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * (100 / visibleItems)}%)` }}
        >
          {integrations.map((integration, index) => (
            <div
              key={index}
              className={cn(
                "flex-shrink-0 w-full px-2",
                visibleItems === 3 ? "lg:w-1/3" : "lg:w-1/4"
              )}
            >
              <div className="group relative p-6 rounded-2xl bg-card/50 backdrop-blur-sm ring-1 ring-border/50 hover:ring-primary/50 hover:bg-card/80 transition-all duration-300 hover:scale-[1.02]">
                <div className="flex flex-col items-center text-center space-y-4">
                  {/* Logo */}
                  <div className="relative w-20 h-12 flex items-center justify-center rounded-lg bg-background/50 ring-1 ring-border/50 p-2">
                    <img
                      src={integration.logo}
                      alt={`${integration.name} logo`}
                      className="max-w-full max-h-full object-contain filter brightness-0 invert"
                    />
                  </div>
                  
                  {/* Content */}
                  <div className="space-y-2">
                    <h3 className="font-semibold text-foreground text-sm">
                      {integration.name}
                    </h3>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {integration.description}
                    </p>
                    <span className="inline-flex items-center px-2 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                      {integration.category}
                    </span>
                  </div>
                </div>
                
                {/* Hover Effect */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Dots Indicator */}
      <div className="flex justify-center items-center gap-2 mt-6">
        {Array.from({ length: maxIndex + 1 }).map((_, index) => (
          <button
            key={index}
            onClick={() => handleDotClick(index)}
            className={cn(
              "w-2 h-2 rounded-full transition-all duration-300",
              currentIndex === index 
                ? "w-8 bg-primary" 
                : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
            )}
          />
        ))}
      </div>
    </div>
  );
};

export default IntegrationsCarousel;