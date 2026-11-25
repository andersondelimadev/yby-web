import { useState, useEffect, useMemo, useCallback } from 'react';
import { toast } from 'sonner';
import { collectionRoutineRepository } from '@/services/repositories/collectionRoutineRepository.js';
import { organizationRepository } from '@/services/repositories/organizationRepository.js';
import { ORGANIZATION_TYPES } from '@/domain/constants/organizationTypes.js';
import { WEEK_DAYS } from '@/domain/constants/weekDays.js';
import {
  groupRoutinesByPointAndCoop,
  groupRoutinesByCooperative,
  countCollectionsByWeekDay,
} from '@/domain/formatters/routineGrouping.js';

/**
 * Controller Hook (GRASP Controller) para a tela de Rotinas de Coleta.
 * Orquestra busca combinada, alternância de visões (Lista, Por Cooperativa, Por Dia),
 * agrupamento por Ponto + Cooperativa, paginação e CRUD em lote de múltiplos dias.
 */
export function useRotinasController() {
  const [filteredRoutines, setFilteredRoutines] = useState([]);
  const [allRoutines, setAllRoutines] = useState([]);
  const [totalRegistered, setTotalRegistered] = useState(0);
  const [allOrganizations, setAllOrganizations] = useState([]);
  const [initialLoading, setInitialLoading] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const [saving, setSaving] = useState(false);

  // Modo de visualização: 'list' | 'coop' | 'day'
  const [viewMode, setViewMode] = useState('list');
  const [selectedDayTab, setSelectedDayTab] = useState(WEEK_DAYS.SEGUNDA.id);

  // Filtros combináveis
  const [search, setSearch] = useState('');
  const [cooperativeId, setCooperativeId] = useState('Todas');
  const [clientId, setClientId] = useState('Todos');
  const [days, setDays] = useState([]);

  // Paginação (sobre grupos na visão Lista)
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  // Modais
  const [isCreating, setIsCreating] = useState(false);
  const [editingRoutine, setEditingRoutine] = useState(null);
  const [deletingRoutine, setDeletingRoutine] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setIsFetching(true);
      const effectiveDays = viewMode === 'day' ? [] : days;
      const [routineData, allData, totalCount, orgData] = await Promise.all([
        collectionRoutineRepository.getAll({
          search,
          cooperativeId,
          clientId,
          days: effectiveDays,
        }),
        collectionRoutineRepository.getAll(),
        collectionRoutineRepository.countAll(),
        organizationRepository.getAll(),
      ]);
      setFilteredRoutines(routineData);
      setAllRoutines(allData);
      setTotalRegistered(totalCount);
      setAllOrganizations(orgData);
    } catch (err) {
      toast.error('Erro ao carregar rotinas de coleta.');
    } finally {
      setInitialLoading(false);
      setIsFetching(false);
    }
  }, [search, cooperativeId, clientId, days, viewMode]);

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

  // Agrupamento consolidado por Ponto de Coleta + Cooperativa
  const groupedRoutines = useMemo(
    () => groupRoutinesByPointAndCoop(filteredRoutines),
    [filteredRoutines]
  );

  const cooperativeGroups = useMemo(
    () => groupRoutinesByCooperative(groupedRoutines),
    [groupedRoutines]
  );

  const dayCounts = useMemo(
    () => countCollectionsByWeekDay(groupedRoutines),
    [groupedRoutines]
  );

  const totalWeeklyCollections = useMemo(
    () => groupedRoutines.reduce((acc, g) => acc + g.days.length, 0),
    [groupedRoutines]
  );

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
    (viewMode !== 'day' && days.length > 0);

  const handleSave = async (formData) => {
    try {
      setSaving(true);
      const replaceIds = editingRoutine?.ids || (editingRoutine?.id ? [editingRoutine.id] : []);
      await collectionRoutineRepository.saveBatch(formData, replaceIds);

      toast.success(
        editingRoutine
          ? 'Rotina de coleta atualizada com sucesso!'
          : 'Rotina de coleta cadastrada com sucesso!'
      );
      setEditingRoutine(null);
      setIsCreating(false);
      await fetchData();
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
      const idsToDelete = deletingRoutine.ids || [deletingRoutine.id];
      await collectionRoutineRepository.deleteMany(idsToDelete);
      toast.success('Rotina de coleta excluída com sucesso.');
      setDeletingRoutine(null);
      await fetchData();
    } catch (err) {
      toast.error('Erro ao excluir rotina de coleta.');
      setDeletingRoutine(null);
    }
  };

  // Paginação (sobre grupos consolidados)
  const totalItems = groupedRoutines.length;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;
  const paginatedRoutines = useMemo(() => {
    const safePage = Math.min(currentPage, totalPages);
    const start = (safePage - 1) * pageSize;
    return groupedRoutines.slice(start, start + pageSize);
  }, [groupedRoutines, currentPage, totalPages, pageSize]);

  return {
    routines: paginatedRoutines,
    groupedRoutines,
    cooperativeGroups,
    dayCounts,
    allRoutines,
    allFilteredCount: totalItems,
    totalWeeklyCollections,
    totalRegistered,
    cooperatives,
    clientOrganizations,
    totalPages,
    currentPage: Math.min(currentPage, totalPages),
    setCurrentPage,
    viewMode,
    setViewMode,
    selectedDayTab,
    setSelectedDayTab,
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
