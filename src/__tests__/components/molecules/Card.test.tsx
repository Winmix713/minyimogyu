import { render, screen } from '@testing-library/react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';

describe('Card Components', () => {
  describe('Card', () => {
    it('renders children', () => {
      render(
        <Card data-testid="card">
          <div>Card content</div>
        </Card>
      );
      
      const card = screen.getByTestId('card');
      expect(card).toBeInTheDocument();
      expect(card).toHaveTextContent('Card content');
    });

    it('applies custom className', () => {
      render(
        <Card className="custom-class" data-testid="card">
          <div>Content</div>
        </Card>
      );
      
      const card = screen.getByTestId('card');
      expect(card).toHaveClass('custom-class');
      expect(card).toHaveClass('rounded-lg', 'border', 'bg-card');
    });
  });

  describe('CardHeader', () => {
    it('renders header content', () => {
      render(
        <Card>
          <CardHeader data-testid="header">
            <CardTitle>Test Title</CardTitle>
            <CardDescription>Test Description</CardDescription>
          </CardHeader>
        </Card>
      );
      
      const header = screen.getByTestId('header');
      expect(header).toBeInTheDocument();
      expect(header).toHaveTextContent('Test Title');
      expect(header).toHaveTextContent('Test Description');
    });

    it('applies custom className', () => {
      render(
        <Card>
          <CardHeader className="custom-header" data-testid="header">
            <CardTitle>Title</CardTitle>
          </CardHeader>
        </Card>
      );
      
      const header = screen.getByTestId('header');
      expect(header).toHaveClass('custom-header');
      expect(header).toHaveClass('flex', 'flex-col', 'space-y-1.5', 'p-6');
    });
  });

  describe('CardTitle', () => {
    it('renders title as h3', () => {
      render(
        <Card>
          <CardHeader>
            <CardTitle data-testid="title">Test Title</CardTitle>
          </CardHeader>
        </Card>
      );
      
      const title = screen.getByTestId('title');
      expect(title.tagName).toBe('H3');
      expect(title).toHaveTextContent('Test Title');
      expect(title).toHaveClass('text-2xl', 'font-semibold');
    });
  });

  describe('CardDescription', () => {
    it('renders description as paragraph', () => {
      render(
        <Card>
          <CardHeader>
            <CardDescription data-testid="description">Test Description</CardDescription>
          </CardHeader>
        </Card>
      );
      
      const description = screen.getByTestId('description');
      expect(description.tagName).toBe('P');
      expect(description).toHaveTextContent('Test Description');
      expect(description).toHaveClass('text-sm', 'text-muted-foreground');
    });
  });

  describe('CardContent', () => {
    it('renders content', () => {
      render(
        <Card>
          <CardContent data-testid="content">
            <p>Main content goes here</p>
          </CardContent>
        </Card>
      );
      
      const content = screen.getByTestId('content');
      expect(content).toBeInTheDocument();
      expect(content).toHaveTextContent('Main content goes here');
      expect(content).toHaveClass('p-6', 'pt-0');
    });
  });

  describe('CardFooter', () => {
    it('renders footer content', () => {
      render(
        <Card>
          <CardFooter data-testid="footer">
            <button>Footer Button</button>
          </CardFooter>
        </Card>
      );
      
      const footer = screen.getByTestId('footer');
      expect(footer).toBeInTheDocument();
      expect(footer).toHaveTextContent('Footer Button');
      expect(footer).toHaveClass('flex', 'items-center', 'p-6', 'pt-0');
    });
  });

  it('renders complete card structure', () => {
    render(
      <Card data-testid="complete-card">
        <CardHeader>
          <CardTitle>Card Title</CardTitle>
          <CardDescription>Card description</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Card content</p>
        </CardContent>
        <CardFooter>
          <button>Action</button>
        </CardFooter>
      </Card>
    );

    const card = screen.getByTestId('complete-card');
    expect(card).toHaveTextContent('Card Title');
    expect(card).toHaveTextContent('Card description');
    expect(card).toHaveTextContent('Card content');
    expect(card).toHaveTextContent('Action');
  });
});
