import React, { useState, useEffect } from 'react';
import { X, Building2 } from 'lucide-react';
import { InputField } from '@/shared/ui/InputField.jsx';
import { SelectField } from '@/shared/ui/SelectField.jsx';
import { Button } from '@/shared/ui/Button.jsx';
import {
  ORGANIZATION_TYPES,
  ORGANIZATION_TYPE_LIST,
  ORGANIZATION_STATUS,
} from '@/domain/constants/organizationTypes.js';

export function OrganizationModal({ organization, onClose, onSave, saving }) {
  const isEditing = Boolean(organization);

  const [name, setName] = useState('');
  const [cnpj, setCnpj] = useState('');
  const [type, setType] = useState(ORGANIZATION_TYPES.CLIENTE);
  const [status, setStatus] = useState(ORGANIZATION_STATUS.ATIVA);

  useEffect(() => {
    if (organization) {
      setName(organization.name || '');
      setCnpj(organization.cnpj || '');
      setType(organization.type || ORGANIZATION_TYPES.CLIENTE);
      setStatus(organization.status || ORGANIZATION_STATUS.ATIVA);
    } else {
      setName('');
      setCnpj('');
      setType(ORGANIZATION_TYPES.CLIENTE);
      setStatus(ORGANIZATION_STATUS.ATIVA);
    }
  }, [organization]);

  const handleCnpjChange = (e) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 14);
    let formatted = raw;
    if (raw.length > 2) formatted = `${raw.slice(0, 2)}.${raw.slice(2)}`;
    if (raw.length > 5) formatted = `${formatted.slice(0, 6)}.${raw.slice(5)}`;
    if (raw.length > 8) formatted = `${formatted.slice(0, 10)}/${raw.slice(8)}`;
    if (raw.length > 12) formatted = `${formatted.slice(0, 15)}-${raw.slice(12)}`;
    setCnpj(formatted);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSave({
      name: name.trim(),
      cnpj: cnpj.trim(),
      type,
      status,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 border border-yby-border shadow-popup relative">
        {/* Topo do Modal */}
        <div className="flex items-center justify-between border-b border-yby-border/60 pb-3 mb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-yby-tint text-yby-primary flex items-center justify-center">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-lg text-yby-heading">
                {isEditing ? 'Editar Organização' : 'Nova Organização'}
              </h3>
              <p className="text-xs text-yby-muted">
                {isEditing
                  ? 'Atualize os dados e o status da entidade'
                  : 'Cadastre um novo cliente, cooperativa ou unidade YBY na plataforma'}
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
            label="Nome da Organização / Razão Social"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ex: Condomínio Solar das Flores"
          />

          <InputField
            label="CNPJ"
            placeholder="00.000.000/0001-00"
            value={cnpj}
            onChange={handleCnpjChange}
          />

          <SelectField
            label="Tipo de Organização"
            required
            options={ORGANIZATION_TYPE_LIST}
            value={type}
            onChange={(e) => setType(e.target.value)}
          />

          {/* Switch de Status */}
          <div className="flex items-center justify-between p-3.5 bg-yby-surface/50 rounded-xl border border-yby-border/60">
            <div>
              <span className="text-xs font-bold text-yby-heading block">Status da Organização</span>
              <p className="text-[11px] text-yby-muted">
                Organizações inativas não aparecem em novas rotas de coleta
              </p>
            </div>
            <button
              type="button"
              onClick={() =>
                setStatus((prev) =>
                  prev === ORGANIZATION_STATUS.ATIVA
                    ? ORGANIZATION_STATUS.INATIVA
                    : ORGANIZATION_STATUS.ATIVA
                )
              }
              className="inline-flex items-center gap-2 p-1 rounded-lg hover:bg-yby-surface transition-colors cursor-pointer"
              aria-label={`Alternar status da organização (atualmente ${status})`}
            >
              <div
                className={`w-11 h-6 rounded-full transition-colors relative flex items-center px-0.5 ${
                  status === ORGANIZATION_STATUS.ATIVA ? 'bg-yby-primary' : 'bg-gray-300'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white transition-transform shadow-sm ${
                    status === ORGANIZATION_STATUS.ATIVA ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </div>
              <span
                className={`text-xs font-bold ${
                  status === ORGANIZATION_STATUS.ATIVA ? 'text-yby-primary' : 'text-yby-muted'
                }`}
              >
                {status}
              </span>
            </button>
          </div>

          {/* Botões de Ação */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-yby-border/60">
            <Button type="button" variant="outline" onClick={onClose} disabled={saving}>
              Cancelar
            </Button>
            <Button type="submit" variant="primary" loading={saving}>
              {isEditing ? 'Salvar alterações' : 'Cadastrar organização'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
