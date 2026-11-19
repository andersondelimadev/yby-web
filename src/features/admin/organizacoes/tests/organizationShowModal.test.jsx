import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { OrganizationShowModal } from '../components/OrganizationShowModal.jsx';
import { ORGANIZATION_TYPES } from '@/domain/constants/organizationTypes.js';
import { cepService } from '@/services/cepService.js';

describe('OrganizationShowModal & Pontos de Coleta Integrados', () => {
  const mockOrg = {
    id: 'client-1',
    name: 'Ticiana Rolim Empreendimentos',
    cnpj: '12.345.678/0001-90',
    type: ORGANIZATION_TYPES.CLIENTE,
    created_at: '2026-02-05T14:15:00Z',
    collectionPoints: [
      {
        id: 'cp-1',
        nickname: 'Torre Aldeota',
        zip_code: '60160-100',
        address: 'Av. Santos Dumont',
        number: '1200',
        neighborhood: 'Aldeota',
        city: 'Fortaleza',
        state: 'CE',
        active: true,
      },
    ],
  };

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('deve exibir dados da organização (nome, CNPJ, tipo, criado em), botões Editar/Excluir e pontos de coleta', () => {
    render(
      <OrganizationShowModal
        organization={mockOrg}
        onClose={vi.fn()}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
        onAddCollectionPoint={vi.fn()}
        onUpdateCollectionPoint={vi.fn()}
        onDeleteCollectionPoint={vi.fn()}
      />
    );

    expect(screen.getAllByText('Ticiana Rolim Empreendimentos').length).toBeGreaterThan(0);
    expect(screen.getByText('12.345.678/0001-90')).toBeInTheDocument();
    expect(screen.getAllByText('Cliente').length).toBeGreaterThan(0);
    expect(screen.getByText(/05\/02\/2026/)).toBeInTheDocument();

    expect(screen.getByRole('button', { name: 'Editar' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Excluir' })).toBeInTheDocument();

    expect(screen.getByText('Torre Aldeota')).toBeInTheDocument();
    expect(screen.getByText(/Av\. Santos Dumont, 1200 — Aldeota/)).toBeInTheDocument();
    expect(screen.getByText(/CEP: 60160-100/)).toBeInTheDocument();
    expect(screen.getByText('Ativo')).toBeInTheDocument();
  });

  it('deve abrir o formulário integrado de adicionar ponto de coleta, consultar CEP e enviar todos os campos', async () => {
    vi.spyOn(cepService, 'getAddressByCep').mockResolvedValueOnce({
      cep: '60170-220',
      street: 'Rua Júlio Ibiapina',
      neighborhood: 'Meireles',
      city: 'Fortaleza',
      state: 'Ceará',
      uf: 'CE',
    });

    const onAdd = vi.fn().mockResolvedValueOnce({});

    render(
      <OrganizationShowModal
        organization={mockOrg}
        onClose={vi.fn()}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
        onAddCollectionPoint={onAdd}
        onUpdateCollectionPoint={vi.fn()}
        onDeleteCollectionPoint={vi.fn()}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /Adicionar ponto de coleta/i }));

    expect(screen.getByText('Novo Ponto de Coleta')).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText(/Apelido/i), {
      target: { value: 'Galpão Meireles' },
    });
    fireEvent.change(screen.getByLabelText(/CEP/i), {
      target: { value: '60170220' },
    });

    await waitFor(() => {
      expect(cepService.getAddressByCep).toHaveBeenCalledWith('60170220');
      expect(screen.getByLabelText(/Endereço/i)).toHaveValue('Rua Júlio Ibiapina');
    });

    fireEvent.change(screen.getByLabelText(/Número/i), {
      target: { value: '340' },
    });

    // Alterna switch para Inativo
    const switchBtn = screen.getByRole('switch', { name: /Ponto de coleta ativo/i });
    fireEvent.click(switchBtn);

    fireEvent.click(screen.getByRole('button', { name: /Salvar ponto de coleta/i }));

    await waitFor(() => {
      expect(onAdd).toHaveBeenCalledWith('client-1', {
        nickname: 'Galpão Meireles',
        zip_code: '60170-220',
        address: 'Rua Júlio Ibiapina',
        number: '340',
        neighborhood: 'Meireles',
        city: 'Fortaleza',
        state: 'CE',
        active: false,
      });
    });
  });

  it('deve editar e excluir um ponto de coleta com confirmação inline', async () => {
    const onUpdate = vi.fn().mockResolvedValueOnce({});
    const onDelete = vi.fn().mockResolvedValueOnce({});

    render(
      <OrganizationShowModal
        organization={mockOrg}
        onClose={vi.fn()}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
        onAddCollectionPoint={vi.fn()}
        onUpdateCollectionPoint={onUpdate}
        onDeleteCollectionPoint={onDelete}
      />
    );

    // Editar ponto existente
    fireEvent.click(screen.getByRole('button', { name: /Editar ponto Torre Aldeota/i }));
    expect(screen.getByText('Editar Ponto de Coleta')).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText(/Apelido/i), {
      target: { value: 'Torre Aldeota - Entrada B' },
    });
    fireEvent.click(screen.getByRole('button', { name: /Salvar alterações/i }));

    await waitFor(() => {
      expect(onUpdate).toHaveBeenCalledWith(
        'client-1',
        'cp-1',
        expect.objectContaining({ nickname: 'Torre Aldeota - Entrada B' })
      );
    });

    // Excluir ponto com confirmação inline
    fireEvent.click(screen.getByRole('button', { name: /Excluir ponto Torre Aldeota/i }));
    expect(screen.getByText(/Deseja excluir o ponto "Torre Aldeota"\?/i)).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /Confirmar exclusão/i }));

    await waitFor(() => {
      expect(onDelete).toHaveBeenCalledWith('client-1', 'cp-1');
    });
  });
});
