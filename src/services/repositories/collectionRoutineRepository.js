import { organizationRepository } from './organizationRepository.js';
import { WEEK_DAYS, getWeekDayMeta } from '@/domain/constants/weekDays.js';
import { formatPointShortAddress } from '@/domain/formatters/routineFormatters.js';
import {
  validateRoutineInput,
  validateRoutineBatchInput,
} from '@/domain/validators/routineValidator.js';

/**
 * Gera a base inicial de rotinas de coleta vinculadas às cooperativas,
 * clientes e pontos de coleta cadastrados em organizationRepository.
 * Mantém o contrato canônico de 1 registro por dia da semana.
 */
function getInitialRoutines() {
  return [
    // Ticiana Rolim — Principal: Coocencipe (Seg, Qua, Sex) + Rosa Virginia (Ter)
    {
      id: 'rot-1',
      cooperativeId: 'coop-2',
      clientId: 'client-1',
      collectionPointId: 'cp-c-1-1',
      dayOfWeek: WEEK_DAYS.SEGUNDA.id,
      created_at: '2026-03-02T09:00:00Z',
      updated_at: '2026-03-10T14:20:00Z',
    },
    {
      id: 'rot-1b',
      cooperativeId: 'coop-2',
      clientId: 'client-1',
      collectionPointId: 'cp-c-1-1',
      dayOfWeek: WEEK_DAYS.QUARTA.id,
      created_at: '2026-03-02T09:00:00Z',
      updated_at: '2026-03-10T14:20:00Z',
    },
    {
      id: 'rot-1c',
      cooperativeId: 'coop-2',
      clientId: 'client-1',
      collectionPointId: 'cp-c-1-1',
      dayOfWeek: WEEK_DAYS.SEXTA.id,
      created_at: '2026-03-02T09:00:00Z',
      updated_at: '2026-03-10T14:20:00Z',
    },
    {
      id: 'rot-1d',
      cooperativeId: 'coop-4',
      clientId: 'client-1',
      collectionPointId: 'cp-c-1-1',
      dayOfWeek: WEEK_DAYS.TERCA.id,
      created_at: '2026-03-04T10:00:00Z',
      updated_at: '2026-03-14T10:20:00Z',
    },
    // Ticiana Rolim — Anexo: Coocencipe (Qua)
    {
      id: 'rot-2',
      cooperativeId: 'coop-2',
      clientId: 'client-1',
      collectionPointId: 'cp-c-1-2',
      dayOfWeek: WEEK_DAYS.QUARTA.id,
      created_at: '2026-03-03T10:15:00Z',
      updated_at: '2026-03-12T16:40:00Z',
    },
    // Hospital Jayme da Fonte: Rede Ceará (Ter, Qui)
    {
      id: 'rot-3',
      cooperativeId: 'coop-3',
      clientId: 'client-2',
      collectionPointId: 'cp-c-2-1',
      dayOfWeek: WEEK_DAYS.TERCA.id,
      created_at: '2026-03-05T11:30:00Z',
      updated_at: '2026-03-05T11:30:00Z',
    },
    {
      id: 'rot-3b',
      cooperativeId: 'coop-3',
      clientId: 'client-2',
      collectionPointId: 'cp-c-2-1',
      dayOfWeek: WEEK_DAYS.QUINTA.id,
      created_at: '2026-03-05T11:30:00Z',
      updated_at: '2026-03-05T11:30:00Z',
    },
    // Arvoredo: Rede Ceará (Qui)
    {
      id: 'rot-4',
      cooperativeId: 'coop-3',
      clientId: 'client-3',
      collectionPointId: 'cp-c-3-1',
      dayOfWeek: WEEK_DAYS.QUINTA.id,
      created_at: '2026-03-08T08:45:00Z',
      updated_at: '2026-03-18T09:10:00Z',
    },
    // Colosso: Coocencipe (Sex, Sáb)
    {
      id: 'rot-5',
      cooperativeId: 'coop-2',
      clientId: 'client-4',
      collectionPointId: 'cp-c-4-1',
      dayOfWeek: WEEK_DAYS.SEXTA.id,
      created_at: '2026-03-11T15:00:00Z',
      updated_at: '2026-03-20T11:05:00Z',
    },
    {
      id: 'rot-5b',
      cooperativeId: 'coop-2',
      clientId: 'client-4',
      collectionPointId: 'cp-c-4-1',
      dayOfWeek: WEEK_DAYS.SABADO.id,
      created_at: '2026-03-11T15:00:00Z',
      updated_at: '2026-03-20T11:05:00Z',
    },
    // Edifício Le Louvre: Rosa Virginia (Sáb)
    {
      id: 'rot-6',
      cooperativeId: 'coop-4',
      clientId: 'client-5',
      collectionPointId: 'cp-c-5-1',
      dayOfWeek: WEEK_DAYS.SABADO.id,
      created_at: '2026-03-14T13:20:00Z',
      updated_at: '2026-03-14T13:20:00Z',
    },
    // Locmed: Rede Ceará (Seg, Qui)
    {
      id: 'rot-7',
      cooperativeId: 'coop-3',
      clientId: 'client-6',
      collectionPointId: 'cp-c-6-1',
      dayOfWeek: WEEK_DAYS.SEGUNDA.id,
      created_at: '2026-03-16T09:30:00Z',
      updated_at: '2026-03-22T17:45:00Z',
    },
    {
      id: 'rot-7b',
      cooperativeId: 'coop-3',
      clientId: 'client-6',
      collectionPointId: 'cp-c-6-1',
      dayOfWeek: WEEK_DAYS.QUINTA.id,
      created_at: '2026-03-16T09:30:00Z',
      updated_at: '2026-03-22T17:45:00Z',
    },
    // Prisma Residencial: Coocencipe (Qua)
    {
      id: 'rot-8',
      cooperativeId: 'coop-2',
      clientId: 'client-7',
      collectionPointId: 'cp-c-7-1',
      dayOfWeek: WEEK_DAYS.QUARTA.id,
      created_at: '2026-03-19T10:00:00Z',
      updated_at: '2026-03-19T10:00:00Z',
    },
    // Jardim Europa: Rosa Virginia (Sex)
    {
      id: 'rot-9',
      cooperativeId: 'coop-4',
      clientId: 'client-9',
      collectionPointId: 'cp-c-9-1',
      dayOfWeek: WEEK_DAYS.SEXTA.id,
      created_at: '2026-03-21T14:50:00Z',
      updated_at: '2026-03-25T10:15:00Z',
    },
  ];
}

let routinesStore = getInitialRoutines();

/**
 * Hidrata uma rotina com os nomes e endereço atualizados da cooperativa,
 * do cliente e do ponto de coleta a partir do catálogo de organizações.
 *
 * @param {Object} routine
 * @param {Array<Object>} allOrganizations
 * @returns {Object}
 */
function hydrateRoutine(routine, allOrganizations) {
  const coop = allOrganizations.find((o) => o.id === routine.cooperativeId);
  const client = allOrganizations.find((o) => o.id === routine.clientId);
  const point = (client?.collectionPoints || []).find(
    (cp) => cp.id === routine.collectionPointId
  );

  return {
    ...routine,
    cooperativeName: coop?.name || routine.cooperativeName || 'Cooperativa não encontrada',
    clientName: client?.name || routine.clientName || 'Cliente não encontrado',
    collectionPointName: point?.nickname || routine.collectionPointName || 'Ponto removido',
    collectionPointAddress: point
      ? formatPointShortAddress(point)
      : routine.collectionPointAddress || 'Endereço não informado',
    dayLabel: getWeekDayMeta(routine.dayOfWeek).label,
  };
}

/**
 * Repositório de Rotinas de Coleta (Pure Fabrication / DIP).
 * Centraliza leitura filtrada, criação, edição, exclusão e checagem de duplicidade.
 */
export const collectionRoutineRepository = {
  /**
   * Retorna todas as rotinas hidratadas e filtradas.
   * @param {Object} [filters]
   * @param {string} [filters.search]
   * @param {string} [filters.cooperativeId]
   * @param {string} [filters.clientId]
   * @param {string[]} [filters.days]
   * @returns {Promise<Array<Object>>}
   */
  async getAll({ search = '', cooperativeId = '', clientId = '', days = [] } = {}) {
    await new Promise((resolve) => setTimeout(resolve, 180));
    const allOrgs = await organizationRepository.getAll();
    const hydrated = routinesStore.map((r) => hydrateRoutine(r, allOrgs));

    return hydrated.filter((routine) => {
      if (search) {
        const q = search.trim().toLowerCase();
        const matches =
          routine.cooperativeName.toLowerCase().includes(q) ||
          routine.clientName.toLowerCase().includes(q) ||
          routine.collectionPointName.toLowerCase().includes(q) ||
          routine.collectionPointAddress.toLowerCase().includes(q) ||
          routine.dayLabel.toLowerCase().includes(q);
        if (!matches) return false;
      }

      if (cooperativeId && cooperativeId !== 'Todas' && routine.cooperativeId !== cooperativeId) {
        return false;
      }

      if (clientId && clientId !== 'Todos' && routine.clientId !== clientId) {
        return false;
      }

      if (Array.isArray(days) && days.length > 0 && !days.includes(routine.dayOfWeek)) {
        return false;
      }

      return true;
    });
  },

  /**
   * Retorna o total bruto de rotinas cadastradas (sem filtros).
   * @returns {Promise<number>}
   */
  async countAll() {
    return routinesStore.length;
  },

  /**
   * Cria uma nova rotina validando campos obrigatórios e unicidade.
   * @param {{ cooperativeId: string, clientId: string, collectionPointId: string, dayOfWeek: string }} data
   * @returns {Promise<Object>}
   */
  async create(data) {
    const allOrgs = await organizationRepository.getAll();
    const hydratedExisting = routinesStore.map((r) => hydrateRoutine(r, allOrgs));
    const validation = validateRoutineInput(data, hydratedExisting, null);

    if (!validation.valid) {
      const error = new Error(validation.duplicateError || 'Dados inválidos para a rotina.');
      error.code = validation.duplicateError ? 'DUPLICATE_ROUTINE' : 'VALIDATION_ERROR';
      error.fieldErrors = validation.errors;
      throw error;
    }

    const now = new Date().toISOString();
    const newRoutine = {
      id: `rot-${Date.now()}`,
      cooperativeId: data.cooperativeId,
      clientId: data.clientId,
      collectionPointId: data.collectionPointId,
      dayOfWeek: data.dayOfWeek,
      created_at: now,
      updated_at: now,
    };

    routinesStore.unshift(newRoutine);
    return hydrateRoutine(newRoutine, allOrgs);
  },

  /**
   * Atualiza uma rotina existente validando duplicidade contra as demais.
   * @param {string} id
   * @param {{ cooperativeId: string, clientId: string, collectionPointId: string, dayOfWeek: string }} data
   * @returns {Promise<Object>}
   */
  async update(id, data) {
    const idx = routinesStore.findIndex((r) => r.id === id);
    if (idx === -1) throw new Error('Rotina de coleta não encontrada.');

    const allOrgs = await organizationRepository.getAll();
    const hydratedExisting = routinesStore.map((r) => hydrateRoutine(r, allOrgs));
    const validation = validateRoutineInput(data, hydratedExisting, id);

    if (!validation.valid) {
      const error = new Error(validation.duplicateError || 'Dados inválidos para a rotina.');
      error.code = validation.duplicateError ? 'DUPLICATE_ROUTINE' : 'VALIDATION_ERROR';
      error.fieldErrors = validation.errors;
      throw error;
    }

    const updated = {
      ...routinesStore[idx],
      cooperativeId: data.cooperativeId,
      clientId: data.clientId,
      collectionPointId: data.collectionPointId,
      dayOfWeek: data.dayOfWeek,
      updated_at: new Date().toISOString(),
    };

    routinesStore[idx] = updated;
    return hydrateRoutine(updated, allOrgs);
  },

  /**
   * Remove permanentemente uma rotina pelo ID.
   * @param {string} id
   * @returns {Promise<boolean>}
   */
  async delete(id) {
    const exists = routinesStore.some((r) => r.id === id);
    if (!exists) throw new Error('Rotina de coleta não encontrada para exclusão.');
    routinesStore = routinesStore.filter((r) => r.id !== id);
    return true;
  },

  /**
   * Salva (cria ou atualiza) um conjunto de dias da semana para uma mesma
   * combinação de Cooperativa + Ponto de Coleta em operação atômica.
   *
   * @param {{ cooperativeId: string, clientId: string, collectionPointId: string, days: string[] }} data
   * @param {string[]} [replaceIds=[]] - IDs existentes substituídos na edição do grupo
   * @returns {Promise<Array<Object>>}
   */
  async saveBatch(data, replaceIds = []) {
    const allOrgs = await organizationRepository.getAll();
    const hydratedExisting = routinesStore.map((r) => hydrateRoutine(r, allOrgs));
    const uniqueDays = Array.from(new Set((data.days || []).filter(Boolean)));
    const validation = validateRoutineBatchInput(
      { ...data, days: uniqueDays },
      hydratedExisting,
      replaceIds
    );

    if (!validation.valid) {
      const error = new Error(validation.duplicateError || 'Dados inválidos para a rotina.');
      error.code = validation.duplicateError ? 'DUPLICATE_ROUTINE' : 'VALIDATION_ERROR';
      error.fieldErrors = validation.errors;
      throw error;
    }

    const now = new Date().toISOString();
    const replacedRecords = routinesStore.filter((r) => replaceIds.includes(r.id));
    const earliestCreatedAt =
      replacedRecords.reduce(
        (acc, r) => (!acc || r.created_at < acc ? r.created_at : acc),
        null
      ) || now;

    // Remove registros antigos substituídos e insere os novos dias preservando unicidade
    const replaceSet = new Set(replaceIds);
    routinesStore = routinesStore.filter((r) => !replaceSet.has(r.id));

    const created = uniqueDays.map((dayOfWeek, index) => ({
      id: `rot-${Date.now()}-${index}`,
      cooperativeId: data.cooperativeId,
      clientId: data.clientId,
      collectionPointId: data.collectionPointId,
      dayOfWeek,
      created_at: earliestCreatedAt,
      updated_at: now,
    }));

    routinesStore = [...created, ...routinesStore];
    return created.map((r) => hydrateRoutine(r, allOrgs));
  },

  /**
   * Remove permanentemente um conjunto de rotinas (todos os dias de um grupo).
   * @param {string[]} ids
   * @returns {Promise<boolean>}
   */
  async deleteMany(ids = []) {
    const idSet = new Set(ids);
    routinesStore = routinesStore.filter((r) => !idSet.has(r.id));
    return true;
  },

  /**
   * Restaura o conjunto inicial para isolamento de testes.
   */
  reset() {
    routinesStore = getInitialRoutines();
    return routinesStore;
  },
};
