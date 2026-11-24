import React from 'react';
import { Pencil, Trash2, Truck, Building2, MapPin, Clock } from 'lucide-react';
import { Badge } from '@/shared/ui/Badge.jsx';
import { Button } from '@/shared/ui/Button.jsx';
import { getWeekDayMeta } from '@/domain/constants/weekDays.js';
import { formatRoutineDate } from '@/domain/formatters/routineFormatters.js';

/**
 * Card responsivo Mobile para exibição de uma Rotina de Coleta.
 */
export function RoutineMobileCard({ routine, onEdit, onDelete }) {
  const dayMeta = getWeekDayMeta(routine.dayOfWeek);

  return (
    <div className="bg-white rounded-2xl border border-yby-border p-4 shadow-card space-y-3 transition-all duration-300 hover:shadow-card-elevated hover:border-yby-primary/30">
      {/* Cabeçalho: Cooperativa + Badge Dia da Semana */}
      <div className="flex items-start justify-between gap-3 border-b border-yby-border/60 pb-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-emerald-50 text-yby-teal flex items-center justify-center shrink-0">
            <Truck className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <span className="text-[10px] font-bold uppercase tracking-wider text-yby-muted block">
              Cooperativa
            </span>
            <h3 className="font-bold text-sm text-yby-heading truncate">
              {routine.cooperativeName}
            </h3>
          </div>
        </div>

        <Badge variant={dayMeta.badgeVariant}>{dayMeta.label}</Badge>
      </div>

      {/* Cliente e Ponto de Coleta */}
      <div className="space-y-2 text-xs">
        <div className="flex items-center gap-2 text-yby-heading">
          <Building2 className="w-3.5 h-3.5 text-yby-muted shrink-0" />
          <span className="font-semibold">{routine.clientName}</span>
        </div>

        <div className="flex items-start gap-2 bg-yby-surface/50 p-2.5 rounded-xl border border-yby-border/60">
          <MapPin className="w-3.5 h-3.5 text-yby-primary shrink-0 mt-0.5" />
          <div className="min-w-0">
            <p className="font-bold text-yby-heading leading-tight">
              {routine.collectionPointName}
            </p>
            <p className="text-[11px] text-yby-muted mt-0.5 leading-snug">
              {routine.collectionPointAddress}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-[11px] text-yby-muted pt-0.5">
          <Clock className="w-3 h-3 shrink-0" />
          <span>Atualizado em {formatRoutineDate(routine.updated_at || routine.created_at)}</span>
        </div>
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
