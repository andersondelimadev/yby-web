import React from 'react';
import { Pencil, Trash2, Building2, Truck } from 'lucide-react';
import { Button } from '@/shared/ui/Button.jsx';
import { Badge } from '@/shared/ui/Badge.jsx';
import { UserRoleBadge } from './UserRoleBadge.jsx';
import { getUserStatusMeta } from '@/domain/constants/userStatuses.js';

export function UserMobileCard({ user, onEdit, onDelete }) {
  const statusMeta = getUserStatusMeta(user.status);
  const initials = user.name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <div className="bg-white rounded-2xl border border-yby-border p-4 shadow-card space-y-3 transition-all duration-300 hover:shadow-card-elevated hover:border-yby-primary/30">
      {/* Topo do Card */}
      <div className="flex items-start justify-between gap-3 border-b border-yby-border/60 pb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-yby-tint border border-yby-light text-yby-primary font-extrabold text-xs flex items-center justify-center flex-shrink-0 shadow-sm">
            {initials}
          </div>
          <div>
            <h3 className="font-bold text-sm text-yby-heading leading-tight">{user.name}</h3>
            <span className="text-xs text-yby-muted block mt-0.5">{user.email}</span>
          </div>
        </div>

        <UserRoleBadge roleId={user.role} />
      </div>

      {/* Organização Vinculada e Status */}
      <div className="space-y-2 py-1">
        <div className="flex items-center justify-between text-xs">
          <span className="text-yby-muted font-semibold">Organização:</span>
          <div className="flex items-center gap-1.5 font-bold text-yby-heading">
            {user.organizationType === 'Cooperativa' ? (
              <Truck className="w-3.5 h-3.5 text-yby-primary flex-shrink-0" />
            ) : (
              <Building2 className="w-3.5 h-3.5 text-yby-muted flex-shrink-0" />
            )}
            <span>{user.organizationName || 'Sem organização'}</span>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs">
          <span className="text-yby-muted font-semibold">Status:</span>
          <Badge variant={statusMeta.badgeVariant}>{statusMeta.label}</Badge>
        </div>
      </div>

      {/* Ações Mobile */}
      <div className="flex items-center gap-2 pt-2 border-t border-yby-border/60">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onEdit(user)}
          className="flex-1 min-h-[44px]"
          aria-label={`Editar usuário ${user.name}`}
        >
          <Pencil className="w-4 h-4 mr-1.5" />
          Editar
        </Button>

        <Button
          variant="danger-outline"
          size="sm"
          onClick={() => onDelete(user)}
          className="flex-1 min-h-[44px]"
          aria-label={`Excluir usuário ${user.name}`}
        >
          <Trash2 className="w-4 h-4 mr-1.5" />
          Excluir
        </Button>
      </div>
    </div>
  );
}
