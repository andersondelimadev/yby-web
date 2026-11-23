import React, { useState } from 'react';
import { MapPin, Plus, Pencil, Trash2, AlertTriangle } from 'lucide-react';
import { Badge } from '@/shared/ui/Badge.jsx';
import { Button } from '@/shared/ui/Button.jsx';

/**
 * Seção de listagem e ações de Pontos de Coleta dentro do Modal Show da Organização.
 * Delega a abertura do formulário de criação/edição ao modal dedicado.
 */
export function CollectionPointsSection({
  organizationId,
  points = [],
  saving = false,
  onRequestAddPoint,
  onRequestEditPoint,
  onDeletePoint,
}) {
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  const handleConfirmDelete = async (pointId) => {
    await onDeletePoint(organizationId, pointId);
    setConfirmDeleteId(null);
  };

  return (
    <div className="space-y-4">
      {/* Cabeçalho da Seção de Pontos de Coleta */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-yby-primary shrink-0" />
          <h4 className="text-sm font-extrabold text-yby-heading">Pontos de Coleta</h4>
          <Badge variant="gray">{points.length}</Badge>
        </div>

        <Button
          type="button"
          variant="primary"
          size="sm"
          onClick={() => onRequestAddPoint?.()}
          className="w-full sm:w-auto"
        >
          <Plus className="w-4 h-4 mr-1.5" />
          Adicionar ponto de coleta
        </Button>
      </div>

      {/* Lista ou Estado Vazio */}
      {points.length === 0 ? (
        <div className="bg-yby-surface/50 rounded-2xl border border-dashed border-yby-border p-6 text-center space-y-2">
          <div className="w-10 h-10 rounded-xl bg-white border border-yby-border/70 flex items-center justify-center mx-auto text-yby-muted">
            <MapPin className="w-5 h-5" />
          </div>
          <p className="text-sm font-bold text-yby-heading">
            Nenhum ponto de coleta cadastrado
          </p>
          <p className="text-xs text-yby-muted max-w-sm mx-auto">
            Adicione um ponto de coleta para vincular endereços operacionais a esta organização.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {points.map((point) => {
            const isConfirming = confirmDeleteId === point.id;

            return (
              <div
                key={point.id}
                className={`rounded-xl border p-4 transition-all ${
                  point.active
                    ? 'bg-white border-yby-border hover:border-yby-primary/40'
                    : 'bg-gray-100/80 border-gray-300/80'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="min-w-0 space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-bold text-sm text-yby-heading">
                        {point.nickname}
                      </span>
                      <Badge variant={point.active ? 'green' : 'gray'}>
                        {point.active ? 'Ativo' : 'Inativo'}
                      </Badge>
                    </div>

                    <p className="text-xs text-yby-heading/90">
                      {point.address}, {point.number} — {point.neighborhood}
                    </p>

                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-yby-muted">
                      <span>
                        {point.city} - {point.state}
                      </span>
                      <span className="font-mono bg-yby-surface px-2 py-0.5 rounded border border-yby-border/70 text-[11px] font-semibold text-yby-heading">
                        CEP: {point.zip_code}
                      </span>
                    </div>
                  </div>

                  {/* Botões Editar e Excluir do Ponto */}
                  <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-start">
                    <button
                      type="button"
                      onClick={() => {
                        setConfirmDeleteId(null);
                        onRequestEditPoint?.(point);
                      }}
                      className="p-2 rounded-lg text-yby-muted hover:text-yby-heading hover:bg-yby-surface transition-colors"
                      title="Editar ponto de coleta"
                      aria-label={`Editar ponto ${point.nickname}`}
                    >
                      <Pencil className="w-4 h-4" />
                    </button>

                    <button
                      type="button"
                      onClick={() => setConfirmDeleteId(point.id)}
                      className="p-2 rounded-lg text-yby-danger/80 hover:text-yby-danger hover:bg-red-50 transition-colors"
                      title="Excluir ponto de coleta"
                      aria-label={`Excluir ponto ${point.nickname}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Confirmação Inline de Exclusão */}
                {isConfirming && (
                  <div className="mt-3 pt-3 border-t border-red-200/80 bg-red-50/70 -mx-4 -mb-4 px-4 py-3 rounded-b-xl flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2 text-xs font-semibold text-yby-danger">
                      <AlertTriangle className="w-4 h-4 shrink-0" />
                      <span>Deseja excluir o ponto "{point.nickname}"?</span>
                    </div>
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setConfirmDeleteId(null)}
                        disabled={saving}
                      >
                        Cancelar
                      </Button>
                      <Button
                        type="button"
                        variant="danger"
                        size="sm"
                        onClick={() => handleConfirmDelete(point.id)}
                        loading={saving}
                      >
                        Confirmar exclusão
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
