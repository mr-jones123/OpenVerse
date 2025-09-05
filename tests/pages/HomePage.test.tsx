/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Home from '@/app/page';

// Mock Next.js Image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    return <img {...props} />;
  },
}));

describe('Home Page', () => {
  it('renders the main heading content', () => {
    render(<Home />);
    
    // Check for Next.js logo
    const logo = screen.getByAltText('Next.js logo');
    expect(logo).toBeInTheDocument();
    
    // Check for the instruction text
    expect(screen.getByText(/Get started by editing/)).toBeInTheDocument();
    expect(screen.getByText('src/app/page.tsx')).toBeInTheDocument();
    expect(screen.getByText('Save and see your changes instantly.')).toBeInTheDocument();
  });

  it('renders navigation buttons with correct links', () => {
    render(<Home />);
    
    // Check for Deploy button
    const deployButton = screen.getByText('Deploy now');
    expect(deployButton).toBeInTheDocument();
    expect(deployButton.closest('a')).toHaveAttribute('href', 'https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app');
    
    // Check for Docs button
    const docsButton = screen.getByText('Read our docs');
    expect(docsButton).toBeInTheDocument();
    expect(docsButton.closest('a')).toHaveAttribute('href', 'https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app');
  });

  it('renders footer links', () => {
    render(<Home />);
    
    // Check footer links
    expect(screen.getByText('Learn')).toBeInTheDocument();
    expect(screen.getByText('Examples')).toBeInTheDocument();
    expect(screen.getByText('Go to nextjs.org →')).toBeInTheDocument();
  });

  it('has proper responsive classes', () => {
    const { container } = render(<Home />);
    const mainDiv = container.firstChild as HTMLElement;
    
    expect(mainDiv).toHaveClass('font-sans');
    expect(mainDiv).toHaveClass('grid');
    expect(mainDiv).toHaveClass('grid-rows-[20px_1fr_20px]');
    expect(mainDiv).toHaveClass('min-h-screen');
  });

  describe('Accessibility Tests', () => {
    it('has proper image alt texts', () => {
      render(<Home />);
      
      expect(screen.getByAltText('Next.js logo')).toBeInTheDocument();
      expect(screen.getByAltText('Vercel logomark')).toBeInTheDocument();
      expect(screen.getByAltText('File icon')).toBeInTheDocument();
      expect(screen.getByAltText('Window icon')).toBeInTheDocument();
      expect(screen.getByAltText('Globe icon')).toBeInTheDocument();
    });

    it('has proper link attributes for external links', () => {
      render(<Home />);
      
      const externalLinks = screen.getAllByRole('link');
      externalLinks.forEach(link => {
        if (link.getAttribute('href')?.startsWith('http')) {
          expect(link).toHaveAttribute('target', '_blank');
          expect(link).toHaveAttribute('rel', 'noopener noreferrer');
        }
      });
    });

    it('has semantic HTML structure', () => {
      render(<Home />);
      
      const main = screen.getByRole('main');
      expect(main).toBeInTheDocument();
      
      const contentInfo = screen.getByRole('contentinfo');
      expect(contentInfo).toBeInTheDocument();
    });
  });

  describe('Performance Tests', () => {
    it('renders within acceptable time', () => {
      const startTime = performance.now();
      render(<Home />);
      const endTime = performance.now();
      
      // Should render in under 50ms
      expect(endTime - startTime).toBeLessThan(50);
    });
  });

  describe('Dark Mode Compatibility', () => {
    it('has dark mode classes on images', () => {
      render(<Home />);
      
      const logos = screen.getAllByAltText(/(Next.js logo|Vercel logomark)/);
      logos.forEach(logo => {
        expect(logo).toHaveClass('dark:invert');
      });
    });

    it('has proper dark mode hover states', () => {
      const { container } = render(<Home />);
      
      const deployButton = screen.getByText('Deploy now').closest('a');
      expect(deployButton).toHaveClass('dark:hover:bg-[#ccc]');
      
      const docsButton = screen.getByText('Read our docs').closest('a');
      expect(docsButton).toHaveClass('dark:hover:bg-[#1a1a1a]');
    });
  });
});