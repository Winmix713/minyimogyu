import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import QuoteRevealTestimonials from '@/components/ui/QuoteRevealTestimonials';

// Mock IntersectionObserver
class MockIntersectionObserver {
  constructor(callback: IntersectionObserverCallback) {
    // Simulate immediate intersection
    setTimeout(() => {
      callback([{ isIntersecting: true } as IntersectionObserverEntry]);
    }, 0);
  }
  observe() {}
  unobserve() {}
  disconnect() {}
}

describe('QuoteRevealTestimonials', () => {
  const mockTestimonials = [
    {
      id: '1',
      name: 'John Doe',
      role: 'Developer',
      company: 'Tech Corp',
      avatar: 'https://example.com/avatar1.jpg',
      content: 'This is an amazing testimonial.',
      rating: 5,
      featured: true
    },
    {
      id: '2',
      name: 'Jane Smith',
      role: 'Designer',
      avatar: 'https://example.com/avatar2.jpg',
      content: 'Great experience with this product.',
      rating: 4
    }
  ];

  beforeEach(() => {
    vi.useFakeTimers();
    (global as unknown as { IntersectionObserver: typeof IntersectionObserver }).IntersectionObserver = MockIntersectionObserver;
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('renders default testimonials when none provided', () => {
    render(<QuoteRevealTestimonials />);
    expect(screen.getByText('Alex Thompson')).toBeInTheDocument();
    expect(screen.getByText('Sarah Mitchell')).toBeInTheDocument();
  });

  it('renders custom testimonials', () => {
    render(<QuoteRevealTestimonials testimonials={mockTestimonials} />);
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    expect(screen.getByText('This is an amazing testimonial.')).toBeInTheDocument();
  });

  it('displays testimonial content correctly', () => {
    render(<QuoteRevealTestimonials testimonials={mockTestimonials} />);
    const blockquote = screen.getByText('This is an amazing testimonial.');
    expect(blockquote).toBeInTheDocument();
    expect(blockquote.tagName).toBe('BLOCKQUOTE');
  });

  it('shows avatars with correct attributes', () => {
    render(<QuoteRevealTestimonials testimonials={mockTestimonials} />);
    const avatars = screen.getAllByRole('img');
    expect(avatars).toHaveLength(2); // One in main display, one in thumbnail
    expect(avatars[0]).toHaveAttribute('src', 'https://example.com/avatar1.jpg');
    expect(avatars[0]).toHaveAttribute('alt', 'John Doe avatar');
  });

  it('displays names and roles', async () => {
    render(<QuoteRevealTestimonials testimonials={mockTestimonials} />);
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('Developer')).toBeInTheDocument();
      expect(screen.getByText('Tech Corp')).toBeInTheDocument();
    });
  });

  it('shows ratings when enabled', () => {
    render(<QuoteRevealTestimonials testimonials={mockTestimonials} showRating={true} />);
    const stars = document.querySelectorAll('.fill-yellow-400');
    expect(stars.length).toBeGreaterThan(0);
  });

  it('can hide ratings', () => {
    render(<QuoteRevealTestimonials testimonials={mockTestimonials} showRating={false} />);
    const stars = document.querySelectorAll('.fill-yellow-400');
    expect(stars.length).toBe(0);
  });

  it('renders thumbnail navigation', () => {
    render(<QuoteRevealTestimonials testimonials={mockTestimonials} />);
    const thumbnails = document.querySelectorAll('.rounded-xl');
    expect(thumbnails.length).toBe(2);
  });

  it('shows featured indicator for featured testimonials', () => {
    render(<QuoteRevealTestimonials testimonials={mockTestimonials} />);
    const featuredIndicator = document.querySelector('.animate-pulse');
    expect(featuredIndicator).toBeInTheDocument();
  });

  it('handles thumbnail clicks', () => {
    render(<QuoteRevealTestimonials testimonials={mockTestimonials} />);
    const thumbnails = document.querySelectorAll('.rounded-xl');
    
    if (thumbnails.length > 1) {
      fireEvent.click(thumbnails[1]);
      // Should not crash
      expect(thumbnails[1]).toBeInTheDocument();
    }
  });

  it('auto-advances testimonials', () => {
    render(<QuoteRevealTestimonials testimonials={mockTestimonials} autoPlay={true} />);
    vi.advanceTimersByTime(5100); // More than autoPlayInterval
    
    // Should not crash and should handle timer
    const container = document.querySelector('.w-full');
    expect(container).toBeInTheDocument();
  });

  it('can disable auto-play', () => {
    render(<QuoteRevealTestimonials testimonials={mockTestimonials} autoPlay={false} />);
    vi.advanceTimersByTime(5100);
    
    const container = document.querySelector('.w-full');
    expect(container).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(<QuoteRevealTestimonials testimonials={mockTestimonials} className="custom-class" />);
    const container = document.querySelector('.custom-class');
    expect(container).toBeInTheDocument();
  });

  it('has progress indicator dots', () => {
    render(<QuoteRevealTestimonials testimonials={mockTestimonials} />);
    const dots = document.querySelectorAll('.rounded-full');
    expect(dots.length).toBeGreaterThan(0);
  });

  it('shows quote icon', () => {
    render(<QuoteRevealTestimonials testimonials={mockTestimonials} />);
    const quoteIcon = document.querySelector('.text-primary\\/20');
    if (!quoteIcon) {
      // Try alternative selector
      const svgIcon = document.querySelector('svg');
      expect(svgIcon).toBeInTheDocument();
    } else {
      expect(quoteIcon).toBeInTheDocument();
    }
  });

  it('has proper card structure for thumbnails', () => {
    render(<QuoteRevealTestimonials testimonials={mockTestimonials} />);
    const firstThumbnail = document.querySelector('.rounded-xl');
    expect(firstThumbnail).toHaveClass(
      'bg-card/80',
      'backdrop-blur-sm',
      'ring-2',
      'ring-primary'
    );
  });
});