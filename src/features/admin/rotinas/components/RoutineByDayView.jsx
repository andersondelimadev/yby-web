import React from 'react';
import { Pencil, Trash2, Calendar } from 'lucide-react';
import { WEEK_DAYS_LIST, getWeekDayMeta } from '@/domain/constants/weekDays.js';
import { formatRoutineDate } from '@/domain/formatters/routineFormatters.js';

/**
 * Visão "Por Dia da Semana" para Rotinas de Coleta.
 * Permite inspecionar rapidamente a carga de coletas agendadas em cada dia (Dom a Sáb).
 */
export function RoutineByDayView({
  groupedRoutines = [],
  dayCounts = {},
  selectedDayTab,
  onSelectDayTab,
  onEdit,
  onDelete,
}) {
  const dayRoutines = groupedRoutines.filter((r) => r.days.includes(selectedDayTab));
  const activeDayMeta = getWeekDayMeta(selectedDayTab);

  return (
    <div className="space-y-4">
      {/* Seletor dos 7 dias da semana com contadores */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
        {WEEK_DAYS_LIST.map((day) => {
          const count = dayCounts[day.id] || 0;
          const isActive = day.id === selectedDayTab;
          return (
            <button
              key={day.id}
              type="button"
              aria-pressed={isActive}
              onClick={() => onSelectDayTab(day.id)}
              className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                isActive
                  ? 'bg-yby-primary text-white border-yby-primary shadow-sm'
                  : 'bg-white text-yby-heading border-yby-border hover:border-yby-primary hover:bg-yby-tint/30'
              }`}
            >
              <div className="text-xs font-bold">{day.shortLabel}</div>
              <div
                className={`text-[11px] mt-0.5 ${
                  isActive ? 'text-white/85' : 'text-yby-muted'
                }`}
              >
                {count} {count === 1 ? 'coleta' : 'coletas'}
              </div>
            </button>
          );
        })}
      </div>

      {/* Lista de pontos agendados no dia selecionado */}
      <div className="bg-white rounded-2xl border border-yby-border overflow-hidden shadow-card">
        <div className="px-5 py-3.5 bg-yby-surface/70 border-b border-yby-border flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-yby-primary" />
            <h3 className="text-sm font-bold text-yby-heading">
              Coletas de {activeDayMeta.label}
            </h3>
          </div>
          <span className="text-xs font-medium text-yby-muted">
            {dayRoutines.length}{' '}
            {dayRoutines.length === 1 ? 'ponto agendado' : 'pontos agendados'}
          </span>
        </div>

        {dayRoutines.length === 0 ? (
          <div className="p-8 text-center text-xs text-yby-muted">
            Nenhuma coleta agendada para {activeDayMeta.label}.
          </div>
        ) : (
          <div className="divide-y divide-yby-border/60">
            {dayRoutines.map((routine) => (
              <div
                key={`${routine.groupKey}-${selectedDayTab}`}
                className="px-5 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-yby-tint/30 transition-colors"
              >
                <div className="min-w-0">
                  <p className="font-bold text-xs sm:text-sm text-yby-heading leading-tight">
                    {routine.collectionPointName}
                  </p>
                  <p className="text-xs text-yby-muted mt-0.5 leading-snug">
                    {routine.clientName} · {routine.collectionPointAddress}
                  </p>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-yby-tint text-yby-primary text-xs font-semibold">
                    {routine.cooperativeName}
                  </span>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => onEdit(routine)}
                      className="p-1.5 rounded-lg text-yby-muted hover:text-yby-heading hover:bg-white transition-all shadow-sm"
                      title={`Editar rotina (Atualizado em ${formatRoutineDate(routine.updated_at)})`}
                      aria-label={`Editar rotina ${routine.collectionPointName}`}
                    >
                      <Pencil className="w-4 h-4" />
                    </button>

                    <button
                      type="button"
                      onClick={() => onDelete(routine)}
                      className="p-1.5 rounded-lg text-yby-danger/80 hover:text-yby-danger hover:bg-red-50 transition-all shadow-sm"
                      title="Excluir rotina"
                      aria-label={`Excluir rotina ${routine.collectionPointName}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
