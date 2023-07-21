/**
 * Authorization Roles
 */
const authRoles = {
  admin: ['admin', 'role_admin'],
  staff: ['admin', 'staff', 'role_admin'],
  user: ['admin', 'staff', 'user', 'role_admin'],
  onlyGuest: [],
};

export default authRoles;
