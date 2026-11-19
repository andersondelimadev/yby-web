import { USER_ROLES } from '@/domain/constants/userRoles.js';
import { USER_STATUS } from '@/domain/constants/userStatuses.js';

let usersStore = [
  {
    id: 1,
    name: 'Mariana Silva',
    email: 'mariana@somosyby.com',
    role: USER_ROLES.GESTOR_YBY.id,
    organizationId: 'coop-1',
    organizationName: 'Yby Soluções Sustentáveis',
    organizationType: 'Cooperativa',
    status: USER_STATUS.ACTIVE.id,
    avatar: '',
  },
  {
    id: 2,
    name: 'Lucas Ferreira',
    email: 'lucas@somosyby.com',
    role: USER_ROLES.COLABORADOR_YBY.id,
    organizationId: 'coop-1',
    organizationName: 'Yby Soluções Sustentáveis',
    organizationType: 'Cooperativa',
    status: USER_STATUS.ACTIVE.id,
    avatar: '',
  },
  {
    id: 3,
    name: 'Antônia Rosa',
    email: 'rosa@cooperativa.org',
    role: USER_ROLES.PRESIDENTE_COOPERATIVA.id,
    organizationId: 'coop-4',
    organizationName: 'Rosa Virginia',
    organizationType: 'Cooperativa',
    status: USER_STATUS.ACTIVE.id,
    avatar: '',
  },
  {
    id: 4,
    name: 'Carlos Nascimento',
    email: 'carlos@coocencipe.org',
    role: USER_ROLES.COLABORADOR_COOPERATIVA.id,
    organizationId: 'coop-2',
    organizationName: 'Coocencipe',
    organizationType: 'Cooperativa',
    status: USER_STATUS.PENDING.id,
    avatar: '',
  },
  {
    id: 5,
    name: 'Juliana Rocha',
    email: 'juliana@ticianarolim.com.br',
    role: USER_ROLES.CLIENTE.id,
    organizationId: 'client-1',
    organizationName: 'Ticiana Rolim Empreendimentos',
    organizationType: 'Cliente',
    status: USER_STATUS.ACTIVE.id,
    avatar: '',
  },
  {
    id: 6,
    name: 'Manoel Santana',
    email: 'manoel@coocencipe.org',
    role: USER_ROLES.PRESIDENTE_COOPERATIVA.id,
    organizationId: 'coop-2',
    organizationName: 'Coocencipe',
    organizationType: 'Cooperativa',
    status: USER_STATUS.INACTIVE.id,
    avatar: '',
  },
  {
    id: 7,
    name: 'Roberto Mendes',
    email: 'roberto@jaymedafonte.com.br',
    role: USER_ROLES.CLIENTE.id,
    organizationId: 'client-2',
    organizationName: 'Hospital Jayme da Fonte Ltda',
    organizationType: 'Cliente',
    status: USER_STATUS.ACTIVE.id,
    avatar: '',
  },
  {
    id: 8,
    name: 'Francisco Chagas',
    email: 'chagas@redeceara.org',
    role: USER_ROLES.COLABORADOR_COOPERATIVA.id,
    organizationId: 'coop-3',
    organizationName: 'Rede Ceará',
    organizationType: 'Cooperativa',
    status: USER_STATUS.PENDING.id,
    avatar: '',
  },
];

/**
 * Repositório de Usuários do Painel Administrativo.
 * Suporta consultas com filtros por busca textual, papel (role), organização e status.
 */
export const userRepository = {
  /**
   * Retorna lista de usuários filtrados.
   * @param {Object} [filters]
   * @param {string} [filters.search]
   * @param {string} [filters.role]
   * @param {string} [filters.organizationId]
   * @param {string} [filters.status]
   * @returns {Promise<Array<Object>>}
   */
  async getAll({ search = '', role = '', organizationId = '', status = '' } = {}) {
    await new Promise((resolve) => setTimeout(resolve, 200));

    return usersStore.filter((user) => {
      if (search) {
        const q = search.toLowerCase();
        const match =
          user.name.toLowerCase().includes(q) ||
          user.email.toLowerCase().includes(q) ||
          user.organizationName.toLowerCase().includes(q);
        if (!match) return false;
      }

      if (role && role !== 'Todos' && user.role !== role) {
        return false;
      }

      if (organizationId && organizationId !== 'Todas' && user.organizationId !== organizationId) {
        return false;
      }

      if (status && status !== 'Todos' && user.status !== status) {
        return false;
      }

      return true;
    });
  },

  async getById(id) {
    const found = usersStore.find((u) => u.id === Number(id));
    return found ? { ...found } : null;
  },

  async create(data) {
    const newUser = {
      id: Date.now(),
      status: USER_STATUS.PENDING.id,
      ...data,
    };
    usersStore.unshift(newUser);
    return { ...newUser };
  },

  async update(id, data) {
    const idx = usersStore.findIndex((u) => u.id === Number(id));
    if (idx === -1) throw new Error('Usuário não encontrado.');
    usersStore[idx] = { ...usersStore[idx], ...data };
    return { ...usersStore[idx] };
  },

  async delete(id) {
    const exists = usersStore.some((u) => u.id === Number(id));
    if (!exists) throw new Error('Usuário não encontrado para exclusão.');
    usersStore = usersStore.filter((u) => u.id !== Number(id));
    return true;
  },
};
