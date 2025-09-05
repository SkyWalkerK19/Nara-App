// tests/ChatTab.test.tsx

import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import React from 'react';
import ChatTab from '../components/chat/ChatTab';

// Mock useAuth hook with complete AuthContextType
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

// Mock supabase client
jest.mock('../lib/supabase', () => ({
  supabase: {
    from: () => ({
      select: () => ({
        eq: () => ({
          order: () => Promise.resolve({ data: [], error: null }),
        }),
      }),
    }),
    channel: () => ({
      on: () => ({
        subscribe: () => ({}),
      }),
      subscribe: () => ({}),
    }),
    removeChannel: jest.fn(),
  },
}));

describe('ChatTab', () => {
  it('renders chat UI with chatId', async () => {
    render(<ChatTab chatId="test-chat" />);
    
    // Check heading
    expect(screen.getByText(/chat/i)).toBeInTheDocument();
    
    // Check for loading messages
    expect(await screen.findByText(/loading messages/i)).toBeInTheDocument();
    
    // Check input placeholder
    expect(screen.getByPlaceholderText(/type your message/i)).toBeInTheDocument();
    
    // Check send button
    expect(screen.getByRole('button', { name: /send/i })).toBeInTheDocument();
  });
});
