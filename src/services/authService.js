import { USER_ROLES } from '@/domain/constants/userRoles.js';
import { userRepository } from './repositories/userRepository.js';

const COOPERATIVE_ROLES = new Set([
  USER_ROLES.PRESIDENTE_COOPERATIVA.id,
  USER_ROLES.COLABORADOR_COOPERATIVA.id,
]);

const DEFAULT_DEMO_PASSWORD = '123456';

/**
 * Autentica o usuário pelo identificador (e-mail ou login) e senha.
 * Unifica o acesso administrativo/gestor/cliente e o acesso da cooperativa
 * no mesmo formulário principal (/signIn), aceitando o login "Cooperativa"
 * ou o e-mail de usuários vinculados a uma cooperativa.
 *
 * @param {string} identifier - E-mail ou login informado
 * @param {string} password - Senha informada
 * @returns {Promise<{ jwt: string, user: Object, redirectTo: string }>}
 */
export async function authenticateUser(identifier, password) {
  const normalizedIdentifier = String(identifier || '').trim().toLowerCase();

  if (!normalizedIdentifier || !password) {
    throw new Error('Preencha o e-mail e a senha para entrar.');
  }

  if (password !== DEFAULT_DEMO_PASSWORD) {
    throw new Error('E-mail ou senha inválidos.');
  }

  const allUsers = await userRepository.getAll();
  const matchedUser = allUsers.find(
    (user) => String(user.email || '').trim().toLowerCase() === normalizedIdentifier
  );

  const isCooperativeLogin = normalizedIdentifier === 'cooperativa';
  const isCooperativeUser = Boolean(matchedUser && COOPERATIVE_ROLES.has(matchedUser.role));

  if (isCooperativeLogin || isCooperativeUser) {
    return {
      jwt: 'mock-coop-jwt',
      user: {
        id: matchedUser?.id ?? 99,
        name: matchedUser?.name ?? 'Cooperativa',
        username: matchedUser?.email ?? 'Cooperativa',
        email: matchedUser?.email ?? 'cooperativa@somosyby.com',
        organizationName: matchedUser?.organizationName ?? 'Cooperativa Parceira',
        cooperative_id: matchedUser?.organizationId ?? 2,
        role: 'cooperativa',
      },
      redirectTo: '/ponto-coleta',
    };
  }

  return {
    jwt: 'mock-jwt-token',
    user: {
      id: matchedUser?.id ?? 1,
      name: matchedUser?.name ?? 'Administrador YBY',
      username: matchedUser?.email ?? 'admin',
      email: matchedUser?.email ?? String(identifier).trim(),
      isAdmin: !matchedUser || matchedUser.role === USER_ROLES.GESTOR_YBY.id,
      role: matchedUser?.role ?? 'admin',
    },
    redirectTo: '/dashboard',
  };
}
