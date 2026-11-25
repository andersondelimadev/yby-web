import React from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/shared/ui/Button.jsx';
import { WeekDayRuler } from './WeekDayRuler.jsx';

/**
 * Card responsivo Mobile para exibição de uma Rotina de Coleta consolidada.
 */
export function RoutineMobileCard({ routine, onEdit, onDelete }) {
  return (
    <div className="bg-white rounded-2xl border border-yby-border p-4 shadow-card space-y-3 transition-all duration-300 hover:shadow-card-elevated hover:border-yby-primary/30">
      {/* Ponto de Coleta + Cliente + Cooperativa */}
      <div className="flex items-start justify-between gap-3 border-b border-yby-border/60 pb-3">
        <div className="min-w-0">
          <h3 className="font-bold text-sm text-yby-heading leading-tight">
            {routine.collectionPointName}
          </h3>
          <p className="text-xs text-yby-muted mt-0.5 leading-snug">
            {routine.clientName} · {routine.collectionPointAddress}
          </p>
        </div>

        <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-yby-tint text-yby-primary text-xs font-semibold shrink-0">
          {routine.cooperativeName}
        </span>
      </div>

      {/* Dias da semana */}
      <div className="flex items-center justify-between gap-2">
        <span className="text-[11px] font-semibold text-yby-muted">Dias de coleta:</span>
        <WeekDayRuler days={routine.days} />
      </div>

      {/* Ações Mobile (>= 44px tap targets) */}
      <div className="flex items-center gap-2 pt-2 border-t border-yby-border/60">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onEdit(routine)}
          className="flex-1 min-h-[44px]"
          aria-label={`Editar rotina ${routine.collectionPointName}`}
        >
          <Pencil className="w-4 h-4 mr-1.5" />
          Editar
        </Button>

        <Button
          variant="danger-outline"
          size="sm"
          onClick={() => onDelete(routine)}
          className="flex-1 min-h-[44px]"
          aria-label={`Excluir rotina ${routine.collectionPointName}`}
        >
          <Trash2 className="w-4 h-4 mr-1.5" />
          Excluir
        </Button>
      </div>
    </div>
  );
}
