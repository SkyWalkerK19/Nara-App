export interface Team {
  id: string;
  name: string;
  passcode?: string;
  created_by: string; // user id of the creator
  created_at: string;
}
