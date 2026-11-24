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
