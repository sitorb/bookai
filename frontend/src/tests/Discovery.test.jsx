import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import axios from 'axios';
import Discovery from '../pages/Discovery';

// Mock axios so no real HTTP requests are made
vi.mock('axios');
// Mock react-hot-toast to suppress rendering
vi.mock('react-hot-toast', () => ({
  default: { error: vi.fn() },
  __esModule: true,
}));

describe('Discovery — Oracle button', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Default: empty book list on initial load
    axios.get.mockResolvedValue({ data: [] });
  });

  it('calls the correct /api/books/discovery/random/ endpoint on Oracle click', async () => {
    const mockBook = { id: 1, title: 'Whispers in the Dark', author: 'A. Writer', summary: '...' };
    // First call (initial load) resolves empty, second call (oracle) returns a book
    axios.get
      .mockResolvedValueOnce({ data: [] })
      .mockResolvedValueOnce({ data: mockBook });

    render(<Discovery />);

    const oracleButton = screen.getByText(/Oracle/i);
    fireEvent.click(oracleButton);

    await waitFor(() => {
      const calls = axios.get.mock.calls;
      const oracleCall = calls.find(([url]) => url.includes('/discovery/random/'));
      expect(oracleCall).toBeDefined();
      expect(oracleCall[0]).toBe('http://127.0.0.1:8000/api/books/discovery/random/');
    }, { timeout: 2000 });
  });
});
