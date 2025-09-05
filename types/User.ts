export interface User {
  id: string;
  email: string;
  name?: string;
  age?: number;
  role: 'admin' | 'bar' | 'hookah' | 'server';
  team?: string;
  chatId?: string;
  created_at: string;
}
