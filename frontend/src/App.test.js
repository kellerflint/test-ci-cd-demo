import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from './App';

// Mock fetch
global.fetch = jest.fn();

beforeEach(() => {
  fetch.mockClear();
});

describe('App Component', () => {
  test('renders app title', () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => []
    });

    render(<App />);
    expect(screen.getByText('Demo App')).toBeInTheDocument();
  });

  test('fetches and displays items on mount', async () => {
    const mockItems = [
      { id: 1, name: 'Item 1' },
      { id: 2, name: 'Item 2' }
    ];

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockItems
    });

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('Item 1')).toBeInTheDocument();
      expect(screen.getByText('Item 2')).toBeInTheDocument();
    });
  });

  test('displays no items message when list is empty', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => []
    });

    render(<App />);

    await waitFor(() => {
      expect(screen.getByTestId('no-items')).toBeInTheDocument();
    });
  });

  test('adds new item on form submit', async () => {
    fetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => []
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ id: 1, name: 'New Item' })
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => [{ id: 1, name: 'New Item' }]
      });

    render(<App />);

    const input = screen.getByTestId('item-input');
    const button = screen.getByTestId('add-button');

    fireEvent.change(input, { target: { value: 'New Item' } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText('New Item')).toBeInTheDocument();
    });
  });

  test('shows error message on fetch failure', async () => {
    fetch.mockRejectedValueOnce(new Error('Network error'));

    render(<App />);

    await waitFor(() => {
      expect(screen.getByTestId('error')).toBeInTheDocument();
    });
  });
});
