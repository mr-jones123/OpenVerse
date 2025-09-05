/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { DataTable } from '@/components/aral-table/data-table';
import { columns } from '@/components/aral-table/columns';
import { Aral } from '@/lib/types';

const mockData: Aral[] = [
  { id: 1, source_name: 'Test Source 1', category: 'Category A', field: 'Field 1' },
  { id: 2, source_name: 'Test Source 2', category: 'Category B', field: 'Field 2' },
  { id: 3, source_name: 'Another Source', category: 'Category A', field: 'Field 3' },
  { id: 4, source_name: 'Different Source', category: 'Category C', field: 'Field 1' },
  { id: 5, source_name: 'Final Source', category: 'Category B', field: 'Field 4' },
];

const emptyData: Aral[] = [];

describe('DataTable Component', () => {
  const user = userEvent.setup();

  it('renders table with data', () => {
    render(<DataTable columns={columns} data={mockData} />);
    
    // Check table headers
    expect(screen.getByText('Source Name')).toBeInTheDocument();
    expect(screen.getByText('Category')).toBeInTheDocument();
    expect(screen.getByText('Field')).toBeInTheDocument();
    
    // Check some data rows
    expect(screen.getByText('Test Source 1')).toBeInTheDocument();
    expect(screen.getByText('Category A')).toBeInTheDocument();
    expect(screen.getByText('Field 1')).toBeInTheDocument();
  });

  it('displays no results message when data is empty', () => {
    render(<DataTable columns={columns} data={emptyData} />);
    expect(screen.getByText('No results.')).toBeInTheDocument();
  });

  it('filters by source name correctly', async () => {
    render(<DataTable columns={columns} data={mockData} />);
    
    const filterInput = screen.getByPlaceholderText('Filter by source_name...');
    await user.type(filterInput, 'Test');
    
    await waitFor(() => {
      expect(screen.getByText('Test Source 1')).toBeInTheDocument();
      expect(screen.getByText('Test Source 2')).toBeInTheDocument();
      expect(screen.queryByText('Another Source')).not.toBeInTheDocument();
    });
  });

  it('switches filter column and filters correctly', async () => {
    render(<DataTable columns={columns} data={mockData} />);
    
    // Change filter column to Category
    const columnSelect = screen.getByDisplayValue('Source Name');
    await user.click(columnSelect);
    
    const categoryOption = screen.getByText('Category');
    await user.click(categoryOption);
    
    // Filter by category
    const filterInput = screen.getByPlaceholderText('Filter by category...');
    await user.type(filterInput, 'Category A');
    
    await waitFor(() => {
      expect(screen.getByText('Test Source 1')).toBeInTheDocument();
      expect(screen.getByText('Another Source')).toBeInTheDocument();
      expect(screen.queryByText('Test Source 2')).not.toBeInTheDocument();
    });
  });

  it('clears filter when input is empty', async () => {
    render(<DataTable columns={columns} data={mockData} />);
    
    const filterInput = screen.getByPlaceholderText('Filter by source_name...');
    await user.type(filterInput, 'Test');
    
    // Verify filtering worked
    await waitFor(() => {
      expect(screen.getByText('Test Source 1')).toBeInTheDocument();
      expect(screen.queryByText('Another Source')).not.toBeInTheDocument();
    });
    
    // Clear filter
    await user.clear(filterInput);
    
    await waitFor(() => {
      expect(screen.getByText('Test Source 1')).toBeInTheDocument();
      expect(screen.getByText('Another Source')).toBeInTheDocument();
      expect(screen.getByText('Different Source')).toBeInTheDocument();
    });
  });

  describe('Accessibility Tests', () => {
    it('has proper table structure', () => {
      render(<DataTable columns={columns} data={mockData} />);
      
      const table = screen.getByRole('table');
      expect(table).toBeInTheDocument();
      
      // Check for proper table headers
      const columnHeaders = screen.getAllByRole('columnheader');
      expect(columnHeaders).toHaveLength(3);
      
      // Check for table rows
      const rows = screen.getAllByRole('row');
      expect(rows.length).toBeGreaterThan(1); // Header + data rows
    });

    it('filter input has proper labeling', () => {
      render(<DataTable columns={columns} data={mockData} />);
      
      const filterInput = screen.getByPlaceholderText('Filter by source_name...');
      expect(filterInput).toBeInTheDocument();
      expect(filterInput).toHaveAttribute('placeholder', 'Filter by source_name...');
    });

    it('select dropdown has proper accessibility', () => {
      render(<DataTable columns={columns} data={mockData} />);
      
      const select = screen.getByRole('combobox');
      expect(select).toBeInTheDocument();
      expect(select).toHaveAttribute('aria-expanded', 'false');
    });
  });

  describe('Performance Tests', () => {
    it('handles large datasets efficiently', () => {
      const largeDataset: Aral[] = Array.from({ length: 1000 }, (_, index) => ({
        id: index + 1,
        source_name: `Source ${index + 1}`,
        category: `Category ${(index % 5) + 1}`,
        field: `Field ${(index % 3) + 1}`,
      }));
      
      const startTime = performance.now();
      render(<DataTable columns={columns} data={largeDataset} />);
      const endTime = performance.now();
      
      // Should render large dataset in reasonable time
      expect(endTime - startTime).toBeLessThan(500);
      
      // Check that data is rendered
      expect(screen.getByText('Source 1')).toBeInTheDocument();
    });

    it('filtering performance is acceptable', async () => {
      const largeDataset: Aral[] = Array.from({ length: 500 }, (_, index) => ({
        id: index + 1,
        source_name: `Source ${index + 1}`,
        category: `Category ${(index % 5) + 1}`,
        field: `Field ${(index % 3) + 1}`,
      }));
      
      render(<DataTable columns={columns} data={largeDataset} />);
      
      const filterInput = screen.getByPlaceholderText('Filter by source_name...');
      
      const startTime = performance.now();
      await user.type(filterInput, 'Source 1');
      const endTime = performance.now();
      
      // Filtering should be fast
      expect(endTime - startTime).toBeLessThan(200);
    });
  });

  describe('Edge Cases', () => {
    it('handles special characters in filter', async () => {
      const specialData: Aral[] = [
        { id: 1, source_name: 'Source-With-Dashes', category: 'Cat@gory', field: 'Field_1' },
        { id: 2, source_name: 'Source (With Parens)', category: 'Category/Slash', field: 'Field#2' },
      ];
      
      render(<DataTable columns={columns} data={specialData} />);
      
      const filterInput = screen.getByPlaceholderText('Filter by source_name...');
      await user.type(filterInput, 'Source-With');
      
      await waitFor(() => {
        expect(screen.getByText('Source-With-Dashes')).toBeInTheDocument();
        expect(screen.queryByText('Source (With Parens)')).not.toBeInTheDocument();
      });
    });

    it('handles case-insensitive filtering', async () => {
      render(<DataTable columns={columns} data={mockData} />);
      
      const filterInput = screen.getByPlaceholderText('Filter by source_name...');
      await user.type(filterInput, 'test');
      
      await waitFor(() => {
        expect(screen.getByText('Test Source 1')).toBeInTheDocument();
        expect(screen.getByText('Test Source 2')).toBeInTheDocument();
      });
    });
  });
});