import { render, screen } from '@testing-library/react';
import HomePage from '../HomePage';

// Mock the components
jest.mock('../../components/home', () => ({
  Header: () => <div data-testid="header">Header</div>,
  Hero: () => <div data-testid="hero">Hero</div>,
  Footer: () => <div data-testid="footer">Footer</div>,
}));

describe('HomePage', () => {
  it('should render without crashing', () => {
    const { container } = render(<HomePage />);
    expect(container).toBeDefined();
  });

  it('should render Header component', () => {
    render(<HomePage />);
    const header = screen.getByTestId('header');
    expect(header).toBeDefined();
    expect(header.textContent).toBe('Header');
  });

  it('should render Hero component in main section', () => {
    render(<HomePage />);
    const hero = screen.getByTestId('hero');
    const main = screen.getByRole('main');
    
    expect(hero).toBeDefined();
    expect(hero.textContent).toBe('Hero');
    expect(main).toBeDefined();
    expect(main.contains(hero)).toBe(true);
  });

  it('should render Footer component', () => {
    render(<HomePage />);
    const footer = screen.getByTestId('footer');
    expect(footer).toBeDefined();
    expect(footer.textContent).toBe('Footer');
  });

  it('should render components in correct order', () => {
    const { container } = render(<HomePage />);
    const elements = container.querySelectorAll('[data-testid]');
    
    expect(elements.length).toBe(3);
    expect(elements[0].getAttribute('data-testid')).toBe('header');
    expect(elements[1].getAttribute('data-testid')).toBe('hero');
    expect(elements[2].getAttribute('data-testid')).toBe('footer');
  });

  it('should have proper structure', () => {
    const { container } = render(<HomePage />);
    
    // Check for main element
    const mainElement = container.querySelector('main');
    expect(mainElement).toBeDefined();
    
    // Check that Hero is inside main
    const heroElement = container.querySelector('[data-testid="hero"]');
    expect(mainElement?.contains(heroElement)).toBe(true);
  });

  it('should render all components with correct text', () => {
    render(<HomePage />);
    
    // Using getByText as alternative
    expect(screen.getByText('Header')).toBeDefined();
    expect(screen.getByText('Hero')).toBeDefined();
    expect(screen.getByText('Footer')).toBeDefined();
  });
});
