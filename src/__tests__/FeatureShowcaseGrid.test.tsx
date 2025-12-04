import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import FeatureShowcaseGrid from '@/components/ui/FeatureShowcaseGrid';

describe('FeatureShowcaseGrid', () => {
  const mockFeatures = [
    {
      icon: 'Test Icon 1',
      title: 'Feature 1',
      description: 'Description for feature 1'
    },
    {
      icon: 'Test Icon 2',
      title: 'Feature 2',
      description: 'Description for feature 2',
      highlight: true
    }
  ];

  it('renders default features when none provided', () => {
    render(<FeatureShowcaseGrid />);
    expect(screen.getByText('AI-Powered Predictions')).toBeInTheDocument();
    expect(screen.getByText('Risk Management')).toBeInTheDocument();
  });

  it('renders custom features', () => {
    render(<FeatureShowcaseGrid features={mockFeatures} />);
    expect(screen.getByText('Feature 1')).toBeInTheDocument();
    expect(screen.getByText('Feature 2')).toBeInTheDocument();
    expect(screen.getByText('Description for feature 1')).toBeInTheDocument();
    expect(screen.getByText('Description for feature 2')).toBeInTheDocument();
  });

  it('renders correct number of features', () => {
    render(<FeatureShowcaseGrid features={mockFeatures} />);
    const featureCards = document.querySelectorAll('.relative.group.p-6.rounded-2xl');
    expect(featureCards).toHaveLength(2);
  });

  it('highlights featured features', () => {
    render(<FeatureShowcaseGrid features={mockFeatures} />);
    const highlightedCard = document.querySelector('.ring-2.ring-primary\\/30');
    expect(highlightedCard).toBeInTheDocument();
  });

  it('shows featured badge for highlighted features', () => {
    render(<FeatureShowcaseGrid features={mockFeatures} />);
    expect(screen.getByText('Featured')).toBeInTheDocument();
  });

  it('renders with correct columns', () => {
    const { rerender } = render(<FeatureShowcaseGrid features={mockFeatures} columns={2} />);
    expect(document.querySelector('.grid-cols-1.md\\:grid-cols-2')).toBeInTheDocument();

    rerender(<FeatureShowcaseGrid features={mockFeatures} columns={3} />);
    expect(document.querySelector('.grid-cols-1.md\\:grid-cols-2.lg\\:grid-cols-3')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(<FeatureShowcaseGrid features={mockFeatures} className="custom-class" />);
    const container = document.querySelector('.custom-class');
    expect(container).toBeInTheDocument();
  });

  it('has hover effects on cards', () => {
    render(<FeatureShowcaseGrid features={mockFeatures} />);
    const cards = document.querySelectorAll('.group');
    cards.forEach((card) => {
      expect(card).toHaveClass('group');
      expect(card).toHaveClass('hover:scale-[1.02]');
    });
  });

  it('renders icons correctly', () => {
    render(<FeatureShowcaseGrid features={mockFeatures} />);
    const iconContainers = document.querySelectorAll('.w-12.h-12');
    expect(iconContainers).toHaveLength(2);
  });

  it('has proper card structure', () => {
    render(<FeatureShowcaseGrid features={mockFeatures} />);
    const firstCard = document.querySelector('.rounded-2xl');
    expect(firstCard).toHaveClass(
      'bg-card/50',
      'backdrop-blur-sm',
      'ring-1',
      'ring-border/50'
    );
  });
});