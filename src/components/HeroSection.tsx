import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ChevronRight, 
  Radar, 
  Wifi, 
  Sparkles, 
  Activity, 
  ShieldCheck,
  TrendingUp,
  Users,
  Globe,
  Award,
  Zap,
  BarChart3,
  Clock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import AnimatedShinyButton from "@/components/ui/AnimatedShinyButton";
import PhotoMarquee from "@/components/ui/PhotoMarquee";
import FeatureShowcaseGrid from "@/components/ui/FeatureShowcaseGrid";
import IntegrationsCarousel from "@/components/ui/IntegrationsCarousel";
import QuoteRevealTestimonials from "@/components/ui/QuoteRevealTestimonials";
import ControlPanel from "./ControlPanel";
import stadiumImage from "@/assets/stadium-champions-league.jpg";
import manCityLogo from "@/assets/team-logo-mancity.png";
import arsenalLogo from "@/assets/team-logo-arsenal.png";
import liverpoolLogo from "@/assets/team-logo-liverpool.png";
import villaLogo from "@/assets/team-logo-villa.png";

const HeroSection = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Sample images for marquee
  const marqueeImages = [
    "https://via.placeholder.com/160x100/1a1a1a/10b981?text=Match1",
    "https://via.placeholder.com/160x100/1a1a1a/a855f7?text=Match2", 
    "https://via.placeholder.com/160x100/1a1a1a/10b981?text=Match3",
    "https://via.placeholder.com/160x100/1a1a1a/a855f7?text=Match4",
    "https://via.placeholder.com/160x100/1a1a1a/10b981?text=Match5",
    "https://via.placeholder.com/160x100/1a1a1a/a855f7?text=Match6",
  ];

  const teamData = [
    { name: "Manchester City", logo: manCityLogo, form: ["W", "W", "W", "D", "W"], points: 28 },
    { name: "Arsenal", logo: arsenalLogo, form: ["W", "W", "L", "W", "W"], points: 26 },
    { name: "Liverpool", logo: liverpoolLogo, form: ["W", "D", "W", "W", "L"], points: 25 },
    { name: "Aston Villa", logo: villaLogo, form: ["L", "W", "W", "D", "W"], points: 24 }
  ];

  return (
    <section id="hero" className="relative ml-0 md:ml-[84px]">
      {/* Enhanced Global Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(80%_60%_at_20%_30%,rgba(255,115,50,0.20),transparent_60%),radial-gradient(70%_60%_at_80%_70%,rgba(16,185,129,0.12),transparent_55%),linear-gradient(to_b,#0b0b0f,#000)]"></div>
        
        <div className="absolute inset-0 opacity-[0.06]">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(148,163,184,0.3)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.3)_1px,transparent_1px)] bg-[length:72px_72px] [mask-image:radial-gradient(ellipse_80%_60%_at_50%_40%,black,transparent)]"></div>
        </div>

        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-24 -left-10 w-[36rem] h-[36rem] bg-secondary/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-32 right-0 w-[28rem] h-[28rem] bg-primary/10 rounded-full blur-3xl"></div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8 pb-6">
        {/* Enhanced Hero Section */}
        <div className="text-center mb-12">
          <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight mb-6">
              <span className="bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent animate-gradient bg-300%">
                AI-Powered Sports
              </span>
              <br />
              <span className="text-foreground">Prediction Platform</span>
            </h1>
            
            <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto mb-8 leading-relaxed">
              Transform your sports betting strategy with advanced machine learning algorithms, 
              real-time analytics, and community-driven insights.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <AnimatedShinyButton 
                href="/predictions/new"
                size="lg"
                variant="primary"
              >
                Start Predicting Now
              </AnimatedShinyButton>
              
              <AnimatedShinyButton 
                href="/analytics"
                size="lg"
                variant="secondary"
              >
                View Analytics
              </AnimatedShinyButton>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-6">
            {/* Enhanced Stadium Section */}
            <div className={`relative overflow-hidden rounded-3xl ring-1 ring-border bg-card transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
              <img 
                src={stadiumImage} 
                alt="UEFA Champions League stadium with dramatic lighting and crowd" 
                className="w-full h-[440px] sm:h-[520px] object-cover opacity-[0.92]" 
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-background/50 via-background/10 to-transparent"></div>
              
              {/* Enhanced Floating Stats Card */}
              <div className="absolute left-1/2 -translate-x-1/2 bottom-6 w-[92%] sm:w-[80%] max-w-xl">
                <div className="rounded-2xl bg-background/80 backdrop-blur-xl ring-1 ring-border/50 p-4 shadow-2xl border border-primary/20">
                  {/* Header with animated indicator */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="inline-flex items-center gap-2">
                      <div className="relative">
                        <Radar className="w-5 h-5 text-primary" />
                        <span className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full animate-pulse"></span>
                      </div>
                      <span className="text-foreground text-sm tracking-tight font-semibold">Live Match Analysis</span>
                    </div>
                    <div className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                      <Wifi className="w-4 h-4 text-green-500" /> 
                      <span className="text-green-500">Real-time</span>
                    </div>
                  </div>
                  
                  {/* Enhanced Metrics */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Win Probability */}
                    <div className="rounded-xl bg-gradient-to-br from-card to-card/50 ring-1 ring-border/50 p-3 hover:ring-primary/50 transition-all duration-300">
                      <div className="flex items-center justify-between mb-2">
                        <div className="inline-flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-secondary" />
                          <span className="text-sm text-foreground font-semibold">Win Probability</span>
                        </div>
                        <span className="text-sm text-secondary font-bold">22%</span>
                      </div>
                      <div className="flex items-center gap-1 mb-2">
                        {[...Array(10)].map((_, i) => (
                          <span 
                            key={i} 
                            className={`h-2 w-2 rounded-full transition-all duration-300 ${
                              i < 3 ? 'bg-secondary/70' : 'bg-secondary/10'
                            }`}
                          />
                        ))}
                      </div>
                      <div className="text-[11px] text-muted-foreground">Optimal: 35–65%</div>
                    </div>
                    
                    {/* Value Edge */}
                    <div className="rounded-xl bg-gradient-to-br from-card to-card/50 ring-1 ring-border/50 p-3 hover:ring-primary/50 transition-all duration-300">
                      <div className="flex items-center justify-between mb-2">
                        <div className="inline-flex items-center gap-2">
                          <Activity className="w-4 h-4 text-primary" />
                          <span className="text-sm text-foreground font-semibold">Value Edge</span>
                        </div>
                        <span className="text-sm text-primary font-bold">55%</span>
                      </div>
                      <div className="flex items-center gap-1 mb-2">
                        {[...Array(10)].map((_, i) => (
                          <span 
                            key={i} 
                            className={`h-2 w-2 rounded-full transition-all duration-300 ${
                              i < 5 ? 'bg-primary/70' : 'bg-primary/10'
                            }`}
                          />
                        ))}
                      </div>
                      <div className="text-[11px] text-muted-foreground">Optimal: 40–60%</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mt-4">
                    <div className="inline-flex items-center gap-2 text-xs text-muted-foreground">
                      <ShieldCheck className="w-4 h-4 text-green-500" />
                      <span className="text-green-500">Risk Management Active</span>
                    </div>
                    <Link to="/predictions/new">
                      <Button className="inline-flex items-center gap-2 h-9 px-3 hover:scale-105 transition-transform duration-200">
                        Start Betting
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced Team Form Cards */}
            <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              {teamData.map((team, i) => (
                <div 
                  key={i} 
                  className="group rounded-2xl bg-card/50 backdrop-blur-sm ring-1 ring-border/50 p-3 flex items-center gap-3 hover:ring-primary/50 hover:bg-card/80 transition-all duration-300 hover:scale-[1.02]"
                >
                  <div className="relative">
                    <img 
                      src={team.logo} 
                      alt={`${team.name} logo`} 
                      className="h-10 w-10 rounded-full ring-1 ring-border object-cover bg-background p-1 group-hover:ring-primary/50 transition-colors duration-300"
                    />
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-background"></div>
                  </div>
                  <div className="flex-1">
                    <div className="text-sm text-foreground tracking-tight font-semibold">{team.name}</div>
                    <div className="flex items-center gap-1 mt-1">
                      {team.form.map((result, idx) => (
                        <span 
                          key={idx} 
                          className={`h-1.5 w-1.5 rounded-full transition-all duration-300 hover:scale-150 ${
                            result === "W" ? "bg-primary" : 
                            result === "D" ? "bg-secondary" : 
                            "bg-destructive"
                          }`}
                          title={result === "W" ? "Győzelem" : result === "D" ? "Döntetlen" : "Vereség"}
                        />
                      ))}
                      <span className="text-xs text-muted-foreground ml-1">{team.points} pts</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Control Panel */}
          <div className={`transition-all duration-1000 delay-700 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'}`}>
            <ControlPanel />
          </div>
        </div>
      </div>

      {/* Community Photo Marquee Section */}
      <section className="ml-0 md:ml-[84px] py-16 bg-gradient-to-b from-transparent to-background/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-foreground mb-4">Join Our Winning Community</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Connect with thousands of successful tipsters and share winning strategies
            </p>
          </div>
          <PhotoMarquee 
            images={marqueeImages} 
            speed="normal"
            pauseOnHover={true}
          />
        </div>
      </section>

      {/* Feature Showcase Grid */}
      <section className="ml-0 md:ml-[84px] py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Everything You Need to Win
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Powerful features designed to give you the competitive edge in sports betting
            </p>
          </div>
          <FeatureShowcaseGrid columns={4} />
        </div>
      </section>

      {/* Integrations Carousel */}
      <section className="ml-0 md:ml-[84px] py-16 bg-gradient-to-b from-transparent to-background/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Trusted by Leading Platforms
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Integrations with top sports data providers and betting platforms
            </p>
          </div>
          <IntegrationsCarousel autoPlay={true} />
        </div>
      </section>

      {/* Quote Testimonials */}
      <section className="ml-0 md:ml-[84px] py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Success Stories from Our Community
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Hear from tipsters who have transformed their betting strategy with WinMix
            </p>
          </div>
          <QuoteRevealTestimonials autoPlay={true} showRating={true} />
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="ml-0 md:ml-[84px] py-16 bg-gradient-to-b from-transparent to-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="rounded-3xl bg-gradient-to-br from-primary/10 to-secondary/10 p-12 ring-1 ring-primary/20">
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
                Ready to Start Winning?
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
                Join thousands of successful tipsters who are already using WinMix to gain the competitive edge.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <AnimatedShinyButton 
                  href="/predictions/new"
                  size="lg"
                  variant="primary"
                >
                  Get Started Free
                </AnimatedShinyButton>
                
                <AnimatedShinyButton 
                  href="/analytics"
                  size="lg"
                  variant="secondary"
                >
                  View Success Stories
                </AnimatedShinyButton>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Add gradient animation styles */}
      <style jsx>{`
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 6s ease infinite;
        }
        .bg-300\\% {
          background-size: 300% 300%;
        }
      `}</style>
    </section>
  );
};

export default HeroSection;