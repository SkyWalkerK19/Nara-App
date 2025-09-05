import { hasPermission, roleMap, roles } from '../roles/roles';



describe('Role system', () => {
  it('should have all expected roles', () => {
    const roleNames = roles.map(r => r.name).sort();
    expect(roleNames).toEqual(['admin', 'bar', 'hookah', 'server'].sort());
  });

  it('roleMap lookup returns correct properties', () => {
    expect(roleMap['admin'].canManageTeam).toBe(true);
    expect(roleMap['bar'].canManageTeam).toBe(false);
    expect(roleMap['server'].canViewDashboard).toBe(true);
    expect(roleMap['hookah'].canViewDashboard).toBe(true);
  });

  it('hasPermission utility works for permissions', () => {
    expect(hasPermission('admin', 'canManageTeam')).toBe(true);
    expect(hasPermission('bar', 'canManageTeam')).toBe(false);
    expect(hasPermission('hookah', 'canCreateChat')).toBe(false);
    expect(hasPermission('admin', 'canViewDashboard')).toBe(true);
  });

  it('returns false for unknown role or permission', () => {
    expect(hasPermission('unknown', 'canManageTeam')).toBe(false);
    expect(hasPermission('admin', 'notARealPermission')).toBe(false);
  });
});



