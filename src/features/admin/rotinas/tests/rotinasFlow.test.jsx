import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { WEEK_DAYS } from '@/domain/constants/weekDays.js';
import { ORGANIZATION_TYPES } from '@/domain/constants/organizationTypes.js';
import { RoutineTable } from '../components/RoutineTable.jsx';
import { RoutineFilterBar } from '../components/RoutineFilterBar.jsx';
import { RoutineModal } from '../components/RoutineModal.jsx';
import { DeleteRoutineModal } from '../components/DeleteRoutineModal.jsx';
import { RoutineByCoopView } from '../components/RoutineByCoopView.jsx';
import { RoutineByDayView } from '../components/RoutineByDayView.jsx';

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

const mockGroupedRoutines = [
  {
    groupKey: 'coop-2::cp-1',
    id: 'rot-1',
    ids: ['rot-1', 'rot-2'],
    cooperativeId: 'coop-2',
    cooperativeName: 'Coocencipe',
    clientId: 'client-1',
    clientName: 'Ticiana Rolim Empreendimentos',
    collectionPointId: 'cp-1',
    collectionPointName: 'Torre Aldeota',
    collectionPointAddress: 'Av. Santos Dumont, 1200 — Aldeota · Fortaleza',
    days: [WEEK_DAYS.SEGUNDA.id, WEEK_DAYS.QUARTA.id],
    created_at: '2026-03-02T09:00:00Z',
    updated_at: '2026-03-10T14:20:00Z',
  },
];

describe('Rotinas de Coleta - Fluxo Consolidado (4 colunas, Visões, Multi-dia e Conflito)', () => {
  it('deve renderizar a tabela enxuta de 4 colunas com Ponto+Cliente, Cooperativa e Régua Semanal', () => {
    render(
      <RoutineTable
        routines={mockGroupedRoutines}
        totalItems={1}
        totalWeeklyCollections={2}
        currentPage={1}
        totalPages={1}
        onPageChange={vi.fn()}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
      />
    );

    expect(screen.getByText('Torre Aldeota')).toBeInTheDocument();
    expect(screen.getByText(/Ticiana Rolim Empreendimentos/)).toBeInTheDocument();
    expect(screen.getByText('Coocencipe')).toBeInTheDocument();
    expect(
      screen.getByLabelText(/Dias de coleta: Segunda-feira, Quarta-feira/i)
    ).toBeInTheDocument();
  });

  it('deve alternar visões (Lista, Por Cooperativa, Por Dia) e manipular filtros ativos', () => {
    const toggleDay = vi.fn();
    const handleClearFilters = vi.fn();
    const onViewModeChange = vi.fn();

    render(
      <RoutineFilterBar
        viewMode="list"
        onViewModeChange={onViewModeChange}
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

    fireEvent.click(screen.getByRole('tab', { name: /Por Cooperativa/i }));
    expect(onViewModeChange).toHaveBeenCalledWith('coop');

    fireEvent.click(screen.getByRole('button', { name: 'Qua' }));
    expect(toggleDay).toHaveBeenCalledWith(WEEK_DAYS.QUARTA.id);

    expect(screen.getByText(/Cooperativa: Coocencipe/)).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /Limpar filtros/i }));
    expect(handleClearFilters).toHaveBeenCalledTimes(1);
  });

  it('deve bloquear preventivamente dias já atendidos por outra cooperativa e enviar múltiplos dias no modal', async () => {
    const onSave = vi.fn().mockResolvedValueOnce({ ok: true });
    const existingRoutines = [
      {
        id: 'rot-99',
        cooperativeId: 'coop-3',
        cooperativeName: 'Rede Ceará',
        clientId: 'client-1',
        collectionPointId: 'cp-1',
        dayOfWeek: WEEK_DAYS.TERCA.id,
      },
    ];

    render(
      <RoutineModal
        routine={null}
        cooperatives={mockCoops}
        clientOrganizations={mockClients}
        existingRoutines={existingRoutines}
        onClose={vi.fn()}
        onSave={onSave}
      />
    );

    expect(screen.getByLabelText(/Ponto de coleta/i)).toBeDisabled();

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

    // Terça-feira deve estar bloqueada preventivamente (ocupada por Rede Ceará)
    const tuesdayBtn = screen.getByRole('button', { name: /Terça-feira \(indisponível/i });
    expect(tuesdayBtn).toBeDisabled();
    expect(screen.getByText(/Rede Ceará/)).toBeInTheDocument();

    // Seleciona Segunda e Quarta de uma só vez
    fireEvent.click(screen.getByRole('button', { name: 'Segunda-feira' }));
    fireEvent.click(screen.getByRole('button', { name: 'Quarta-feira' }));

    fireEvent.click(screen.getByRole('button', { name: /Cadastrar rotina/i }));

    await waitFor(() => {
      expect(onSave).toHaveBeenCalledWith({
        cooperativeId: 'coop-2',
        clientId: 'client-1',
        collectionPointId: 'cp-1',
        days: [WEEK_DAYS.SEGUNDA.id, WEEK_DAYS.QUARTA.id],
      });
    });
  });

  it('deve renderizar as visões Por Cooperativa e Por Dia corretamente', () => {
    const { rerender } = render(
      <RoutineByCoopView
        cooperativeGroups={[
          {
            cooperativeId: 'coop-2',
            cooperativeName: 'Coocencipe',
            items: mockGroupedRoutines,
            totalWeeklyCollections: 2,
          },
        ]}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
      />
    );

    expect(screen.getByText('Coocencipe')).toBeInTheDocument();
    expect(screen.getByText(/1 ponto · 2 coletas\/semana/)).toBeInTheDocument();

    rerender(
      <RoutineByDayView
        groupedRoutines={mockGroupedRoutines}
        dayCounts={{ segunda: 1, quarta: 1 }}
        selectedDayTab={WEEK_DAYS.SEGUNDA.id}
        onSelectDayTab={vi.fn()}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
      />
    );

    expect(screen.getByText('Coletas de Segunda-feira')).toBeInTheDocument();
    expect(screen.getByText('Torre Aldeota')).toBeInTheDocument();
  });

  it('deve exibir a mensagem correta no modal de exclusão para múltiplos dias', () => {
    const onConfirm = vi.fn();

    render(
      <DeleteRoutineModal
        routine={mockGroupedRoutines[0]}
        onClose={vi.fn()}
        onConfirm={onConfirm}
      />
    );

    expect(screen.getByText('Excluir rotina de coleta?')).toBeInTheDocument();
    expect(
      screen.getByText(
        /A coleta da cooperativa "Coocencipe" no ponto "Torre Aldeota" nos dias Segunda-feira e Quarta-feira será removida permanentemente\./
      )
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /Sim, excluir/i }));
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });
});
