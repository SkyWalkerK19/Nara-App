// types/guards.ts

import type { Chat } from './Chat';
import type { User } from './User';
/**
 * Checks if the given chat is a direct (1:1) chat.
 */

export function isDirectChat(chat: Chat): chat is Chat {
  return chat.is_group === false;
}
/**
 * Checks if the user has the admin role.
 */
export function isAdminUser(user: User | null | undefined): user is User {
  return !!user && user.role === 'admin';
}


