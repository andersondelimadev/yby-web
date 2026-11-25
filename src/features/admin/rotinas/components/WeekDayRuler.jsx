import React from 'react';
import { WEEK_DAYS_LIST, getWeekDayMeta } from '@/domain/constants/weekDays.js';

/**
 * Mini régua semanal (D S T Q Q S S) destacando os dias ativos de coleta.
 * Componente puramente visual de alta coesão (SRP).
 */
export function WeekDayRuler({ days = [] }) {
  const activeLabels = days.map((id) => getWeekDayMeta(id).label).join(', ');

  return (
    <div
      className="inline-flex items-center gap-1"
      title={activeLabels ? `Dias ativos: ${activeLabels}` : 'Sem dias ativos'}
      aria-label={activeLabels ? `Dias de coleta: ${activeLabels}` : 'Sem dias de coleta'}
    >
      {WEEK_DAYS_LIST.map((day) => {
        const isActive = days.includes(day.id);
        return (
          <span
            key={day.id}
            title={day.label}
            className={`w-7 h-7 rounded-lg text-[11px] font-bold inline-flex items-center justify-center transition-colors select-none ${
              isActive
                ? 'bg-yby-primary text-white shadow-sm'
                : 'bg-yby-surface text-yby-muted/55'
            }`}
          >
            {day.tinyLabel}
          </span>
        );
      })}
    </div>
  );
}
