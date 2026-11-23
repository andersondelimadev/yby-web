import { useState, useEffect, useMemo } from 'react';
import { toast } from 'sonner';
import { organizationRepository } from '@/services/repositories/organizationRepository.js';

export function useOrganizacoesController() {
  const [organizations, setOrganizations] = useState([]);
  const [allOrganizations, setAllOrganizations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Filtros
  const [search, setSearch] = useState('');
  const [type, setType] = useState('Todas');
  const [status, setStatus] = useState('Todos');

  // Paginação
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  // Modais
  const [isCreating, setIsCreating] = useState(false);
  const [viewingOrg, setViewingOrg] = useState(null);
  const [editingOrg, setEditingOrg] = useState(null);
  const [deletingOrg, setDeletingOrg] = useState(null);
  const [pointModalState, setPointModalState] = useState(null);

  const syncUpdatedOrganization = (updatedOrg) => {
    setOrganizations((prev) =>
      prev.map((item) => (item.id === updatedOrg.id ? updatedOrg : item))
    );
    setAllOrganizations((prev) =>
      prev.map((item) => (item.id === updatedOrg.id ? updatedOrg : item))
    );
    setViewingOrg((prev) => (prev?.id === updatedOrg.id ? updatedOrg : prev));
  };

  const fetchOrganizations = async () => {
    try {
      setLoading(true);
      const hasActiveFilters = Boolean(search) || type !== 'Todas' || status !== 'Todos';
      if (hasActiveFilters) {
        const [filteredData, fullData] = await Promise.all([
          organizationRepository.getAll({ search, type, status }),
          organizationRepository.getAll(),
        ]);
        setOrganizations(filteredData);
        setAllOrganizations(fullData);
      } else {
        const data = await organizationRepository.getAll();
        setOrganizations(data);
        setAllOrganizations(data);
      }
    } catch (err) {
      toast.error('Erro ao carregar organizações.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrganizations();
    setCurrentPage(1);
  }, [search, type, status]);

  const handleToggleStatus = async (org) => {
    try {
      const updated = await organizationRepository.toggleStatus(org.id);
      syncUpdatedOrganization(updated);
      toast.success(
        `Status da organização "${org.shortName || org.name}" alterado para ${updated.status}.`
      );
    } catch (err) {
      toast.error('Erro ao atualizar status.');
    }
  };

  const handleSave = async (formData) => {
    try {
      setSaving(true);
      if (editingOrg) {
        const updated = await organizationRepository.update(editingOrg.id, formData);
        syncUpdatedOrganization(updated);
        toast.success(`Organização "${updated.name}" atualizada com sucesso!`);
        setEditingOrg(null);
      } else {
        const created = await organizationRepository.create(formData);
        setOrganizations((prev) => [created, ...prev]);
        setAllOrganizations((prev) => [created, ...prev]);
        toast.success(`Organização "${created.name}" cadastrada com sucesso!`);
        setIsCreating(false);
      }
    } catch (err) {
      toast.error('Erro ao salvar organização.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingOrg) return;
    try {
      await organizationRepository.delete(deletingOrg.id);
      setOrganizations((prev) => prev.filter((item) => item.id !== deletingOrg.id));
      setAllOrganizations((prev) => prev.filter((item) => item.id !== deletingOrg.id));
      if (viewingOrg?.id === deletingOrg.id) {
        setViewingOrg(null);
      }
      toast.success(`Organização "${deletingOrg.name}" excluída com sucesso.`);
    } catch (err) {
      toast.error('Erro ao excluir organização.');
    } finally {
      setDeletingOrg(null);
    }
  };

  const handleAddCollectionPoint = async (orgId, pointData) => {
    try {
      setSaving(true);
      const updatedOrg = await organizationRepository.addCollectionPoint(orgId, pointData);
      syncUpdatedOrganization(updatedOrg);
      toast.success(`Ponto de coleta "${pointData.nickname}" adicionado com sucesso!`);
      return updatedOrg;
    } catch (err) {
      toast.error('Erro ao adicionar ponto de coleta.');
      throw err;
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateCollectionPoint = async (orgId, pointId, pointData) => {
    try {
      setSaving(true);
      const updatedOrg = await organizationRepository.updateCollectionPoint(
        orgId,
        pointId,
        pointData
      );
      syncUpdatedOrganization(updatedOrg);
      toast.success(`Ponto de coleta "${pointData.nickname}" atualizado com sucesso!`);
      return updatedOrg;
    } catch (err) {
      toast.error('Erro ao atualizar ponto de coleta.');
      throw err;
    } finally {
      setSaving(false);
    }
  };

  const handleSaveCollectionPoint = async (targetOrgId, formData) => {
    if (pointModalState?.mode === 'edit' && pointModalState?.point) {
      await handleUpdateCollectionPoint(targetOrgId, pointModalState.point.id, formData);
    } else {
      await handleAddCollectionPoint(targetOrgId, formData);
    }
    setPointModalState(null);
  };

  const handleDeleteCollectionPoint = async (orgId, pointId) => {
    try {
      setSaving(true);
      const updatedOrg = await organizationRepository.deleteCollectionPoint(orgId, pointId);
      syncUpdatedOrganization(updatedOrg);
      toast.success('Ponto de coleta excluído com sucesso.');
      return updatedOrg;
    } catch (err) {
      toast.error('Erro ao excluir ponto de coleta.');
      throw err;
    } finally {
      setSaving(false);
    }
  };

  const handleClearFilters = () => {
    setSearch('');
    setType('Todas');
    setStatus('Todos');
  };

  // Itens paginados
  const totalItems = organizations.length;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;
  const paginatedOrgs = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return organizations.slice(start, start + pageSize);
  }, [organizations, currentPage, pageSize]);

  return {
    organizations: paginatedOrgs,
    allOrganizations,
    totalItems,
    totalPages,
    currentPage,
    setCurrentPage,
    loading,
    saving,
    filters: {
      search,
      setSearch,
      type,
      setType,
      status,
      setStatus,
      handleClearFilters,
    },
    modals: {
      isCreating,
      setIsCreating,
      viewingOrg,
      setViewingOrg,
      editingOrg,
      setEditingOrg,
      deletingOrg,
      setDeletingOrg,
      pointModalState,
      setPointModalState,
    },
    actions: {
      handleToggleStatus,
      handleSave,
      handleDelete,
      handleSaveCollectionPoint,
      handleAddCollectionPoint,
      handleUpdateCollectionPoint,
      handleDeleteCollectionPoint,
      refresh: fetchOrganizations,
    },
  };
}
