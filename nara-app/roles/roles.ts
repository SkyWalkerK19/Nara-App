// roles.ts
import { UserRole } from './types';

/**
 * All user roles in the system, extensible for new permissions & properties.
 */
export const roles: UserRole[] = [
  {
    name: 'admin',
    canViewDashboard: true,
    canCreateChat: true,
    canManageTeam: true,
  },
  {
    name: 'bar',
    canViewDashboard: true,
    canCreateChat: false,
    canManageTeam: false,
  },
  {
    name: 'server',
    canViewDashboard: true,
    canCreateChat: false,
    canManageTeam: false,
  },
  {
    name: 'hookah',
    canViewDashboard: true,
    canCreateChat: false,
    canManageTeam: false,
  },
];

/**
 * For direct lookup by role name (e.g., roleMap['admin'])
 */
export const roleMap: Record<string, UserRole> = Object.fromEntries(
  roles.map((role) => [role.name, role])
);

/**
 * Utility to check permissions for a given role.
 * @param roleName - the string name of the role
 * @param permission - the permission property, e.g., 'canCreateChat'
 */
export function hasPermission(roleName: string, permission: string): boolean {
  const role = roleMap[roleName];
  return !!role && !!role[permission];
}