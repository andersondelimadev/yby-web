import { MOCK_COOPERATIVES, MOCK_CLIENTS } from '../mock/mockData.js';
import { ORGANIZATION_TYPES, ORGANIZATION_STATUS } from '@/domain/constants/organizationTypes.js';

function createMockCollectionPoints(orgName, city, state, neighborhood, index, isClient) {
  if (!isClient && index === 3) {
    return [];
  }

  return [
    {
      id: `cp-${isClient ? 'c' : 'k'}-${index + 1}-1`,
      nickname: isClient ? `${orgName} — Principal` : `Base Operacional ${orgName}`,
      zip_code: `60160-${String(100 + index * 15).padStart(3, '0')}`,
      address: isClient ? 'Av. Santos Dumont' : 'Rua José Avelino',
      number: String(1200 + index * 40),
      neighborhood: neighborhood || 'Aldeota',
      city: city || 'Fortaleza',
      state: state || 'CE',
      active: true,
    },
    ...(index % 2 === 0
      ? [
          {
            id: `cp-${isClient ? 'c' : 'k'}-${index + 1}-2`,
            nickname: isClient ? `${orgName} — Anexo` : `Galpão de Triagem ${index + 1}`,
            zip_code: `60175-${String(210 + index * 10).padStart(3, '0')}`,
            address: 'Rua Silva Paulet',
            number: String(450 + index * 12),
            neighborhood: neighborhood || 'Meireles',
            city: city || 'Fortaleza',
            state: state || 'CE',
            active: index !== 2,
          },
        ]
      : []),
  ];
}

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
      created_at: `2026-01-${String(10 + index * 4).padStart(2, '0')}T10:30:00Z`,
      collectionPoints: createMockCollectionPoints(
        coop.shortName || coop.name,
        'Fortaleza',
        'CE',
        'Centro',
        index,
        false
      ),
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
      created_at: `2026-02-${String(5 + index * 2).padStart(2, '0')}T14:15:00Z`,
      collectionPoints: createMockCollectionPoints(
        client.name,
        client.city || 'Fortaleza',
        client.state || 'CE',
        client.neighborhood || 'Aldeota',
        index,
        true
      ),
    })),
  ];
}

function cloneOrganization(org) {
  return {
    ...org,
    collectionPoints: (org.collectionPoints || []).map((cp) => ({ ...cp })),
  };
}

let organizationsStore = getInitialOrganizations();

/**
 * Repositório central de Organizações do Painel Administrativo.
 * Fornece isolamento DIP com suporte a filtros, CRUD de organizações
 * e gerenciamento de pontos de coleta vinculados.
 */
export const organizationRepository = {
  /**
   * Retorna organizações filtradas e ordenadas.
   * @param {Object} [filters]
   * @param {string} [filters.search] - Busca por nome ou CNPJ
   * @param {string} [filters.type] - 'Todas' | 'Cooperativa' | 'Cliente' | 'YBY'
   * @param {string} [filters.status] - 'Todos' | 'Ativa' | 'Inativa'
   * @returns {Promise<Array<Object>>}
   */
  async getAll({ search = '', type = '', status = '' } = {}) {
    await new Promise((resolve) => setTimeout(resolve, 200));

    return organizationsStore
      .filter((org) => {
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
      })
      .map(cloneOrganization);
  },

  /**
   * Obtém uma organização pelo ID.
   * @param {string} id
   * @returns {Promise<Object|null>}
   */
  async getById(id) {
    const found = organizationsStore.find((o) => o.id === id);
    return found ? cloneOrganization(found) : null;
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
      created_at: new Date().toISOString(),
      collectionPoints: [],
      ...data,
    };
    organizationsStore.unshift(newOrg);
    return cloneOrganization(newOrg);
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
    return cloneOrganization(organizationsStore[idx]);
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
    return cloneOrganization(organizationsStore[idx]);
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
   * Adiciona um novo ponto de coleta a uma organização.
   * @param {string} orgId
   * @param {Object} pointData
   * @returns {Promise<Object>} Organização atualizada
   */
  async addCollectionPoint(orgId, pointData) {
    const idx = organizationsStore.findIndex((o) => o.id === orgId);
    if (idx === -1) throw new Error('Organização não encontrada.');

    const newPoint = {
      id: `cp-${Date.now()}`,
      nickname: pointData.nickname?.trim() || '',
      zip_code: pointData.zip_code?.trim() || '',
      address: pointData.address?.trim() || '',
      number: pointData.number?.trim() || '',
      neighborhood: pointData.neighborhood?.trim() || '',
      city: pointData.city?.trim() || '',
      state: pointData.state?.trim() || '',
      active: Boolean(pointData.active ?? true),
    };

    const currentPoints = organizationsStore[idx].collectionPoints || [];
    organizationsStore[idx] = {
      ...organizationsStore[idx],
      collectionPoints: [newPoint, ...currentPoints],
    };

    return cloneOrganization(organizationsStore[idx]);
  },

  /**
   * Atualiza um ponto de coleta existente de uma organização.
   * @param {string} orgId
   * @param {string} pointId
   * @param {Object} pointData
   * @returns {Promise<Object>} Organização atualizada
   */
  async updateCollectionPoint(orgId, pointId, pointData) {
    const idx = organizationsStore.findIndex((o) => o.id === orgId);
    if (idx === -1) throw new Error('Organização não encontrada.');

    const currentPoints = organizationsStore[idx].collectionPoints || [];
    const pointIdx = currentPoints.findIndex((cp) => cp.id === pointId);
    if (pointIdx === -1) throw new Error('Ponto de coleta não encontrado.');

    const updatedPoints = currentPoints.map((cp) =>
      cp.id === pointId
        ? {
            ...cp,
            nickname: pointData.nickname?.trim() ?? cp.nickname,
            zip_code: pointData.zip_code?.trim() ?? cp.zip_code,
            address: pointData.address?.trim() ?? cp.address,
            number: pointData.number?.trim() ?? cp.number,
            neighborhood: pointData.neighborhood?.trim() ?? cp.neighborhood,
            city: pointData.city?.trim() ?? cp.city,
            state: pointData.state?.trim() ?? cp.state,
            active: pointData.active !== undefined ? Boolean(pointData.active) : cp.active,
          }
        : cp
    );

    organizationsStore[idx] = {
      ...organizationsStore[idx],
      collectionPoints: updatedPoints,
    };

    return cloneOrganization(organizationsStore[idx]);
  },

  /**
   * Remove um ponto de coleta de uma organização.
   * @param {string} orgId
   * @param {string} pointId
   * @returns {Promise<Object>} Organização atualizada
   */
  async deleteCollectionPoint(orgId, pointId) {
    const idx = organizationsStore.findIndex((o) => o.id === orgId);
    if (idx === -1) throw new Error('Organização não encontrada.');

    const currentPoints = organizationsStore[idx].collectionPoints || [];
    const exists = currentPoints.some((cp) => cp.id === pointId);
    if (!exists) throw new Error('Ponto de coleta não encontrado.');

    organizationsStore[idx] = {
      ...organizationsStore[idx],
      collectionPoints: currentPoints.filter((cp) => cp.id !== pointId),
    };

    return cloneOrganization(organizationsStore[idx]);
  },

  /**
   * Restaura os dados originais simulados para testes.
   */
  reset() {
    organizationsStore = getInitialOrganizations();
    return organizationsStore;
  },
};
