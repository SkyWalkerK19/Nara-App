// types.ts

/**
 * Represents a user role and its properties.
 * Extend with more permissions as needed.
 */
export interface UserRole {
  name: string;
  canViewDashboard: boolean;
  canCreateChat?: boolean;
  canManageTeam?: boolean;
  // Add more permission flags below as needed
  [key: string]: any; // Enables extensibility for new properties
}
