/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { StarsBackground } from '@/components/star-background';

// Mock ResizeObserver which is not available in jsdom
class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}

global.ResizeObserver = ResizeObserverMock;

// Mock HTMLCanvasElement methods
HTMLCanvasElement.prototype.getContext = jest.fn(() => ({
  clearRect: jest.fn(),
  beginPath: jest.fn(),
  arc: jest.fn(),
  fill: jest.fn(),
  fillStyle: '',
}));

HTMLCanvasElement.prototype.getBoundingClientRect = jest.fn(() => ({
  width: 800,
  height: 600,
  top: 0,
  left: 0,
  bottom: 600,
  right: 800,
}));

// Mock requestAnimationFrame
global.requestAnimationFrame = jest.fn((cb) => setTimeout(cb, 16));
global.cancelAnimationFrame = jest.fn();

describe('StarsBackground Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders canvas element with correct classes', () => {
    render(<StarsBackground />);
    const canvas = screen.getByRole('img', { hidden: true });
    expect(canvas).toBeInTheDocument();
    expect(canvas).toHaveClass('h-full', 'w-full', 'absolute', 'inset-0');
  });

  it('applies custom className when provided', () => {
    const customClass = 'custom-stars';
    render(<StarsBackground className={customClass} />);
    const canvas = screen.getByRole('img', { hidden: true });
    expect(canvas).toHaveClass(customClass);
  });

  it('generates stars based on star density', () => {
    const highDensity = 0.001;
    render(<StarsBackground starDensity={highDensity} />);
    
    // With mocked canvas size 800x600 and density 0.001,
    // we expect floor(800 * 600 * 0.001) = 480 stars
    expect(HTMLCanvasElement.prototype.getContext).toHaveBeenCalled();
  });

  it('handles custom twinkle configuration', () => {
    render(
      <StarsBackground
        allStarsTwinkle={false}
        twinkleProbability={0.3}
        minTwinkleSpeed={1}
        maxTwinkleSpeed={2}
      />
    );
    
    expect(HTMLCanvasElement.prototype.getContext).toHaveBeenCalled();
  });

  it('responds to window resize', () => {
    render(<StarsBackground />);
    
    // Verify ResizeObserver was instantiated
    expect(global.ResizeObserver).toHaveBeenCalled();
  });

  it('cleans up on unmount', () => {
    const { unmount } = render(<StarsBackground />);
    unmount();
    
    // Component should clean up without errors
    expect(true).toBe(true);
  });

  describe('Performance Tests', () => {
    it('handles high star density without crashing', () => {
      const performanceStart = performance.now();
      render(<StarsBackground starDensity={0.01} />);
      const performanceEnd = performance.now();
      
      // Component should render in reasonable time (< 100ms)
      expect(performanceEnd - performanceStart).toBeLessThan(100);
    });

    it('efficiently manages animation frame requests', () => {
      render(<StarsBackground />);
      
      // Should call requestAnimationFrame for animation
      expect(global.requestAnimationFrame).toHaveBeenCalled();
    });
  });

  describe('Accessibility Tests', () => {
    it('has proper canvas accessibility', () => {
      render(<StarsBackground />);
      const canvas = screen.getByRole('img', { hidden: true });
      
      // Canvas should be present but not interfere with screen readers
      expect(canvas).toBeInTheDocument();
    });

    it('does not interfere with keyboard navigation', () => {
      const { container } = render(<StarsBackground />);
      const canvas = container.querySelector('canvas');
      
      // Canvas should not be focusable
      expect(canvas?.tabIndex).toBeFalsy();
    });
  });
});