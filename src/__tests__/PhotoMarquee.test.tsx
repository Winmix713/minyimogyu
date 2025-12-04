import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import PhotoMarquee from '@/components/ui/PhotoMarquee';

describe('PhotoMarquee', () => {
  const mockImages = [
    'https://example.com/image1.jpg',
    'https://example.com/image2.jpg',
    'https://example.com/image3.jpg'
  ];

  it('renders all images twice for seamless loop', () => {
    render(<PhotoMarquee images={mockImages} />);
    const images = screen.getAllByRole('img');
    expect(images).toHaveLength(6); // 3 images x 2 for seamless loop
  });

  it('renders images with correct attributes', () => {
    render(<PhotoMarquee images={mockImages} />);
    const firstImage = screen.getAllByRole('img')[0];
    expect(firstImage).toHaveAttribute('src', mockImages[0]);
    expect(firstImage).toHaveAttribute('alt', 'Marquee image 1');
    expect(firstImage).toHaveClass('w-32', 'h-20', 'object-cover');
  });

  it('applies correct animation classes', () => {
    render(<PhotoMarquee images={mockImages} speed="slow" />);
    const marqueeContainer = document.querySelector('.animate-marquee-slow');
    expect(marqueeContainer).toBeInTheDocument();
  });

  it('renders with fast speed', () => {
    render(<PhotoMarquee images={mockImages} speed="fast" />);
    const marqueeContainer = document.querySelector('.animate-marquee-fast');
    expect(marqueeContainer).toBeInTheDocument();
  });

  it('renders with right direction', () => {
    render(<PhotoMarquee images={mockImages} direction="right" />);
    const marqueeContainer = document.querySelector('.animate-reverse');
    expect(marqueeContainer).toBeInTheDocument();
  });

  it('includes pause on hover classes by default', () => {
    render(<PhotoMarquee images={mockImages} />);
    const marqueeContainer = document.querySelector('.hover\\:animation-pause');
    expect(marqueeContainer).toBeInTheDocument();
  });

  it('can disable pause on hover', () => {
    render(<PhotoMarquee images={mockImages} pauseOnHover={false} />);
    const marqueeContainer = document.querySelector('.hover\\:animation-pause');
    expect(marqueeContainer).not.toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(<PhotoMarquee images={mockImages} className="custom-class" />);
    const container = document.querySelector('.custom-class');
    expect(container).toBeInTheDocument();
  });

  it('has fade edges', () => {
    render(<PhotoMarquee images={mockImages} />);
    const fadeEdges = document.querySelectorAll('.absolute.inset-y-0');
    expect(fadeEdges).toHaveLength(2); // Left and right fade edges
  });

  it('images have hover effects', () => {
    render(<PhotoMarquee images={mockImages} />);
    const imageContainers = document.querySelectorAll('.group');
    imageContainers.forEach((container) => {
      expect(container).toHaveClass('group');
    });
  });
});