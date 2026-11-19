import React from 'react';
import { Search, X } from 'lucide-react';
import { SelectField } from '@/shared/ui/SelectField.jsx';
import { USER_ROLE_LIST } from '@/domain/constants/userRoles.js';
import { USER_STATUS_LIST } from '@/domain/constants/userStatuses.js';

export function UserFilterBar({ filters, organizations = [] }) {
  const roleOptions = [
    { value: 'Todos', label: 'Todos os papéis' },
    ...USER_ROLE_LIST.map((r) => ({ value: r.id, label: r.label })),
  ];

  const orgOptions = [
    { value: 'Todas', label: 'Todas as organizações' },
    ...organizations.map((o) => ({ value: o.id, label: `${o.name} (${o.type})` })),
  ];

  const statusOptions = [
    { value: 'Todos', label: 'Todos os status' },
    ...USER_STATUS_LIST.map((s) => ({ value: s.id, label: s.label })),
  ];

  const activeStatus = filters.status || 'Todos';
  const hasActiveFilters =
    filters.search ||
    filters.role !== 'Todos' ||
    filters.organizationId !== 'Todas' ||
    activeStatus !== 'Todos';

  return (
    <div className="bg-yby-surface p-4 sm:p-5 rounded-2xl border border-yby-border mb-6 transition-all duration-300 ease-out hover:shadow-card hover:border-yby-primary/30 cursor-default">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
        {/* Campo de Busca */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-yby-heading block">
            Buscar usuário
          </label>
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-yby-muted pointer-events-none" />
            <input
              type="text"
              value={filters.search}
              onChange={(e) => filters.setSearch(e.target.value)}
              placeholder="Nome, e-mail ou organização"
              className="w-full pl-9 pr-3 py-2 text-xs md:text-sm bg-white rounded-xl border border-yby-border hover:border-yby-primary hover:transition-none transition-none focus:outline-none focus:border-yby-primary focus:transition-none shadow-sm min-h-[44px]"
            />
          </div>
        </div>

        {/* Filtro por Organização */}
        <SelectField
          label="Organização vinculada"
          options={orgOptions}
          value={filters.organizationId}
          onChange={(e) => filters.setOrganizationId(e.target.value)}
          placeholder={null}
        />

        {/* Filtro por Papel */}
        <SelectField
          label="Papel"
          options={roleOptions}
          value={filters.role}
          onChange={(e) => filters.setRole(e.target.value)}
          placeholder={null}
        />

        {/* Filtro por Status */}
        <SelectField
          label="Status"
          options={statusOptions}
          value={activeStatus}
          onChange={(e) => filters.setStatus?.(e.target.value)}
          placeholder={null}
        />
      </div>

      {hasActiveFilters && (
        <div className="mt-3 pt-3 border-t border-yby-border/60 flex items-center justify-between">
          <span className="text-xs text-yby-muted font-medium">
            Filtros ativos aplicados na listagem de usuários
          </span>
          <button
            type="button"
            onClick={filters.handleClearFilters}
            className="text-xs font-semibold text-yby-primary hover:underline inline-flex items-center gap-1"
          >
            <X className="w-3.5 h-3.5" />
            Limpar filtros
          </button>
        </div>
      )}
    </div>
  );
}
