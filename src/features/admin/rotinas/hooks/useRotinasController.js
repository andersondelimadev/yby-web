import { useState, useEffect, useMemo, useCallback } from 'react';
import { toast } from 'sonner';
import { collectionRoutineRepository } from '@/services/repositories/collectionRoutineRepository.js';
import { organizationRepository } from '@/services/repositories/organizationRepository.js';
import { ORGANIZATION_TYPES } from '@/domain/constants/organizationTypes.js';

/**
 * Controller Hook (GRASP Controller) para a tela de Rotinas de Coleta.
 * Orquestra busca combinada, filtros, paginação, estados vazios e CRUD.
 */
export function useRotinasController() {
  const [routines, setRoutines] = useState([]);
  const [totalRegistered, setTotalRegistered] = useState(0);
  const [allOrganizations, setAllOrganizations] = useState([]);
  const [initialLoading, setInitialLoading] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const [saving, setSaving] = useState(false);

  // Filtros combináveis
  const [search, setSearch] = useState('');
  const [cooperativeId, setCooperativeId] = useState('Todas');
  const [clientId, setClientId] = useState('Todos');
  const [days, setDays] = useState([]);

  // Paginação
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  // Modais
  const [isCreating, setIsCreating] = useState(false);
  const [editingRoutine, setEditingRoutine] = useState(null);
  const [deletingRoutine, setDeletingRoutine] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setIsFetching(true);
      const [routineData, totalCount, orgData] = await Promise.all([
        collectionRoutineRepository.getAll({ search, cooperativeId, clientId, days }),
        collectionRoutineRepository.countAll(),
        organizationRepository.getAll(),
      ]);
      setRoutines(routineData);
      setTotalRegistered(totalCount);
      setAllOrganizations(orgData);
    } catch (err) {
      toast.error('Erro ao carregar rotinas de coleta.');
    } finally {
      setInitialLoading(false);
      setIsFetching(false);
    }
  }, [search, cooperativeId, clientId, days]);

  useEffect(() => {
    fetchData();
    setCurrentPage(1);
  }, [fetchData]);

  // Apenas organizações do tipo Cooperativa
  const cooperatives = useMemo(
    () => allOrganizations.filter((org) => org.type === ORGANIZATION_TYPES.COOPERATIVA),
    [allOrganizations]
  );

  // Organizações elegíveis como cliente/origem de ponto de coleta (priorizando as que têm pontos)
  const clientOrganizations = useMemo(() => {
    const withPoints = allOrganizations.filter((org) => (org.collectionPoints || []).length > 0);
    const withoutPoints = allOrganizations.filter((org) => (org.collectionPoints || []).length === 0);
    return [...withPoints, ...withoutPoints];
  }, [allOrganizations]);

  const toggleDay = (dayId) => {
    setDays((prev) =>
      prev.includes(dayId) ? prev.filter((d) => d !== dayId) : [...prev, dayId]
    );
  };

  const handleClearFilters = () => {
    setSearch('');
    setCooperativeId('Todas');
    setClientId('Todos');
    setDays([]);
  };

  const hasActiveFilters =
    Boolean(search.trim()) ||
    cooperativeId !== 'Todas' ||
    clientId !== 'Todos' ||
    days.length > 0;

  const handleSave = async (formData) => {
    try {
      setSaving(true);
      if (editingRoutine) {
        const updated = await collectionRoutineRepository.update(editingRoutine.id, formData);
        setRoutines((prev) =>
          prev.map((item) => (item.id === editingRoutine.id ? updated : item))
        );
        toast.success('Rotina de coleta atualizada com sucesso!');
        setEditingRoutine(null);
      } else {
        const created = await collectionRoutineRepository.create(formData);
        setTotalRegistered((prev) => prev + 1);
        setRoutines((prev) => [created, ...prev]);
        toast.success('Rotina de coleta cadastrada com sucesso!');
        setIsCreating(false);
      }
      return { ok: true };
    } catch (err) {
      if (err?.code === 'DUPLICATE_ROUTINE' || err?.code === 'VALIDATION_ERROR') {
        return {
          ok: false,
          error: err.message,
          fieldErrors: err.fieldErrors || {},
        };
      }
      toast.error('Erro ao salvar rotina de coleta.');
      return { ok: false, error: 'Erro inesperado ao salvar rotina.' };
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingRoutine) return;
    try {
      await collectionRoutineRepository.delete(deletingRoutine.id);
      setRoutines((prev) => prev.filter((item) => item.id !== deletingRoutine.id));
      setTotalRegistered((prev) => Math.max(0, prev - 1));
      toast.success('Rotina de coleta excluída com sucesso.');
    } catch (err) {
      toast.error('Erro ao excluir rotina de coleta.');
    } finally {
      setDeletingRoutine(null);
    }
  };

  // Paginação
  const totalItems = routines.length;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;
  const paginatedRoutines = useMemo(() => {
    const safePage = Math.min(currentPage, totalPages);
    const start = (safePage - 1) * pageSize;
    return routines.slice(start, start + pageSize);
  }, [routines, currentPage, totalPages, pageSize]);

  return {
    routines: paginatedRoutines,
    allFilteredCount: totalItems,
    totalRegistered,
    cooperatives,
    clientOrganizations,
    totalPages,
    currentPage: Math.min(currentPage, totalPages),
    setCurrentPage,
    initialLoading,
    isFetching,
    saving,
    filters: {
      search,
      setSearch,
      cooperativeId,
      setCooperativeId,
      clientId,
      setClientId,
      days,
      toggleDay,
      hasActiveFilters,
      handleClearFilters,
    },
    modals: {
      isCreating,
      setIsCreating,
      editingRoutine,
      setEditingRoutine,
      deletingRoutine,
      setDeletingRoutine,
    },
    actions: {
      handleSave,
      handleDelete,
      refresh: fetchData,
    },
  };
}
