import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { RelatoriosTable } from '../components/RelatoriosTable.jsx';
import { MOCK_COLLECTIONS } from '@/services/mock/mockData.js';

describe('RelatoriosTable Component', () => {
  const mockOnEdit = vi.fn();
  const mockOnDelete = vi.fn();
  const mockOnViewPhotos = vi.fn();

  it('deve renderizar a tabela com todos os estados de Avaria (Sim e Não)', () => {
    render(
      <RelatoriosTable
        collections={MOCK_COLLECTIONS}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onViewPhotos={mockOnViewPhotos}
      />
    );

    // Verifica que existem registros com Avaria = "Sim" e com Avaria = "Não"
    const simBadges = screen.getAllByText('Sim');
    const naoBadges = screen.getAllByText('Não');

    expect(simBadges.length).toBeGreaterThan(0);
    expect(naoBadges.length).toBeGreaterThan(0);

    // O badge de "Sim" deve ter a variante red (bg-red-50 text-yby-danger)
    expect(simBadges[0].closest('span')).toHaveClass('text-yby-danger');

    // O badge de "Não" deve ter a variante beige (bg-yby-surface text-yby-heading)
    expect(naoBadges[0].closest('span')).toHaveClass('text-yby-heading');
  });

  it('deve exibir múltiplos tipos de resíduos com badges semânticos', () => {
    render(
      <RelatoriosTable
        collections={MOCK_COLLECTIONS}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onViewPhotos={mockOnViewPhotos}
      />
    );

    expect(screen.getAllByText('Recicláveis Geral').length).toBeGreaterThan(0);
    expect(screen.getByText('Papel')).toBeInTheDocument();
    expect(screen.getByText('Plástico')).toBeInTheDocument();
    expect(screen.getByText('Vidro')).toBeInTheDocument();
    expect(screen.getByText('Metal')).toBeInTheDocument();
    expect(screen.getByText('Óleo')).toBeInTheDocument();
    expect(screen.getByText('Orgânicos')).toBeInTheDocument();

    // Valida variante semântica azul para Papel
    const papelBadge = screen.getByText('Papel').closest('span');
    expect(papelBadge).toHaveClass('text-yby-blue');

    // Valida variante semântica teal para Vidro
    const vidroBadge = screen.getByText('Vidro').closest('span');
    expect(vidroBadge).toHaveClass('text-yby-teal');

    // Valida variante semântica orange para Metal
    const metalBadge = screen.getByText('Metal').closest('span');
    expect(metalBadge).toHaveClass('text-yby-orange');
  });

  it('deve disparar os callbacks de ações ao clicar em editar, excluir e fotos', () => {
    render(
      <RelatoriosTable
        collections={MOCK_COLLECTIONS}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onViewPhotos={mockOnViewPhotos}
      />
    );

    const editBtns = screen.getAllByTitle('Editar coleta');
    fireEvent.click(editBtns[0]);
    expect(mockOnEdit).toHaveBeenCalledWith(MOCK_COLLECTIONS[0]);

    const deleteBtns = screen.getAllByTitle('Excluir coleta');
    fireEvent.click(deleteBtns[0]);
    expect(mockOnDelete).toHaveBeenCalledWith(MOCK_COLLECTIONS[0].id);

    const photoBtns = screen.getAllByTitle('Ver fotos da coleta');
    fireEvent.click(photoBtns[0]);
    expect(mockOnViewPhotos).toHaveBeenCalledWith(MOCK_COLLECTIONS[0]);
  });
});
