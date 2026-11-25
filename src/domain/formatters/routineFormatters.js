import { getWeekDayMeta } from '../constants/weekDays.js';

/**
 * Formata um endereço resumido para exibição compacta na listagem e nos selects.
 * @param {Object} [point]
 * @returns {string}
 */
export function formatPointShortAddress(point) {
  if (!point) return 'Endereço não informado';
  const streetPart = [point.address, point.number].filter(Boolean).join(', ');
  const locationPart = [point.neighborhood, point.city].filter(Boolean).join(' · ');
  if (streetPart && locationPart) return `${streetPart} — ${locationPart}`;
  return streetPart || locationPart || 'Endereço não informado';
}

/**
 * Formata data ISO de registro (created_at / updated_at) em padrão brasileiro.
 * @param {string} isoDate
 * @returns {string}
 */
export function formatRoutineDate(isoDate) {
  if (!isoDate) return '—';
  const parsed = new Date(isoDate);
  if (Number.isNaN(parsed.getTime())) return String(isoDate);

  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(parsed);
}

/**
 * Formata uma lista de dias da semana em texto legível em português.
 * @param {string[]} days
 * @returns {string}
 */
export function formatDaysList(days = []) {
  const labels = days.map((dayId) => getWeekDayMeta(dayId).label);
  if (labels.length === 0) return '';
  if (labels.length === 1) return labels[0];
  return `${labels.slice(0, -1).join(', ')} e ${labels[labels.length - 1]}`;
}

/**
 * Monta a mensagem padrão de confirmação de exclusão de rotina de coleta
 * (suporta rotina de 1 dia ou grupo de múltiplos dias no mesmo ponto).
 * @param {Object} routine
 * @returns {string}
 */
export function buildRoutineDeleteMessage(routine) {
  const coop = routine?.cooperativeName || 'Cooperativa';
  const point = routine?.collectionPointName || 'Ponto de coleta';
  const days =
    Array.isArray(routine?.days) && routine.days.length > 0
      ? routine.days
      : routine?.dayOfWeek
      ? [routine.dayOfWeek]
      : [];

  if (days.length > 1) {
    return `A coleta da cooperativa "${coop}" no ponto "${point}" nos dias ${formatDaysList(days)} será removida permanentemente.`;
  }

  const dayLabel = getWeekDayMeta(days[0]).label;
  return `A coleta da cooperativa "${coop}" no ponto "${point}" às ${dayLabel} será removida permanentemente.`;
}
