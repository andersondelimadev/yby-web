import React from 'react';
import { Pencil, Trash2, Truck } from 'lucide-react';
import { WeekDayRuler } from './WeekDayRuler.jsx';
import { formatRoutineDate } from '@/domain/formatters/routineFormatters.js';

/**
 * Visão agrupada "Por Cooperativa" para Rotinas de Coleta.
 * Exibe um card dedicado por cooperativa com contador de pontos e coletas semanais.
 */
export function RoutineByCoopView({ cooperativeGroups = [], onEdit, onDelete }) {
  return (
    <div className="space-y-4">
      {cooperativeGroups.map((group) => (
        <div
          key={group.cooperativeId}
          className="bg-white rounded-2xl border border-yby-border overflow-hidden shadow-card transition-all duration-200 hover:border-yby-primary/30"
        >
          {/* Cabeçalho da Cooperativa */}
          <div className="px-5 py-3.5 bg-yby-surface/70 border-b border-yby-border flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-yby-tint text-yby-primary flex items-center justify-center shrink-0">
                <Truck className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-yby-heading">{group.cooperativeName}</h3>
            </div>
            <span className="text-xs font-medium text-yby-muted">
              {group.items.length} {group.items.length === 1 ? 'ponto' : 'pontos'} ·{' '}
              {group.totalWeeklyCollections}{' '}
              {group.totalWeeklyCollections === 1 ? 'coleta/semana' : 'coletas/semana'}
            </span>
          </div>

          {/* Pontos atendidos pela cooperativa */}
          <div className="divide-y divide-yby-border/60">
            {group.items.map((routine) => (
              <div
                key={routine.groupKey}
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
                  <WeekDayRuler days={routine.days} />

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
        </div>
      ))}
    </div>
  );
}
