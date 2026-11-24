import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { WEEK_DAYS } from '@/domain/constants/weekDays.js';
import { ORGANIZATION_TYPES } from '@/domain/constants/organizationTypes.js';
import { RoutineTable } from '../components/RoutineTable.jsx';
import { RoutineFilterBar } from '../components/RoutineFilterBar.jsx';
import { RoutineModal } from '../components/RoutineModal.jsx';
import { DeleteRoutineModal } from '../components/DeleteRoutineModal.jsx';

const mockCoops = [
  { id: 'coop-2', name: 'Coocencipe', type: ORGANIZATION_TYPES.COOPERATIVA, cnpj: '07.101.456/0001-89' },
  { id: 'coop-3', name: 'Rede Ceará', type: ORGANIZATION_TYPES.COOPERATIVA, cnpj: '07.102.456/0001-89' },
];

const mockClients = [
  {
    id: 'client-1',
    name: 'Ticiana Rolim Empreendimentos',
    type: ORGANIZATION_TYPES.CLIENTE,
    collectionPoints: [
      {
        id: 'cp-1',
        nickname: 'Torre Aldeota',
        address: 'Av. Santos Dumont',
        number: '1200',
        neighborhood: 'Aldeota',
        city: 'Fortaleza',
      },
    ],
  },
];

const mockRoutines = [
  {
    id: 'rot-1',
    cooperativeId: 'coop-2',
    cooperativeName: 'Coocencipe',
    clientId: 'client-1',
    clientName: 'Ticiana Rolim Empreendimentos',
    collectionPointId: 'cp-1',
    collectionPointName: 'Torre Aldeota',
    collectionPointAddress: 'Av. Santos Dumont, 1200 — Aldeota · Fortaleza',
    dayOfWeek: WEEK_DAYS.SEGUNDA.id,
    created_at: '2026-03-02T09:00:00Z',
    updated_at: '2026-03-10T14:20:00Z',
  },
];

describe('Rotinas de Coleta - Fluxo de Interface (Tabela, Filtros, Modal e Exclusão)', () => {
  it('deve renderizar a tabela com Cooperativa, Cliente, Ponto + endereço resumido e Dia da Semana', () => {
    render(
      <RoutineTable
        routines={mockRoutines}
        totalItems={1}
        currentPage={1}
        totalPages={1}
        onPageChange={vi.fn()}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
      />
    );

    expect(screen.getByText('Coocencipe')).toBeInTheDocument();
    expect(screen.getByText('Ticiana Rolim Empreendimentos')).toBeInTheDocument();
    expect(screen.getByText('Torre Aldeota')).toBeInTheDocument();
    expect(screen.getByText(/Av\. Santos Dumont, 1200/)).toBeInTheDocument();
    expect(screen.getByText('Segunda-feira')).toBeInTheDocument();
  });

  it('deve alternar chips de dias da semana, exibir filtros ativos e permitir limpar filtros', () => {
    const toggleDay = vi.fn();
    const handleClearFilters = vi.fn();

    render(
      <RoutineFilterBar
        filters={{
          search: 'Aldeota',
          setSearch: vi.fn(),
          cooperativeId: 'coop-2',
          setCooperativeId: vi.fn(),
          clientId: 'Todos',
          setClientId: vi.fn(),
          days: [WEEK_DAYS.SEGUNDA.id],
          toggleDay,
          hasActiveFilters: true,
          handleClearFilters,
        }}
        cooperatives={mockCoops}
        clientOrganizations={mockClients}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: 'Qua' }));
    expect(toggleDay).toHaveBeenCalledWith(WEEK_DAYS.QUARTA.id);

    expect(screen.getByText(/Cooperativa: Coocencipe/)).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /Limpar filtros/i }));
    expect(handleClearFilters).toHaveBeenCalledTimes(1);
  });

  it('deve manter Ponto de coleta desabilitado até selecionar Cliente e exibir erro inline para rotina duplicada', async () => {
    const onSave = vi.fn().mockResolvedValueOnce({
      ok: false,
      error: 'Já existe uma rotina cadastrada para este ponto de coleta em Segunda-feira (Coocencipe).',
    });

    render(
      <RoutineModal
        routine={null}
        cooperatives={mockCoops}
        clientOrganizations={mockClients}
        onClose={vi.fn()}
        onSave={onSave}
      />
    );

    const pointTrigger = screen.getByLabelText(/Ponto de coleta/i);
    expect(pointTrigger).toBeDisabled();

    // Seleciona Cooperativa
    fireEvent.click(screen.getByLabelText(/Cooperativa/i));
    fireEvent.click(screen.getByRole('option', { name: /Coocencipe/i }));

    // Seleciona Cliente -> habilita Ponto de coleta
    fireEvent.click(screen.getByLabelText(/Cliente/i));
    fireEvent.click(screen.getByRole('option', { name: /Ticiana Rolim Empreendimentos/i }));

    const enabledPointTrigger = screen.getByLabelText(/Ponto de coleta/i);
    expect(enabledPointTrigger).not.toBeDisabled();

    fireEvent.click(enabledPointTrigger);
    fireEvent.click(screen.getByRole('option', { name: /Torre Aldeota/i }));

    // Seleciona Dia da Semana
    fireEvent.change(screen.getByLabelText(/Dia da semana/i), {
      target: { value: WEEK_DAYS.SEGUNDA.id },
    });

    fireEvent.click(screen.getByRole('button', { name: /Cadastrar rotina/i }));

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(/Já existe uma rotina cadastrada/i);
    });
  });

  it('deve exibir a mensagem correta no modal de confirmação de exclusão', () => {
    const onConfirm = vi.fn();

    render(
      <DeleteRoutineModal
        routine={mockRoutines[0]}
        onClose={vi.fn()}
        onConfirm={onConfirm}
      />
    );

    expect(screen.getByText('Excluir rotina de coleta?')).toBeInTheDocument();
    expect(
      screen.getByText(
        /A coleta da cooperativa "Coocencipe" no ponto "Torre Aldeota" às Segunda-feira será removida permanentemente\./
      )
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /Sim, excluir/i }));
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });
});
