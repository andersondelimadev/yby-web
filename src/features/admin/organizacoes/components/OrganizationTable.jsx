import React from 'react';
import { Pencil, Trash2, Building2, Truck, Sprout, ChevronLeft, ChevronRight } from 'lucide-react';
import { Badge } from '@/shared/ui/Badge.jsx';
import { Button } from '@/shared/ui/Button.jsx';
import { ORGANIZATION_TYPES, ORGANIZATION_STATUS } from '@/domain/constants/organizationTypes.js';

export function OrganizationTable({
  organizations = [],
  totalItems = 0,
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  onEdit,
  onDelete,
  onToggleStatus,
}) {
  return (
    <div className="bg-white rounded-2xl border border-yby-border overflow-hidden shadow-card transition-all duration-300 ease-out hover:shadow-card-elevated hover:border-yby-primary/30 cursor-default">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-yby-surface/60 border-b border-yby-border text-xs font-bold text-yby-muted uppercase tracking-wider">
              <th className="py-3.5 px-4 min-w-[240px]">Nome da Organização</th>
              <th className="py-3.5 px-4 min-w-[140px]">Tipo</th>
              <th className="py-3.5 px-4 min-w-[130px]">Status</th>
              <th className="py-3.5 px-4 min-w-[140px]">Localidade</th>
              <th className="py-3.5 px-4 text-center min-w-[120px]">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-yby-border/60 text-sm">
            {organizations.map((org, index) => {
              const isEven = index % 2 === 1;
              const isYby = org.type === ORGANIZATION_TYPES.YBY;
              const isCooperativa = org.type === ORGANIZATION_TYPES.COOPERATIVA;
              const isActive = org.status === ORGANIZATION_STATUS.ATIVA;

              return (
                <tr
                  key={org.id}
                  className={`transition-colors duration-150 ${
                    !isActive
                      ? 'bg-gray-100/90 hover:bg-gray-200/80'
                      : isEven
                      ? 'bg-yby-zebra hover:bg-yby-tint/40'
                      : 'bg-white hover:bg-yby-tint/40'
                  }`}
                >
                  {/* Nome e CNPJ */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors ${
                          !isActive
                            ? 'bg-gray-200/80 text-gray-500'
                            : isYby
                            ? 'bg-yby-tint text-yby-primary'
                            : isCooperativa
                            ? 'bg-emerald-50 text-yby-teal'
                            : 'bg-yby-surface text-yby-heading'
                        }`}
                      >
                        {isYby ? (
                          <Sprout className="w-4 h-4" />
                        ) : isCooperativa ? (
                          <Truck className="w-4 h-4" />
                        ) : (
                          <Building2 className="w-4 h-4" />
                        )}
                      </div>
                      <div>
                        <p
                          className={`font-bold leading-tight ${
                            isActive ? 'text-yby-heading' : 'text-gray-600'
                          }`}
                        >
                          {org.name}
                        </p>
                        <div className="inline-flex items-center gap-1.5 mt-1 px-2 py-0.5 rounded-md bg-yby-surface/80 border border-yby-border text-xs font-mono">
                          <span className="font-bold text-[10px] text-yby-muted uppercase tracking-wider">
                            CNPJ
                          </span>
                          <span className={`font-bold ${isActive ? 'text-yby-heading' : 'text-gray-600'}`}>
                            {org.cnpj || 'Sem CNPJ informado'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Tipo da Organização */}
                  <td className="py-3.5 px-4">
                    <Badge
                      variant={
                        !isActive
                          ? 'gray'
                          : isYby
                          ? 'green'
                          : isCooperativa
                          ? 'teal'
                          : 'beige'
                      }
                    >
                      {org.type}
                    </Badge>
                  </td>

                  {/* Status com Switch Visual */}
                  <td className="py-3.5 px-4">
                    <button
                      type="button"
                      onClick={() => onToggleStatus(org)}
                      className="inline-flex items-center gap-2 group text-left"
                      title="Clique para alternar o status"
                    >
                      <div
                        className={`w-9 h-5 rounded-full transition-colors relative flex items-center px-0.5 ${
                          isActive ? 'bg-yby-primary' : 'bg-gray-300'
                        }`}
                      >
                        <div
                          className={`w-4 h-4 rounded-full bg-white transition-transform shadow-sm ${
                            isActive ? 'translate-x-4' : 'translate-x-0'
                          }`}
                        />
                      </div>
                      <span
                        className={`text-xs font-bold ${
                          isActive ? 'text-yby-primary' : 'text-yby-muted'
                        }`}
                      >
                        {org.status}
                      </span>
                    </button>
                  </td>

                  {/* Localidade */}
                  <td className="py-3.5 px-4 text-xs text-yby-muted">
                    {org.city || 'Fortaleza'} / {org.state || 'CE'}
                    {org.neighborhood && ` · ${org.neighborhood}`}
                  </td>

                  {/* Ações */}
                  <td className="py-3.5 px-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => onEdit(org)}
                        className="p-1.5 rounded-lg text-yby-muted hover:text-yby-heading hover:bg-white transition-all duration-150 hover:scale-110 active:scale-95 shadow-sm"
                        title="Editar organização"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => onDelete(org)}
                        className="p-1.5 rounded-lg text-yby-danger/80 hover:text-yby-danger hover:bg-red-50 transition-all duration-150 hover:scale-110 active:scale-95 shadow-sm"
                        title="Excluir organização"
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
          Mostrando {organizations.length} de {totalItems} organizações cadastradas
        </span>

        {totalPages > 1 && (
          <div className="flex items-center gap-1.5">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === 1}
              onClick={() => onPageChange(currentPage - 1)}
              className="p-1.5 min-h-[32px]"
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
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
