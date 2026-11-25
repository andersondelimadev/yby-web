import React from 'react';
import { Pencil, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/shared/ui/Button.jsx';
import { WeekDayRuler } from './WeekDayRuler.jsx';
import { formatRoutineDate } from '@/domain/formatters/routineFormatters.js';

/**
 * Tabela paginada Desktop enxuta (4 colunas) para listagem consolidada de Rotinas de Coleta.
 * Segue a hierarquia visual: Onde (Ponto + Cliente) -> Quem (Cooperativa) -> Quando (Régua semanal) -> Ações.
 */
export function RoutineTable({
  routines = [],
  totalItems = 0,
  totalWeeklyCollections = 0,
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
            <tr className="bg-yby-surface/60 border-b border-yby-border text-[11px] font-bold text-yby-muted uppercase tracking-wider">
              <th className="py-3.5 pl-5 pr-3">Ponto de Coleta e Cliente</th>
              <th className="py-3.5 px-3 whitespace-nowrap">Cooperativa</th>
              <th className="py-3.5 px-3 whitespace-nowrap">Dias da Semana</th>
              <th className="py-3.5 pl-3 pr-5 text-center w-24">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-yby-border/60 text-sm">
            {routines.map((routine, index) => {
              const isEven = index % 2 === 1;
              const updatedLabel = formatRoutineDate(routine.updated_at || routine.created_at);

              return (
                <tr
                  key={routine.groupKey || routine.id}
                  className={`transition-colors duration-150 ${
                    isEven ? 'bg-yby-zebra hover:bg-yby-tint/40' : 'bg-white hover:bg-yby-tint/40'
                  }`}
                >
                  {/* Ponto de Coleta + Cliente + Endereço resumido */}
                  <td className="py-3.5 pl-5 pr-3">
                    <p className="font-bold text-xs sm:text-sm text-yby-heading leading-tight">
                      {routine.collectionPointName}
                    </p>
                    <p className="text-xs text-yby-muted mt-0.5 leading-snug">
                      {routine.clientName} · {routine.collectionPointAddress}
                    </p>
                  </td>

                  {/* Cooperativa */}
                  <td className="py-3.5 px-3 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-yby-tint text-yby-primary text-xs font-semibold">
                      {routine.cooperativeName}
                    </span>
                  </td>

                  {/* Mini Régua Semanal (D S T Q Q S S) */}
                  <td className="py-3.5 px-3 whitespace-nowrap">
                    <WeekDayRuler days={routine.days} />
                  </td>

                  {/* Ações */}
                  <td className="py-3.5 pl-3 pr-5 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => onEdit(routine)}
                        className="p-1.5 rounded-lg text-yby-muted hover:text-yby-heading hover:bg-white transition-all duration-150 hover:scale-110 active:scale-95 shadow-sm cursor-pointer"
                        title={`Editar rotina (Atualizado em ${updatedLabel})`}
                        aria-label={`Editar rotina ${routine.collectionPointName}`}
                      >
                        <Pencil className="w-4 h-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => onDelete(routine)}
                        className="p-1.5 rounded-lg text-yby-danger/80 hover:text-yby-danger hover:bg-red-50 transition-all duration-150 hover:scale-110 active:scale-95 shadow-sm cursor-pointer"
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

      {/* Rodapé com Contadores e Paginação */}
      <div className="p-4 bg-white border-t border-yby-border flex flex-col sm:flex-row items-center justify-between gap-4">
        <span className="text-xs text-yby-muted">
          Mostrando {routines.length} de {totalItems} pontos com rotina ativa (
          {totalWeeklyCollections} {totalWeeklyCollections === 1 ? 'coleta semanal' : 'coletas semanais'})
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
