import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import AnimatedShinyButton from '@/components/ui/AnimatedShinyButton';

describe('AnimatedShinyButton', () => {
  it('renders children correctly', () => {
    render(<AnimatedShinyButton>Click me</AnimatedShinyButton>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('renders with default props', () => {
    render(<AnimatedShinyButton>Test Button</AnimatedShinyButton>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('h-12', 'px-8');
  });

  it('renders with custom size', () => {
    render(<AnimatedShinyButton size="sm">Small Button</AnimatedShinyButton>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('h-9', 'px-4');
  });

  it('renders with secondary variant', () => {
    render(<AnimatedShinyButton variant="secondary">Secondary Button</AnimatedShinyButton>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('from-secondary', 'to-secondary');
  });

  it('calls onClick handler when clicked', () => {
    const handleClick = vi.fn();
    render(<AnimatedShinyButton onClick={handleClick}>Click me</AnimatedShinyButton>);
    
    const button = screen.getByRole('button');
    fireEvent.click(button);
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('renders as link when href is provided', () => {
    render(<AnimatedShinyButton href="/test">Link Button</AnimatedShinyButton>);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/test');
  });

  it('shows arrow icon', () => {
    render(<AnimatedShinyButton>Button with arrow</AnimatedShinyButton>);
    // Check if the arrow icon is present by looking for the SVG
    const svg = document.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(<AnimatedShinyButton className="custom-class">Custom Button</AnimatedShinyButton>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('custom-class');
  });

  it('has hover effects classes', () => {
    render(<AnimatedShinyButton>Hover Button</AnimatedShinyButton>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('hover:scale-[1.02]', 'group');
  });

  it('contains shimmer effect span', () => {
    render(<AnimatedShinyButton>Shimmer Button</AnimatedShinyButton>);
    const shimmerSpan = document.querySelector('.animate-shimmer');
    expect(shimmerSpan).toBeInTheDocument();
  });
});