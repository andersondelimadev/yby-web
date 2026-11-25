import React from 'react';
import { Search, X, Loader2, List, Building2, CalendarDays } from 'lucide-react';
import { SearchableSelect } from '@/shared/ui/SearchableSelect.jsx';
import { WEEK_DAYS_LIST, getWeekDayMeta } from '@/domain/constants/weekDays.js';

const VIEW_TABS = [
  { id: 'list', label: 'Lista', icon: List },
  { id: 'coop', label: 'Por Cooperativa', icon: Building2 },
  { id: 'day', label: 'Por Dia', icon: CalendarDays },
];

/**
 * Barra de controle de visões e filtros combináveis para Rotinas de Coleta.
 * Contempla alternador de visão (Lista | Por Cooperativa | Por Dia),
 * busca textual, selects com busca (Cooperativa e Cliente), chips de dias e Limpar filtros.
 */
export function RoutineFilterBar({
  filters,
  cooperatives = [],
  clientOrganizations = [],
  viewMode = 'list',
  onViewModeChange,
  isFetching = false,
}) {
  const coopOptions = [
    { value: 'Todas', label: 'Todas as cooperativas' },
    ...cooperatives.map((c) => ({ value: c.id, label: c.name })),
  ];

  const clientOptions = [
    { value: 'Todos', label: 'Todos os clientes' },
    ...clientOrganizations.map((c) => ({
      value: c.id,
      label: c.name,
      description: `${(c.collectionPoints || []).length} ponto(s) de coleta`,
    })),
  ];

  const selectedCoop = cooperatives.find((c) => c.id === filters.cooperativeId);
  const selectedClient = clientOrganizations.find((c) => c.id === filters.clientId);

  return (
    <div className="bg-yby-surface p-4 sm:p-5 rounded-2xl border border-yby-border mb-6 space-y-4 transition-all duration-300 ease-out hover:shadow-card hover:border-yby-primary/30 cursor-default">
      {/* Linha 0: Alternador de Visões + Indicador de Atualização */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-yby-border/60">
        <div
          role="tablist"
          aria-label="Modo de visualização das rotinas"
          className="inline-flex items-center p-1 bg-white border border-yby-border rounded-xl"
        >
          {VIEW_TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = viewMode === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => onViewModeChange?.(tab.id)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-yby-primary text-white shadow-sm'
                    : 'text-yby-muted hover:text-yby-heading'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {isFetching && (
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-yby-muted">
            <Loader2 className="w-3.5 h-3.5 animate-spin text-yby-primary" />
            Atualizando...
          </span>
        )}
      </div>

      {/* Linha 1: Busca + Cooperativa + Cliente */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
        <div className="space-y-1.5">
          <label
            htmlFor="rotinas-search"
            className="text-xs font-semibold text-yby-heading block"
          >
            Buscar rotina
          </label>
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-yby-muted pointer-events-none" />
            <input
              id="rotinas-search"
              type="text"
              value={filters.search}
              onChange={(e) => filters.setSearch(e.target.value)}
              placeholder="Cooperativa, cliente, ponto ou endereço"
              className="w-full pl-9 pr-3 py-2 text-xs md:text-sm bg-white rounded-lg border border-yby-border hover:border-yby-primary focus:outline-none focus:border-yby-primary focus:ring-2 focus:ring-yby-tint h-[44px]"
            />
          </div>
        </div>

        <SearchableSelect
          id="filtro-cooperativa"
          label="Cooperativa"
          value={filters.cooperativeId}
          onChange={filters.setCooperativeId}
          options={coopOptions}
          placeholder="Todas as cooperativas"
          searchPlaceholder="Buscar cooperativa..."
        />

        <SearchableSelect
          id="filtro-cliente"
          label="Cliente"
          value={filters.clientId}
          onChange={filters.setClientId}
          options={clientOptions}
          placeholder="Todos os clientes"
          searchPlaceholder="Buscar cliente..."
        />
      </div>

      {/* Linha 2: Chips clicáveis dos Dias da Semana (ocultos na visão Por Dia) */}
      {viewMode !== 'day' && (
        <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-yby-border/60">
          <span className="text-xs font-semibold text-yby-heading mr-1">Dia da semana:</span>
          {WEEK_DAYS_LIST.map((day) => {
            const isSelected = filters.days.includes(day.id);
            return (
              <button
                key={day.id}
                type="button"
                aria-pressed={isSelected}
                onClick={() => filters.toggleDay(day.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all duration-150 cursor-pointer ${
                  isSelected
                    ? 'bg-yby-primary text-white border-yby-primary shadow-sm'
                    : 'bg-white text-yby-heading border-yby-border hover:border-yby-primary hover:bg-yby-tint/40'
                }`}
              >
                {day.shortLabel}
              </button>
            );
          })}
        </div>
      )}

      {/* Linha 3: Chips de Filtros Ativos + Limpar Filtros */}
      {filters.hasActiveFilters && (
        <div className="pt-3 border-t border-yby-border/60 flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs font-medium text-yby-muted mr-1">Filtros ativos:</span>

            {filters.search.trim() && (
              <button
                type="button"
                onClick={() => filters.setSearch('')}
                className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-white border border-yby-border text-yby-heading hover:border-yby-primary cursor-pointer"
              >
                <span>Busca: "{filters.search.trim()}"</span>
                <X className="w-3 h-3" />
              </button>
            )}

            {selectedCoop && (
              <button
                type="button"
                onClick={() => filters.setCooperativeId('Todas')}
                className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-white border border-yby-border text-yby-heading hover:border-yby-primary cursor-pointer"
              >
                <span>Cooperativa: {selectedCoop.name}</span>
                <X className="w-3 h-3" />
              </button>
            )}

            {selectedClient && (
              <button
                type="button"
                onClick={() => filters.setClientId('Todos')}
                className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-white border border-yby-border text-yby-heading hover:border-yby-primary cursor-pointer"
              >
                <span>Cliente: {selectedClient.name}</span>
                <X className="w-3 h-3" />
              </button>
            )}

            {viewMode !== 'day' &&
              filters.days.map((dayId) => (
                <button
                  key={dayId}
                  type="button"
                  onClick={() => filters.toggleDay(dayId)}
                  className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-yby-tint border border-yby-light text-yby-primary hover:bg-yby-light cursor-pointer"
                >
                  <span>{getWeekDayMeta(dayId).shortLabel}</span>
                  <X className="w-3 h-3" />
                </button>
              ))}
          </div>

          <button
            type="button"
            onClick={filters.handleClearFilters}
            className="text-xs font-semibold text-yby-primary hover:underline inline-flex items-center gap-1 shrink-0 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
            Limpar filtros
          </button>
        </div>
      )}
    </div>
  );
}
