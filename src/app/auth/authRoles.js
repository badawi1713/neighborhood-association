/**
 * Authorization Roles
 */
const authRoles = {
  admin: ['admin', 'role_merchant'],
  staff: ['admin', 'staff', 'role_merchant'],
  user: ['admin', 'staff', 'user', 'role_merchant'],
  onlyGuest: [],
};

export default authRoles;
