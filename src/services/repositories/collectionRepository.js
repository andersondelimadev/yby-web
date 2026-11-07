import { MOCK_COLLECTIONS } from '../mock/mockData.js';

let collectionsStore = [...MOCK_COLLECTIONS];

export const collectionRepository = {
  async getFiltered({ search = '', cooperative = '', waste = '', startDate = '', endDate = '' } = {}) {
    // Simula latência de rede realista para feedback visual de skeleton
    await new Promise((resolve) => setTimeout(resolve, 280));

    return collectionsStore.filter((c) => {
      if (search) {
        const q = search.toLowerCase();
        const match =
          String(c.id).includes(q) ||
          c.pev.toLowerCase().includes(q) ||
          c.cooperative.toLowerCase().includes(q);
        if (!match) return false;
      }
      if (cooperative && cooperative !== 'Todas as cooperativas' && c.cooperative !== cooperative) {
        return false;
      }
      if (waste && waste !== 'Todos os resíduos' && c.waste !== waste) {
        return false;
      }
      return true;
    });
  },

  async delete(id) {
    collectionsStore = collectionsStore.filter((c) => c.id !== Number(id));
    return true;
  },

  async update(id, data) {
    const idx = collectionsStore.findIndex((c) => c.id === Number(id));
    if (idx === -1) throw new Error('Coleta não encontrada');
    collectionsStore[idx] = { ...collectionsStore[idx], ...data };
    return collectionsStore[idx];
  },

  reset() {
    collectionsStore = [...MOCK_COLLECTIONS];
    return collectionsStore;
  },
};
