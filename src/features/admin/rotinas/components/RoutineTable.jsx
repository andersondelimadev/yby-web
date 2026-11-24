import React from 'react';
import { Pencil, Trash2, Truck, Building2, MapPin, ChevronLeft, ChevronRight } from 'lucide-react';
import { Badge } from '@/shared/ui/Badge.jsx';
import { Button } from '@/shared/ui/Button.jsx';
import { getWeekDayMeta } from '@/domain/constants/weekDays.js';
import { formatRoutineDate } from '@/domain/formatters/routineFormatters.js';

/**
 * Tabela paginada Desktop para listagem de Rotinas de Coleta.
 */
export function RoutineTable({
  routines = [],
  totalItems = 0,
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  onEdit,
  onDelete,
}) {
  return (
    <div className="bg-white rounded-2xl border border-yby-border overflow-hidden shadow-card transition-all duration-300 ease-out hover:shadow-card-elevated hover:border-yby-primary/30 cursor-default">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-yby-surface/60 border-b border-yby-border text-xs font-bold text-yby-muted uppercase tracking-wider">
              <th className="py-3.5 pl-5 pr-3 min-w-[140px]">Cooperativa</th>
              <th className="py-3.5 px-3 min-w-[165px]">Cliente</th>
              <th className="py-3.5 px-3 min-w-[210px]">Ponto de Coleta</th>
              <th className="py-3.5 px-3 min-w-[120px] whitespace-nowrap">Dia da Semana</th>
              <th className="py-3.5 px-3 min-w-[125px] whitespace-nowrap">Atualizado em</th>
              <th className="py-3.5 pl-3 pr-5 text-center min-w-[88px]">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-yby-border/60 text-sm">
            {routines.map((routine, index) => {
              const isEven = index % 2 === 1;
              const dayMeta = getWeekDayMeta(routine.dayOfWeek);

              return (
                <tr
                  key={routine.id}
                  className={`transition-colors duration-150 ${
                    isEven ? 'bg-yby-zebra hover:bg-yby-tint/40' : 'bg-white hover:bg-yby-tint/40'
                  }`}
                >
                  {/* Cooperativa */}
                  <td className="py-3.5 pl-5 pr-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-emerald-50 text-yby-teal flex items-center justify-center shrink-0">
                        <Truck className="w-4 h-4" />
                      </div>
                      <span className="font-bold text-yby-heading text-xs sm:text-sm">
                        {routine.cooperativeName}
                      </span>
                    </div>
                  </td>

                  {/* Cliente */}
                  <td className="py-3.5 px-3">
                    <div className="flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-yby-muted shrink-0" />
                      <span className="font-semibold text-xs text-yby-heading">
                        {routine.clientName}
                      </span>
                    </div>
                  </td>

                  {/* Ponto de Coleta + Endereço Resumido */}
                  <td className="py-3.5 px-3">
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-yby-primary shrink-0 mt-0.5" />
                      <div className="min-w-0">
                        <p className="font-bold text-xs text-yby-heading leading-tight">
                          {routine.collectionPointName}
                        </p>
                        <span className="text-[11px] text-yby-muted block mt-0.5 leading-snug">
                          {routine.collectionPointAddress}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Dia da Semana */}
                  <td className="py-3.5 px-3 whitespace-nowrap">
                    <Badge variant={dayMeta.badgeVariant} className="whitespace-nowrap">
                      {dayMeta.label}
                    </Badge>
                  </td>

                  {/* Registro (Atualizado em + tooltip com Criado em) */}
                  <td
                    className="py-3.5 px-3 text-xs text-yby-muted whitespace-nowrap"
                    title={`Criado em: ${formatRoutineDate(routine.created_at)}`}
                  >
                    {formatRoutineDate(routine.updated_at || routine.created_at)}
                  </td>

                  {/* Ações */}
                  <td className="py-3.5 pl-3 pr-5 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => onEdit(routine)}
                        className="p-1.5 rounded-lg text-yby-muted hover:text-yby-heading hover:bg-white transition-all duration-150 hover:scale-110 active:scale-95 shadow-sm"
                        title="Editar rotina"
                        aria-label={`Editar rotina ${routine.collectionPointName}`}
                      >
                        <Pencil className="w-4 h-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => onDelete(routine)}
                        className="p-1.5 rounded-lg text-yby-danger/80 hover:text-yby-danger hover:bg-red-50 transition-all duration-150 hover:scale-110 active:scale-95 shadow-sm"
                        title="Excluir rotina"
                        aria-label={`Excluir rotina ${routine.collectionPointName}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Rodapé com Paginação */}
      <div className="p-4 bg-white border-t border-yby-border flex flex-col sm:flex-row items-center justify-between gap-4">
        <span className="text-xs text-yby-muted">
          Mostrando {routines.length} de {totalItems} rotinas de coleta
        </span>

        {totalPages > 1 && (
          <div className="flex items-center gap-1.5">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === 1}
              onClick={() => onPageChange(currentPage - 1)}
              className="p-1.5 min-h-[32px]"
              aria-label="Página anterior"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>

            <span className="text-xs font-semibold px-2 text-yby-heading">
              Página {currentPage} de {totalPages}
            </span>

            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === totalPages}
              onClick={() => onPageChange(currentPage + 1)}
              className="p-1.5 min-h-[32px]"
              aria-label="Próxima página"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
