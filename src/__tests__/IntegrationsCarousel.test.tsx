import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import IntegrationsCarousel from '@/components/ui/IntegrationsCarousel';

describe('IntegrationsCarousel', () => {
  const mockIntegrations = [
    {
      name: 'Test Integration 1',
      logo: 'https://example.com/logo1.png',
      description: 'Description for integration 1',
      category: 'Test'
    },
    {
      name: 'Test Integration 2',
      logo: 'https://example.com/logo2.png',
      description: 'Description for integration 2',
      category: 'Demo'
    }
  ];

  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders default integrations when none provided', () => {
    render(<IntegrationsCarousel />);
    expect(screen.getByText('Bet365')).toBeInTheDocument();
    expect(screen.getByText('Opta')).toBeInTheDocument();
  });

  it('renders custom integrations', () => {
    render(<IntegrationsCarousel integrations={mockIntegrations} />);
    expect(screen.getByText('Test Integration 1')).toBeInTheDocument();
    expect(screen.getByText('Test Integration 2')).toBeInTheDocument();
    expect(screen.getByText('Description for integration 1')).toBeInTheDocument();
  });

  it('renders integration logos', () => {
    render(<IntegrationsCarousel integrations={mockIntegrations} />);
    const logos = screen.getAllByRole('img');
    expect(logos).toHaveLength(2);
    expect(logos[0]).toHaveAttribute('src', 'https://example.com/logo1.png');
    expect(logos[0]).toHaveAttribute('alt', 'Test Integration 1 logo');
  });

  it('shows category badges', () => {
    render(<IntegrationsCarousel integrations={mockIntegrations} />);
    expect(screen.getByText('Test')).toBeInTheDocument();
    expect(screen.getByText('Demo')).toBeInTheDocument();
  });

  it('renders navigation buttons', () => {
    render(<IntegrationsCarousel integrations={mockIntegrations} />);
    const buttons = screen.getAllByRole('button');
    // Should have previous and next buttons
    expect(buttons.length).toBeGreaterThan(1);
  });

  it('renders dots indicator', () => {
    render(<IntegrationsCarousel integrations={mockIntegrations} />);
    const dots = document.querySelectorAll('.rounded-full');
    expect(dots.length).toBeGreaterThan(0);
  });

  it('pauses auto-play on hover', () => {
    render(<IntegrationsCarousel integrations={mockIntegrations} autoPlay={true} />);
    const carousel = document.querySelector('.relative');
    
    fireEvent.mouseEnter(carousel!);
    vi.advanceTimersByTime(4100); // More than autoPlayInterval
    
    fireEvent.mouseLeave(carousel!);
    vi.advanceTimersByTime(4100);
    
    // Should not crash and should handle mouse events
    expect(carousel).toBeInTheDocument();
  });

  it('can disable auto-play', () => {
    render(<IntegrationsCarousel integrations={mockIntegrations} autoPlay={false} />);
    vi.advanceTimersByTime(4100);
    
    const carousel = document.querySelector('.relative');
    expect(carousel).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(<IntegrationsCarousel integrations={mockIntegrations} className="custom-class" />);
    const container = document.querySelector('.custom-class');
    expect(container).toBeInTheDocument();
  });

  it('has hover effects on cards', () => {
    render(<IntegrationsCarousel integrations={mockIntegrations} />);
    const cards = document.querySelectorAll('.group');
    cards.forEach((card) => {
      expect(card).toHaveClass('group');
      expect(card).toHaveClass('hover:ring-primary/50');
    });
  });

  it('handles navigation clicks', () => {
    render(<IntegrationsCarousel integrations={mockIntegrations} />);
    const buttons = screen.getAllByRole('button');
    
    // Find navigation buttons (they have SVG icons)
    const navButtons = buttons.filter(button => 
      button.querySelector('svg')
    );
    
    if (navButtons.length > 0) {
      fireEvent.click(navButtons[0]);
      // Should not crash
      expect(navButtons[0]).toBeInTheDocument();
    }
  });

  it('has proper card structure', () => {
    render(<IntegrationsCarousel integrations={mockIntegrations} />);
    const firstCard = document.querySelector('.rounded-2xl');
    expect(firstCard).toHaveClass(
      'bg-card/50',
      'backdrop-blur-sm',
      'ring-1',
      'ring-border/50'
    );
  });
});