import React, { useState, useEffect } from 'react';
import { X, UserPlus, Users } from 'lucide-react';
import { InputField } from '@/shared/ui/InputField.jsx';
import { SelectField } from '@/shared/ui/SelectField.jsx';
import { Button } from '@/shared/ui/Button.jsx';
import { USER_ROLE_LIST, USER_ROLES } from '@/domain/constants/userRoles.js';
import { toast } from 'sonner';

export function UserModal({ user, organizations = [], onClose, onSave, saving }) {
  const isEditing = Boolean(user);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState(USER_ROLES.COLABORADOR_YBY.id);
  const [organizationId, setOrganizationId] = useState('');

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
      setRole(user.role || USER_ROLES.COLABORADOR_YBY.id);
      setOrganizationId(user.organizationId || '');
    } else {
      setName('');
      setEmail('');
      setRole(USER_ROLES.COLABORADOR_YBY.id);
      setOrganizationId('');
    }
  }, [user, organizations]);

  const roleOptions = USER_ROLE_LIST.map((r) => ({
    value: r.id,
    label: r.label,
  }));

  const orgOptions = organizations.map((o) => ({
    value: o.id,
    label: `${o.name} (${o.type})`,
  }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('Informe o nome do usuário.');
      return;
    }
    if (!email.trim()) {
      toast.error('Informe o e-mail do usuário.');
      return;
    }
    if (!organizationId) {
      toast.error('Selecione uma organização vinculada.');
      return;
    }

    onSave({
      name: name.trim(),
      email: email.trim(),
      role,
      organizationId,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 border border-yby-border shadow-popup relative">
        {/* Topo do Modal */}
        <div className="flex items-center justify-between border-b border-yby-border/60 pb-3 mb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-yby-tint text-yby-primary flex items-center justify-center">
              {isEditing ? <Users className="w-5 h-5" /> : <UserPlus className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="font-extrabold text-lg text-yby-heading">
                {isEditing ? 'Editar Usuário' : 'Novo Usuário'}
              </h3>
              <p className="text-xs text-yby-muted">
                {isEditing
                  ? 'Atualize os dados e o papel do colaborador'
                  : 'Cadastre um novo usuário e vincule-o a uma organização'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-yby-muted hover:text-yby-heading hover:bg-yby-surface"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <InputField
            label="Nome Completo"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ex: Ana Clara Cavalcante"
          />

          <InputField
            label="E-mail"
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="usuario@dominio.com.br"
          />

          <SelectField
            label="Organização Vinculada"
            required
            options={orgOptions}
            value={organizationId}
            onChange={(e) => setOrganizationId(e.target.value)}
            placeholder="Selecione uma organização..."
            helperText="Identifica a cooperativa ou cliente ao qual o usuário está vinculado."
          />

          <SelectField
            label="Papel"
            required
            options={roleOptions}
            value={role}
            onChange={(e) => setRole(e.target.value)}
            placeholder={null}
            helperText="Define as permissões e o nível de acesso do usuário dentro da plataforma."
          />

          {/* Botões de Ação */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-yby-border/60">
            <Button type="button" variant="outline" onClick={onClose} disabled={saving}>
              Cancelar
            </Button>
            <Button type="submit" variant="primary" loading={saving}>
              {isEditing ? 'Salvar alterações' : 'Cadastrar usuário'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
