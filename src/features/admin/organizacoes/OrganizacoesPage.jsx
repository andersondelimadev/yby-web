import React from 'react';
import { Plus, Building2 } from 'lucide-react';
import { useOrganizacoesController } from './hooks/useOrganizacoesController.js';
import { PageHeader } from '@/shared/layout/PageHeader.jsx';
import { Button } from '@/shared/ui/Button.jsx';
import { EmptyState } from '@/shared/ui/EmptyState.jsx';
import { OrganizacoesSkeleton } from '@/shared/ui/skeletons/OrganizacoesSkeleton.jsx';
import { OrganizationFilterBar } from './components/OrganizationFilterBar.jsx';
import { OrganizationTable } from './components/OrganizationTable.jsx';
import { OrganizationMobileCard } from './components/OrganizationMobileCard.jsx';
import { OrganizationModal } from './components/OrganizationModal.jsx';
import { OrganizationShowModal } from './components/OrganizationShowModal.jsx';
import { DeleteOrganizationModal } from './components/DeleteOrganizationModal.jsx';

export function OrganizacoesPage() {
  const {
    organizations,
    totalItems,
    totalPages,
    currentPage,
    setCurrentPage,
    loading,
    saving,
    filters,
    modals,
    actions,
  } = useOrganizacoesController();

  if (loading && !organizations?.length) {
    return <OrganizacoesSkeleton />;
  }

  return (
    <div className="space-y-6">
      {/* Header com Ação de Adicionar Organização */}
      <PageHeader
        title="Organizações"
        subtitle="Gerencie clientes e cooperativas conveniadas à plataforma Yby Impacta"
        actions={
          <Button
            variant="primary"
            size="md"
            onClick={() => modals.setIsCreating(true)}
            className="w-full sm:w-auto"
          >
            <Plus className="w-4 h-4 mr-2" />
            Adicionar organização
          </Button>
        }
      />

      {/* Barra de Filtros */}
      <OrganizationFilterBar filters={filters} />

      {/* Conteúdo Principal */}
      {organizations.length === 0 ? (
        <div className="bg-white rounded-2xl border border-yby-border p-8 shadow-card">
          <EmptyState
            icon={<Building2 className="w-6 h-6 stroke-[2.5]" />}
            title="Nenhuma organização encontrada"
            description="Tente ajustar os filtros de busca, tipo ou status para visualizar os registros."
            action={
              <Button variant="outline" size="sm" onClick={filters.handleClearFilters}>
                Limpar filtros de busca
              </Button>
            }
          />
        </div>
      ) : (
        <>
          {/* Visualização Desktop (Tabela Completa) */}
          <div className="hidden md:block">
            <OrganizationTable
              organizations={organizations}
              totalItems={totalItems}
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              onShow={(org) => modals.setViewingOrg(org)}
              onEdit={(org) => modals.setEditingOrg(org)}
              onDelete={(org) => modals.setDeletingOrg(org)}
              onToggleStatus={actions.handleToggleStatus}
            />
          </div>

          {/* Visualização Mobile (Cards Individuais) */}
          <div className="md:hidden space-y-3">
            {organizations.map((org) => (
              <OrganizationMobileCard
                key={org.id}
                org={org}
                onShow={(o) => modals.setViewingOrg(o)}
                onEdit={(o) => modals.setEditingOrg(o)}
                onDelete={(o) => modals.setDeletingOrg(o)}
                onToggleStatus={actions.handleToggleStatus}
              />
            ))}

            {/* Paginação Mobile */}
            {totalPages > 1 && (
              <div className="pt-2 flex items-center justify-between text-xs text-yby-muted">
                <span>
                  Página {currentPage} de {totalPages} ({totalItems} total)
                </span>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(currentPage - 1)}
                  >
                    Anterior
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(currentPage + 1)}
                  >
                    Próxima
                  </Button>
                </div>
              </div>
            )}
          </div>
        </>
      )}

      {/* Modais de Cadastro/Edição e Exclusão */}
      {(modals.isCreating || modals.editingOrg) && (
        <OrganizationModal
          organization={modals.editingOrg}
          saving={saving}
          onClose={() => {
            modals.setIsCreating(false);
            modals.setEditingOrg(null);
          }}
          onSave={actions.handleSave}
        />
      )}

      {modals.deletingOrg && (
        <DeleteOrganizationModal
          organization={modals.deletingOrg}
          onClose={() => modals.setDeletingOrg(null)}
          onConfirm={actions.handleDelete}
        />
      )}

      {modals.viewingOrg && !modals.editingOrg && !modals.deletingOrg && !modals.isCreating && (
        <OrganizationShowModal
          organization={modals.viewingOrg}
          saving={saving}
          onClose={() => modals.setViewingOrg(null)}
          onEdit={(org) => modals.setEditingOrg(org)}
          onDelete={(org) => modals.setDeletingOrg(org)}
          onAddCollectionPoint={actions.handleAddCollectionPoint}
          onUpdateCollectionPoint={actions.handleUpdateCollectionPoint}
          onDeleteCollectionPoint={actions.handleDeleteCollectionPoint}
        />
      )}
    </div>
  );
}
