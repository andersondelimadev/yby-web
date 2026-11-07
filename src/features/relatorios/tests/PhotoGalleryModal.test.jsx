import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { PhotoGalleryModal } from '../components/PhotoGalleryModal.jsx';

describe('PhotoGalleryModal Component', () => {
  it('deve exibir mensagem e evidência fotográfica de avaria quando breakdown="Sim"', () => {
    const itemWithAvaria = {
      id: 2559,
      date: '14/10/2026',
      pev: 'Hospital Jayme da Fonte',
      breakdown: 'Sim',
    };

    render(<PhotoGalleryModal item={itemWithAvaria} onClose={vi.fn()} />);

    expect(screen.getByText(/Avaria relatada/i)).toBeInTheDocument();
    expect(screen.getByText(/Foto comprobatória da avaria/i)).toBeInTheDocument();
  });

  it('deve exibir status regular quando breakdown="Não"', () => {
    const itemWithoutAvaria = {
      id: 2561,
      date: '15/10/2026',
      pev: 'Prisma Residencial',
      breakdown: 'Não',
    };

    render(<PhotoGalleryModal item={itemWithoutAvaria} onClose={vi.fn()} />);

    expect(screen.getByText(/Nenhuma avaria relatada na coleta/i)).toBeInTheDocument();
  });
});
