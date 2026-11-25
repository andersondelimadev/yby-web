import React from 'react';
import { Plus, CalendarClock, SearchX } from 'lucide-react';
import { useRotinasController } from './hooks/useRotinasController.js';
import { PageHeader } from '@/shared/layout/PageHeader.jsx';
import { Button } from '@/shared/ui/Button.jsx';
import { EmptyState } from '@/shared/ui/EmptyState.jsx';
import { RotinasSkeleton } from '@/shared/ui/skeletons/RotinasSkeleton.jsx';
import { RoutineFilterBar } from './components/RoutineFilterBar.jsx';
import { RoutineTable } from './components/RoutineTable.jsx';
import { RoutineMobileCard } from './components/RoutineMobileCard.jsx';
import { RoutineByCoopView } from './components/RoutineByCoopView.jsx';
import { RoutineByDayView } from './components/RoutineByDayView.jsx';
import { RoutineModal } from './components/RoutineModal.jsx';
import { DeleteRoutineModal } from './components/DeleteRoutineModal.jsx';

/**
 * Página administrativa de gestão de Rotinas de Coleta (/admin/rotinas).
 * Componente puramente visual; toda orquestração reside em useRotinasController.
 */
export function RotinasPage() {
  const {
    routines,
    groupedRoutines,
    cooperativeGroups,
    dayCounts,
    allRoutines,
    allFilteredCount,
    totalWeeklyCollections,
    totalRegistered,
    cooperatives,
    clientOrganizations,
    totalPages,
    currentPage,
    setCurrentPage,
    viewMode,
    setViewMode,
    selectedDayTab,
    setSelectedDayTab,
    initialLoading,
    isFetching,
    saving,
    filters,
    modals,
    actions,
  } = useRotinasController();

  if (initialLoading) {
    return <RotinasSkeleton />;
  }

  const isDatabaseEmpty = totalRegistered === 0;
  const isFilterEmpty = totalRegistered > 0 && groupedRoutines.length === 0;

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <PageHeader
        title="Rotinas de coleta"
        subtitle="Gerencie quais cooperativas atendem cada ponto de coleta e os dias da semana"
        actions={
          <Button
            variant="primary"
            size="md"
            onClick={() => modals.setIsCreating(true)}
            className="w-full sm:w-auto whitespace-nowrap"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nova rotina de coleta
          </Button>
        }
      />

      {/* Barra de Visões e Filtros */}
      {!isDatabaseEmpty && (
        <RoutineFilterBar
          filters={filters}
          cooperatives={cooperatives}
          clientOrganizations={clientOrganizations}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          isFetching={isFetching}
        />
      )}

      {/* Conteúdo Principal e Estados Vazios */}
      {isDatabaseEmpty ? (
        <div className="bg-white rounded-2xl border border-yby-border p-8 shadow-card">
          <EmptyState
            icon={<CalendarClock className="w-6 h-6 stroke-[2.2]" />}
            title="Nenhuma rotina de coleta cadastrada"
            description="Cadastre a primeira rotina vinculando uma cooperativa, um ponto de coleta e os dias da semana."
            action={
              <Button variant="primary" size="sm" onClick={() => modals.setIsCreating(true)}>
                <Plus className="w-4 h-4 mr-1.5" />
                Criar rotina de coleta
              </Button>
            }
          />
        </div>
      ) : isFilterEmpty ? (
        <div className="bg-white rounded-2xl border border-yby-border p-8 shadow-card">
          <EmptyState
            icon={<SearchX className="w-6 h-6 stroke-[2.2]" />}
            title="Nenhuma rotina encontrada para os filtros aplicados"
            description="Ajuste a busca, cooperativa, cliente ou dias da semana selecionados para visualizar resultados."
            action={
              <Button variant="outline" size="sm" onClick={filters.handleClearFilters}>
                Limpar filtros
              </Button>
            }
          />
        </div>
      ) : viewMode === 'coop' ? (
        <RoutineByCoopView
          cooperativeGroups={cooperativeGroups}
          onEdit={(r) => modals.setEditingRoutine(r)}
          onDelete={(r) => modals.setDeletingRoutine(r)}
        />
      ) : viewMode === 'day' ? (
        <RoutineByDayView
          groupedRoutines={groupedRoutines}
          dayCounts={dayCounts}
          selectedDayTab={selectedDayTab}
          onSelectDayTab={setSelectedDayTab}
          onEdit={(r) => modals.setEditingRoutine(r)}
          onDelete={(r) => modals.setDeletingRoutine(r)}
        />
      ) : (
        <>
          {/* Visualização Desktop (Tabela Enxuta de 4 Colunas Paginada) */}
          <div className="hidden md:block">
            <RoutineTable
              routines={routines}
              totalItems={allFilteredCount}
              totalWeeklyCollections={totalWeeklyCollections}
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              onEdit={(r) => modals.setEditingRoutine(r)}
              onDelete={(r) => modals.setDeletingRoutine(r)}
            />
          </div>

          {/* Visualização Mobile (Cards + Paginação) */}
          <div className="md:hidden space-y-3">
            {routines.map((routine) => (
              <RoutineMobileCard
                key={routine.groupKey || routine.id}
                routine={routine}
                onEdit={(r) => modals.setEditingRoutine(r)}
                onDelete={(r) => modals.setDeletingRoutine(r)}
              />
            ))}

            {totalPages > 1 && (
              <div className="pt-2 flex items-center justify-between text-xs text-yby-muted">
                <span>
                  Página {currentPage} de {totalPages} ({allFilteredCount} pontos)
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

      {/* Modal de Criação / Edição (Múltiplos dias + Prevenção de conflito) */}
      {(modals.isCreating || modals.editingRoutine) && (
        <RoutineModal
          routine={modals.editingRoutine}
          cooperatives={cooperatives}
          clientOrganizations={clientOrganizations}
          existingRoutines={allRoutines}
          saving={saving}
          onClose={() => {
            modals.setIsCreating(false);
            modals.setEditingRoutine(null);
          }}
          onSave={actions.handleSave}
        />
      )}

      {/* Modal de Exclusão */}
      {modals.deletingRoutine && (
        <DeleteRoutineModal
          routine={modals.deletingRoutine}
          onClose={() => modals.setDeletingRoutine(null)}
          onConfirm={actions.handleDelete}
        />
      )}
    </div>
  );
}
