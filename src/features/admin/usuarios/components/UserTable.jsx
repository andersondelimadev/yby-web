import React from 'react';
import { Pencil, Trash2, Building2, Truck, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/shared/ui/Button.jsx';
import { Badge } from '@/shared/ui/Badge.jsx';
import { UserRoleBadge } from './UserRoleBadge.jsx';
import { getUserStatusMeta } from '@/domain/constants/userStatuses.js';

export function UserTable({
  users = [],
  totalItems = 0,
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
            <tr className="bg-yby-surface/60 border-b border-yby-border text-xs font-bold text-yby-muted uppercase tracking-wider">
              <th className="py-3.5 px-4 min-w-[220px]">Usuário</th>
              <th className="py-3.5 px-4 min-w-[180px]">Papel</th>
              <th className="py-3.5 px-4 min-w-[210px]">Organização Vinculada</th>
              <th className="py-3.5 px-4 min-w-[120px]">Status</th>
              <th className="py-3.5 px-4 text-center min-w-[110px]">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-yby-border/60 text-sm">
            {users.map((user, index) => {
              const isEven = index % 2 === 1;
              const statusMeta = getUserStatusMeta(user.status);
              const initials = user.name
                .split(' ')
                .map((n) => n[0])
                .slice(0, 2)
                .join('')
                .toUpperCase();

              return (
                <tr
                  key={user.id}
                  className={`transition-colors duration-150 ${
                    isEven ? 'bg-yby-zebra hover:bg-yby-tint/40' : 'bg-white hover:bg-yby-tint/40'
                  }`}
                >
                  {/* Nome e E-mail */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-yby-tint border border-yby-light text-yby-primary font-extrabold text-xs flex items-center justify-center flex-shrink-0 shadow-sm">
                        {initials}
                      </div>
                      <div>
                        <p className="font-bold text-yby-heading leading-tight">{user.name}</p>
                        <span className="text-xs text-yby-muted block mt-0.5">{user.email}</span>
                      </div>
                    </div>
                  </td>

                  {/* Papel (Role) com Chip Colorido */}
                  <td className="py-3.5 px-4">
                    <UserRoleBadge roleId={user.role} />
                  </td>

                  {/* Organização Vinculada */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2">
                      <span className="text-yby-muted flex-shrink-0">
                        {user.organizationType === 'Cooperativa' ? (
                          <Truck className="w-4 h-4 text-yby-primary" />
                        ) : (
                          <Building2 className="w-4 h-4 text-yby-muted" />
                        )}
                      </span>
                      <span className="font-semibold text-xs text-yby-heading">
                        {user.organizationName || 'Não atribuída'}
                      </span>
                    </div>
                  </td>

                  {/* Status */}
                  <td className="py-3.5 px-4">
                    <Badge variant={statusMeta.badgeVariant}>{statusMeta.label}</Badge>
                  </td>

                  {/* Ações */}
                  <td className="py-3.5 px-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => onEdit(user)}
                        className="p-1.5 rounded-lg text-yby-muted hover:text-yby-heading hover:bg-white transition-all duration-150 hover:scale-110 active:scale-95 shadow-sm"
                        title="Editar usuário"
                        aria-label={`Editar usuário ${user.name}`}
                      >
                        <Pencil className="w-4 h-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => onDelete(user)}
                        className="p-1.5 rounded-lg text-yby-danger/80 hover:text-yby-danger hover:bg-red-50 transition-all duration-150 hover:scale-110 active:scale-95 shadow-sm"
                        title="Excluir usuário"
                        aria-label={`Excluir usuário ${user.name}`}
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
          Mostrando {users.length} de {totalItems} usuários cadastrados
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
