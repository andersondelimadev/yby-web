import { useState, useEffect, useMemo } from 'react';
import { toast } from 'sonner';
import { userRepository } from '@/services/repositories/userRepository.js';
import { organizationRepository } from '@/services/repositories/organizationRepository.js';

export function useUsuariosController() {
  const [users, setUsers] = useState([]);
  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Filtros
  const [search, setSearch] = useState('');
  const [role, setRole] = useState('Todos');
  const [organizationId, setOrganizationId] = useState('Todas');
  const [status, setStatus] = useState('Todos');

  // Paginação
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  // Modais
  const [isCreating, setIsCreating] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [deletingUser, setDeletingUser] = useState(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const [userData, orgData] = await Promise.all([
        userRepository.getAll({ search, role, organizationId, status }),
        organizationRepository.getAll(),
      ]);
      setUsers(userData);
      setOrganizations(orgData);
    } catch (err) {
      toast.error('Erro ao carregar usuários.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    setCurrentPage(1);
  }, [search, role, organizationId, status]);

  const handleSave = async (formData) => {
    try {
      setSaving(true);
      // Vincula o nome da organização caso tenha sido selecionada
      const org = organizations.find((o) => o.id === formData.organizationId);
      const payload = {
        ...formData,
        organizationName: org ? org.name : formData.organizationName || 'Sem organização',
        organizationType: org ? org.type : 'Cliente',
      };

      if (editingUser) {
        const updated = await userRepository.update(editingUser.id, payload);
        setUsers((prev) =>
          prev.map((item) => (item.id === editingUser.id ? updated : item))
        );
        toast.success(`Usuário "${updated.name}" atualizado com sucesso!`);
        setEditingUser(null);
      } else {
        const created = await userRepository.create(payload);
        setUsers((prev) => [created, ...prev]);
        toast.success(`Usuário "${created.name}" cadastrado com sucesso!`);
        setIsCreating(false);
      }
    } catch (err) {
      toast.error('Erro ao salvar usuário.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingUser) return;
    try {
      await userRepository.delete(deletingUser.id);
      setUsers((prev) => prev.filter((item) => item.id !== deletingUser.id));
      toast.success(`Usuário "${deletingUser.name}" excluído com sucesso.`);
    } catch (err) {
      toast.error('Erro ao excluir usuário.');
    } finally {
      setDeletingUser(null);
    }
  };

  const handleClearFilters = () => {
    setSearch('');
    setRole('Todos');
    setOrganizationId('Todas');
    setStatus('Todos');
  };

  // Paginação
  const totalItems = users.length;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;
  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return users.slice(start, start + pageSize);
  }, [users, currentPage, pageSize]);

  return {
    users: paginatedUsers,
    organizations,
    totalItems,
    totalPages,
    currentPage,
    setCurrentPage,
    loading,
    saving,
    filters: {
      search,
      setSearch,
      role,
      setRole,
      organizationId,
      setOrganizationId,
      status,
      setStatus,
      handleClearFilters,
    },
    modals: {
      isCreating,
      setIsCreating,
      editingUser,
      setEditingUser,
      deletingUser,
      setDeletingUser,
    },
    actions: {
      handleSave,
      handleDelete,
      refresh: fetchUsers,
    },
  };
}
