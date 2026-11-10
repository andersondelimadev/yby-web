import { MOCK_COOPERATIVES, MOCK_CLIENTS } from '../mock/mockData.js';
import { ORGANIZATION_TYPES, ORGANIZATION_STATUS } from '@/domain/constants/organizationTypes.js';

// Base inicial unificada de Organizações (YBY + Cooperativas + Clientes)
function getInitialOrganizations() {
  return [
    // Entidade YBY e Cooperativas
    ...MOCK_COOPERATIVES.map((coop, index) => ({
      id: `coop-${coop.id}`,
      rawId: coop.id,
      name: coop.name,
      shortName: coop.shortName,
      cnpj: coop.cnpj || `07.${100 + index}.456/0001-89`,
      type: index === 0 ? ORGANIZATION_TYPES.YBY : ORGANIZATION_TYPES.COOPERATIVA,
      status: index === 3 ? ORGANIZATION_STATUS.INATIVA : ORGANIZATION_STATUS.ATIVA,
      city: 'Fortaleza',
      state: 'CE',
      employees: coop.employees,
    })),
    // Clientes
    ...MOCK_CLIENTS.map((client, index) => ({
      id: `client-${client.id}`,
      rawId: client.id,
      name: client.social_name || client.name,
      shortName: client.name,
      cnpj: client.cnpj,
      type: ORGANIZATION_TYPES.CLIENTE,
      status: index === 7 ? ORGANIZATION_STATUS.INATIVA : ORGANIZATION_STATUS.ATIVA,
      city: client.city || 'Fortaleza',
      state: client.state || 'CE',
      neighborhood: client.neighborhood,
      phone: client.phone,
      email: client.email,
    })),
  ];
}

let organizationsStore = getInitialOrganizations();

/**
 * Repositório central de Organizações do Painel Administrativo.
 * Fornece isolamento DIP com suporte a filtros por busca, tipo e status.
 */
export const organizationRepository = {
  /**
   * Retorna organizações filtradas e ordenadas.
   * @param {Object} [filters]
   * @param {string} [filters.search] - Busca por nome ou CNPJ
   * @param {string} [filters.type] - 'Todas' | 'Cooperativa' | 'Cliente'
   * @param {string} [filters.status] - 'Todos' | 'Ativa' | 'Inativa'
   * @returns {Promise<Array<Object>>}
   */
  async getAll({ search = '', type = '', status = '' } = {}) {
    // Simula latência de rede
    await new Promise((resolve) => setTimeout(resolve, 200));

    return organizationsStore.filter((org) => {
      if (search) {
        const q = search.toLowerCase().replace(/[^\w]/g, '');
        const cleanCnpj = (org.cnpj || '').replace(/[^\w]/g, '').toLowerCase();
        const cleanName = (org.name || '').toLowerCase();
        const cleanShort = (org.shortName || '').toLowerCase();
        const matches =
          cleanName.includes(search.toLowerCase()) ||
          cleanShort.includes(search.toLowerCase()) ||
          cleanCnpj.includes(q);
        if (!matches) return false;
      }

      if (type && type !== 'Todas' && org.type !== type) {
        return false;
      }

      if (status && status !== 'Todos' && org.status !== status) {
        return false;
      }

      return true;
    });
  },

  /**
   * Obtém uma organização pelo ID.
   * @param {string} id
   * @returns {Promise<Object|null>}
   */
  async getById(id) {
    const found = organizationsStore.find((o) => o.id === id);
    return found ? { ...found } : null;
  },

  /**
   * Cria uma nova organização.
   * @param {Object} data
   * @returns {Promise<Object>}
   */
  async create(data) {
    const newOrg = {
      id: `org-${Date.now()}`,
      rawId: Date.now(),
      status: data.status || ORGANIZATION_STATUS.ATIVA,
      type: data.type || ORGANIZATION_TYPES.CLIENTE,
      shortName: data.shortName || data.name,
      city: 'Fortaleza',
      state: 'CE',
      ...data,
    };
    organizationsStore.unshift(newOrg);
    return { ...newOrg };
  },

  /**
   * Atualiza dados de uma organização existente.
   * @param {string} id
   * @param {Object} data
   * @returns {Promise<Object>}
   */
  async update(id, data) {
    const idx = organizationsStore.findIndex((o) => o.id === id);
    if (idx === -1) throw new Error('Organização não encontrada.');
    organizationsStore[idx] = { ...organizationsStore[idx], ...data };
    return { ...organizationsStore[idx] };
  },

  /**
   * Alterna o status da organização entre Ativa e Inativa.
   * @param {string} id
   * @returns {Promise<Object>}
   */
  async toggleStatus(id) {
    const idx = organizationsStore.findIndex((o) => o.id === id);
    if (idx === -1) throw new Error('Organização não encontrada.');
    const current = organizationsStore[idx];
    const newStatus =
      current.status === ORGANIZATION_STATUS.ATIVA
        ? ORGANIZATION_STATUS.INATIVA
        : ORGANIZATION_STATUS.ATIVA;
    organizationsStore[idx] = { ...current, status: newStatus };
    return { ...organizationsStore[idx] };
  },

  /**
   * Remove uma organização do repositório.
   * @param {string} id
   * @returns {Promise<boolean>}
   */
  async delete(id) {
    const exists = organizationsStore.some((o) => o.id === id);
    if (!exists) throw new Error('Organização não encontrada para exclusão.');
    organizationsStore = organizationsStore.filter((o) => o.id !== id);
    return true;
  },

  /**
   * Restaura os dados originais simulados para testes.
   */
  reset() {
    organizationsStore = getInitialOrganizations();
    return organizationsStore;
  },
};
