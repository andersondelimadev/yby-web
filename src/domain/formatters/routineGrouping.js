import { getWeekDayMeta, WEEK_DAYS_LIST } from '../constants/weekDays.js';

/**
 * Agrupa rotinas individuais (1 registro por dia) por Ponto de Coleta + Cooperativa.
 * Aplica Protected Variations (GRASP): mantém compatibilidade com contratos de API
 * de 1 registro por dia enquanto entrega uma visão consolidada e limpa para a UI.
 *
 * @param {Array<Object>} routines
 * @returns {Array<Object>}
 */
export function groupRoutinesByPointAndCoop(routines = []) {
  const map = new Map();

  routines.forEach((routine) => {
    const groupKey = `${routine.cooperativeId}::${routine.collectionPointId}`;
    const existing = map.get(groupKey);

    if (!existing) {
      map.set(groupKey, {
        groupKey,
        id: routine.id,
        ids: [routine.id],
        cooperativeId: routine.cooperativeId,
        cooperativeName: routine.cooperativeName,
        clientId: routine.clientId,
        clientName: routine.clientName,
        collectionPointId: routine.collectionPointId,
        collectionPointName: routine.collectionPointName,
        collectionPointAddress: routine.collectionPointAddress,
        days: routine.dayOfWeek ? [routine.dayOfWeek] : [],
        created_at: routine.created_at,
        updated_at: routine.updated_at || routine.created_at,
      });
      return;
    }

    existing.ids.push(routine.id);
    if (routine.dayOfWeek && !existing.days.includes(routine.dayOfWeek)) {
      existing.days.push(routine.dayOfWeek);
    }

    if (routine.created_at && (!existing.created_at || routine.created_at < existing.created_at)) {
      existing.created_at = routine.created_at;
    }
    const candidateUpdated = routine.updated_at || routine.created_at;
    if (candidateUpdated && (!existing.updated_at || candidateUpdated > existing.updated_at)) {
      existing.updated_at = candidateUpdated;
    }
  });

  return Array.from(map.values()).map((group) => ({
    ...group,
    days: [...group.days].sort((a, b) => getWeekDayMeta(a).order - getWeekDayMeta(b).order),
  }));
}

/**
 * Agrupa rotinas já consolidadas por Cooperativa para a visão "Por Cooperativa".
 *
 * @param {Array<Object>} groupedRoutines
 * @returns {Array<{ cooperativeId: string, cooperativeName: string, items: Array<Object>, totalWeeklyCollections: number }>}
 */
export function groupRoutinesByCooperative(groupedRoutines = []) {
  const map = new Map();

  groupedRoutines.forEach((group) => {
    const key = group.cooperativeId;
    if (!map.has(key)) {
      map.set(key, {
        cooperativeId: group.cooperativeId,
        cooperativeName: group.cooperativeName,
        items: [],
        totalWeeklyCollections: 0,
      });
    }
    const entry = map.get(key);
    entry.items.push(group);
    entry.totalWeeklyCollections += group.days.length;
  });

  return Array.from(map.values()).sort((a, b) =>
    a.cooperativeName.localeCompare(b.cooperativeName, 'pt-BR')
  );
}

/**
 * Calcula a contagem de coletas por dia da semana para as abas da visão "Por Dia".
 *
 * @param {Array<Object>} groupedRoutines
 * @returns {Record<string, number>}
 */
export function countCollectionsByWeekDay(groupedRoutines = []) {
  const counts = {};
  WEEK_DAYS_LIST.forEach((d) => {
    counts[d.id] = 0;
  });

  groupedRoutines.forEach((group) => {
    group.days.forEach((dayId) => {
      if (counts[dayId] !== undefined) {
        counts[dayId] += 1;
      }
    });
  });

  return counts;
}
