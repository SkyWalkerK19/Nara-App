// types/Order.ts our order interface

export interface OrderItem {
  name: string;
  quantity?: number;
  notes?: string;
  // Add more fields as your menu grows
}

export interface Orders {
  id: string;
  created_by: string;       // User ID
  assigned_to?: string;     // User ID
  team_id?: string;         // Team ID
  items: OrderItem[];
  status: 'pending' | 'in_progress' | 'done' | 'cancelled';
  notes?: string;
  created_at: string;
  updated_at: string;
}
