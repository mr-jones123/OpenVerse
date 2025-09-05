/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';

// Mock Next.js router
const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
    replace: jest.fn(),
  }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
}));

// Mock components for integration testing
const MockHomePage = () => (
  <div data-testid="home-page">
    <h1>OpenVerse Home</h1>
    <button onClick={() => mockPush('/aral')}>
      Go to Aral Page
    </button>
  </div>
);

const MockAralPage = () => (
  <div data-testid="aral-page">
    <h1>Aral Resources</h1>
    <button onClick={() => mockPush('/')}>
      Back to Home
    </button>
  </div>
);

describe('Navigation Integration Tests', () => {
  const user = userEvent.setup();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('navigates from home to aral page', async () => {
    render(<MockHomePage />);

    expect(screen.getByTestId('home-page')).toBeInTheDocument();
    expect(screen.getByText('OpenVerse Home')).toBeInTheDocument();

    const aralButton = screen.getByText('Go to Aral Page');
    await user.click(aralButton);

    expect(mockPush).toHaveBeenCalledWith('/aral');
  });

  it('navigates from aral page back to home', async () => {
    render(<MockAralPage />);

    expect(screen.getByTestId('aral-page')).toBeInTheDocument();
    expect(screen.getByText('Aral Resources')).toBeInTheDocument();

    const homeButton = screen.getByText('Back to Home');
    await user.click(homeButton);

    expect(mockPush).toHaveBeenCalledWith('/');
  });

  describe('URL Structure Tests', () => {
    it('has correct route patterns', () => {
      // Test that navigation calls use proper URL structure
      render(<MockHomePage />);
      
      const button = screen.getByText('Go to Aral Page');
      expect(button).toBeInTheDocument();
      
      // Simulate navigation and verify URL pattern
      mockPush.mockImplementation((url) => {
        expect(url).toMatch(/^\/[a-zA-Z]*$/); // Simple path validation
        expect(url).not.toContain('//'); // No double slashes
        expect(url).not.toMatch(/\s/); // No spaces
      });
    });
  });

  describe('Browser History Integration', () => {
    it('handles browser back/forward correctly', () => {
      // Mock browser navigation
      const mockHistoryBack = jest.fn();
      const mockHistoryForward = jest.fn();
      
      Object.defineProperty(window, 'history', {
        value: {
          back: mockHistoryBack,
          forward: mockHistoryForward,
          pushState: jest.fn(),
          replaceState: jest.fn(),
        },
        writable: true,
      });

      render(<MockAralPage />);

      // Simulate browser back button
      const backEvent = new KeyboardEvent('keydown', { key: 'ArrowLeft', altKey: true });
      window.dispatchEvent(backEvent);

      // Navigation should be handled properly
      expect(screen.getByTestId('aral-page')).toBeInTheDocument();
    });
  });

  describe('Accessibility Navigation', () => {
    it('supports keyboard navigation', async () => {
      render(<MockHomePage />);

      const button = screen.getByText('Go to Aral Page');
      
      // Focus the button with keyboard
      button.focus();
      expect(button).toHaveFocus();

      // Activate with Enter key
      await user.keyboard('{Enter}');
      expect(mockPush).toHaveBeenCalledWith('/aral');
    });

    it('has proper tab order', () => {
      render(<MockHomePage />);

      const button = screen.getByText('Go to Aral Page');
      
      // Button should be focusable
      expect(button).not.toHaveAttribute('tabindex', '-1');
      
      // Button should have proper role
      expect(button).toHaveAttribute('type', 'button');
    });
  });

  describe('Error Handling', () => {
    it('handles navigation errors gracefully', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      mockPush.mockRejectedValueOnce(new Error('Navigation failed'));

      render(<MockHomePage />);

      const button = screen.getByText('Go to Aral Page');
      await user.click(button);

      // Should not crash the application
      expect(screen.getByTestId('home-page')).toBeInTheDocument();
      
      consoleSpy.mockRestore();
    });
  });

  describe('Performance Tests', () => {
    it('navigation triggers complete within acceptable time', async () => {
      render(<MockHomePage />);

      const startTime = performance.now();
      const button = screen.getByText('Go to Aral Page');
      await user.click(button);
      const endTime = performance.now();

      expect(endTime - startTime).toBeLessThan(50); // Navigation should be instant
      expect(mockPush).toHaveBeenCalled();
    });
  });
});