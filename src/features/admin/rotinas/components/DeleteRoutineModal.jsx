import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/shared/ui/Button.jsx';
import { buildRoutineDeleteMessage } from '@/domain/formatters/routineFormatters.js';

/**
 * Modal de confirmação de exclusão de Rotina de Coleta.
 * Reutiliza o mesmo padrão visual dos demais modais de exclusão do painel.
 */
export function DeleteRoutineModal({ routine, onClose, onConfirm }) {
  if (!routine) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-routine-title"
    >
      <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-yby-border shadow-popup space-y-4">
        <div className="flex items-start gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-red-50 text-yby-danger flex items-center justify-center flex-shrink-0">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <h3 id="delete-routine-title" className="font-extrabold text-lg text-yby-heading">
              Excluir rotina de coleta?
            </h3>
            <p className="text-xs sm:text-sm text-yby-muted mt-1 leading-relaxed">
              {buildRoutineDeleteMessage(routine)}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-yby-border/60">
          <Button type="button" variant="outline" onClick={onClose} autoFocus>
            Cancelar
          </Button>
          <Button type="button" variant="danger" onClick={onConfirm}>
            Sim, excluir
          </Button>
        </div>
      </div>
    </div>
  );
}
