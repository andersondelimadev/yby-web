import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { InputField } from '@/shared/ui/InputField.jsx';
import { SelectField } from '@/shared/ui/SelectField.jsx';
import { Button } from '@/shared/ui/Button.jsx';
import { useCepLookup } from '@/shared/hooks/useCepLookup.js';

const EMPTY_FORM = {
  nickname: '',
  zip_code: '',
  address: '',
  number: '',
  neighborhood: '',
  city: '',
  state: '',
  active: true,
};

/**
 * Formulário modular para criar ou editar um Ponto de Coleta.
 * Quando aberto fora da Show (botão global), exibe o seletor de Organização.
 * Inclui máscara e consulta automática de CEP via ViaCEP.
 */
export function CollectionPointForm({
  point = null,
  organizations = [],
  showOrganizationSelect = false,
  initialOrganizationId = '',
  saving = false,
  onCancel,
  onSave,
}) {
  const isEditing = Boolean(point);
  const [selectedOrgId, setSelectedOrgId] = useState(initialOrganizationId || '');
  const [formData, setFormData] = useState(EMPTY_FORM);

  useEffect(() => {
    setSelectedOrgId(initialOrganizationId || '');
  }, [initialOrganizationId]);

  useEffect(() => {
    if (point) {
      setFormData({
        nickname: point.nickname || '',
        zip_code: point.zip_code || '',
        address: point.address || '',
        number: point.number || '',
        neighborhood: point.neighborhood || '',
        city: point.city || '',
        state: point.state || '',
        active: point.active !== undefined ? Boolean(point.active) : true,
      });
    } else {
      setFormData(EMPTY_FORM);
    }
  }, [point]);

  const handleAddressFound = useCallback((found) => {
    setFormData((prev) => ({
      ...prev,
      address: found.street || prev.address,
      neighborhood: found.neighborhood || prev.neighborhood,
      city: found.city || prev.city,
      state: found.uf || found.state || prev.state,
    }));
  }, []);

  const { loading: loadingCep, lookupCep, formatCep } = useCepLookup(handleAddressFound);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCepChange = (e) => {
    const formatted = formatCep(e.target.value);
    handleChange('zip_code', formatted);

    const digits = formatted.replace(/\D/g, '');
    if (digits.length === 8) {
      lookupCep(digits);
    }
  };

  const handleCepBlur = () => {
    const digits = String(formData.zip_code || '').replace(/\D/g, '');
    if (digits.length === 8) {
      lookupCep(digits);
    }
  };

  const orgOptions = organizations.map((o) => ({
    value: o.id,
    label: `${o.name} (${o.type})`,
  }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (showOrganizationSelect && !selectedOrgId) {
      toast.error('Selecione uma organização para vincular o ponto de coleta.');
      return;
    }
    if (!formData.nickname.trim() || !formData.zip_code.trim() || !formData.address.trim()) {
      toast.error('Preencha os campos obrigatórios do ponto de coleta.');
      return;
    }
    onSave(formData, selectedOrgId);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {showOrganizationSelect && (
        <SelectField
          label="Organização"
          required
          options={orgOptions}
          value={selectedOrgId}
          onChange={(e) => setSelectedOrgId(e.target.value)}
          placeholder="Selecione uma organização..."
        />
      )}

      {/* Campos do Ponto de Coleta */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="sm:col-span-2 lg:col-span-2">
          <InputField
            label="Apelido / Nome do Ponto"
            required
            placeholder="Ex.: Unidade Aldeota - Entrada Lateral"
            value={formData.nickname}
            onChange={(e) => handleChange('nickname', e.target.value)}
          />
        </div>

        <InputField
          label="CEP"
          required
          placeholder="00000-000"
          maxLength={9}
          value={formData.zip_code}
          onChange={handleCepChange}
          onBlur={handleCepBlur}
          helperText={loadingCep ? 'Buscando endereço...' : undefined}
        />

        <div className="sm:col-span-2">
          <InputField
            label="Endereço"
            required
            placeholder="Rua, Avenida ou Logradouro"
            value={formData.address}
            onChange={(e) => handleChange('address', e.target.value)}
          />
        </div>

        <InputField
          label="Número"
          required
          placeholder="Ex.: 1200"
          value={formData.number}
          onChange={(e) => handleChange('number', e.target.value)}
        />

        <InputField
          label="Bairro"
          required
          placeholder="Ex.: Aldeota"
          value={formData.neighborhood}
          onChange={(e) => handleChange('neighborhood', e.target.value)}
        />

        <InputField
          label="Cidade"
          required
          placeholder="Ex.: Fortaleza"
          value={formData.city}
          onChange={(e) => handleChange('city', e.target.value)}
        />

        <InputField
          label="Estado"
          required
          placeholder="Ex.: CE"
          value={formData.state}
          onChange={(e) => handleChange('state', e.target.value)}
        />
      </div>

      {/* Switch de Status Ativo/Inativo */}
      <div className="flex items-center justify-between p-3.5 bg-yby-surface/60 rounded-xl border border-yby-border/70">
        <div>
          <span className="text-xs font-bold text-yby-heading block">
            Ponto de coleta ativo
          </span>
          <p className="text-[11px] text-yby-muted">
            Pontos inativos não aparecem disponíveis para agendamento de coletas
          </p>
        </div>

        <button
          type="button"
          role="switch"
          aria-checked={formData.active}
          aria-label="Ponto de coleta ativo"
          onClick={() => handleChange('active', !formData.active)}
          className="inline-flex items-center gap-2 shrink-0"
        >
          <div
            className={`w-11 h-6 rounded-full transition-colors relative flex items-center px-0.5 ${
              formData.active ? 'bg-yby-primary' : 'bg-gray-300'
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-white transition-transform shadow-sm ${
                formData.active ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </div>
          <span
            className={`text-xs font-bold ${
              formData.active ? 'text-yby-primary' : 'text-yby-muted'
            }`}
          >
            {formData.active ? 'Ativo' : 'Inativo'}
          </span>
        </button>
      </div>

      {/* Ações do Formulário */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-yby-border/60">
        <Button type="button" variant="outline" onClick={onCancel} disabled={saving}>
          Cancelar
        </Button>
        <Button type="submit" variant="primary" loading={saving}>
          {isEditing ? 'Salvar alterações' : 'Salvar ponto de coleta'}
        </Button>
      </div>
    </form>
  );
}
