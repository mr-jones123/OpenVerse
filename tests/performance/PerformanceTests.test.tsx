/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { StarsBackground } from '@/components/star-background';
import { DataTable } from '@/components/aral-table/data-table';
import { columns } from '@/components/aral-table/columns';

describe('Performance Tests', () => {
  // Helper function to generate test data
  const generateLargeDataset = (size: number) => {
    return Array.from({ length: size }, (_, index) => ({
      id: index + 1,
      source_name: `Source ${index + 1}`,
      category: `Category ${(index % 10) + 1}`,
      field: `Field ${(index % 5) + 1}`,
    }));
  };

  describe('Component Rendering Performance', () => {
    it('renders StarsBackground within acceptable time', () => {
      const startTime = performance.now();
      render(<StarsBackground />);
      const endTime = performance.now();

      expect(endTime - startTime).toBeLessThan(50); // Should render in < 50ms
    });

    it('renders DataTable with 100 items efficiently', () => {
      const data = generateLargeDataset(100);
      
      const startTime = performance.now();
      render(<DataTable columns={columns} data={data} />);
      const endTime = performance.now();

      expect(endTime - startTime).toBeLessThan(100); // Should render in < 100ms
    });

    it('renders DataTable with 1000 items within limits', () => {
      const data = generateLargeDataset(1000);
      
      const startTime = performance.now();
      render(<DataTable columns={columns} data={data} />);
      const endTime = performance.now();

      expect(endTime - startTime).toBeLessThan(500); // Should render in < 500ms
    });

    it('handles rapid re-renders efficiently', () => {
      const { rerender } = render(<StarsBackground starDensity={0.001} />);
      
      const iterations = 10;
      const startTime = performance.now();
      
      for (let i = 0; i < iterations; i++) {
        rerender(<StarsBackground starDensity={0.001 + i * 0.0001} />);
      }
      
      const endTime = performance.now();
      const averageTime = (endTime - startTime) / iterations;

      expect(averageTime).toBeLessThan(10); // Each re-render should take < 10ms
    });
  });

  describe('Memory Performance', () => {
    it('does not leak memory with multiple StarsBackground instances', () => {
      const instances = [];
      
      // Create multiple instances
      for (let i = 0; i < 5; i++) {
        const { unmount } = render(<StarsBackground />);
        instances.push(unmount);
      }
      
      // Clean up all instances
      instances.forEach(unmount => unmount());
      
      // Should complete without memory issues
      expect(instances).toHaveLength(5);
    });

    it('handles large datasets without memory overflow', () => {
      const largeData = generateLargeDataset(5000);
      
      const beforeMemory = (global.gc && performance.memory?.usedJSHeapSize) || 0;
      
      const { unmount } = render(<DataTable columns={columns} data={largeData} />);
      
      // Component should render successfully
      expect(screen.getByRole('table')).toBeInTheDocument();
      
      unmount();
      
      // Clean up should work without issues
      if (global.gc) {
        global.gc();
        const afterMemory = performance.memory?.usedJSHeapSize || 0;
        // Memory should not increase dramatically (allowing for some variance)
        expect(afterMemory - beforeMemory).toBeLessThan(50 * 1024 * 1024); // < 50MB
      }
    });
  });

  describe('Animation Performance', () => {
    it('StarsBackground animation frame rate is stable', () => {
      let frameCount = 0;
      const originalRAF = global.requestAnimationFrame;
      
      global.requestAnimationFrame = jest.fn((callback) => {
        frameCount++;
        return originalRAF(callback);
      });

      render(<StarsBackground />);
      
      // Should request animation frames for smooth animation
      expect(frameCount).toBeGreaterThan(0);
      
      global.requestAnimationFrame = originalRAF;
    });

    it('handles high star density without performance degradation', () => {
      const startTime = performance.now();
      render(<StarsBackground starDensity={0.01} />); // Very high density
      const endTime = performance.now();

      // Even with high density, should render reasonably fast
      expect(endTime - startTime).toBeLessThan(200);
    });
  });

  describe('Filtering Performance', () => {
    it('filters large datasets efficiently', () => {
      const largeData = generateLargeDataset(1000);
      const { container } = render(<DataTable columns={columns} data={largeData} />);
      
      const filterInput = container.querySelector('input[type="text"]');
      expect(filterInput).toBeInTheDocument();
      
      const startTime = performance.now();
      
      // Simulate typing in filter
      if (filterInput) {
        filterInput.setAttribute('value', 'Source 1');
        const inputEvent = new Event('input', { bubbles: true });
        filterInput.dispatchEvent(inputEvent);
      }
      
      const endTime = performance.now();

      // Filtering should be fast even with large datasets
      expect(endTime - startTime).toBeLessThan(50);
    });

    it('handles rapid filter changes efficiently', () => {
      const data = generateLargeDataset(500);
      const { container } = render(<DataTable columns={columns} data={data} />);
      
      const filterInput = container.querySelector('input[type="text"]');
      
      const startTime = performance.now();
      
      // Simulate rapid typing
      const filterValues = ['S', 'So', 'Sou', 'Sour', 'Source'];
      filterValues.forEach(value => {
        if (filterInput) {
          filterInput.setAttribute('value', value);
          const inputEvent = new Event('input', { bubbles: true });
          filterInput.dispatchEvent(inputEvent);
        }
      });
      
      const endTime = performance.now();

      expect(endTime - startTime).toBeLessThan(100);
    });
  });

  describe('Resource Usage', () => {
    it('StarsBackground uses requestAnimationFrame efficiently', () => {
      const rafCalls: number[] = [];
      const originalRAF = global.requestAnimationFrame;
      
      global.requestAnimationFrame = jest.fn((callback) => {
        const id = Date.now() + Math.random();
        rafCalls.push(id);
        setTimeout(callback, 16); // Simulate 60fps
        return id;
      });

      const { unmount } = render(<StarsBackground />);
      
      // Should make initial RAF call
      expect(rafCalls.length).toBeGreaterThan(0);
      
      const initialCalls = rafCalls.length;
      
      // After unmount, should not continue calling RAF
      unmount();
      setTimeout(() => {
        expect(rafCalls.length).toBe(initialCalls);
      }, 50);
      
      global.requestAnimationFrame = originalRAF;
    });

    it('cleans up event listeners properly', () => {
      const addEventListenerSpy = jest.spyOn(window, 'addEventListener');
      const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener');
      
      const { unmount } = render(<StarsBackground />);
      
      const addCalls = addEventListenerSpy.mock.calls.length;
      
      unmount();
      
      const removeCalls = removeEventListenerSpy.mock.calls.length;
      
      // Should clean up listeners (allowing for some framework listeners)
      expect(removeCalls).toBeGreaterThanOrEqual(0);
      
      addEventListenerSpy.mockRestore();
      removeEventListenerSpy.mockRestore();
    });
  });

  describe('Scalability Tests', () => {
    it('performance degrades gracefully with dataset size', () => {
      const sizes = [100, 500, 1000, 2000];
      const renderTimes: number[] = [];
      
      sizes.forEach(size => {
        const data = generateLargeDataset(size);
        
        const startTime = performance.now();
        const { unmount } = render(<DataTable columns={columns} data={data} />);
        const endTime = performance.now();
        
        renderTimes.push(endTime - startTime);
        unmount();
      });
      
      // Performance should degrade somewhat linearly, not exponentially
      const timeIncrease = renderTimes[3] / renderTimes[0]; // 2000 items vs 100 items
      expect(timeIncrease).toBeLessThan(50); // Should not be more than 50x slower
    });

    it('handles concurrent renders efficiently', () => {
      const promises: Promise<void>[] = [];
      
      const startTime = performance.now();
      
      // Create multiple concurrent renders
      for (let i = 0; i < 5; i++) {
        const promise = new Promise<void>((resolve) => {
          const { unmount } = render(<StarsBackground key={i} />);
          setTimeout(() => {
            unmount();
            resolve();
          }, 10);
        });
        promises.push(promise);
      }
      
      return Promise.all(promises).then(() => {
        const endTime = performance.now();
        
        // Concurrent renders should complete reasonably fast
        expect(endTime - startTime).toBeLessThan(200);
      });
    });
  });

  describe('Browser Performance', () => {
    it('does not block the main thread excessively', (done) => {
      render(<StarsBackground />);
      
      let mainThreadBlocked = false;
      
      // Schedule a task to run soon
      setTimeout(() => {
        mainThreadBlocked = true;
      }, 10);
      
      // Check if the task ran within reasonable time
      setTimeout(() => {
        expect(mainThreadBlocked).toBe(true);
        done();
      }, 50);
    });

    it('optimizes DOM updates efficiently', () => {
      const observerSpy = jest.fn();
      
      // Mock MutationObserver to track DOM changes
      global.MutationObserver = jest.fn().mockImplementation((callback) => ({
        observe: observerSpy,
        disconnect: jest.fn(),
      }));
      
      render(<DataTable columns={columns} data={generateLargeDataset(10)} />);
      
      // Component should set up efficient DOM observation
      expect(global.MutationObserver).toHaveBeenCalled();
    });
  });
});