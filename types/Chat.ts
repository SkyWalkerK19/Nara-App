export interface Chat {
  id: string;
  is_group: boolean;
  name?: string; // only for group chats
  created_by: string;
  created_at: string;
}