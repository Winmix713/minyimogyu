import { render, screen, fireEvent } from '@testing-library/react';
import { Input } from '@/components/ui/input';

describe('Input', () => {
  it('renders with basic props', () => {
    render(<Input placeholder="Enter text" data-testid="input" />);
    
    const input = screen.getByTestId('input');
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('placeholder', 'Enter text');
    expect(input.tagName).toBe('INPUT');
  });

  it('handles value changes', () => {
    const handleChange = vi.fn();
    render(<Input onChange={handleChange} data-testid="input" />);
    
    const input = screen.getByTestId('input');
    fireEvent.change(input, { target: { value: 'test value' } });
    
    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(input).toHaveValue('test value');
  });

  it('applies custom className', () => {
    render(<Input className="custom-input" data-testid="input" />);
    
    const input = screen.getByTestId('input');
    expect(input).toHaveClass('custom-input');
    expect(input).toHaveClass('flex', 'h-10', 'w-full');
  });

  it('supports different input types', () => {
    render(<Input type="email" data-testid="input" />);
    
    const input = screen.getByTestId('input');
    expect(input).toHaveAttribute('type', 'email');
  });

  it('can be disabled', () => {
    render(<Input disabled data-testid="input" />);
    
    const input = screen.getByTestId('input');
    expect(input).toBeDisabled();
    expect(input).toHaveClass('disabled:cursor-not-allowed', 'disabled:opacity-50');
  });

  it('forwards ref correctly', () => {
    const ref = { current: null };
    render(<Input ref={ref} />);
    
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });

  it('handles focus events', () => {
    const handleFocus = vi.fn();
    const handleBlur = vi.fn();
    
    render(
      <Input 
        onFocus={handleFocus} 
        onBlur={handleBlur} 
        data-testid="input" 
      />
    );
    
    const input = screen.getByTestId('input');
    
    fireEvent.focus(input);
    expect(handleFocus).toHaveBeenCalledTimes(1);
    
    fireEvent.blur(input);
    expect(handleBlur).toHaveBeenCalledTimes(1);
  });

  it('applies focus styles', () => {
    render(<Input data-testid="input" />);
    
    const input = screen.getByTestId('input');
    expect(input).toHaveClass('focus-visible:outline-none', 'focus-visible:ring-2');
  });
});
