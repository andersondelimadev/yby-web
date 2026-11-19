import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { USER_ROLES, USER_ROLE_LIST } from '@/domain/constants/userRoles.js';
import { UserTable } from '../components/UserTable.jsx';
import { UserFilterBar } from '../components/UserFilterBar.jsx';
import { UserMobileCard } from '../components/UserMobileCard.jsx';
import { UserModal } from '../components/UserModal.jsx';
import { DeleteUserModal } from '../components/DeleteUserModal.jsx';

const mockOrganizations = [
  { id: 'coop-1', name: 'Yby Soluções Sustentáveis', type: 'Cooperativa' },
  { id: 'coop-2', name: 'Coocencipe', type: 'Cooperativa' },
  { id: 'client-1', name: 'Ticiana Rolim Empreendimentos', type: 'Cliente' },
];

const mockUsers = [
  {
    id: 1,
    name: 'Mariana Silva',
    email: 'mariana@somosyby.com',
    role: USER_ROLES.GESTOR_YBY.id,
    organizationId: 'coop-1',
    organizationName: 'Yby Soluções Sustentáveis',
    organizationType: 'Cooperativa',
  },
  {
    id: 2,
    name: 'Carlos Nascimento',
    email: 'carlos@coocencipe.org',
    role: USER_ROLES.COLABORADOR_COOPERATIVA.id,
    organizationId: 'coop-2',
    organizationName: 'Coocencipe',
    organizationType: 'Cooperativa',
  },
  {
    id: 3,
    name: 'Juliana Rocha',
    email: 'juliana@ticianarolim.com.br',
    role: USER_ROLES.CLIENTE.id,
    organizationId: 'client-1',
    organizationName: 'Ticiana Rolim Empreendimentos',
    organizationType: 'Cliente',
  },
];

describe('Fluxo do Painel Administrativo de Usuários (UI e Interações)', () => {
  describe('1. Fluxo de Listagem de Usuários (Tabela Desktop e Cards Mobile)', () => {
    it('deve renderizar a tabela desktop com dados dos usuários, papéis e organizações', () => {
      const onEdit = vi.fn();
      const onDelete = vi.fn();
      const onPageChange = vi.fn();

      render(
        <UserTable
          users={mockUsers}
          totalItems={3}
          currentPage={1}
          totalPages={1}
          onPageChange={onPageChange}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      );

      // Verifica dados do primeiro usuário
      expect(screen.getByText('Mariana Silva')).toBeInTheDocument();
      expect(screen.getByText('mariana@somosyby.com')).toBeInTheDocument();
      expect(screen.getByText('Gestor Yby')).toBeInTheDocument();
      expect(screen.getByText('Yby Soluções Sustentáveis')).toBeInTheDocument();

      // Verifica segundo usuário com papel de cooperativa
      expect(screen.getByText('Carlos Nascimento')).toBeInTheDocument();
      expect(screen.getByText('carlos@coocencipe.org')).toBeInTheDocument();
      expect(screen.getByText('Colaborador da Cooperativa')).toBeInTheDocument();

      // Verifica terceiro usuário com papel de cliente
      expect(screen.getByText('Juliana Rocha')).toBeInTheDocument();
      expect(screen.getByText('Cliente')).toBeInTheDocument();

      // Verifica contador
      expect(
        screen.getByText('Mostrando 3 de 3 usuários cadastrados')
      ).toBeInTheDocument();
    });

    it('deve acionar os callbacks de editar e excluir a partir da tabela', () => {
      const onEdit = vi.fn();
      const onDelete = vi.fn();

      render(
        <UserTable
          users={mockUsers}
          totalItems={3}
          currentPage={1}
          totalPages={1}
          onPageChange={vi.fn()}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      );

      const editButtons = screen.getAllByTitle('Editar usuário');
      expect(editButtons).toHaveLength(3);
      fireEvent.click(editButtons[0]);
      expect(onEdit).toHaveBeenCalledWith(mockUsers[0]);

      const deleteButtons = screen.getAllByTitle('Excluir usuário');
      expect(deleteButtons).toHaveLength(3);
      fireEvent.click(deleteButtons[1]);
      expect(onDelete).toHaveBeenCalledWith(mockUsers[1]);
    });

    it('deve renderizar o card mobile com todas as informações e botões táteis', () => {
      const onEdit = vi.fn();
      const onDelete = vi.fn();

      render(
        <UserMobileCard
          user={mockUsers[0]}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      );

      expect(screen.getByText('Mariana Silva')).toBeInTheDocument();
      expect(screen.getByText('mariana@somosyby.com')).toBeInTheDocument();
      expect(screen.getByText('Gestor Yby')).toBeInTheDocument();
      expect(screen.getByText('Yby Soluções Sustentáveis')).toBeInTheDocument();

      const editBtn = screen.getByRole('button', { name: /Editar usuário Mariana Silva/i });
      fireEvent.click(editBtn);
      expect(onEdit).toHaveBeenCalledWith(mockUsers[0]);

      const deleteBtn = screen.getByRole('button', { name: /Excluir usuário Mariana Silva/i });
      fireEvent.click(deleteBtn);
      expect(onDelete).toHaveBeenCalledWith(mockUsers[0]);
    });
  });

  describe('2. Fluxo de Busca e Filtragem', () => {
    it('deve interagir com campos de busca, filtro por papel e filtro por organização', () => {
      const setSearch = vi.fn();
      const setRole = vi.fn();
      const setOrganizationId = vi.fn();
      const handleClearFilters = vi.fn();

      const filters = {
        search: '',
        setSearch,
        role: 'Todos',
        setRole,
        organizationId: 'Todas',
        setOrganizationId,
        handleClearFilters,
      };

      const { rerender } = render(
        <UserFilterBar filters={filters} organizations={mockOrganizations} />
      );

      // 1. Busca textual
      const searchInput = screen.getByPlaceholderText('Nome, e-mail ou organização');
      fireEvent.change(searchInput, { target: { value: 'Mariana' } });
      expect(setSearch).toHaveBeenCalledWith('Mariana');

      // 2. Filtro por papel
      const roleSelect = screen.getByLabelText(/^Papel$/i);
      fireEvent.change(roleSelect, { target: { value: USER_ROLES.CLIENTE.id } });
      expect(setRole).toHaveBeenCalledWith(USER_ROLES.CLIENTE.id);

      // 3. Filtro por organização
      const orgSelect = screen.getByLabelText(/Organização vinculada/i);
      fireEvent.change(orgSelect, { target: { value: 'coop-1' } });
      expect(setOrganizationId).toHaveBeenCalledWith('coop-1');

      // Re-renderiza com filtros ativos aplicados para validar o botão de limpeza
      rerender(
        <UserFilterBar
          filters={{ ...filters, search: 'Mariana', role: USER_ROLES.CLIENTE.id }}
          organizations={mockOrganizations}
        />
      );

      expect(screen.getByText('Filtros ativos aplicados na listagem de usuários')).toBeInTheDocument();
      const clearBtn = screen.getByText('Limpar filtros');
      fireEvent.click(clearBtn);
      expect(handleClearFilters).toHaveBeenCalled();
    });
  });

  describe('3. Fluxo de Cadastro de Usuário (UserModal)', () => {
    it('deve exibir todos os campos requeridos e as 5 opções oficiais de papel em português', () => {
      render(
        <UserModal
          user={null}
          organizations={mockOrganizations}
          onClose={vi.fn()}
          onSave={vi.fn()}
          saving={false}
        />
      );

      // Título e subtítulo
      expect(screen.getByText('Novo Usuário')).toBeInTheDocument();
      expect(
        screen.getByText('Cadastre um novo usuário e vincule-o a uma organização')
      ).toBeInTheDocument();

      // Campos
      expect(screen.getByLabelText(/Nome Completo/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/E-mail/i)).toBeInTheDocument();
      const orgField = screen.getByLabelText(/Organização Vinculada/i);
      const roleField = screen.getByLabelText(/^Papel/i);
      expect(orgField).toBeInTheDocument();
      expect(roleField).toBeInTheDocument();
      // Organização Vinculada aparece antes de Papel
      expect(
        Boolean(orgField.compareDocumentPosition(roleField) & Node.DOCUMENT_POSITION_FOLLOWING)
      ).toBe(true);

      // Verifica se as 5 opções oficiais de Papel estão presentes no Select
      const roleSelect = screen.getByLabelText(/^Papel/i);
      expect(roleSelect).toContainHTML(USER_ROLES.GESTOR_YBY.label);
      expect(roleSelect).toContainHTML(USER_ROLES.COLABORADOR_YBY.label);
      expect(roleSelect).toContainHTML(USER_ROLES.PRESIDENTE_COOPERATIVA.label);
      expect(roleSelect).toContainHTML(USER_ROLES.COLABORADOR_COOPERATIVA.label);
      expect(roleSelect).toContainHTML(USER_ROLES.CLIENTE.label);

      // Verifica se as organizações cadastradas estão disponíveis no Select
      const orgSelect = screen.getByLabelText(/Organização Vinculada/i);
      expect(orgSelect).toContainHTML('Yby Soluções Sustentáveis (Cooperativa)');
      expect(orgSelect).toContainHTML('Coocencipe (Cooperativa)');
      expect(orgSelect).toContainHTML('Ticiana Rolim Empreendimentos (Cliente)');

      // Textos de ajuda para diferenciar Papel e Organização
      expect(
        screen.getByText('Define as permissões e o nível de acesso do usuário dentro da plataforma.')
      ).toBeInTheDocument();
      expect(
        screen.getByText('Identifica a cooperativa ou cliente ao qual o usuário está vinculado.')
      ).toBeInTheDocument();
    });

    it('deve submeter o formulário de cadastro com dados válidos', () => {
      const onSave = vi.fn();
      const onClose = vi.fn();

      render(
        <UserModal
          user={null}
          organizations={mockOrganizations}
          onClose={onClose}
          onSave={onSave}
          saving={false}
        />
      );

      // Preenche os campos
      fireEvent.change(screen.getByLabelText(/Nome Completo/i), {
        target: { value: 'Fernanda Oliveira' },
      });
      fireEvent.change(screen.getByLabelText(/E-mail/i), {
        target: { value: 'fernanda@cooperativa.org' },
      });
      fireEvent.change(screen.getByLabelText(/^Papel/i), {
        target: { value: USER_ROLES.PRESIDENTE_COOPERATIVA.id },
      });
      fireEvent.change(screen.getByLabelText(/Organização Vinculada/i), {
        target: { value: 'coop-2' },
      });

      // Submete
      const submitBtn = screen.getByRole('button', { name: /Cadastrar usuário/i });
      fireEvent.click(submitBtn);

      expect(onSave).toHaveBeenCalledWith({
        name: 'Fernanda Oliveira',
        email: 'fernanda@cooperativa.org',
        role: USER_ROLES.PRESIDENTE_COOPERATIVA.id,
        organizationId: 'coop-2',
      });
    });

    it('deve fechar o modal ao clicar em Cancelar', () => {
      const onClose = vi.fn();

      render(
        <UserModal
          user={null}
          organizations={mockOrganizations}
          onClose={onClose}
          onSave={vi.fn()}
          saving={false}
        />
      );

      const cancelBtn = screen.getByRole('button', { name: /Cancelar/i });
      fireEvent.click(cancelBtn);
      expect(onClose).toHaveBeenCalled();
    });
  });

  describe('4. Fluxo de Edição de Usuário (UserModal em modo de edição)', () => {
    it('deve carregar os dados pré-preenchidos do usuário a ser editado', () => {
      const onSave = vi.fn();

      render(
        <UserModal
          user={mockUsers[0]}
          organizations={mockOrganizations}
          onClose={vi.fn()}
          onSave={onSave}
          saving={false}
        />
      );

      expect(screen.getByText('Editar Usuário')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Mariana Silva')).toBeInTheDocument();
      expect(screen.getByDisplayValue('mariana@somosyby.com')).toBeInTheDocument();

      // Altera o papel para Cliente
      fireEvent.change(screen.getByLabelText(/^Papel/i), {
        target: { value: USER_ROLES.CLIENTE.id },
      });

      // Salva
      const saveBtn = screen.getByRole('button', { name: /Salvar alterações/i });
      fireEvent.click(saveBtn);

      expect(onSave).toHaveBeenCalledWith({
        name: 'Mariana Silva',
        email: 'mariana@somosyby.com',
        role: USER_ROLES.CLIENTE.id,
        organizationId: 'coop-1',
      });
    });
  });

  describe('5. Fluxo de Exclusão com Confirmação (DeleteUserModal)', () => {
    it('deve exibir o modal de confirmação com detalhes do usuário e cancelar ou confirmar', () => {
      const onConfirm = vi.fn();
      const onClose = vi.fn();

      const { rerender } = render(
        <DeleteUserModal
          user={mockUsers[1]}
          onClose={onClose}
          onConfirm={onConfirm}
        />
      );

      expect(screen.getByText('Excluir usuário?')).toBeInTheDocument();
      expect(screen.getByText(/Carlos Nascimento/i)).toBeInTheDocument();
      expect(screen.getByText(/carlos@coocencipe.org/i)).toBeInTheDocument();

      // Clica em Cancelar
      const cancelBtn = screen.getByRole('button', { name: /Cancelar/i });
      fireEvent.click(cancelBtn);
      expect(onClose).toHaveBeenCalled();

      // Clica em Confirmar
      const confirmBtn = screen.getByRole('button', { name: /Sim, excluir usuário/i });
      fireEvent.click(confirmBtn);
      expect(onConfirm).toHaveBeenCalled();

      // Se user for null, não renderiza nada
      rerender(<DeleteUserModal user={null} onClose={onClose} onConfirm={onConfirm} />);
      expect(screen.queryByText('Excluir usuário?')).not.toBeInTheDocument();
    });
  });
});
