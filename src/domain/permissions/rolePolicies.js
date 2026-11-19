/**
 * Políticas de Controle de Acesso Baseadas em Papel (RBAC).
 * @see docs/01-VISAO-GERAL-E-DOMINIO.md
 */

export const ROLES = {
  ADMIN: 'admin',
  GESTOR: 'gestor',
  CLIENTE: 'cliente',
  COOPERATIVA: 'cooperativa',
};

/**
 * Retorna as permissões e itens de menu permitidos para o perfil do usuário.
 * @param {{ role?: string, isAdmin?: boolean, isManager?: boolean, client_id?: any, cooperative_id?: any }} user
 */
export function getRolePermissions(user = {}) {
  if (user.isAdmin || user.role === ROLES.ADMIN) {
    return {
      role: ROLES.ADMIN,
      canManageUsers: true,
      canManagePlanning: true,
      canEditCollections: true,
      canDeleteCollections: true,
      canExportReports: true,
      allowedRoutes: ['/relatorios', '/planejamento', '/dashboard', '/cadastro', '/edicao'],
      homeRoute: '/dashboard',
    };
  }

  if (user.isManager || user.role === ROLES.GESTOR) {
    return {
      role: ROLES.GESTOR,
      canManageUsers: false,
      canManagePlanning: false,
      canEditCollections: false,
      canDeleteCollections: false,
      canExportReports: true,
      allowedRoutes: ['/relatorios', '/dashboard'],
      homeRoute: '/dashboard',
    };
  }

  if (user.client_id || user.role === ROLES.CLIENTE) {
    return {
      role: ROLES.CLIENTE,
      canManageUsers: false,
      canManagePlanning: false,
      canEditCollections: false,
      canDeleteCollections: false,
      canExportReports: true,
      allowedRoutes: ['/relatorios', '/dashboard'],
      homeRoute: '/dashboard',
    };
  }

  if (user.cooperative_id || user.role === ROLES.COOPERATIVA) {
    return {
      role: ROLES.COOPERATIVA,
      canManageUsers: false,
      canManagePlanning: false,
      canEditCollections: false,
      canDeleteCollections: false,
      canExportReports: false,
      allowedRoutes: ['/ponto-coleta'],
      homeRoute: '/ponto-coleta',
    };
  }

  // Visitante não autenticado
  return {
    role: 'guest',
    canManageUsers: false,
    canManagePlanning: false,
    canEditCollections: false,
    canDeleteCollections: false,
    canExportReports: false,
    allowedRoutes: ['/', '/signIn', '/forgot-password', '/reset-password'],
    homeRoute: '/',
  };
}
