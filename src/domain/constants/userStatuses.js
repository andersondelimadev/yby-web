/**
 * Definição oficial dos status de usuário no Painel Administrativo YBY.
 * Valores canônicos: active, inactive, pending.
 */
export const USER_STATUS = {
  ACTIVE: {
    id: 'active',
    label: 'Ativo',
    badgeVariant: 'green',
  },
  INACTIVE: {
    id: 'inactive',
    label: 'Inativo',
    badgeVariant: 'gray',
  },
  PENDING: {
    id: 'pending',
    label: 'Pendente',
    badgeVariant: 'orange',
  },
};

export const USER_STATUS_LIST = Object.values(USER_STATUS);

/**
 * Retorna os metadados visuais (id, label e badgeVariant) do status do usuário.
 * @param {string} [statusId='pending']
 * @returns {{ id: string, label: string, badgeVariant: 'green'|'gray'|'orange' }}
 */
export function getUserStatusMeta(statusId) {
  const normalized = String(statusId || '').trim().toLowerCase();
  const found = USER_STATUS_LIST.find(
    (s) => s.id === normalized || s.label.toLowerCase() === normalized
  );
  return found || USER_STATUS.PENDING;
}
