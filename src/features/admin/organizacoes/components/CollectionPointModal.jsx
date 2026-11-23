import React from 'react';
import { X, MapPin } from 'lucide-react';
import { CollectionPointForm } from './CollectionPointForm.jsx';

/**
 * Modal dedicado para cadastro e edição de Pontos de Coleta.
 * Mantém a interface focada e limpa, evitando sobrecarga de informações
 * da organização durante o preenchimento do ponto.
 */
export function CollectionPointModal({
  organization = null,
  organizations = [],
  point = null,
  saving = false,
  onClose,
  onSave,
}) {
  const isEditing = Boolean(point);
  const showOrganizationSelect = !organization;

  const handleFormSave = (formData, selectedOrgId) => {
    const targetOrgId = organization ? organization.id : selectedOrgId;
    onSave(targetOrgId, formData);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/45 backdrop-blur-sm animate-in fade-in duration-150"
      role="dialog"
      aria-modal="true"
      aria-labelledby="collection-point-modal-title"
    >
      <div className="bg-white rounded-2xl max-w-2xl w-full p-5 sm:p-6 border border-yby-border shadow-popup relative max-h-[90vh] overflow-y-auto">
        {/* Cabeçalho do Modal */}
        <div className="flex items-center justify-between border-b border-yby-border/60 pb-3 mb-5">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-yby-tint text-yby-primary flex items-center justify-center shrink-0">
              <MapPin className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h3
                id="collection-point-modal-title"
                className="font-extrabold text-lg text-yby-heading leading-tight"
              >
                {isEditing ? 'Editar Ponto de Coleta' : 'Novo Ponto de Coleta'}
              </h3>
              <p className="text-xs text-yby-muted truncate">
                {organization
                  ? `Vinculado a ${organization.name}`
                  : 'Selecione a organização e preencha os dados de localização'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-yby-muted hover:text-yby-heading hover:bg-yby-surface transition-colors shrink-0"
            aria-label="Fechar modal de ponto de coleta"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Formulário Limpo e Focado */}
        <CollectionPointForm
          point={point}
          organizations={organizations}
          showOrganizationSelect={showOrganizationSelect}
          initialOrganizationId={organization?.id || ''}
          saving={saving}
          onCancel={onClose}
          onSave={handleFormSave}
        />
      </div>
    </div>
  );
}
