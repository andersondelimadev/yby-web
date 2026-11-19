import React from 'react';
import { X, Building2, Truck, Sprout, Pencil, Trash2, Calendar } from 'lucide-react';
import { Badge } from '@/shared/ui/Badge.jsx';
import { Button } from '@/shared/ui/Button.jsx';
import { ORGANIZATION_TYPES } from '@/domain/constants/organizationTypes.js';
import { CollectionPointsSection } from './CollectionPointsSection.jsx';

function formatCreatedAt(dateValue) {
  if (!dateValue) return 'Não informado';
  const parsed = new Date(dateValue);
  if (Number.isNaN(parsed.getTime())) return String(dateValue);

  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(parsed);
}

/**
 * Modal Show da Organização.
 * Apresenta nome, CNPJ, tipo e data de criação, botões de Editar e Excluir
 * da organização, além da listagem e gerenciamento de Pontos de Coleta.
 */
export function OrganizationShowModal({
  organization,
  saving = false,
  onClose,
  onEdit,
  onDelete,
  onAddCollectionPoint,
  onUpdateCollectionPoint,
  onDeleteCollectionPoint,
}) {
  if (!organization) return null;

  const isYby = organization.type === ORGANIZATION_TYPES.YBY;
  const isCooperativa = organization.type === ORGANIZATION_TYPES.COOPERATIVA;
  const typeBadgeVariant = isYby ? 'green' : isCooperativa ? 'teal' : 'beige';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-150"
      role="dialog"
      aria-modal="true"
      aria-labelledby="org-show-modal-title"
    >
      <div className="bg-yby-cream rounded-2xl w-full max-w-3xl shadow-2xl border border-yby-border overflow-hidden max-h-[90vh] flex flex-col">
        {/* Cabeçalho Fixo */}
        <div className="bg-white p-4 sm:p-6 border-b border-yby-border flex items-start justify-between gap-4 shrink-0">
          <div className="flex items-start gap-3 min-w-0">
            <div
              className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
                isYby
                  ? 'bg-yby-tint text-yby-primary'
                  : isCooperativa
                  ? 'bg-emerald-50 text-yby-teal'
                  : 'bg-yby-surface text-yby-heading'
              }`}
            >
              {isYby ? (
                <Sprout className="w-5 h-5" />
              ) : isCooperativa ? (
                <Truck className="w-5 h-5" />
              ) : (
                <Building2 className="w-5 h-5" />
              )}
            </div>

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h3
                  id="org-show-modal-title"
                  className="text-lg font-extrabold text-yby-heading leading-tight break-words"
                >
                  {organization.name}
                </h3>
                <Badge variant={typeBadgeVariant}>{organization.type}</Badge>
              </div>
              <p className="text-xs text-yby-muted mt-1">
                Detalhes da organização e pontos de coleta vinculados
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-yby-muted hover:text-yby-heading hover:bg-yby-surface transition-colors shrink-0"
            aria-label="Fechar detalhes da organização"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Corpo Rolável */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6">
          {/* Card de Informações da Organização + Botões Editar e Excluir */}
          <div className="bg-white rounded-2xl border border-yby-border p-4 sm:p-5 space-y-4 shadow-sm">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-yby-muted block">
                  Nome da Organização
                </span>
                <p className="text-sm font-bold text-yby-heading mt-1 break-words">
                  {organization.name}
                </p>
              </div>

              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-yby-muted block">
                  CNPJ
                </span>
                <p className="text-sm font-mono font-bold text-yby-heading mt-1">
                  {organization.cnpj || 'Não informado'}
                </p>
              </div>

              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-yby-muted block">
                  Tipo de Organização
                </span>
                <div className="mt-1">
                  <Badge variant={typeBadgeVariant}>{organization.type}</Badge>
                </div>
              </div>

              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-yby-muted block">
                  Criado em
                </span>
                <p className="text-xs font-semibold text-yby-heading mt-1.5 inline-flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-yby-muted shrink-0" />
                  <span>{formatCreatedAt(organization.created_at)}</span>
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-end gap-2.5 pt-3 border-t border-yby-border/60">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => onEdit(organization)}
              >
                <Pencil className="w-4 h-4 mr-1.5" />
                Editar
              </Button>

              <Button
                type="button"
                variant="danger-outline"
                size="sm"
                onClick={() => onDelete(organization)}
              >
                <Trash2 className="w-4 h-4 mr-1.5" />
                Excluir
              </Button>
            </div>
          </div>

          {/* Seção de Pontos de Coleta */}
          <CollectionPointsSection
            organizationId={organization.id}
            points={organization.collectionPoints || []}
            saving={saving}
            onAddPoint={onAddCollectionPoint}
            onUpdatePoint={onUpdateCollectionPoint}
            onDeletePoint={onDeleteCollectionPoint}
          />
        </div>
      </div>
    </div>
  );
}
