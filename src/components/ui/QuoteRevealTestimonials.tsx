import React, { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { Quote, Star } from 'lucide-react';

interface Testimonial {
  id: string;
  name: string;
  role: string;
  company?: string;
  avatar: string;
  content: string;
  rating: number;
  featured?: boolean;
}

interface QuoteRevealTestimonialsProps {
  testimonials?: Testimonial[];
  className?: string;
  autoPlay?: boolean;
  autoPlayInterval?: number;
  showRating?: boolean;
}

const defaultTestimonials: Testimonial[] = [
  {
    id: "1",
    name: "Alex Thompson",
    role: "Professional Tipster",
    company: "BetInsight Pro",
    avatar: "https://via.placeholder.com/64x64/1a1a1a/10b981?text=AT",
    content: "WinMix has completely transformed my approach to sports betting. The AI predictions are incredibly accurate, and the risk management tools have helped me maintain consistent profits.",
    rating: 5,
    featured: true
  },
  {
    id: "2",
    name: "Sarah Mitchell",
    role: "Sports Analyst",
    company: "DataSports Analytics",
    avatar: "https://via.placeholder.com/64x64/1a1a1a/a855f7?text=SM",
    content: "The depth of statistical analysis and real-time data integration is unmatched. I've recommended WinMix to all my clients who are serious about data-driven betting.",
    rating: 5
  },
  {
    id: "3",
    name: "Marcus Chen",
    role: "Weekend Bettor",
    avatar: "https://via.placeholder.com/64x64/1a1a1a/10b981?text=MC",
    content: "As someone who bets casually on weekends, WinMix has made me feel like a professional. The insights are easy to understand and have significantly improved my success rate.",
    rating: 4
  },
  {
    id: "4",
    name: "Emma Rodriguez",
    role: "Fantasy Sports Manager",
    company: "FantasyPro League",
    avatar: "https://via.placeholder.com/64x64/1a1a1a/a855f7?text=ER",
    content: "The community features and expert analysis have taken my fantasy sports game to the next level. WinMix is now an essential part of my weekly preparation.",
    rating: 5
  },
  {
    id: "5",
    name: "James Wilson",
    role: "Investment Analyst",
    avatar: "https://via.placeholder.com/64x64/1a1a1a/10b981?text=JW",
    content: "I treat sports betting as an investment, and WinMix provides the analytical rigor I need. The risk management tools are particularly valuable for portfolio management.",
    rating: 5
  }
];

const QuoteRevealTestimonials = ({ 
  testimonials = defaultTestimonials,
  className,
  autoPlay = true,
  autoPlayInterval = 5000,
  showRating = true
}: QuoteRevealTestimonialsProps) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (autoPlay && isVisible) {
      const interval = setInterval(() => {
        setActiveIndex((prev) => (prev + 1) % testimonials.length);
      }, autoPlayInterval);

      return () => clearInterval(interval);
    }
  }, [autoPlay, autoPlayInterval, isVisible, testimonials.length]);

  const handleTestimonialClick = (index: number) => {
    setActiveIndex(index);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        className={cn(
          "w-4 h-4 transition-colors duration-300",
          i < rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground/30"
        )}
      />
    ));
  };

  return (
    <div 
      ref={containerRef}
      className={cn("w-full", className)}
    >
      {/* Main Testimonial Display */}
      <div className="relative mb-8">
        <div className="text-center mb-6">
          <Quote className="w-12 h-12 mx-auto text-primary/20 mb-4" />
        </div>
        
        <div className="relative overflow-hidden">
          <div 
            className="flex transition-transform duration-700 ease-in-out"
            style={{ transform: `translateX(-${activeIndex * 100}%)` }}
          >
            {testimonials.map((testimonial, index) => (
              <div
                key={testimonial.id}
                className="w-full flex-shrink-0 px-4"
              >
                <div className={cn(
                  "max-w-4xl mx-auto text-center transition-all duration-1000",
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                )}>
                  <blockquote className="text-xl sm:text-2xl font-medium text-foreground mb-6 leading-relaxed">
                    "{testimonial.content}"
                  </blockquote>
                  
                  <div className="flex items-center justify-center gap-4 mb-4">
                    <img
                      src={testimonial.avatar}
                      alt={`${testimonial.name} avatar`}
                      className="w-12 h-12 rounded-full ring-2 ring-border"
                    />
                    <div className="text-left">
                      <div className="font-semibold text-foreground">
                        {testimonial.name}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {testimonial.role}
                        {testimonial.company && (
                          <span> • {testimonial.company}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {showRating && (
                    <div className="flex items-center justify-center gap-1">
                      {renderStars(testimonial.rating)}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Thumbnail Navigation */}
      <div className="flex flex-wrap justify-center gap-4">
        {testimonials.map((testimonial, index) => (
          <button
            key={testimonial.id}
            onClick={() => handleTestimonialClick(index)}
            className={cn(
              "group relative p-3 rounded-xl bg-card/50 backdrop-blur-sm ring-1 ring-border/50 transition-all duration-300 hover:ring-primary/50 hover:bg-card/80 hover:scale-[1.02]",
              activeIndex === index && "ring-2 ring-primary bg-card/80"
            )}
          >
            <div className="flex items-center gap-3">
              <img
                src={testimonial.avatar}
                alt={`${testimonial.name} avatar`}
                className={cn(
                  "w-10 h-10 rounded-full ring-1 ring-border transition-all duration-300",
                  activeIndex === index && "ring-2 ring-primary"
                )}
              />
              <div className="text-left">
                <div className={cn(
                  "text-sm font-medium text-foreground transition-colors duration-300",
                  activeIndex === index && "text-primary"
                )}>
                  {testimonial.name}
                </div>
                <div className="text-xs text-muted-foreground">
                  {testimonial.role}
                </div>
              </div>
            </div>
            
            {testimonial.featured && (
              <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-primary animate-pulse" />
            )}
          </button>
        ))}
      </div>

      {/* Progress Indicator */}
      <div className="mt-8 flex justify-center">
        <div className="flex gap-1.5">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => handleTestimonialClick(index)}
              className={cn(
                "h-2 rounded-full transition-all duration-300",
                activeIndex === index 
                  ? "w-8 bg-primary" 
                  : "w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50"
              )}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuoteRevealTestimonials;