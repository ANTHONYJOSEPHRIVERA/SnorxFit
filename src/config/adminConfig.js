/**
 * Configuración de Administradores
 * 
 * Lista de emails autorizados para acceder al panel de administración
 * Solo los usuarios con estos emails verán el panel admin al iniciar sesión
 */

export const ADMIN_EMAILS = [
  'admin@gmail.com', // Admin principal (Password: 147258)
  // Agrega más emails admin aquí si es necesario:
  // 'otro_admin@ejemplo.com',
];

/**
 * Verificar si un email es administrador
 * @param {string} email 
 * @returns {boolean}
 */
export const isAdmin = (email) => {
  if (!email) return false;
  return ADMIN_EMAILS.includes(email.toLowerCase().trim());
};

/**
 * Verificar si un usuario es administrador
 * @param {object} user - Objeto de usuario con email o userProfile
 * @returns {boolean}
 */
export const isUserAdmin = (user) => {
  if (!user) return false;
  const email = user.email || user.userProfile?.email;
  return isAdmin(email);
};
