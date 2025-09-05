/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import AralPage from '@/app/aral/page';

// Mock the database query function
jest.mock('@/lib/db/queries', () => ({
  getAllResources: jest.fn(),
}));

// Mock the DataTable component
jest.mock('@/components/aral-table/data-table', () => ({
  DataTable: ({ columns, data }: any) => (
    <div data-testid="data-table">
      <div>Columns: {columns.length}</div>
      <div>Data: {data.length} items</div>
      {data.map((item: any, index: number) => (
        <div key={index} data-testid={`data-item-${index}`}>
          {item.source_name} - {item.category} - {item.field}
        </div>
      ))}
    </div>
  ),
}));

import { getAllResources } from '@/lib/db/queries';

const mockGetAllResources = getAllResources as jest.MockedFunction<typeof getAllResources>;

const mockAralData = [
  { id: 1, source_name: 'Test Resource 1', category: 'Category A', field: 'Field 1' },
  { id: 2, source_name: 'Test Resource 2', category: 'Category B', field: 'Field 2' },
  { id: 3, source_name: 'Test Resource 3', category: 'Category A', field: 'Field 3' },
];

describe('Aral Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Suppress console.log for cleaner test output
    jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('renders DataTable with fetched data successfully', async () => {
    mockGetAllResources.mockResolvedValue(mockAralData);

    render(await AralPage());

    await waitFor(() => {
      expect(screen.getByTestId('data-table')).toBeInTheDocument();
    });

    expect(screen.getByText('Columns: 3')).toBeInTheDocument();
    expect(screen.getByText('Data: 3 items')).toBeInTheDocument();
    
    // Check that data items are rendered
    expect(screen.getByTestId('data-item-0')).toHaveTextContent('Test Resource 1 - Category A - Field 1');
    expect(screen.getByTestId('data-item-1')).toHaveTextContent('Test Resource 2 - Category B - Field 2');
    expect(screen.getByTestId('data-item-2')).toHaveTextContent('Test Resource 3 - Category A - Field 3');
  });

  it('handles empty data gracefully', async () => {
    mockGetAllResources.mockResolvedValue([]);

    render(await AralPage());

    await waitFor(() => {
      expect(screen.getByTestId('data-table')).toBeInTheDocument();
    });

    expect(screen.getByText('Data: 0 items')).toBeInTheDocument();
  });

  it('handles database errors gracefully', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    mockGetAllResources.mockRejectedValue(new Error('Database connection failed'));

    render(await AralPage());

    await waitFor(() => {
      expect(screen.getByTestId('data-table')).toBeInTheDocument();
    });

    // Should render with empty data when error occurs
    expect(screen.getByText('Data: 0 items')).toBeInTheDocument();
    
    consoleSpy.mockRestore();
  });

  it('calls getAllResources function', async () => {
    mockGetAllResources.mockResolvedValue(mockAralData);

    render(await AralPage());

    expect(mockGetAllResources).toHaveBeenCalledTimes(1);
  });

  describe('Performance Tests', () => {
    it('renders page within acceptable time with large dataset', async () => {
      const largeDataset = Array.from({ length: 100 }, (_, index) => ({
        id: index + 1,
        source_name: `Resource ${index + 1}`,
        category: `Category ${(index % 5) + 1}`,
        field: `Field ${(index % 3) + 1}`,
      }));

      mockGetAllResources.mockResolvedValue(largeDataset);

      const startTime = performance.now();
      render(await AralPage());
      const endTime = performance.now();

      expect(endTime - startTime).toBeLessThan(100);

      await waitFor(() => {
        expect(screen.getByText('Data: 100 items')).toBeInTheDocument();
      });
    });
  });

  describe('Error Handling', () => {
    it('logs errors but continues rendering', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      mockGetAllResources.mockRejectedValue(new Error('Network error'));

      const component = await AralPage();
      
      expect(() => render(component)).not.toThrow();

      consoleSpy.mockRestore();
    });

    it('handles malformed data gracefully', async () => {
      const malformedData = [
        { id: 1, source_name: 'Valid Resource', category: 'Valid Category', field: 'Valid Field' },
        { id: 2 }, // Missing required fields
        null, // Null entry
      ].filter(Boolean); // Remove null entries

      mockGetAllResources.mockResolvedValue(malformedData as any);

      const component = await AralPage();
      
      expect(() => render(component)).not.toThrow();

      await waitFor(() => {
        expect(screen.getByTestId('data-table')).toBeInTheDocument();
      });
    });
  });
});