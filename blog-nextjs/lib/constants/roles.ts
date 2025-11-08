// ============================================================================
// User Role Constants
// ============================================================================

/**
 * User role IDs matching backend RoleID enum
 * Backend: server/model/appTypes/user_role.go
 */
export const USER_ROLES = {
  GUEST: 0,
  USER: 1,
  ADMIN: 2,
} as const;

/**
 * Check if a role_id represents an admin user
 */
export function isAdminRole(roleId: number): boolean {
  return roleId === USER_ROLES.ADMIN;
}

/**
 * Get role display name
 */
export function getRoleName(roleId: number): string {
  switch (roleId) {
    case USER_ROLES.GUEST:
      return 'Guest';
    case USER_ROLES.USER:
      return 'User';
    case USER_ROLES.ADMIN:
      return 'Admin';
    default:
      return 'Unknown';
  }
}
