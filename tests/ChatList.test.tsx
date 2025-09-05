import '@testing-library/jest-dom';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import ChatList from '../components/chat/ChatList';

// Mock useAuth
jest.mock('../context/AuthContext', () => ({
  useAuth: () => ({
    user: { 
      id: 'user1',
      email: 'test@example.com',
      role: 'user',
      created_at: '2023-01-01'
    },
    loading: false,
    signUp: jest.fn(),
    signIn: jest.fn(),
    signOut: jest.fn(),
  }),
}));

// Mock supabase with proper promise chain
jest.mock('../lib/supabase', () => ({
  supabase: {
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        eq: jest.fn(() => Promise.resolve({
          data: [
            {
              chats: { id: 'abc', name: 'Group Chat', is_group: true },
              chat_id: 'abc',
            },
            {
              chats: { id: 'def', name: '', is_group: false },
              chat_id: 'def',
            },
          ],
          error: null,
        }))
      }))
    }))
  },
}));

describe('ChatList', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('shows loading and then chats', async () => {
    render(<ChatList onSelectChat={jest.fn()} />);
    
    // Initially shows loading
    expect(screen.getByText(/loading/i)).toBeInTheDocument();

    // Wait for chats to render
    await waitFor(() => {
      expect(screen.getByText('Group Chat')).toBeInTheDocument();
    });
    
    // Check for the second chat (unnamed direct chat)
    expect(screen.getByText(/Chat: def/i)).toBeInTheDocument();
  });

  it('calls onSelectChat when a chat is clicked', async () => {
    const handleSelect = jest.fn();
    
    render(<ChatList onSelectChat={handleSelect} />);

    // Wait for chat to appear
    await waitFor(() => {
      expect(screen.getByText('Group Chat')).toBeInTheDocument();
    });

    // Click on the chat
    fireEvent.click(screen.getByText('Group Chat'));
    
    // Verify the callback was called
    expect(handleSelect).toHaveBeenCalledWith('abc');
  });

  it('handles empty chat list', async () => {
    // Override the mock for this specific test
    const { supabase } = require('../lib/supabase');
    supabase.from.mockReturnValue({
      select: jest.fn().mockReturnValue({
        eq: jest.fn().mockResolvedValue({
          data: [],
          error: null,
        })
      })
    });

    render(<ChatList onSelectChat={jest.fn()} />);
    
    // Should show loading first
    expect(screen.getByText(/loading/i)).toBeInTheDocument();

    // Wait for empty state
    await waitFor(() => {
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
    });

    // Should not have any chat items
    expect(screen.queryByText('Group Chat')).not.toBeInTheDocument();
  });

  it('handles error state', async () => {
    // Override the mock for this specific test
    const { supabase } = require('../lib/supabase');
    supabase.from.mockReturnValue({
      select: jest.fn().mockReturnValue({
        eq: jest.fn().mockResolvedValue({
          data: null,
          error: { message: 'Database error' },
        })
      })
    });

    render(<ChatList onSelectChat={jest.fn()} />);
    
    // Should show loading first
    expect(screen.getByText(/loading/i)).toBeInTheDocument();

    // Wait for error handling (component should handle this gracefully)
    await waitFor(() => {
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
    });
  });
});
