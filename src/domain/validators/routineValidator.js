import { getWeekDayMeta } from '../constants/weekDays.js';

/**
 * Verifica se já existe uma rotina cadastrada para o mesmo ponto de coleta
 * e mesmo dia da semana (regra de unicidade de agenda do ponto).
 *
 * @param {Array<Object>} existingRoutines
 * @param {{ collectionPointId: string, dayOfWeek: string }} candidate
 * @param {string|null} [ignoreId=null] - ID da rotina atual em edição
 * @returns {Object|null}
 */
export function findDuplicateRoutine(existingRoutines = [], candidate = {}, ignoreId = null) {
  if (!candidate.collectionPointId || !candidate.dayOfWeek) return null;

  return (
    existingRoutines.find(
      (routine) =>
        routine.id !== ignoreId &&
        routine.collectionPointId === candidate.collectionPointId &&
        routine.dayOfWeek === candidate.dayOfWeek
    ) || null
  );
}

/**
 * Valida os dados de entrada de uma rotina de coleta antes da persistência.
 * Aplica SRP e Information Expert concentrando todas as regras no domínio.
 *
 * @param {{ cooperativeId?: string, clientId?: string, collectionPointId?: string, dayOfWeek?: string }} data
 * @param {Array<Object>} [existingRoutines=[]]
 * @param {string|null} [editingId=null]
 * @returns {{ valid: boolean, errors: Record<string, string>, duplicateError: string|null }}
 */
export function validateRoutineInput(data = {}, existingRoutines = [], editingId = null) {
  const errors = {};

  if (!data.cooperativeId) {
    errors.cooperativeId = 'Selecione uma cooperativa responsável.';
  }
  if (!data.clientId) {
    errors.clientId = 'Selecione o cliente dono do ponto de coleta.';
  }
  if (!data.collectionPointId) {
    errors.collectionPointId = 'Selecione o ponto de coleta.';
  }
  if (!data.dayOfWeek) {
    errors.dayOfWeek = 'Selecione o dia da semana da coleta.';
  }

  let duplicateError = null;
  if (Object.keys(errors).length === 0) {
    const duplicate = findDuplicateRoutine(existingRoutines, data, editingId);
    if (duplicate) {
      const dayLabel = getWeekDayMeta(data.dayOfWeek).label;
      duplicateError = `Já existe uma rotina cadastrada para este ponto de coleta em ${dayLabel} (${duplicate.cooperativeName || 'outra cooperativa'}).`;
    }
  }

  return {
    valid: Object.keys(errors).length === 0 && !duplicateError,
    errors,
    duplicateError,
  };
}

/**
 * Mapeia os dias da semana que já possuem coleta agendada para um ponto de coleta,
 * permitindo bloqueio preventivo na interface antes do envio do formulário.
 *
 * @param {Array<Object>} existingRoutines
 * @param {string} collectionPointId
 * @param {string[]} [ignoreIds=[]] - IDs das rotinas que estão sendo editadas
 * @returns {Record<string, { routineId: string, cooperativeId: string, cooperativeName: string }>}
 */
export function getOccupiedDaysForPoint(existingRoutines = [], collectionPointId = '', ignoreIds = []) {
  if (!collectionPointId) return {};
  const ignoredSet = new Set(ignoreIds);
  const occupied = {};

  existingRoutines.forEach((routine) => {
    if (ignoredSet.has(routine.id)) return;
    if (routine.collectionPointId !== collectionPointId) return;
    occupied[routine.dayOfWeek] = {
      routineId: routine.id,
      cooperativeId: routine.cooperativeId,
      cooperativeName: routine.cooperativeName || 'outra cooperativa',
    };
  });

  return occupied;
}

/**
 * Valida a criação ou atualização em lote de múltiplos dias da semana para um
 * mesmo ponto de coleta e cooperativa.
 *
 * @param {{ cooperativeId?: string, clientId?: string, collectionPointId?: string, days?: string[] }} data
 * @param {Array<Object>} [existingRoutines=[]]
 * @param {string[]} [ignoreIds=[]]
 * @returns {{ valid: boolean, errors: Record<string, string>, duplicateError: string|null }}
 */
export function validateRoutineBatchInput(data = {}, existingRoutines = [], ignoreIds = []) {
  const errors = {};
  const uniqueDays = Array.from(new Set(Array.isArray(data.days) ? data.days.filter(Boolean) : []));

  if (!data.cooperativeId) {
    errors.cooperativeId = 'Selecione uma cooperativa responsável.';
  }
  if (!data.clientId) {
    errors.clientId = 'Selecione o cliente dono do ponto de coleta.';
  }
  if (!data.collectionPointId) {
    errors.collectionPointId = 'Selecione o ponto de coleta.';
  }
  if (uniqueDays.length === 0) {
    errors.days = 'Selecione pelo menos um dia da semana para a coleta.';
  }

  let duplicateError = null;
  if (Object.keys(errors).length === 0) {
    const occupied = getOccupiedDaysForPoint(existingRoutines, data.collectionPointId, ignoreIds);
    const conflictingDays = uniqueDays.filter((dayId) => Boolean(occupied[dayId]));

    if (conflictingDays.length > 0) {
      const details = conflictingDays
        .map((dayId) => `${getWeekDayMeta(dayId).label} (${occupied[dayId].cooperativeName})`)
        .join(', ');
      duplicateError = `Já existe rotina cadastrada para este ponto de coleta em: ${details}.`;
    }
  }

  return {
    valid: Object.keys(errors).length === 0 && !duplicateError,
    errors,
    duplicateError,
  };
}
