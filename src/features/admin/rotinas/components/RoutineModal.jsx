import React, { useState, useEffect, useMemo } from 'react';
import { X, CalendarClock, AlertCircle } from 'lucide-react';
import { SearchableSelect } from '@/shared/ui/SearchableSelect.jsx';
import { SelectField } from '@/shared/ui/SelectField.jsx';
import { Button } from '@/shared/ui/Button.jsx';
import { WEEK_DAYS_LIST } from '@/domain/constants/weekDays.js';
import { formatPointShortAddress, formatRoutineDate } from '@/domain/formatters/routineFormatters.js';

/**
 * Modal unificado de Criação e Edição de Rotina de Coleta.
 * Contempla selects com busca, dependência Cliente -> Ponto de Coleta
 * e exibição de erros inline (incluindo detecção de rotina duplicada).
 */
export function RoutineModal({
  routine = null,
  cooperatives = [],
  clientOrganizations = [],
  saving = false,
  onClose,
  onSave,
}) {
  const isEditing = Boolean(routine);

  const [cooperativeId, setCooperativeId] = useState('');
  const [clientId, setClientId] = useState('');
  const [collectionPointId, setCollectionPointId] = useState('');
  const [dayOfWeek, setDayOfWeek] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [formError, setFormError] = useState('');

  useEffect(() => {
    if (routine) {
      setCooperativeId(routine.cooperativeId || '');
      setClientId(routine.clientId || '');
      setCollectionPointId(routine.collectionPointId || '');
      setDayOfWeek(routine.dayOfWeek || '');
    } else {
      setCooperativeId('');
      setClientId('');
      setCollectionPointId('');
      setDayOfWeek('');
    }
    setFieldErrors({});
    setFormError('');
  }, [routine]);

  const cooperativeOptions = useMemo(
    () => cooperatives.map((c) => ({ value: c.id, label: c.name, description: c.cnpj })),
    [cooperatives]
  );

  const clientOptions = useMemo(
    () =>
      clientOrganizations.map((c) => ({
        value: c.id,
        label: c.name,
        description: `${c.type} · ${(c.collectionPoints || []).length} ponto(s) de coleta`,
      })),
    [clientOrganizations]
  );

  const selectedClient = useMemo(
    () => clientOrganizations.find((c) => c.id === clientId) || null,
    [clientOrganizations, clientId]
  );

  const pointOptions = useMemo(() => {
    if (!selectedClient) return [];
    return (selectedClient.collectionPoints || []).map((cp) => ({
      value: cp.id,
      label: cp.nickname,
      description: formatPointShortAddress(cp),
    }));
  }, [selectedClient]);

  const dayOptions = WEEK_DAYS_LIST.map((d) => ({
    value: d.id,
    label: d.label,
  }));

  const handleClientChange = (newClientId) => {
    setClientId(newClientId);
    setCollectionPointId('');
    setFieldErrors((prev) => ({ ...prev, clientId: undefined, collectionPointId: undefined }));
    setFormError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFieldErrors({});
    setFormError('');

    const result = await onSave({
      cooperativeId,
      clientId,
      collectionPointId,
      dayOfWeek,
    });

    if (result && !result.ok) {
      if (result.fieldErrors && Object.keys(result.fieldErrors).length > 0) {
        setFieldErrors(result.fieldErrors);
      } else if (result.error) {
        setFormError(result.error);
      }
    }
  };

  const clientHasNoPoints = Boolean(selectedClient) && pointOptions.length === 0;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/45 backdrop-blur-sm animate-in fade-in duration-150"
      role="dialog"
      aria-modal="true"
      aria-labelledby="routine-modal-title"
    >
      <div className="bg-white rounded-2xl max-w-lg w-full p-5 sm:p-6 border border-yby-border shadow-popup relative max-h-[90vh] overflow-y-auto">
        {/* Cabeçalho */}
        <div className="flex items-center justify-between border-b border-yby-border/60 pb-3 mb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-yby-tint text-yby-primary flex items-center justify-center shrink-0">
              <CalendarClock className="w-5 h-5" />
            </div>
            <div>
              <h3 id="routine-modal-title" className="font-extrabold text-lg text-yby-heading">
                {isEditing ? 'Editar Rotina de Coleta' : 'Nova Rotina de Coleta'}
              </h3>
              <p className="text-xs text-yby-muted">
                {isEditing
                  ? 'Atualize a cooperativa, o ponto ou o dia da semana desta coleta'
                  : 'Defina qual cooperativa coleta em cada ponto e em qual dia da semana'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-yby-muted hover:text-yby-heading hover:bg-yby-surface"
            aria-label="Fechar modal de rotina"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Alerta de Erro Geral (ex.: Rotina Duplicada) */}
        {formError && (
          <div
            role="alert"
            className="mb-4 p-3.5 rounded-xl bg-red-50 border border-red-200 flex items-start gap-2.5 text-xs font-semibold text-yby-danger"
          >
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{formError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <SearchableSelect
            id="routine-cooperative"
            label="Cooperativa"
            required
            value={cooperativeId}
            onChange={(val) => {
              setCooperativeId(val);
              setFieldErrors((prev) => ({ ...prev, cooperativeId: undefined }));
              setFormError('');
            }}
            options={cooperativeOptions}
            placeholder="Selecione uma cooperativa..."
            searchPlaceholder="Buscar cooperativa..."
            emptyMessage="Nenhuma cooperativa encontrada"
            error={fieldErrors.cooperativeId}
          />

          <SearchableSelect
            id="routine-client"
            label="Cliente"
            required
            value={clientId}
            onChange={handleClientChange}
            options={clientOptions}
            placeholder="Selecione um cliente..."
            searchPlaceholder="Buscar cliente..."
            emptyMessage="Nenhum cliente encontrado"
            error={fieldErrors.clientId}
          />

          <SearchableSelect
            id="routine-point"
            label="Ponto de coleta"
            required
            disabled={!clientId || clientHasNoPoints}
            value={collectionPointId}
            onChange={(val) => {
              setCollectionPointId(val);
              setFieldErrors((prev) => ({ ...prev, collectionPointId: undefined }));
              setFormError('');
            }}
            options={pointOptions}
            placeholder={
              !clientId
                ? 'Selecione um cliente primeiro...'
                : clientHasNoPoints
                ? 'Este cliente não possui pontos cadastrados'
                : 'Selecione o ponto de coleta...'
            }
            searchPlaceholder="Buscar ponto ou endereço..."
            emptyMessage="Nenhum ponto de coleta encontrado"
            error={fieldErrors.collectionPointId}
            helperText={
              clientHasNoPoints
                ? 'Cadastre um ponto de coleta em Organizações antes de vincular uma rotina.'
                : undefined
            }
          />

          <SelectField
            id="routine-day"
            label="Dia da semana"
            required
            options={dayOptions}
            value={dayOfWeek}
            onChange={(e) => {
              setDayOfWeek(e.target.value);
              setFieldErrors((prev) => ({ ...prev, dayOfWeek: undefined }));
              setFormError('');
            }}
            placeholder="Selecione o dia da semana..."
            error={fieldErrors.dayOfWeek}
          />

          {/* Datas de Registro no modo Edição */}
          {isEditing && (
            <div className="p-3 rounded-xl bg-yby-surface/60 border border-yby-border/70 flex flex-wrap items-center justify-between gap-2 text-[11px] text-yby-muted">
              <span>Criado em: {formatRoutineDate(routine.created_at)}</span>
              <span>Atualizado em: {formatRoutineDate(routine.updated_at)}</span>
            </div>
          )}

          {/* Ações */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-yby-border/60">
            <Button type="button" variant="outline" onClick={onClose} disabled={saving}>
              Cancelar
            </Button>
            <Button type="submit" variant="primary" loading={saving}>
              {isEditing ? 'Salvar alterações' : 'Cadastrar rotina'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
