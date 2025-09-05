import { isDirectChat } from '../types/guards';
import type { Chat } from '../types/Chat';

describe('isDirectChat', () => {
  it('returns true for direct (1:1) chats', () => {
    const chat: Chat = { id: 'c1', is_group: false, name: 'Alice & Bob', created_by: 'u1', created_at: '...' };
    expect(isDirectChat(chat)).toBe(true);
  });
  it('returns false for group chats', () => {
    const chat: Chat = { id: 'c2', is_group: true, name: 'Bar Team', created_by: 'u2', created_at: '...' };
    expect(isDirectChat(chat)).toBe(false);
  });
});