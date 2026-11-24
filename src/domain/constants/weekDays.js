/**
 * Constantes canônicas dos 7 dias da semana para Rotinas de Coleta.
 * Segue o padrão Information Expert (GRASP), centralizando ordem,
 * rótulos completos, siglas e variantes visuais.
 */
export const WEEK_DAYS = {
  DOMINGO: {
    id: 'domingo',
    label: 'Domingo',
    shortLabel: 'Dom',
    order: 0,
    badgeVariant: 'beige',
  },
  SEGUNDA: {
    id: 'segunda',
    label: 'Segunda-feira',
    shortLabel: 'Seg',
    order: 1,
    badgeVariant: 'green',
  },
  TERCA: {
    id: 'terca',
    label: 'Terça-feira',
    shortLabel: 'Ter',
    order: 2,
    badgeVariant: 'teal',
  },
  QUARTA: {
    id: 'quarta',
    label: 'Quarta-feira',
    shortLabel: 'Qua',
    order: 3,
    badgeVariant: 'blue',
  },
  QUINTA: {
    id: 'quinta',
    label: 'Quinta-feira',
    shortLabel: 'Qui',
    order: 4,
    badgeVariant: 'green',
  },
  SEXTA: {
    id: 'sexta',
    label: 'Sexta-feira',
    shortLabel: 'Sex',
    order: 5,
    badgeVariant: 'orange',
  },
  SABADO: {
    id: 'sabado',
    label: 'Sábado',
    shortLabel: 'Sáb',
    order: 6,
    badgeVariant: 'beige',
  },
};

export const WEEK_DAYS_LIST = Object.values(WEEK_DAYS).sort((a, b) => a.order - b.order);

/**
 * Retorna os metadados de um dia da semana pelo identificador ou rótulo.
 * @param {string} dayId
 * @returns {typeof WEEK_DAYS.SEGUNDA}
 */
export function getWeekDayMeta(dayId) {
  const normalized = String(dayId || '').trim().toLowerCase();
  const found = WEEK_DAYS_LIST.find(
    (d) =>
      d.id === normalized ||
      d.label.toLowerCase() === normalized ||
      d.shortLabel.toLowerCase() === normalized
  );
  return found || WEEK_DAYS.SEGUNDA;
}
