import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import { Sidebar } from '../Sidebar.jsx';

describe('Sidebar Navigation', () => {
  it('não deve exibir a seção "Edição usuário" e deve manter os demais menus principais', () => {
    render(
      <MemoryRouter>
        <Sidebar collapsed={false} onToggleCollapse={vi.fn()} />
      </MemoryRouter>
    );

    expect(screen.queryByText(/Edição usuário/i)).not.toBeInTheDocument();

    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Relatórios')).toBeInTheDocument();
    expect(screen.getByText('Planejamento')).toBeInTheDocument();
    expect(screen.getByText('Cadastro')).toBeInTheDocument();
    expect(screen.getByText('Organizações')).toBeInTheDocument();
    expect(screen.getByText('Usuários')).toBeInTheDocument();
    expect(screen.getByText('Rotinas de coleta')).toBeInTheDocument();
  });
});
